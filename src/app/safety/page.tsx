"use client"

import { Button } from "@/components/ui/button"
import { Shield, MapPin, Phone, MessageSquare, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export default function SafetyPage() {
    const [isSharing, setIsSharing] = useState(false)

    const toggleSharing = () => {
        setIsSharing(!isSharing)
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center space-y-4">
                <Shield className="w-16 h-16 text-primary mx-auto" />
                <h1 className="text-4xl font-black tracking-tighter text-white">SAFETY CENTER</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Your security is paramount. RanThru employs elite verification and real-time monitoring to ensure every encounter is secure.
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${isSharing ? 'bg-primary/10 border-primary' : 'bg-card border-white/5'} transition-all`}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <MapPin className={`w-5 h-5 ${isSharing ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                                Mock Location Sharing
                            </h3>
                            <p className="text-sm text-muted-foreground">Share your live GPS location with trusted contacts.</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${isSharing ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-zinc-700'}`} />
                    </div>
                    <Button
                        onClick={toggleSharing}
                        className={`w-full ${isSharing ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
                    >
                        {isSharing ? "Stop Sharing" : "Start Live Sharing"}
                    </Button>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Phone className="w-5 h-5 text-muted-foreground" />
                                Emergency Hotline
                            </h3>
                            <p className="text-sm text-muted-foreground">24/7 Priority support for urgent situations.</p>
                        </div>
                    </div>
                    <Button variant="secondary" className="w-full">Call Support (Mock)</Button>
                </div>
            </div>

            {/* Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-3">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    <h4 className="font-bold text-white">Verified Identities</h4>
                    <p className="text-sm text-muted-foreground">Every Companion undergoes rigorous ID verification and background checks.</p>
                </div>
                <div className="space-y-3">
                    <MessageSquare className="w-8 h-8 text-blue-500" />
                    <h4 className="font-bold text-white">Secure Chat</h4>
                    <p className="text-sm text-muted-foreground">All communications are encrypted. Never move conversation off-platform.</p>
                </div>
                <div className="space-y-3">
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    <h4 className="font-bold text-white">Zero Tolerance</h4>
                    <p className="text-sm text-muted-foreground">Harassment or illegal requests result in immediate permanent bans.</p>
                </div>
            </div>
        </div>
    )
}
