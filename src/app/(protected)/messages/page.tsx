"use client"

import { useState } from "react"
import { Lock, Send, Image as ImageIcon, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MessagesPage() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hey warm welcome to the velvet district!", sender: "host", time: "10:05 PM" },
        { id: 2, text: "Are you available tonight around 11?", sender: "me", time: "10:06 PM" },
    ])
    const [input, setInput] = useState("")

    const sendMessage = () => {
        if (!input.trim()) return
        setMessages([...messages, { id: Date.now(), text: input, sender: "me", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
        setInput("")
    }

    return (
        <div className="flex h-full flex-col bg-background/50 backdrop-blur-sm">
            {/* Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-card/80">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/50">
                        VR
                    </div>
                    <div>
                        <h2 className="font-bold text-white">Velvet Rose</h2>
                        <div className="flex items-center gap-2 text-xs text-green-500">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> End-to-End Encrypted
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Clock className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="flex justify-center">
                    <span className="text-xs bg-secondary/50 px-3 py-1 rounded-full text-muted-foreground flex items-center gap-2">
                        <Lock className="w-3 h-3" /> Messages are self-destructing in 24h
                    </span>
                </div>

                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl ${msg.sender === 'me' ? 'bg-primary text-white rounded-tr-sm' : 'bg-secondary text-secondary-foreground rounded-tl-sm'}`}>
                            <p>{msg.text}</p>
                            <p className={`text-[10px] opacity-70 mt-1 text-right`}>{msg.time}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-card/80 border-t border-border">
                <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <ImageIcon className="w-5 h-5" />
                    </Button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a secure message..."
                        className="flex-1 bg-secondary/50 border border-transparent focus:border-primary/50 rounded-full px-4 py-2 outline-none text-white transition-all"
                    />
                    <Button size="icon" onClick={sendMessage} className="rounded-full w-10 h-10">
                        <Send className="w-4 h-4 ml-0.5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
