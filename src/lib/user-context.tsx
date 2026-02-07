"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type UserRole = "client" | "provider" | null

interface UserProfile {
    alias: string
    role: UserRole
    email: string
    walletAddress?: string // Optional for MVP text input
    bio?: string
    hourlyRate?: string
    location?: string
    isIncognito: boolean
    blurPhotos: boolean
}

interface UserContextType {
    user: UserProfile | null
    isAuthenticated: boolean
    login: (profile: UserProfile) => void
    logout: () => void
    updateProfile: (updates: Partial<UserProfile>) => void
    isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Initialize from LocalStorage
    useEffect(() => {
        const stored = localStorage.getItem("ranthru_user")
        if (stored) {
            // eslint-disable-next-line
            setUser(JSON.parse(stored))
        }
        setIsLoading(false)
    }, [])

    const login = (profile: UserProfile) => {
        setUser(profile)
        localStorage.setItem("ranthru_user", JSON.stringify(profile))
        // Redirect based on role
        if (profile.role === "client") router.push("/dashboard/client")
        if (profile.role === "provider") router.push("/dashboard/provider")
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("ranthru_user")
        router.push("/")
    }

    const updateProfile = (updates: Partial<UserProfile>) => {
        setUser(prev => {
            if (!prev) return null
            const updated = { ...prev, ...updates }
            localStorage.setItem("ranthru_user", JSON.stringify(updated))
            return updated
        })
    }

    return (
        <UserContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile, isLoading }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}
