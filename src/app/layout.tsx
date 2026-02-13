import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { UserProvider } from "@/lib/user-context";
import { NotificationProvider } from "@/lib/notification-context";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary/20 selection:text-primary",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <NotificationProvider>
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
