"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useUser } from "@/lib/user-context"
import { MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { ReviewDialog } from "@/components/review-dialog"

export default function ClientDashboard() {
    const { user } = useUser()
    const [companions, setCompanions] = useState<any[]>([])

    const [bookings, setBookings] = useState<any[]>([])

    useEffect(() => {
        // Fetch Companions
        fetch('/api/users?role=companion')
            .then(res => res.json())
            .then(data => setCompanions(data))

        // Fetch My Bookings
        fetch('/api/bookings')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setBookings(data)
            })
    }, [])

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">COMPANION RADAR</h1>
                    <p className="text-muted-foreground uppercase tracking-widest text-xs">
                        Access Granted: <span className="text-primary font-bold">{user?.alias || "Guest"}</span>
                    </p>
                </div>
                <button className="bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold border border-primary/20 flex items-center gap-2 hover:bg-primary/20 transition-all">
                    <MapPin className="w-4 h-4" /> Dallas, TX
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters & Bookings */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Active Bookings Widget */}
                    <div className="p-4 bg-card border border-border rounded-xl">
                        <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Your Schedule</h3>
                        <div className="space-y-3">
                            {bookings.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No active bookings.</p>
                            ) : (
                                bookings.map(b => (
                                    <div key={b.id} className="p-3 bg-white/5 rounded border border-white/10 text-xs">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-primary">{new Date(b.date).toLocaleDateString()}</span>
                                            <span className={`capitalize ${b.status === 'confirmed' ? 'text-green-400' : 'text-yellow-400'}`}>{b.status}</span>
                                        </div>
                                        <div className="text-white/70">{b.service?.name || "Service"}</div>
                                        {b.provider && (
                                            <div className="flex justify-between items-end mt-1">
                                                <div className="text-white/50">w/ {b.provider.alias}</div>
                                                {b.status === 'completed' && !b.review && (
                                                    <ReviewDialog
                                                        bookingId={b.id}
                                                        providerId={b.provider.id}
                                                        providerName={b.provider.alias}
                                                        onReviewSubmitted={() => {
                                                            // Refresh bookings to hide button
                                                            fetch('/api/bookings').then(res => res.json()).then(d => Array.isArray(d) && setBookings(d))
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

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
                    {companions.map((provider: any, i: number) => (
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
                                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{provider.alias}</h3>
                                    <div className={`w-2 h-2 rounded-full mt-2 ${provider.status === 'Available' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : provider.status === 'Busy' ? 'bg-orange-500' : 'bg-zinc-600'}`} />
                                </div>

                                <div className="flex flex-wrap gap-1 pt-1">
                                    <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[10px] text-muted-foreground uppercase tracking-wide">In-Call</span>
                                    {provider.type === "DOM" && <span className="px-2 py-0.5 bg-red-900/20 border border-red-500/20 rounded text-[10px] text-red-400 uppercase tracking-wide">Training</span>}
                                    {provider.type === "SOC" && <span className="px-2 py-0.5 bg-pink-900/20 border border-pink-500/20 rounded text-[10px] text-pink-400 uppercase tracking-wide">Social</span>}
                                    {provider.type === "FIT" && <span className="px-2 py-0.5 bg-green-900/20 border border-green-500/20 rounded text-[10px] text-green-400 uppercase tracking-wide">Fitness</span>}
                                    {provider.type === "ADV" && <span className="px-2 py-0.5 bg-orange-900/20 border border-orange-500/20 rounded text-[10px] text-orange-400 uppercase tracking-wide">Adventure</span>}
                                </div>
                            </div>
                        </div>
                    ))}    </div>
            </div>
        </div>
    )
}
