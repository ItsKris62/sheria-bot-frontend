"use client"

import React, { useCallback } from "react"
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
  Sparkles,
  ClipboardCheck,
  FileSearch,
  FileText,
  Lightbulb,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { useCloseMobileSidebarOnNavigation, useSidebar } from "@/lib/sidebar-context"
import {
  PendingNavigationLink,
  type NavigationPrefetchStrategy,
} from "@/components/navigation/pending-navigation-link"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// --- Nav definition -----------------------------------------------------------

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badgeQuery?: "supportOpen"
  exact?: boolean
  prefetchStrategy?: NavigationPrefetchStrategy
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
      { title: "Feedback", href: "/admin/analytics/feedback", icon: ThumbsUp, prefetchStrategy: "none" },
    ],
  },
  {
    title: "Users",
    items: [
      { title: "User Management",  href: "/admin/users",         icon: Users, prefetchStrategy: "intent" },
      { title: "Organizations",    href: "/admin/organizations",  icon: Building2, prefetchStrategy: "intent" },
      { title: "Pilot Programme",  href: "/admin/pilot",         icon: Rocket, prefetchStrategy: "none" },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Support Tickets", href: "/admin/support", icon: MessageSquare, badgeQuery: "supportOpen", prefetchStrategy: "intent" },
      { title: "Licenses", href: "/admin/licenses", icon: BadgeCheck, prefetchStrategy: "none" },
    ],
  },
  {
    title: "Content",
    items: [
      { title: "Knowledge Base", href: "/admin/content/knowledge-base", icon: BookOpen, prefetchStrategy: "intent" },
      { title: "Blog", href: "/admin/content/blog", icon: Newspaper, exact: true, prefetchStrategy: "intent" },
      { title: "Blog Sources", href: "/admin/content/blog/sources", icon: Database, prefetchStrategy: "none" },
      { title: "Source Items", href: "/admin/content/blog/source-items", icon: ListOrdered, prefetchStrategy: "none" },
      { title: "Blog Suggestions", href: "/admin/content/blog/suggestions", icon: Lightbulb, prefetchStrategy: "none" },
      { title: "Blog Digests", href: "/admin/content/blog/digests", icon: Activity, prefetchStrategy: "none" },
      { title: "Editorial Triage", href: "/admin/content/editorial/triage", icon: FileSearch, prefetchStrategy: "none" },
      { title: "Research Packs", href: "/admin/content/editorial/research", icon: BookOpen, prefetchStrategy: "none" },
      { title: "Freshness Reviews", href: "/admin/content/editorial/freshness", icon: ClipboardCheck, prefetchStrategy: "none" },
      { title: "Revision Requests", href: "/admin/content/editorial/revisions", icon: FileText, prefetchStrategy: "none" },
      { title: "Content Ops Alerts", href: "/admin/content/editorial/alerts", icon: Shield, prefetchStrategy: "none" },
      { title: "Regulatory Alerts", href: "/admin/alerts", icon: Megaphone },
      { title: "Corpus Gap Reports", href: "/admin/corpus-gap-reports", icon: FileQuestion, prefetchStrategy: "none" },
    ],
  },
  {
    title: "Marketing & Leads",
    items: [
      { title: "Lead Queue",  href: "/admin/marketing/leads",       icon: Sparkles, prefetchStrategy: "none"   },
      { title: "Companies",   href: "/admin/marketing/companies",   icon: Building2, prefetchStrategy: "none"  },
      { title: "Contacts",    href: "/admin/marketing/contacts",    icon: Users, prefetchStrategy: "none"      },
      { title: "Campaigns",   href: "/admin/marketing/campaigns",   icon: Mail, prefetchStrategy: "none"       },
      { title: "Lists",       href: "/admin/marketing/lists",       icon: ListFilter, prefetchStrategy: "none" },
      { title: "Suppression", href: "/admin/marketing/suppression", icon: Ban, prefetchStrategy: "none"        },
    ],
  },
  {
    title: "Automation",
    items: [
      { title: "Approvals", href: "/admin/automation/approvals", icon: ClipboardCheck, prefetchStrategy: "none" },
    ],
  },
  {
    title: "System",
    items: [
      { title: "AI Configuration", href: "/admin/ai-config", icon: Bot, prefetchStrategy: "none" },
      { title: "AI Jobs", href: "/admin/ai-jobs", icon: Activity, prefetchStrategy: "none" },
      { title: "Billing & Plans", href: "/admin/billing", icon: CreditCard, prefetchStrategy: "none" },
      { title: "Enterprise Contracts", href: "/admin/enterprise-contracts", icon: CreditCard, prefetchStrategy: "none" },
      { title: "Audit Logs", href: "/admin/audit-logs", icon: Activity, prefetchStrategy: "intent" },
      { title: "Security", href: "/admin/security", icon: Lock, prefetchStrategy: "none" },
      { title: "System Settings", href: "/admin/system", icon: Settings, prefetchStrategy: "none" },
    ],
  },
]

export function isAdminRouteActive(pathname: string, href: string, exact = false): boolean {
  if (href === "/admin" || exact) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

// --- Component ----------------------------------------------------------------

export function AdminSidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()
  const closeMobileSidebar = useCallback(() => setMobileOpen(false), [setMobileOpen])

  // Live count of open tickets for the badge
  const { data: statsData } = trpc.adminSupport.stats.useQuery(undefined, {
    refetchInterval: 60_000, // refresh every minute
  })
  const openCount = (statsData as { open?: number } | undefined)?.open ?? 0

  useCloseMobileSidebarOnNavigation(pathname)

  // -- Shared nav groups renderer ------------------------------------------
  function renderGroups(opts: { showCollapsed: boolean; mobile?: boolean }) {
    return adminNav.map((group) => (
      <div key={group.title}>
        {!opts.showCollapsed && (
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--portal-sidebar-muted)]">
            {group.title}
          </p>
        )}
        <div className="flex flex-col gap-1">
          {group.items.map((item) => {
            const isActive = isAdminRouteActive(pathname, item.href, item.exact)

            const badgeValue =
              item.badgeQuery === "supportOpen" && openCount > 0
                ? openCount > 99 ? "99+" : openCount
                : null

            const navLink = (
              <PendingNavigationLink
                key={item.href + item.title}
                href={item.href}
                pendingLabel={item.title}
                prefetchStrategy={item.prefetchStrategy}
                onNavigate={opts.mobile ? closeMobileSidebar : undefined}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.title}
                className={cn(
                  "group relative flex min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C13]",
                  isActive
                    ? "bg-[var(--portal-sidebar-active)] text-[var(--portal-sidebar-text)] font-semibold shadow-sm"
                    : "text-[var(--portal-sidebar-muted)] hover:bg-[var(--portal-sidebar-raised)] hover:text-[var(--portal-sidebar-text)]",
                  opts.showCollapsed && "justify-center px-0 w-10 h-10 mx-auto",
                  !opts.showCollapsed && item.href.startsWith("/admin/analytics/") && "pl-6"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#22C55E]" />
                )}
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors duration-150",
                    isActive ? "text-[#22C55E]" : "text-[var(--portal-sidebar-muted)] group-hover:text-[var(--portal-sidebar-text)]"
                  )}
                  aria-hidden="true"
                />
                {!opts.showCollapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                    {badgeValue !== null && (
                      <Badge className="h-5 min-w-[20px] justify-center rounded-full bg-[#22C55E] px-1.5 text-[10px] font-bold text-black border-none shadow-none">
                        {badgeValue}
                      </Badge>
                    )}
                  </>
                )}
                {/* Collapsed badge dot */}
                {opts.showCollapsed && badgeValue !== null && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#22C55E]" />
                )}
              </PendingNavigationLink>
            )

            if (opts.showCollapsed) {
              return (
                <Tooltip key={item.href + item.title} delayDuration={150}>
                  <TooltipTrigger asChild>
                    {navLink}
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12} className="bg-[#0D281A] text-[#F4F7F5] border-[#153D26] text-xs py-1 px-2.5 shadow-lg flex items-center gap-1.5">
                    <span>{item.title}</span>
                    {badgeValue !== null && <span className="text-[10px] font-bold text-[#22C55E]">({badgeValue})</span>}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return navLink
          })}
        </div>
      </div>
    ))
  }

  return (
    <TooltipProvider>
      {/* -- Desktop sidebar (md and above) --------------------------------- */}
      <aside
        aria-label="Admin sidebar navigation"
        className={cn(
          "fixed left-0 top-0 z-40 hidden md:flex h-screen flex-col border-r border-[#0D281A] bg-[var(--portal-sidebar)] text-[var(--portal-sidebar-text)] transition-[width] duration-200 ease-out",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#0D281A] px-4">
          {!collapsed && (
            <Link
              href="/admin"
              className="group flex items-center gap-3 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C13]"
            >
              <Image
                src={LOGOS.hero}
                alt="SheriaBot"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
                priority
              />
              <div className="flex flex-col">
                <span className="brand-wordmark font-bold text-white tracking-tight">
                  Sheria<span className="text-[#22C55E]">Bot</span>
                </span>
                <span className="-mt-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--portal-sidebar-muted)]">
                  <Shield className="h-2.5 w-2.5 text-[#22C55E]" aria-hidden="true" />
                  Admin
                </span>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" aria-label="SheriaBot Admin" className="group mx-auto rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C13]">
              <Image
                src={LOGOS.hero}
                alt="SheriaBot"
                width={32}
                height={32}
                className="h-8 w-8 object-contain transition-opacity group-hover:opacity-90"
              />
            </Link>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-6" aria-label="Admin Navigation">
            {renderGroups({ showCollapsed: collapsed })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-[#0D281A] p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full rounded-lg text-[var(--portal-sidebar-muted)] hover:bg-[var(--portal-sidebar-raised)] hover:text-[var(--portal-sidebar-text)] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C13]",
              collapsed && "mx-auto"
            )}
            aria-label={collapsed ? "Expand admin sidebar" : "Collapse admin sidebar"}
            aria-expanded={!collapsed}
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
        <SheetContent aria-describedby={undefined} side="left" className="flex w-72 flex-col p-0 bg-[var(--portal-sidebar)] text-[var(--portal-sidebar-text)] border-r border-[#0D281A]">
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>

          {/* Logo */}
          <div className="flex h-16 items-center border-b border-[#0D281A] px-4">
            <Link href="/admin" onNavigate={closeMobileSidebar} className="group flex items-center gap-3 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]">
              <Image
                src={LOGOS.hero}
                alt="SheriaBot"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
                priority
              />
              <div className="flex flex-col">
                <span className="brand-wordmark font-bold text-white">
                  Sheria<span className="text-[#22C55E]">Bot</span>
                </span>
                <span className="-mt-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--portal-sidebar-muted)]">
                  <Shield className="h-2.5 w-2.5 text-[#22C55E]" aria-hidden="true" />
                  Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="flex flex-col gap-6">
              {renderGroups({ showCollapsed: false, mobile: true })}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  )
}

