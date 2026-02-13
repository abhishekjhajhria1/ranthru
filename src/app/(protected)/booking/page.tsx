"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Bitcoin, Plus, Trash2, ShieldCheck, Loader2 } from "lucide-react"
// import { createBooking } from "@/lib/booking" // Unused
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/user-context"
import { useToast } from "@/components/ui/use-toast"
import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from "wagmi"
import { parseEther } from "viem"
// import { Service } from "@prisma/client" // Unused

// Mock Receiver Address (Random generated for demo)
const TREASURY_ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"

const ADDONS = [
    { id: 101, name: "Aromatherapy Oil", price: 0.02 },
    { id: 102, name: "Silk Restraints (Provider's)", price: 0.05 },
    { id: 103, name: "Fantasy Costume", price: 0.08 },
    { id: 104, name: "Dom Perignon '13", price: 0.1 },
]

export default function BookingPage() {
    const { user } = useUser()
    const { toast } = useToast()
    const { address, isConnected } = useAccount()
    const { data: hash, isPending, sendTransaction } = useSendTransaction()
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    const [services, setServices] = useState<any[]>([])
    const [cart, setCart] = useState<{ id: number, qty: number }[]>([])
    const [selectedService, setSelectedService] = useState<number | null>(null)

    const total = (
        (selectedService ? services.find(s => s.id === selectedService)?.price || 0 : 0) +
        cart.reduce((sum, item) => sum + (ADDONS.find(a => a.id === item.id)?.price || 0) * item.qty, 0)
    ).toFixed(3)



    // Transaction State
    // const [txHash, setTxHash] = useState("") // Removed unused
    // const [isVerifying, setIsVerifying] = useState(false) // Removed unused
    // const [isProcessing, setIsProcessing] = useState(false) // Removed unused
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'booked' | 'error'>('idle')
    // const [errorMsg, setErrorMsg] = useState("") // Removed unused

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
        setCart((prev: { id: number, qty: number }[]) => {
            const existing = prev.find((item: { id: number, qty: number }) => item.id === id)
            if (existing) {
                return prev.map((item: { id: number, qty: number }) => item.id === id ? { ...item, qty: item.qty + 1 } : item)
            }
            return [...prev, { id, qty: 1 }]
        })
    }

    const removeFromCart = (id: number) => {
        setCart((prev: { id: number, qty: number }[]) => prev.filter((item: { id: number, qty: number }) => item.id !== id))
    }

    const handleBooking = async () => {
        if (!isConnected) {
            toast({ variant: "destructive", title: "Wallet not connected", description: "Please connect your wallet first." })
            return
        }

        if (!selectedService) return

        try {
            sendTransaction({
                to: TREASURY_ADDRESS,
                value: parseEther(total),
            })
        } catch (error) {
            console.error("Transaction failed", error)
        }
    }

    // Effect to handle booking creation AFTER transaction confirmation
    useEffect(() => {
        if (isConfirmed && hash) {
            const createBackendBooking = async () => {
                try {
                    await fetch('/api/bookings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            serviceId: selectedService,
                            date: new Date().toISOString(),
                            txHash: hash,
                            totalPrice: parseFloat(total),
                            addons: cart.map(item => ({ id: item.id, qty: item.qty }))
                        })
                    })

                    setBookingStatus('booked')
                    toast({
                        title: "Booking Confirmed",
                        description: "Transaction verified on-chain.",
                    })
                } catch (error) {
                    console.error("Backend sync failed", error)
                }
            }
            createBackendBooking()
        }
    }, [isConfirmed, hash, selectedService, cart, total, toast])

    const clearBooking = () => {
        localStorage.removeItem('active_booking')
        setBookingStatus('idle')
        // setTxHash("") // Removed
        setSelectedService(null)
        setCart([])
    }

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
                        {hash && (
                            <span className="text-xs font-mono bg-black/50 px-2 py-1 rounded mt-2 inline-block text-zinc-500">
                                {hash.slice(0, 10)}...{hash.slice(-10)}
                            </span>
                        )}
                    </p>
                    <p className="text-accent text-sm uppercase tracking-widest pt-4">Companion has been notified.</p>
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
                            {services.map(service => (
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
                                    <span className="text-white">{services.find(s => s.id === selectedService)?.name}</span>
                                    <span className="font-mono text-primary">{services.find(s => s.id === selectedService)?.price}</span>
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
                                    Payment Method
                                </label>

                                {isConnected ? (
                                    <div className="bg-green-500/10 border border-green-500/20 rounded p-3 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs text-green-400 font-mono">Wallet Connected</span>
                                    </div>
                                ) : (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3 text-xs text-yellow-400">
                                        Please connect your wallet in the sidebar to proceed.
                                    </div>
                                )}

                                {hash && (
                                    <div className="mt-2 text-[10px] bg-black/40 p-2 rounded border border-white/5 font-mono break-all text-muted-foreground">
                                        TX: {hash}
                                    </div>
                                )}

                                <p className="text-[10px] text-muted-foreground mt-2">
                                    Send exactly <span className="text-white font-mono">{total} ETH</span> to <br />
                                    <span className="text-primary/70 font-mono">{TREASURY_ADDRESS.slice(0, 6)}...{TREASURY_ADDRESS.slice(-4)}</span>
                                </p>
                            </div>

                            <Button
                                onClick={handleBooking}
                                disabled={!selectedService || isPending || isConfirming || !isConnected}
                                className="w-full h-12 text-lg font-bold gap-2 relative overflow-hidden group bg-primary hover:bg-primary/90 text-white border-0"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Confirming Wallet...
                                    </>
                                ) : isConfirming ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Verifying On-Chain...
                                    </>
                                ) : (
                                    <>
                                        <Bitcoin className="w-5 h-5" /> Pay with Crypto
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
