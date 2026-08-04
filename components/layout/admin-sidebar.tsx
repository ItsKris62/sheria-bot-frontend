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
  BarChart2,
  Lock,
  Rocket,
  Megaphone,
  Mail,
  ListFilter,
  Ban,
  ThumbsUp,
  BadgeCheck,
  FileQuestion,
  Database,
  ListOrdered,
  Lightbulb,
  ClipboardCheck,
  FileSearch,
  FileText,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { useSidebar } from "@/lib/sidebar-context"

// --- Nav definition -----------------------------------------------------------

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badgeQuery?: "supportOpen"
  exact?: boolean
}

export interface AdminNavGroup {
  title: string
  items: NavItem[]
}

export const adminNav: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { title: "Analytics", href: "/admin/analytics", icon: BarChart2, exact: true },
      { title: "Feedback", href: "/admin/analytics/feedback", icon: ThumbsUp },
    ],
  },
  {
    title: "Users",
    items: [
      { title: "User Management",  href: "/admin/users",         icon: Users },
      { title: "Organizations",    href: "/admin/organizations",  icon: Building2 },
      { title: "Pilot Programme",  href: "/admin/pilot",         icon: Rocket },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Support Tickets", href: "/admin/support", icon: MessageSquare, badgeQuery: "supportOpen" },
      { title: "Licenses", href: "/admin/licenses", icon: BadgeCheck },
    ],
  },
  {
    title: "Content",
    items: [
      { title: "Knowledge Base", href: "/admin/content/knowledge-base", icon: BookOpen },
      { title: "Blog", href: "/admin/content/blog", icon: Newspaper, exact: true },
      { title: "Blog Sources", href: "/admin/content/blog/sources", icon: Database },
      { title: "Source Items", href: "/admin/content/blog/source-items", icon: ListOrdered },
      { title: "Blog Suggestions", href: "/admin/content/blog/suggestions", icon: Lightbulb },
      { title: "Blog Digests", href: "/admin/content/blog/digests", icon: Activity },
      { title: "Editorial Triage", href: "/admin/content/editorial/triage", icon: FileSearch },
      { title: "Research Packs", href: "/admin/content/editorial/research", icon: BookOpen },
      { title: "Freshness Reviews", href: "/admin/content/editorial/freshness", icon: ClipboardCheck },
      { title: "Revision Requests", href: "/admin/content/editorial/revisions", icon: FileText },
      { title: "Content Ops Alerts", href: "/admin/content/editorial/alerts", icon: Shield },
      { title: "Regulatory Alerts", href: "/admin/alerts", icon: Megaphone },
      { title: "Corpus Gap Reports", href: "/admin/corpus-gap-reports", icon: FileQuestion },
    ],
  },
  {
    title: "Marketing",
    items: [
      { title: "Campaigns",   href: "/admin/marketing/campaigns",   icon: Mail       },
      { title: "Contacts",    href: "/admin/marketing/contacts",    icon: Users      },
      { title: "Lists",       href: "/admin/marketing/lists",       icon: ListFilter },
      { title: "Suppression", href: "/admin/marketing/suppression", icon: Ban        },
    ],
  },
  {
    title: "Automation",
    items: [
      { title: "Approvals", href: "/admin/automation/approvals", icon: ClipboardCheck },
    ],
  },
  {
    title: "System",
    items: [
      { title: "AI Configuration", href: "/admin/ai-config", icon: Bot },
      { title: "AI Jobs", href: "/admin/ai-jobs", icon: Activity },
      { title: "Billing & Plans", href: "/admin/billing", icon: CreditCard },
      { title: "Enterprise Contracts", href: "/admin/enterprise-contracts", icon: CreditCard },
      { title: "Audit Logs", href: "/admin/audit-logs", icon: Activity },
      { title: "Security", href: "/admin/security", icon: Lock },
      { title: "System Settings", href: "/admin/system", icon: Settings },
    ],
  },
]

// --- Component ----------------------------------------------------------------

export function AdminSidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()

  // Live count of open tickets for the badge
  const { data: statsData } = trpc.adminSupport.stats.useQuery(undefined, {
    refetchInterval: 60_000, // refresh every minute
  })
  const openCount = (statsData as { open?: number } | undefined)?.open ?? 0

  // Auto-close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  // -- Shared nav groups renderer ------------------------------------------
  function renderGroups(opts: { showCollapsed: boolean }) {
    return adminNav.map((group) => (
      <div key={group.title}>
        {!opts.showCollapsed && (
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase text-[var(--portal-text-muted)]">
            {group.title}
          </p>
        )}
        <div className="flex flex-col gap-1">
          {group.items.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : item.exact
                  ? pathname === item.href
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
                  "group relative flex min-w-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--portal-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-[var(--portal-accent-muted)] text-[var(--portal-accent)] shadow-sm"
                    : "text-[var(--portal-text-secondary)] hover:bg-[var(--portal-surface-solid)] hover:text-[var(--portal-text-primary)]",
                  opts.showCollapsed && "justify-center px-2",
                  !opts.showCollapsed && item.href.startsWith("/admin/analytics/") && "pl-6"
                )}
                title={opts.showCollapsed ? item.title : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[var(--portal-accent)]" />
                )}
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-all duration-200",
                    isActive ? "text-[var(--portal-accent)]" : "group-hover:text-[var(--portal-accent)]"
                  )}
                  aria-hidden="true"
                />
                {!opts.showCollapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                    {badgeValue !== null && (
                      <Badge className="h-5 min-w-5 justify-center rounded-full bg-[var(--portal-accent)] px-1.5 text-[10px] font-bold text-black shadow-sm">
                        {badgeValue}
                      </Badge>
                    )}
                  </>
                )}
                {/* Collapsed badge dot */}
                {opts.showCollapsed && badgeValue !== null && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--portal-accent)]" />
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
      {/* -- Desktop sidebar (md and above) --------------------------------- */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden md:flex h-screen flex-col border-r portal-surface-shell transition-all duration-500 ease-out",
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
                <span className="brand-wordmark font-bold text-white">
                  Sheria<span className="text-brand-green">Bot</span>
                </span>
                <span className="-mt-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase text-[var(--portal-accent)]">
                  <Shield className="h-2.5 w-2.5" aria-hidden="true" />
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
              "w-full rounded-lg text-[var(--portal-text-secondary)] transition-all duration-200 hover:bg-[var(--portal-surface-solid)] hover:text-[var(--portal-accent)] focus-visible:ring-2 focus-visible:ring-[var(--portal-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              collapsed && "mx-auto"
            )}
            aria-label={collapsed ? "Expand admin sidebar" : "Collapse admin sidebar"}
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

      {/* -- Mobile drawer (below md) ---------------------------------------- */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="portal-surface-shell flex w-72 flex-col p-0">
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
                <span className="brand-wordmark font-bold text-white">
                  Sheria<span className="text-brand-green">Bot</span>
                </span>
                <span className="-mt-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase text-[var(--portal-accent)]">
                  <Shield className="h-2.5 w-2.5" aria-hidden="true" />
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
