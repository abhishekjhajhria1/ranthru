"use client"

import { useUser } from "@/lib/user-context"
import { MapPin } from "lucide-react"

export default function ClientDashboard() {
    const { user } = useUser()

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">DISTRICT MAP</h1>
                    <p className="text-muted-foreground uppercase tracking-widest text-xs">
                        Access Granted: <span className="text-primary font-bold">{user?.alias || "Guest"}</span>
                    </p>
                </div>
                <button className="bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold border border-primary/20 flex items-center gap-2 hover:bg-primary/20 transition-all">
                    <MapPin className="w-4 h-4" /> Dallas, TX
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="p-4 bg-card border border-border rounded-xl sticky top-4">
                        <h3 className="font-bold mb-4">Filters</h3>
                        <div className="space-y-2">
                            <div className="h-10 bg-secondary rounded w-full animate-pulse" />
                            <div className="h-10 bg-secondary rounded w-full animate-pulse" />
                            <div className="h-10 bg-secondary rounded w-full animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Listings */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[
                        { name: "Velvet Rose", rating: "5.0", status: "Available", img: "bg-red-900", type: "GDE" },
                        { name: "Mistress K", rating: "4.9", status: "Busy", img: "bg-purple-900", type: "DOM" },
                        { name: "Sasha Grey", rating: "4.8", status: "Available", img: "bg-blue-900", type: "GDE" },
                        { name: "Luna V", rating: "5.0", status: "Offline", img: "bg-zinc-800", type: "SWT" },
                        { name: "Roxanne", rating: "4.7", status: "Available", img: "bg-pink-900", type: "GDE" },
                        { name: "Elektra", rating: "4.9", status: "Busy", img: "bg-yellow-900", type: "EXP" }
                    ].map((provider, i) => (
                        <div key={i} className="group relative bg-card/40 border border-white/5 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(220,20,60,0.1)]">
                            <div className={`aspect-[3/4] ${provider.img} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                                <div className="absolute inset-0 flex items-center justify-center text-white/10 text-6xl font-black uppercase tracking-tighter group-hover:scale-110 transition-transform duration-700">
                                    {provider.type}
                                </div>
                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded backdrop-blur-md border border-white/10 flex items-center gap-1">
                                    <span className="text-accent text-[10px]">★</span>
                                    <span className="text-xs font-bold text-white">{provider.rating}</span>
                                </div>
                                {provider.status === "Available" && (
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-green-500/20 border border-green-500/50 rounded backdrop-blur-md">
                                        <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider animate-pulse">Live</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{provider.name}</h3>
                                    <div className={`w-2 h-2 rounded-full mt-2 ${provider.status === 'Available' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : provider.status === 'Busy' ? 'bg-orange-500' : 'bg-zinc-600'}`} />
                                </div>

                                <div className="flex flex-wrap gap-1 pt-1">
                                    <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[10px] text-muted-foreground uppercase tracking-wide">In-Call</span>
                                    {provider.type === "DOM" && <span className="px-2 py-0.5 bg-red-900/20 border border-red-500/20 rounded text-[10px] text-red-400 uppercase tracking-wide">Dungeon</span>}
                                    {provider.type === "GDE" && <span className="px-2 py-0.5 bg-pink-900/20 border border-pink-500/20 rounded text-[10px] text-pink-400 uppercase tracking-wide">GFE</span>}
                                </div>
                            </div>
                        </div>
                    ))}    </div>
            </div>
        </div>
    )
}
