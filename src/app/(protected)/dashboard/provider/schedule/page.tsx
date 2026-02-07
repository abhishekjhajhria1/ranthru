"use client"

import { WeeklyCalendar } from "@/components/schedule/weekly-calendar"

export default function SchedulePage() {
    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-white mb-2">SCHEDULE MANAGER</h1>
                <p className="text-muted-foreground">Manage your weekly availability. This updates your public profile instantly.</p>
            </div>

            <WeeklyCalendar />
        </div>
    )
}
