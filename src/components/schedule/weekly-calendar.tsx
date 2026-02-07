"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const HOURS = Array.from({ length: 17 }, (_, i) => i + 12) // 12 PM to 28 (4 AM next day)

export function WeeklyCalendar() {
    const [availability, setAvailability] = useState<Record<string, boolean>>({})
    const [isSaving, setIsSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem("ranthru_availability")
        if (stored) {
            // eslint-disable-next-line
            setAvailability(JSON.parse(stored))
        }
    }, [])

    const toggleSlot = (day: string, hour: number) => {
        const key = `${day}-${hour}`
        setAvailability(prev => {
            const next = { ...prev }
            if (next[key]) {
                delete next[key]
            } else {
                next[key] = true
            }
            return next
        })
        setHasChanges(true)
    }

    const saveAvailability = () => {
        setIsSaving(true)
        // Simulate network request
        setTimeout(() => {
            localStorage.setItem("ranthru_availability", JSON.stringify(availability))
            setIsSaving(false)
            setHasChanges(false)
        }, 800)
    }

    const formatHour = (h: number) => {
        if (h === 12) return "12 PM"
        if (h === 24) return "12 AM"
        if (h > 24) return `${h - 24} AM`
        if (h > 12) return `${h - 12} PM`
        return `${h} AM`
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-md sticky top-0 z-20">
                <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                        Weekly Availability
                        {hasChanges && <span className="text-xs text-yellow-500 font-normal animate-pulse">(Unsaved Changes)</span>}
                    </h3>
                    <p className="text-xs text-muted-foreground">Tap slots to toggle availability.</p>
                </div>
                <Button
                    onClick={saveAvailability}
                    disabled={!hasChanges || isSaving}
                    className="bg-primary hover:bg-primary/90 text-white min-w-[100px]"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save</>}
                </Button>
            </div>

            <div className="overflow-x-auto pb-4 custom-scrollbar">
                <div className="min-w-[800px] grid grid-cols-[80px_repeat(7,1fr)] gap-1">
                    {/* Header Row */}
                    <div className="sticky left-0 z-10 bg-background/95 backdrop-blur"></div>
                    {DAYS.map(day => (
                        <div key={day} className="text-center py-2 font-bold text-muted-foreground uppercase text-xs tracking-wider bg-white/5 rounded-t-lg">
                            {day}
                        </div>
                    ))}

                    {/* Time Slots */}
                    {HOURS.map(hour => (
                        <>
                            <div key={`time-${hour}`} className="text-xs text-muted-foreground font-mono flex items-center justify-end pr-3 sticky left-0 bg-background/95 backdrop-blur z-10 border-r border-white/5">
                                {formatHour(hour)}
                            </div>
                            {DAYS.map(day => {
                                const isSelected = availability[`${day}-${hour}`]
                                return (
                                    <button
                                        key={`${day}-${hour}`}
                                        onClick={() => toggleSlot(day, hour)}
                                        className={`
                                            h-10 rounded-sm border border-white/5 transition-all duration-200
                                            ${isSelected
                                                ? "bg-primary/80 shadow-[0_0_10px_rgba(220,20,60,0.3)] border-primary/50"
                                                : "bg-black/20 hover:bg-white/10"
                                            }
                                        `}
                                    />
                                )
                            })}
                        </>
                    ))}
                </div>
            </div>
        </div>
    )
}
