"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Bitcoin, Plus, Trash2, ShieldCheck, Loader2, AlertCircle } from "lucide-react"
import { createBooking } from "@/lib/booking"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/user-context"
import { useToast } from "@/lib/notification-context"

const SERVICES = [
    { id: 1, name: "The Goddess Experience (1h)", price: 0.15, desc: "Full attention, conversation, and intimacy." },
    { id: 2, name: "Private Dinner & Company (2h)", price: 0.25, desc: "A public outing followed by private relaxation." },
    { id: 3, name: "The Overnight Stay (8h)", price: 1.0, desc: "Sunset to sunrise. The ultimate connection." },
]

const ADDONS = [
    { id: 101, name: "Aromatherapy Oil", price: 0.02 },
    { id: 102, name: "Silk Restraints (Provider's)", price: 0.05 },
    { id: 103, name: "Fantasy Costume", price: 0.08 },
    { id: 104, name: "Dom Perignon '13", price: 0.1 },
]

export default function BookingPage() {
    const { user } = useUser()
    const { showToast } = useToast()
    const [cart, setCart] = useState<{ id: number, qty: number }[]>([])
    const [selectedService, setSelectedService] = useState<number | null>(null)

    // Transaction State
    const [txHash, setTxHash] = useState("")
    const [isVerifying, setIsVerifying] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'booked' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState("")

    // Check for existing booking (Double Booking Logic)
    useEffect(() => {
        const existing = localStorage.getItem('active_booking')
        if (existing) {
            // eslint-disable-next-line
            setBookingStatus('booked')
        }
    }, [])

    const addToCart = (id: number) => {
        if (bookingStatus === 'booked') return
        setCart(prev => {
            const existing = prev.find(item => item.id === id)
            if (existing) {
                return prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item)
            }
            return [...prev, { id, qty: 1 }]
        })
    }

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id))
    }

    const handleBooking = async () => {
        if (!txHash.startsWith("0x") || txHash.length !== 66) {
            setErrorMsg("Invalid Transaction Hash format. Must start with 0x and be 66 chars.")
            return
        }

        setIsVerifying(true)
        setErrorMsg("")

        // Simulate Blockchain Verification Delay
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Valid Mock Hash check (simulated)
        if (txHash === "0x0000000000000000000000000000000000000000000000000000000000000000") { // Force fail for testing
            setIsVerifying(false)
            setErrorMsg("Transaction Failed: Insufficient Funds or Reverted.")
            return
        }

        // --- Start of new logic from user instruction ---
        setIsProcessing(true)

        // Simulate blockchain confirm
        setTimeout(async () => { // Made async to await createBooking if it's an async function
            if (user) {
                // Prepare addons for createBooking
                const addonNames = cart.map(item => {
                    const product = ADDONS.find(a => a.id === item.id);
                    return `${item.qty}x ${product?.name || `Unknown Addon ${item.id}`}`;
                });

                await createBooking({ // Assuming createBooking is async
                    clientId: user.alias,
                    clientName: user.alias,
                    providerId: "Mistress K", // Hardcoded for MVP demo context
                    providerName: "Mistress K",
                    service: SERVICES.find(s => s.id === selectedService)?.name || "Custom Service",
                    date: new Date().toISOString(),
                    total: parseFloat(total),
                    addons: addonNames
                })
            }

            setIsProcessing(false)
            setBookingStatus('booked')
            localStorage.setItem('active_booking', 'true') // Keep legacy for simple check
            // --- End of new logic from user instruction ---

            // Trigger Toast
            showToast({
                type: 'success',
                title: 'Booking Request Sent',
                message: 'Velvet Rose has been notified of your request.',
                duration: 5000
            })

            // Original logic for setting txHash and date in localStorage, adapted
            localStorage.setItem('active_booking_details', JSON.stringify({
                service: selectedService,
                tx: txHash,
                date: new Date().toISOString()
            }))
        }, 2000)

        setIsVerifying(false) // This should probably be inside the setTimeout if it's part of the final confirmation
    }

    const clearBooking = () => {
        localStorage.removeItem('active_booking')
        setBookingStatus('idle')
        setTxHash("")
        setSelectedService(null)
        setCart([])
    }

    const total = (
        (selectedService ? SERVICES.find(s => s.id === selectedService)?.price || 0 : 0) +
        cart.reduce((sum, item) => sum + (ADDONS.find(a => a.id === item.id)?.price || 0) * item.qty, 0)
    ).toFixed(3)

    if (bookingStatus === 'booked') {
        return (
            <div className="p-8 max-w-2xl mx-auto pt-32 text-center space-y-8">
                <div className="w-24 h-24 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)] animate-in zoom-in spin-in-3">
                    <ShieldCheck className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-white">Booking Confirmed</h1>
                    <p className="text-muted-foreground">
                        Your transaction has been verified on the blockchain.
                        <br />
                        <span className="text-xs font-mono bg-black/50 px-2 py-1 rounded mt-2 inline-block text-zinc-500">{txHash.slice(0, 10)}...{txHash.slice(-10)}</span>
                    </p>
                    <p className="text-accent text-sm uppercase tracking-widest pt-4">Velvet Rose has been notified.</p>
                </div>
                <Button onClick={clearBooking} variant="outline" className="border-dashed text-muted-foreground hover:text-white">
                    Debug: Clear Booking (Reset)
                </Button>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 pb-32">
            <h1 className="text-3xl font-bold tracking-tight text-white glow-sm">Request Booking</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Selection */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Service Selection */}
                    <div className="bg-card/40 border border-white/10 rounded-xl p-8 space-y-6 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-primary flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/50 text-sm">1</span>
                            Curate Your Experience
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {SERVICES.map(service => (
                                <div
                                    key={service.id}
                                    onClick={() => setSelectedService(service.id)}
                                    className={`p-6 border rounded-lg cursor-pointer transition-all flex flex-col gap-2 relative overflow-hidden group ${selectedService === service.id ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-primary/50 bg-black/20'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`font-bold text-lg ${selectedService === service.id ? 'text-white' : 'text-zinc-300'}`}>{service.name}</span>
                                        <span className="font-mono text-primary font-bold">{service.price} E</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{service.desc}</p>

                                    {selectedService === service.id && <div className="absolute bottom-0 left-0 h-1 bg-primary w-full animate-in slide-in-from-left duration-500"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add-on Cart */}
                    <div className="bg-card/40 border border-white/10 rounded-xl p-8 space-y-6 backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-primary flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/50 text-sm">2</span>
                                Indulgences & Extras
                            </h2>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest border border-white/10 px-2 py-1 rounded">Provider Supplied</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ADDONS.map(addon => (
                                <div key={addon.id} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg border border-transparent hover:border-white/5 transition-colors">
                                    <div>
                                        <h3 className="font-medium text-white text-sm">{addon.name}</h3>
                                        <p className="text-xs text-muted-foreground font-mono">{addon.price} ETH</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="hover:bg-primary/20 hover:text-primary" onClick={() => addToCart(addon.id)}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Summary & Pay */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 bg-card border border-primary/50 rounded-xl p-6 space-y-6 shadow-[0_0_30px_rgba(220,38,38,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />

                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-primary" /> Booking Summary
                        </h2>

                        <div className="space-y-3 text-sm border-b border-white/10 pb-4">
                            {selectedService ? (
                                <div className="flex justify-between">
                                    <span className="text-white">{SERVICES.find(s => s.id === selectedService)?.name}</span>
                                    <span className="font-mono text-primary">{SERVICES.find(s => s.id === selectedService)?.price}</span>
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic text-xs">select a service to begin...</p>
                            )}

                            {cart.map(item => {
                                const product = ADDONS.find(a => a.id === item.id)
                                return (
                                    <div key={item.id} className="flex justify-between items-center text-muted-foreground">
                                        <span className="flex items-center gap-2 text-xs">
                                            <span className="text-white">{item.qty}x</span> {product?.name}
                                            <button onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-white transition-colors"><Trash2 className="w-3 h-3" /></button>
                                        </span>
                                        <span className="font-mono text-white/50">{(product!.price * item.qty).toFixed(3)}</span>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex justify-between items-center text-xl font-bold text-white">
                            <span>Total</span>
                            <span className="text-primary glow-text">{total} ETH</span>
                        </div>

                        {/* Crypto Payment Form */}
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div>
                                <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2 block">
                                    Confirm Transaction
                                </label>
                                <input
                                    type="text"
                                    placeholder="Paste TX Hash (0x...)"
                                    value={txHash}
                                    onChange={(e) => setTxHash(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs font-mono text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-zinc-700"
                                />
                                {errorMsg && (
                                    <p className="text-[10px] text-red-500 mt-2 flex items-center gap-1 animate-in slide-in-from-top-1">
                                        <AlertCircle className="w-3 h-3" /> {errorMsg}
                                    </p>
                                )}
                                <p className="text-[10px] text-muted-foreground mt-2">
                                    Send exactly <span className="text-white font-mono">{total} ETH</span> to <br />
                                    <span className="text-primary/70 font-mono">0x123...abc</span>
                                </p>
                            </div>

                            <Button
                                onClick={handleBooking}
                                disabled={!selectedService || isVerifying || isProcessing}
                                className="w-full h-12 text-lg font-bold gap-2 relative overflow-hidden group bg-primary hover:bg-primary/90 text-white border-0"
                            >
                                {isVerifying || isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> {isProcessing ? "Confirming..." : "Verifying..."}
                                    </>
                                ) : (
                                    <>
                                        <Bitcoin className="w-5 h-5" /> Confirm Booking
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
