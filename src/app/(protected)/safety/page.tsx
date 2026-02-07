import { AlertTriangle, Clock, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SafetyPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-destructive glow-sm flex items-center gap-3">
                <ShieldAlert className="w-8 h-8" /> Safety Center
            </h1>

            <div className="p-8 bg-destructive/10 border border-destructive rounded-xl text-center space-y-6 animate-pulse-slow">
                <h2 className="text-2xl font-bold text-white">EMERGENCY SOS</h2>
                <p className="text-destructive-foreground">
                    Pressing this button will instantly share your live location with your trusted contacts and local emergency services if configured.
                </p>
                <Button variant="destructive" size="lg" className="w-full max-w-md h-24 text-2xl font-black shadow-[0_0_50px_rgba(220,38,38,0.5)] hover:bg-red-600 transition-all">
                    ACTIVATE PANIC ALERT (3s)
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-card border border-border rounded-xl space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <Clock className="w-6 h-6" />
                        <h3 className="font-bold text-lg">Check-In Timer</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Set a timer for your appointment. If you don&apos;t check in before it expires, an alert will be sent.
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">30m</Button>
                        <Button variant="outline" className="flex-1">1h</Button>
                        <Button variant="outline" className="flex-1">2h</Button>
                    </div>
                    <Button className="w-full">Start Timer</Button>
                </div>

                <div className="p-6 bg-card border border-border rounded-xl space-y-4">
                    <div className="flex items-center gap-3 text-orange-500">
                        <AlertTriangle className="w-6 h-6" />
                        <h3 className="font-bold text-lg">Bad Date Registry</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Search the community database for known dangerous clients or report an incident.
                    </p>
                    <div className="space-y-2">
                        <input type="text" placeholder="Search by Phone / Name..." className="w-full bg-background border border-border p-3 rounded-lg text-white focus:border-orange-500 outline-none transition-colors" />
                        <Button variant="secondary" className="w-full">Search Registry</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
