"use client"

import { useState } from "react"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Wallet } from "lucide-react"

export default function RegisterPage() {
    const { login } = useUser()
    const [step, setStep] = useState(1)
    const [role, setRole] = useState<"client" | "provider" | null>(null)
    const [formData, setFormData] = useState({
        alias: "",
        email: "",
        walletAddress: ""
    })

    const handleRegister = () => {
        if (!role || !formData.alias) return

        login({
            alias: formData.alias,
            role: role,
            email: formData.email,
            walletAddress: formData.walletAddress,
            isIncognito: false,
            blurPhotos: true,
            hourlyRate: "0.15",
            location: "The District",
            bio: "New member of the elite."
        })
    }

    return (
        <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center relative overflow-hidden">
            {/* Background FX */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[200px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full p-8 border border-white/10 bg-black/50 backdrop-blur-xl rounded-2xl relative z-10 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black tracking-tighter mb-2">RANTHRU</h1>
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Elite Companion Access</p>
                </div>

                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        <h2 className="text-lg font-bold text-center">Select Your Path</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setRole("client")}
                                className={`p-6 border rounded-xl flex flex-col items-center gap-3 transition-all ${role === "client" ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/30"}`}
                            >
                                <Wallet className="w-8 h-8 text-white" />
                                <span className="font-bold uppercase text-sm">Member</span>
                            </button>
                            <button
                                onClick={() => setRole("provider")}
                                className={`p-6 border rounded-xl flex flex-col items-center gap-3 transition-all ${role === "provider" ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/30"}`}
                            >
                                <Shield className="w-8 h-8 text-white" />
                                <span className="font-bold uppercase text-sm">Companion</span>
                            </button>
                        </div>
                        <Button
                            className="w-full h-12 text-lg uppercase tracking-wider font-bold"
                            disabled={!role}
                            onClick={() => setStep(2)}
                        >
                            Continue
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        <h2 className="text-lg font-bold text-center">Identity & Security</h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Alias / Display Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Velvet Rose"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
                                    value={formData.alias}
                                    onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Secure Email (Optional)</label>
                                <input
                                    type="email"
                                    placeholder="proton@mail.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Wallet Address (ETH)</label>
                                <input
                                    type="text"
                                    placeholder="0x..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
                                    value={formData.walletAddress}
                                    onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                            <Button
                                className="flex-1 h-12 text-lg uppercase tracking-wider font-bold bg-primary hover:bg-primary/90 text-white"
                                onClick={handleRegister}
                                disabled={!formData.alias}
                            >
                                Enter The Club
                            </Button>
                        </div>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-zinc-500 flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" />
                        End-to-End Encrypted Registration
                    </p>
                </div>
            </div>
        </div>
    )
}
