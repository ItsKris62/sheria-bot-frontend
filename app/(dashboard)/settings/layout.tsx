"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Scale,
  User,
  Building2,
  Shield,
  Bell,
  CreditCard,
  Key,
  ChevronLeft,
} from "lucide-react"

const settingsNav = [
  { title: "Profile", href: "/settings", icon: User },
  { title: "Organization", href: "/settings/organization", icon: Building2 },
  { title: "Security", href: "/settings/security", icon: Shield },
  { title: "Notifications", href: "/settings/notifications", icon: Bell },
  { title: "Billing", href: "/settings/billing", icon: CreditCard },
  { title: "API Keys", href: "/settings/api-keys", icon: Key },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/startup">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Scale className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Settings</span>
          </Link>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Settings Sidebar */}
        <aside className="w-64 border-r border-border bg-card/50">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <nav className="flex flex-col gap-1 p-4">
              {settingsNav.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Settings Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
