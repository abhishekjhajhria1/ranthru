"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

export type ToastType = 'success' | 'error' | 'info' | 'message'

export interface Toast {
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
    action?: {
        label: string
        onClick: () => void
    }
}

interface NotificationContextType {
    toasts: Toast[]
    showToast: (toast: Omit<Toast, 'id'>) => void
    dismissToast: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const showToast = useCallback((toastData: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast = { ...toastData, id }

        setToasts((prev) => [...prev, newToast])

        if (toastData.duration !== Infinity) {
            setTimeout(() => {
                dismissToast(id)
            }, toastData.duration || 5000)
        }
    }, [dismissToast])

    return (
        <NotificationContext.Provider value={{ toasts, showToast, dismissToast }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error("useToast must be used within a NotificationProvider")
    }
    return context
}
