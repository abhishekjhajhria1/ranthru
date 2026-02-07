"use client"

import { useUser } from "@/lib/user-context"

export default function ProviderDashboard() {
    const { user } = useUser()

    if (!user) return null // Or a loading spinner/redirect

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">COMMAND CENTER</h1>
                    <p className="text-muted-foreground uppercase tracking-widest text-xs">
                        Welcome back, <span className="text-primary font-bold">{user.alias}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-mono text-green-500 uppercase">Live Signal</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="p-6 bg-card border border-white/10 rounded-xl hover:border-primary/30 transition-colors group">
                    <h3 className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Night&apos;s Take</h3>
                    <p className="text-4xl font-black text-white mt-2 tracking-tighter">$1,240<span className="text-lg text-muted-foreground font-light">.00</span></p>
                </div>
                <div className="p-6 bg-card border border-white/10 rounded-xl hover:border-primary/30 transition-colors group">
                    <h3 className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] group-hover:text-white transition-colors">Session Status</h3>
                    <p className="text-4xl font-black text-white mt-2 tracking-tighter">IDLE</p>
                </div>
                <div className="p-6 bg-card border border-white/10 rounded-xl hover:border-green-500/30 transition-colors group">
                    <h3 className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] group-hover:text-green-500 transition-colors">Security Level</h3>
                    <p className="text-4xl font-black text-green-500 mt-2 tracking-tighter drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">MAX</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 h-96 flex items-center justify-center text-muted-foreground">
                        [Booking Calendar Placeholder]
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-destructive/20 border border-destructive/50 rounded-xl p-6 text-center space-y-4">
                        <h3 className="text-destructive font-bold text-xl">EMERGENCY</h3>
                        <button className="w-full py-4 bg-destructive hover:bg-destructive/90 text-white font-bold rounded-lg animate-pulse">
                            SOS / PANIC BUTTON
                        </button>
                        <p className="text-xs text-muted-foreground">Press and hold for 3 seconds to alert contacts.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
