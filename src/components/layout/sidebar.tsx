"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Map, Calendar, MessageSquare, User, Shield, BarChart3, ListChecks } from "lucide-react"

export default function Sidebar() {
    const pathname = usePathname()
    // Simple logic: If URL path contains 'provider', show provider menu. Defaults to client for 'client' or other paths.
    // In a real app, this would check the authenticated user's role.
    const isProvider = pathname?.includes("/dashboard/provider")

    // Client Navigation
    const clientLinks = [
        { href: "/dashboard/client", icon: LayoutDashboard, label: "Discover" },
        { href: "/map", icon: Map, label: "The District" },
        { href: "/booking", icon: Calendar, label: "Concierge" },
        { href: "/messages", icon: MessageSquare, label: "Messages" },
        { href: "/profile", icon: User, label: "Profile" },
    ]

    // Provider Navigation
    const providerLinks = [
        { href: "/dashboard/provider", icon: BarChart3, label: "Command Center" },
        { href: "/dashboard/provider/schedule", icon: Calendar, label: "Schedule" }, // Placeholder route
        { href: "/dashboard/provider/requests", icon: ListChecks, label: "Requests" }, // Placeholder route
        { href: "/messages", icon: MessageSquare, label: "Encrypted Chat" },
        { href: "/profile", icon: User, label: "Profile" },
    ]

    const links = isProvider ? providerLinks : clientLinks

    return (
        <aside className="hidden md:flex flex-col w-72 border-r border-white/5 glass transition-all duration-300">
            <div className="p-8 border-b border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-white text-xs">R</div>
                <div>
                    <Link href="/" className="text-xl font-bold tracking-tight text-white hover:text-primary transition-colors">
                        RANTHRU
                    </Link>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{isProvider ? 'Companion Portal' : 'Member Access'}</p>
                </div>
            </div>

            <nav className="flex-1 p-6 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden ${isActive ? 'bg-white/5 text-white' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
                        >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-primary transition-transform duration-300 rounded-r-full ${isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />
                            <link.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
                            <span className="font-medium tracking-wide text-xs uppercase">{link.label}</span>
                        </Link>
                    )
                })}

                <div className="pt-8 mt-4 border-t border-white/5">
                    <Link href="/safety" className="group flex items-center gap-3 px-4 py-4 rounded-lg text-red-500 hover:bg-red-500/10 transition-all border border-red-900/20 hover:border-red-500/50">
                        <Shield className="w-4 h-4 group-hover:animate-pulse" />
                        <span className="font-bold tracking-wider text-xs uppercase">Safety Protocol</span>
                    </Link>
                </div>
            </nav>

            <div className="p-4 border-t border-white/5 text-[10px] text-zinc-600 text-center font-mono uppercase">
                Encrypted Connection <span className="text-green-900">●</span>
            </div>
        </aside>
    )
}
