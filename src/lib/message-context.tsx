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

    // Load from LocalStorage
    useEffect(() => {
        if (!user) return

        const storedMessages = localStorage.getItem("ranthru_messages")
        const allMessages: Message[] = storedMessages ? JSON.parse(storedMessages) : []

        // Filter messages relevant to current user
        const myMessages = allMessages.filter(
            m => m.senderId === user.alias || m.receiverId === user.alias
        )

        // eslint-disable-next-line
        setMessages(myMessages)
        generateThreads(myMessages, user.alias)
        setIsLoading(false)
    }, [user])

    const sendMessage = (content: string) => {
        if (!user || !activeThreadId) return

        const newMsg: Message = {
            id: crypto.randomUUID(),
            senderId: user.alias,
            receiverId: activeThreadId,
            content,
            timestamp: new Date().toISOString(),
            read: false
        }

        // 1. Update State
        const updatedMessages = [...messages, newMsg]
        setMessages(updatedMessages)

        // 2. Persist Global (Load, Append, Save)
        const stored = localStorage.getItem("ranthru_messages")
        const allStored: Message[] = stored ? JSON.parse(stored) : []
        localStorage.setItem("ranthru_messages", JSON.stringify([...allStored, newMsg]))

        // 3. Update Threads
        generateThreads(updatedMessages, user.alias)

        // 4. Simulate Reply (Mock)
        if (activeThreadId === "Concierge") {
            setTimeout(() => {
                const reply: Message = {
                    id: crypto.randomUUID(),
                    senderId: "Concierge",
                    receiverId: user.alias,
                    content: "A specialist will be with you shortly.",
                    timestamp: new Date().toISOString(),
                    read: false
                }

                setMessages(prev => {
                    const updated = [...prev, reply]
                    generateThreads(updated, user.alias)
                    return updated
                })

                // Trigger Toast
                // dispatchEvent(new CustomEvent('toast', { detail: { title: 'New Message', message: reply.content } })) 
                // Since we can't easily use hooks inside this timeout wrapper without refactoring context, 
                // we will leave this for Phase 2 when we have a real socket listener component.
                // For now, the UI updates are sufficient.

                const currentStored = JSON.parse(localStorage.getItem("ranthru_messages") || "[]")
                localStorage.setItem("ranthru_messages", JSON.stringify([...currentStored, reply]))
            }, 1500)
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
