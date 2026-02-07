"use client"

import { useToast, Toast, ToastType } from "@/lib/notification-context"
import { X, CheckCircle, AlertCircle, Info, MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"

export function Toaster() {
    const { toasts, dismissToast } = useToast()

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
            ))}
        </div>
    )
}

function ToastItem({ toast, onDismiss }: { toast: Toast, onDismiss: () => void }) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true))
    }, [])

    const handleDismiss = () => {
        setIsVisible(false)
        setTimeout(onDismiss, 300) // Wait for exit animation
    }

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        message: <MessageSquare className="w-5 h-5 text-primary" />
    }

    const borders = {
        success: "border-green-500/20",
        error: "border-red-500/20",
        info: "border-blue-500/20",
        message: "border-primary/20"
    }

    return (
        <div
            className={`
                pointer-events-auto
                relative overflow-hidden
                bg-black/80 backdrop-blur-md border ${borders[toast.type as ToastType] || "border-white/10"}
                p-4 rounded-lg shadow-lg
                transform transition-all duration-300 ease-in-out
                ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
            `}
        >
            <div className="flex gap-3 items-start">
                {icons[toast.type as ToastType]}
                <div className="flex-1 space-y-1">
                    <h4 className="font-medium text-sm text-white">{toast.title}</h4>
                    {toast.message && <p className="text-xs text-muted-foreground">{toast.message}</p>}
                    {toast.action && (
                        <button
                            onClick={toast.action.onClick}
                            className="mt-2 text-xs font-bold text-primary hover:underline"
                        >
                            {toast.action.label}
                        </button>
                    )}
                </div>
                <button onClick={handleDismiss} className="text-muted-foreground hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
            {/* Progress bar could go here */}
        </div>
    )
}
