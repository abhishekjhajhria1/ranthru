"use client"

import { useState, useEffect } from "react"
import { getBookings, updateBookingStatus, Booking } from "@/lib/booking"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, Clock, Calendar, DollarSign } from "lucide-react"

export default function RequestsPage() {
    const [requests, setRequests] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const refreshRequests = () => {
        const all = getBookings()
        // Filter for pending requests primarily
        // For MVP, showing all recent ones
        setRequests(all.filter(b => b.status !== 'cancelled').reverse())
        setIsLoading(false)
    }

    useEffect(() => {
        // eslint-disable-next-line
        refreshRequests()
    }, [])

    const handleAction = (id: string, status: 'accepted' | 'rejected') => {
        updateBookingStatus(id, status)
        refreshRequests()
    }

    if (isLoading) return <div className="p-8">Loading requests...</div>

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">INCOMING REQUESTS</h1>
                    <p className="text-muted-foreground">Review and manage client booking proposals.</p>
                </div>
                <Badge variant="outline" className="text-xs uppercase tracking-widest border-primary/50 text-primary">
                    {requests.filter(r => r.status === 'pending').length} Pending
                </Badge>
            </div>

            <div className="grid gap-4">
                {requests.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        No requests found.
                    </div>
                ) : (
                    requests.map(booking => (
                        <Card key={booking.id} className="bg-black/40 border-white/5 backdrop-blur-md overflow-hidden group hover:border-white/10 transition-colors">
                            <div className="flex flex-col md:flex-row">
                                {/* Left: Validation Strip */}
                                <div className={`w-full md:w-2 ${booking.status === 'accepted' ? 'bg-green-500' :
                                    booking.status === 'rejected' ? 'bg-red-500/50' :
                                        'bg-yellow-500/50'
                                    }`} />

                                <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    {/* Client Info */}
                                    <div className="flex items-center gap-4 min-w-[200px]">
                                        <Avatar className="h-12 w-12 border-2 border-white/10">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${booking.clientId}`} />
                                            <AvatarFallback>CL</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold text-lg text-white">{booking.clientName}</h3>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Badge variant="secondary" className="text-[10px] h-5 px-1">{booking.status.toUpperCase()}</Badge>
                                                <span className="font-mono text-[10px] opacity-50">{booking.id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm w-full">
                                        <div>
                                            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Service</div>
                                            <div className="font-medium text-white">{booking.service}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Date</div>
                                            <div className="font-medium text-white flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-primary" />
                                                {new Date(booking.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Time</div>
                                            <div className="font-medium text-white flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-primary" />
                                                {new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Honorarium</div>
                                            <div className="font-bold text-green-400 flex items-center gap-1">
                                                <DollarSign className="w-3 h-3" />
                                                {booking.total} ETH
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {booking.status === 'pending' && (
                                        <div className="flex gap-2 w-full md:w-auto">
                                            <Button
                                                variant="destructive"
                                                className="flex-1 md:flex-none bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50"
                                                onClick={() => handleAction(booking.id, 'rejected')}
                                            >
                                                <X className="w-4 h-4 mr-2" /> Decline
                                            </Button>
                                            <Button
                                                className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(22,163,74,0.3)]"
                                                onClick={() => handleAction(booking.id, 'accepted')}
                                            >
                                                <Check className="w-4 h-4 mr-2" /> Accept
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
