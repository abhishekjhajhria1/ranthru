"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useUser } from "./user-context"

export interface Message {
    id: string
    senderId: string
    receiverId: string
    content: string
    timestamp: string
    read: boolean
}

export interface Thread {
    id: string
    participantId: string
    participantName: string // For MVP simplicity
    participantAvatar?: string
    lastMessage: string
    lastMessageTime: string
    unreadCount: number
}

interface MessageContextType {
    threads: Thread[]
    messages: Message[]
    activeThreadId: string | null
    setActiveThreadId: (id: string | null) => void
    sendMessage: (content: string) => void
    isLoading: boolean
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

export function MessageProvider({ children }: { children: React.ReactNode }) {
    const { user } = useUser()
    const [threads, setThreads] = useState<Thread[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const generateThreads = (msgs: Message[], myId: string) => {
        const threadMap = new Map<string, Thread>()

        msgs.forEach(m => {
            const otherId = m.senderId === myId ? m.receiverId : m.senderId

            // For MVP, if we don't have user DB, rely on message data
            // In reality, we'd fetch user profile for `otherId`
            const existing = threadMap.get(otherId)

            if (!existing || new Date(m.timestamp) > new Date(existing.lastMessageTime)) {
                threadMap.set(otherId, {
                    id: otherId,
                    participantId: otherId,
                    participantName: otherId, // Fallback to ID/Alias
                    lastMessage: m.content,
                    lastMessageTime: m.timestamp,
                    unreadCount: (existing?.unreadCount || 0) + (!m.read && m.receiverId === myId ? 1 : 0)
                })
            }
        })

        // Add a default "Concierge" thread if empty
        if (threadMap.size === 0) {
            threadMap.set("Concierge", {
                id: "Concierge",
                participantId: "Concierge",
                participantName: "RANTHRU Concierge",
                lastMessage: "Welcome to the district. How can we assist you?",
                lastMessageTime: new Date().toISOString(),
                unreadCount: 1
            })
            // Also add the actual message so it appears in chat
            const welcomeMsg: Message = {
                id: "welcome-1",
                senderId: "Concierge",
                receiverId: myId,
                content: "Welcome to the district. How can we assist you?",
                timestamp: new Date().toISOString(),
                read: false
            }
            setMessages(prev => [...prev, welcomeMsg])
        }

        setThreads(Array.from(threadMap.values()).sort((a, b) =>
            new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        ))
    }

    // Load from API
    useEffect(() => {
        if (!user) return

        const fetchMessages = async () => {
            try {
                const res = await fetch('/api/messages')
                if (res.ok) {
                    const data = await res.json()
                    setMessages(data)
                    generateThreads(data, user.alias)
                    setIsLoading(false)
                }
            } catch (error) {
                console.error("Failed to fetch messages", error)
            }
        }

        fetchMessages()
        // Poll every 5 seconds for new messages (MVP Real-time)
        const interval = setInterval(fetchMessages, 5000)
        return () => clearInterval(interval)
    }, [user])

    const sendMessage = async (content: string) => {
        if (!user || !activeThreadId) return

        // Optimistic Update
        const tempId = crypto.randomUUID()
        const newMsg: Message = {
            id: tempId,
            senderId: user.alias,
            receiverId: activeThreadId,
            content,
            timestamp: new Date().toISOString(),
            read: false
        }

        setMessages(prev => [...prev, newMsg])
        generateThreads([...messages, newMsg], user.alias)

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId: activeThreadId,
                    content
                })
            })

            if (res.ok) {
                await res.json()
                // Replace optimistically added message with real one (if we were rigorous)
                // For now, re-fetching or just letting the poll sync it is fine.
            }
        } catch (error) {
            console.error("Failed to send message", error)
            // Rollback optimistic update if needed
        }
    }

    return (
        <MessageContext.Provider value={{ threads, messages, activeThreadId, setActiveThreadId, sendMessage, isLoading }}>
            {children}
        </MessageContext.Provider>
    )
}

export const useMessages = () => {
    const context = useContext(MessageContext)
    if (context === undefined) {
        throw new Error("useMessages must be used within a MessageProvider")
    }
    return context
}
