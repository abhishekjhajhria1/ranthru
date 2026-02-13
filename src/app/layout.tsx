import type { Metadata } from "next";
import "./globals.css";

import { cn } from "@/lib/utils";
import { UserProvider } from "@/lib/user-context";
import { NotificationProvider } from "@/lib/notification-context";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Web3Provider } from "@/components/web3-provider";

export const metadata: Metadata = {
  title: "RanThru - Elite Active Companions",
  description: "Find your perfect partner for sports, leisure, and intimacy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary/20 selection:text-primary"
        )}
      >
        <Web3Provider>
          <NotificationProvider>
            <UserProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
              <Toaster />
            </UserProvider>
          </NotificationProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
