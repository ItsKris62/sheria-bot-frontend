"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import Image from "next/image"
import { LOGOS } from "@/lib/constants/logos"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  Bot,
  CreditCard,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  BookOpen,
  Newspaper,
  Shield,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { useSidebar } from "@/lib/sidebar-context"

// ─── Nav definition ───────────────────────────────────────────────────────────

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badgeQuery?: "supportOpen"
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const adminNav: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Users",
    items: [
      { title: "User Management", href: "/admin/users", icon: Users },
      { title: "Organizations", href: "/admin/users", icon: Building2 },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Support Tickets", href: "/admin/support", icon: MessageSquare, badgeQuery: "supportOpen" },
    ],
  },
  {
    title: "Content",
    items: [
      { title: "Knowledge Base", href: "/admin/content/knowledge-base", icon: BookOpen },
      { title: "Blog", href: "/admin/content/blog", icon: Newspaper },
    ],
  },
  {
    title: "System",
    items: [
      { title: "AI Configuration", href: "/admin/ai-config", icon: Bot },
      { title: "Billing & Plans", href: "/admin/billing", icon: CreditCard },
      { title: "Audit Logs", href: "/admin/audit-logs", icon: Activity },
      { title: "System Settings", href: "/admin/system", icon: Settings },
    ],
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminSidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()

  // Live count of open tickets for the badge
  const { data: statsData } = trpc.adminSupport.stats.useQuery(undefined, {
    refetchInterval: 60_000, // refresh every minute
  })
  const openCount = (statsData as any)?.open ?? 0

  // Auto-close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  // ── Shared nav groups renderer ──────────────────────────────────────────
  function renderGroups(opts: { showCollapsed: boolean }) {
    return adminNav.map((group) => (
      <div key={group.title}>
        {!opts.showCollapsed && (
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-primary/70">
            {group.title}
          </p>
        )}
        <div className="flex flex-col gap-1">
          {group.items.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/")

            const badgeValue =
              item.badgeQuery === "supportOpen" && openCount > 0
                ? openCount > 99 ? "99+" : openCount
                : null

            return (
              <Link
                key={item.href + item.title}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary/15 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
                  opts.showCollapsed && "justify-center px-2"
                )}
                title={opts.showCollapsed ? item.title : undefined}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-all duration-300",
                    isActive ? "text-primary" : "group-hover:text-primary"
                  )}
                />
                {!opts.showCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {badgeValue !== null && (
                      <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px] font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                        {badgeValue}
                      </Badge>
                    )}
                  </>
                )}
                {/* Collapsed badge dot */}
                {opts.showCollapsed && badgeValue !== null && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    ))
  }

  return (
    <>
      {/* ── Desktop sidebar (md and above) ───────────────────────────────── */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden md:flex h-screen flex-col border-r border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-500 ease-out",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
          {!collapsed && (
            <Link
              href="/admin"
              className="group flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:opacity-90"
            >
              <Image
                src={LOGOS.hero}
                alt="SheriaBot"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
                priority
              />
              <div className="flex flex-col">
                <span className="font-bold text-foreground tracking-tight">SheriaBot</span>
                <span className="text-[10px] text-destructive font-semibold -mt-0.5 tracking-wider uppercase flex items-center gap-1">
                  <Shield className="h-2.5 w-2.5" />
                  Admin
                </span>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" className="group mx-auto">
              <Image
                src={LOGOS.hero}
                alt="SheriaBot"
                width={36}
                height={36}
                className="h-9 w-9 object-contain transition-all duration-300 group-hover:scale-110 group-hover:opacity-90"
              />
            </Link>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-6">
          <nav className="flex flex-col gap-8">
            {renderGroups({ showCollapsed: collapsed })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-border/50 p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300",
              collapsed && "mx-auto"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span className="sr-only">{collapsed ? "Expand" : "Collapse"} sidebar</span>
          </Button>
        </div>
      </aside>

      {/* ── Mobile drawer (below md) ──────────────────────────────────────── */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 flex flex-col">
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>

          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border/50 px-4">
            <Link href="/admin" className="group flex items-center gap-3 transition-all duration-300 hover:opacity-90">
              <Image
                src={LOGOS.hero}
                alt="SheriaBot"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
                priority
              />
              <div className="flex flex-col">
                <span className="font-bold text-foreground tracking-tight">SheriaBot</span>
                <span className="text-[10px] text-destructive font-semibold -mt-0.5 tracking-wider uppercase flex items-center gap-1">
                  <Shield className="h-2.5 w-2.5" />
                  Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-6">
            <nav className="flex flex-col gap-8">
              {renderGroups({ showCollapsed: false })}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}
