"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import Image from "next/image"
import { LOGOS } from "@/lib/constants/logos"
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  BarChart3,
  Newspaper,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  ClipboardCheck,
  AlertTriangle,
  Calendar,
  Folder,
  Sparkles,
  Lock,
  Megaphone,
  BadgeCheck,
  FileQuestion,
} from "lucide-react"
import { usePlan } from "@/lib/plan-context"
import type { FeatureKey } from "@/lib/plan-context"
import { useSidebar } from "@/lib/sidebar-context"
import { useAlertNotifications } from "@/hooks/use-alert-notifications"
import { ReportMissingDocumentDialog } from "@/components/corpus-gap-report/report-missing-document-dialog"

function createSidebarIcon(src: string, alt: string) {
  return function SidebarIcon({ className }: { className?: string }) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={alt}
        aria-hidden="true"
        className={cn(
          "h-5 w-5 shrink-0 object-contain transition-all duration-300 group-hover:scale-110",
          className
        )}
      />
    )
  }
}

const DashboardGridIcon = createSidebarIcon("/icons/sidebar/dashboard-grid-icon.png", "Dashboard")
const ComplianceQueryIcon = createSidebarIcon("/icons/sidebar/compliance-query-icon.png", "Compliance Query")
const ComplianceChecklistIcon = createSidebarIcon("/icons/sidebar/compliance-checklist-icon.png", "Checklists")
const GapAnalysisIcon = createSidebarIcon("/icons/sidebar/gap-analysis-icon.png", "Gap Analysis")
const CustomFrameworkIcon = createSidebarIcon("/icons/sidebar/custom-framework-icon.png", "Custom Frameworks")
const RegulatoryApplicationsIcon = createSidebarIcon("/icons/sidebar/regulatory-applications-icon.png", "Applications")
const RegulatoryLicensesIcon = createSidebarIcon("/icons/sidebar/regulatory-licenses-icon.png", "Licenses")

type NavAction = "reportMissingDocument"

type BaseNavItem = {
  title: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  /** When set, the item is visually locked when the user's plan lacks this feature. */
  lockedFeature?: FeatureKey
}

export type NavItem = BaseNavItem & (
  | { href: string; action?: never }
  | { href?: never; action: NavAction }
)

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const regulatorNav: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/regulator", icon: LayoutDashboard },
    ],
  },
  {
    title: "Policy Tools",
    items: [
      { title: "Policy Generator", href: "/regulator/policy-generator", icon: Sparkles, badge: "AI", lockedFeature: "policyGeneration" },
      { title: "Legal Corpus", href: "/regulator/legal-corpus", icon: BookOpen },
      { title: "Frameworks", href: "/regulator/frameworks", icon: FileText },
    ],
  },
  {
    title: "Collaboration",
    items: [
      { title: "Team", href: "/regulator/collaboration", icon: Users },
      { title: "Analytics", href: "/regulator/analytics", icon: BarChart3 },
      { title: "Intelligence Feed", href: "/regulator/intelligence-feed", icon: Newspaper },
    ],
  },
  {
    title: "Alerts",
    items: [
      { title: "Regulatory Alerts", href: "/dashboard/alerts", icon: Megaphone },
    ],
  },
  {
    title: "Help us improve",
    items: [
      { title: "Report Missing Document", action: "reportMissingDocument", icon: FileQuestion },
    ],
  },
]

export const startupNav: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/startup", icon: DashboardGridIcon },
    ],
  },
  {
    title: "Compliance",
    items: [
      { title: "Compliance Query", href: "/startup/compliance-query", icon: ComplianceQueryIcon, badge: "AI" },
      { title: "Checklists", href: "/startup/checklists", icon: ComplianceChecklistIcon },
      { title: "Gap Analysis", href: "/startup/gap-analysis", icon: GapAnalysisIcon, lockedFeature: "gapAnalysis" },
      { title: "Custom Frameworks", href: "/startup/custom-frameworks", icon: CustomFrameworkIcon, lockedFeature: "customFrameworks" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Applications", href: "/startup/applications", icon: RegulatoryApplicationsIcon },
      { title: "Licenses", href: "/startup/licenses", icon: RegulatoryLicensesIcon, lockedFeature: "licenseManagement" },
      { title: "Calendar", href: "/startup/calendar", icon: Calendar },
      { title: "Documents", href: "/startup/documents", icon: Folder, lockedFeature: "documentRepository" },
      { title: "Regulatory Alerts", href: "/dashboard/alerts", icon: Megaphone },
    ],
  },
  {
    title: "Help us improve",
    items: [
      { title: "Report Missing Document", action: "reportMissingDocument", icon: FileQuestion },
    ],
  },
]

interface DashboardSidebarProps {
  userType: "regulator" | "startup"
}

export function DashboardSidebar({ userType }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()
  const { hasFeature } = usePlan()
  const { alertUnreadCount } = useAlertNotifications()
  const [reportDialogOpen, setReportDialogOpen] = useState(false)

  const baseNavGroups = userType === "regulator" ? regulatorNav : startupNav

  // Inject the live alert unread count into the canonical Regulatory Alerts nav item badge
  const navGroups = useMemo(() => {
    if (userType !== "startup" || alertUnreadCount <= 0) return baseNavGroups

    return baseNavGroups.map((group) => ({
      ...group,
      items: group.items.map((item) =>
        item.href === "/dashboard/alerts"
          ? { ...item, badge: alertUnreadCount }
          : item
      ),
    }))
  }, [baseNavGroups, userType, alertUnreadCount])

  // Auto-close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  // ── Shared nav groups renderer ────────────────────────────────────────────
  function renderGroups(opts: { showCollapsed: boolean }) {
    return navGroups.map((group) => (
      <div key={group.title}>
        {!opts.showCollapsed && (
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-primary/70">
            {group.title}
          </p>
        )}
        <div className="flex flex-col gap-1">
          {group.items.map((item) => {
            const isAction = item.action === "reportMissingDocument"
            const itemKey = item.href ?? item.action
            const isRootPath = item.href === "/startup" || item.href === "/regulator"
            const isActive = item.href
              ? isRootPath
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + "/")
              : false
            const isLocked = item.lockedFeature ? !hasFeature(item.lockedFeature) : false

            if (isAction) {
              return (
                <button
                  key={itemKey}
                  type="button"
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-foreground hover:text-background hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    opts.showCollapsed && "justify-center px-2"
                  )}
                  title={opts.showCollapsed ? item.title : undefined}
                  onClick={() => {
                    setReportDialogOpen(true)
                    setMobileOpen(false)
                  }}
                >
                  <item.icon className="h-5 w-5 shrink-0 transition-all duration-300 group-hover:text-primary group-hover:scale-110" />
                  {!opts.showCollapsed && <span className="flex-1">{item.title}</span>}
                </button>
              )
            }

            return (
              <Link
                key={itemKey}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                  isLocked
                    ? "opacity-50 cursor-pointer"
                    : isActive
                    ? "bg-primary/15 text-primary shadow-sm font-semibold"
                    : "text-muted-foreground hover:bg-foreground hover:text-background hover:shadow-sm",
                  opts.showCollapsed && "justify-center px-2"
                )}
                title={opts.showCollapsed ? item.title : undefined}
              >
                {isActive && !isLocked && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-all duration-300",
                  isLocked
                    ? "text-muted-foreground opacity-40 grayscale"
                    : isActive
                    ? "text-primary opacity-100 drop-shadow-[0_0_8px_rgba(34,197,94,0.35)]"
                    : "text-muted-foreground opacity-80 group-hover:opacity-100 group-hover:text-primary"
                )} />
                {!opts.showCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {isLocked ? (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    ) : item.badge ? (
                      <span className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold transition-all duration-300",
                        typeof item.badge === "number"
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "bg-primary/20 text-primary"
                      )}>
                        {item.badge}
                      </span>
                    ) : null}
                  </>
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
          "fixed left-0 top-0 z-40 hidden md:flex h-screen flex-col border-r portal-surface-shell transition-all duration-500 ease-out",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
          {!collapsed && (
            <Link href="/" className="group flex items-center gap-3 rounded-xl transition-all duration-300 hover:scale-105 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-black">
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
                <span className="text-[10px] text-primary font-medium -mt-0.5 tracking-wider uppercase">Dashboard</span>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="group mx-auto rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-black">
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
          <div className="flex flex-col gap-1">
            <Link
              href="/settings"
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-foreground hover:text-background hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                collapsed && "justify-center px-2",
                pathname.startsWith("/settings") && "bg-primary/15 text-primary"
              )}
            >
              <Settings className={cn(
                "h-5 w-5 shrink-0 transition-all duration-300",
                pathname.startsWith("/settings") ? "text-primary" : "group-hover:text-primary"
              )} />
              {!collapsed && <span>Settings</span>}
            </Link>
            <Link
              href="/support"
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-foreground hover:text-background hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                collapsed && "justify-center px-2",
                pathname.startsWith("/support") && "bg-primary/15 text-primary"
              )}
            >
              <HelpCircle className={cn(
                "h-5 w-5 shrink-0 transition-all duration-300",
                pathname.startsWith("/support") ? "text-primary" : "group-hover:text-primary"
              )} />
              {!collapsed && <span>Support</span>}
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "mt-3 w-full rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300",
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
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border/50 px-4">
            <Link href="/" className="group flex items-center gap-3 rounded-xl transition-all duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-black">
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
                <span className="text-[10px] text-primary font-medium -mt-0.5 tracking-wider uppercase">Dashboard</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-6">
            <nav className="flex flex-col gap-8">
              {renderGroups({ showCollapsed: false })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-border/50 p-3">
            <div className="flex flex-col gap-1">
              <Link
                href="/settings"
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-foreground hover:text-background hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                  pathname.startsWith("/settings") && "bg-primary/15 text-primary"
                )}
              >
                <Settings className={cn(
                  "h-5 w-5 shrink-0 transition-all duration-300",
                  pathname.startsWith("/settings") ? "text-primary" : "group-hover:text-primary"
                )} />
                <span>Settings</span>
              </Link>
              <Link
                href="/support"
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-foreground hover:text-background hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                  pathname.startsWith("/support") && "bg-primary/15 text-primary"
                )}
              >
                <HelpCircle className={cn(
                  "h-5 w-5 shrink-0 transition-all duration-300",
                  pathname.startsWith("/support") ? "text-primary" : "group-hover:text-primary"
                )} />
                <span>Support</span>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <ReportMissingDocumentDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
      />
    </>
  )
}
