"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/user-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Shield, Save, KeyRound } from "lucide-react"

export default function ProfilePage() {
    const { user, updateProfile } = useUser()
    const [isEditing, setIsEditing] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formData, setFormData] = useState<any>({})

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line
            setFormData(user)
        }
    }, [user])

    if (!user) return <div className="p-8 text-center">Please log in.</div>

    const handleSave = () => {
        updateProfile(formData)
        setIsEditing(false)
    }

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-1">IDENTITY</h1>
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Manage your digital persona</p>
                </div>
                <div className="flex gap-4">
                    {isEditing ? (
                        <>
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave} className="bg-primary text-white hover:bg-primary/90">
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" onClick={() => setIsEditing(true)} className="border-white/10 hover:bg-white/5">
                            Edit Profile
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-[300px_1fr]">

                {/* Left Column: Avatar & Quick Privacy */}
                <div className="space-y-6">
                    <Card className="glass border-white/5 overflow-hidden">
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="relative mx-auto w-32 h-32 group">
                                <Avatar className={`w-32 h-32 border-4 border-black/50 shadow-2xl ${user.blurPhotos ? "blur-md hover:blur-none transition-all duration-500" : ""}`}>
                                    <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.alias}`} />
                                    <AvatarFallback>UNK</AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                                        <span className="text-xs font-bold uppercase">Change</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{user.alias}</h2>
                                <Badge variant="outline" className="mt-2 border-primary/50 text-primary uppercase text-[10px] tracking-widest">
                                    {user.role === 'provider' ? 'Verified Talent' : 'Elite Member'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-white/5">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <Shield className="w-4 h-4 text-primary" />
                                Privacy Mode
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="blur-photos" className="text-xs uppercase text-muted-foreground">Blur Photos Initially</Label>
                                <Switch
                                    id="blur-photos"
                                    checked={formData.blurPhotos}
                                    onCheckedChange={(checked) => {
                                        setFormData({ ...formData, blurPhotos: checked })
                                        if (!isEditing) updateProfile({ blurPhotos: checked })
                                    }}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="incognito" className="text-xs uppercase text-muted-foreground">Incognito Status</Label>
                                <Switch
                                    id="incognito"
                                    checked={formData.isIncognito}
                                    onCheckedChange={(checked) => {
                                        setFormData({ ...formData, isIncognito: checked })
                                        if (!isEditing) updateProfile({ isIncognito: checked })
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Editable Details */}
                <Card className="glass border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Profile Details</CardTitle>
                        <CardDescription>Update your public facing information securely.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="alias">Alias (Display Name)</Label>
                            <Input
                                id="alias"
                                value={formData.alias || ''}
                                onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                                disabled={!isEditing}
                                className="bg-white/5 border-white/10"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio / Statement</Label>
                            <textarea
                                id="bio"
                                value={formData.bio || ''}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                disabled={!isEditing}
                                className="flex min-h-[120px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tell the district about yourself..."
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Secure Contact (Email)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={!isEditing}
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            {user.role === 'provider' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="rate">Hourly Rate (ETH)</Label>
                                    <Input
                                        id="rate"
                                        value={formData.hourlyRate || ''}
                                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                                        disabled={!isEditing}
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                            )}
                        </div>

                        <Separator className="bg-white/5" />

                        <div className="space-y-2">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Wallet Connection</h3>
                            <div className="flex items-center gap-2 p-3 rounded-md bg-black/40 border border-white/5 font-mono text-xs text-zinc-400 break-all">
                                <KeyRound className="w-4 h-4 shrink-0" />
                                {user.walletAddress || '0x...'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
