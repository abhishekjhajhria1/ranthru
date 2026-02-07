"use client"

import { useState, useRef, useEffect } from "react"
import { useMessages } from "@/lib/message-context"
import { useUser } from "@/lib/user-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card" // Using our custom one
import { Send, Search, MoreVertical, Phone, Video } from "lucide-react"

export default function MessagesPage() {
    const { threads, messages, activeThreadId, setActiveThreadId, sendMessage } = useMessages()
    const { user } = useUser()
    const [inputValue, setInputValue] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, activeThreadId])

    const activeMessages = activeThreadId
        ? messages.filter(m => (m.senderId === activeThreadId || m.receiverId === activeThreadId) && (m.senderId === user?.alias || m.receiverId === user?.alias))
        : []

    // Sort chronologically
    activeMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputValue.trim()) return
        sendMessage(inputValue)
        setInputValue("")
    }

    return (
        <div className="flex h-[calc(100vh-2rem)] p-4 gap-4 animate-in fade-in duration-500">
            {/* Sidebar List */}
            <Card className="w-80 border-white/5 bg-black/40 backdrop-blur-xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-lg tracking-tight">Messages</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreVertical className="w-4 h-4" /></Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search..." className="pl-9 bg-white/5 border-white/10" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {threads.map(thread => (
                        <div
                            key={thread.id}
                            onClick={() => setActiveThreadId(thread.id)}
                            className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-white/5 hover:bg-white/5 ${activeThreadId === thread.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}
                        >
                            <Avatar>
                                <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${thread.participantId}`} alt={thread.participantName} />
                                <AvatarFallback>{thread.participantName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={`text-sm font-semibold truncate ${activeThreadId === thread.id ? 'text-primary' : 'text-white'}`}>{thread.participantName}</h3>
                                    <span className="text-[10px] text-muted-foreground">{new Date(thread.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>
                            </div>
                            {thread.unreadCount > 0 && (
                                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#f03]" />
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Main Chat Area */}
            <Card className="flex-1 border-white/5 bg-black/40 backdrop-blur-xl flex flex-col overflow-hidden relative">
                {activeThreadId ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-white/10">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${activeThreadId}`} alt={activeThreadId} />
                                    <AvatarFallback>{activeThreadId[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-white">{activeThreadId}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        <span className="text-xs text-muted-foreground">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-white"><Phone className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-white"><Video className="w-4 h-4" /></Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                            {activeMessages.map(msg => {
                                const isMe = msg.senderId === user?.alias
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe
                                                ? 'bg-primary text-white rounded-br-none shadow-[0_0_15px_rgba(220,20,60,0.2)]'
                                                : 'bg-zinc-800/80 text-zinc-100 rounded-bl-none border border-white/5'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/5 bg-black/20">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    className="bg-white/5 border-white/10 focus-visible:ring-primary/50"
                                />
                                <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_10px_rgba(220,20,60,0.4)]">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 opacity-50" />
                        </div>
                        <h3 className="font-bold text-white mb-2">Select a Conversation</h3>
                        <p className="max-w-xs text-sm">Choose a contact from the sidebar to start encrypted communication.</p>
                    </div>
                )}
            </Card>
        </div>
    )
}
