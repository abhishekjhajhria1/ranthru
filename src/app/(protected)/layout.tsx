import Sidebar from "@/components/layout/sidebar"
import { MessageProvider } from "@/lib/message-context"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <MessageProvider>
            <div className="flex h-screen bg-background overflow-hidden relative">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                    <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                </div>

                <Sidebar />
                <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
                    {children}
                </main>
            </div>
        </MessageProvider>
    )
}
