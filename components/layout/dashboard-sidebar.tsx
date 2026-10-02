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
  SlidersHorizontal,
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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function createSidebarIcon(src: string, alt: string) {
  return function SidebarIcon({ className }: { className?: string }) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn(
          "h-5 w-5 shrink-0 bg-current transition-transform duration-200 group-hover:scale-105 inline-block",
          className
        )}
        style={{
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
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
      { title: "Policy Generator", href: "/regulator/policy-generator", icon: SlidersHorizontal, badge: "AI", lockedFeature: "policyGeneration" },
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
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--portal-sidebar-muted)]">
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
              const actionBtn = (
                <button
                  key={itemKey}
                  type="button"
                  aria-label={item.title}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--portal-sidebar-muted)] transition-colors duration-150 hover:bg-[var(--portal-sidebar-raised)] hover:text-[var(--portal-sidebar-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C13]",
                    opts.showCollapsed && "justify-center px-0 w-10 h-10 mx-auto"
                  )}
                  onClick={() => {
                    setReportDialogOpen(true)
                    setMobileOpen(false)
                  }}
                >
                  <item.icon className="h-5 w-5 shrink-0 transition-colors duration-150 group-hover:text-[var(--portal-sidebar-text)]" />
                  {!opts.showCollapsed && <span className="flex-1 truncate">{item.title}</span>}
                </button>
              )

              if (opts.showCollapsed) {
                return (
                  <Tooltip key={itemKey} delayDuration={150}>
                    <TooltipTrigger asChild>
                      {actionBtn}
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={12} className="bg-[#0D281A] text-[#F4F7F5] border-[#153D26] text-xs py-1 px-2.5 shadow-lg">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return actionBtn
            }

            const navLink = (
              <Link
                key={itemKey}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.title}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C13]",
                  isLocked
                    ? "opacity-50 cursor-pointer text-[var(--portal-sidebar-muted)] hover:bg-[var(--portal-sidebar-raised)]"
                    : isActive
                    ? "bg-[var(--portal-sidebar-active)] text-[var(--portal-sidebar-text)] font-semibold shadow-sm"
                    : "text-[var(--portal-sidebar-muted)] hover:bg-[var(--portal-sidebar-raised)] hover:text-[var(--portal-sidebar-text)]",
                  opts.showCollapsed && "justify-center px-0 w-10 h-10 mx-auto"
                )}
              >
                {isActive && !isLocked && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#22C55E] rounded-r-full" />
                )}
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-colors duration-150",
                  isLocked
                    ? "text-[var(--portal-sidebar-muted)] opacity-50"
                    : isActive
                    ? "text-[#22C55E]"
                    : "text-[var(--portal-sidebar-muted)] group-hover:text-[var(--portal-sidebar-text)]"
                )} />
                {!opts.showCollapsed && (
                  <>
                    <span className="flex-1 truncate">{item.title}</span>
                    {isLocked ? (
                      <Lock className="h-3.5 w-3.5 text-[var(--portal-sidebar-muted)]/70 shrink-0" />
                    ) : item.badge ? (
                      <span className={cn(
                        "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold tracking-wide",
                        typeof item.badge === "number"
                          ? "bg-[#22C55E] text-black"
                          : "bg-[var(--portal-sidebar-raised)] text-[#22C55E] border border-[#153D26]"
                      )}>
                        {item.badge}
                      </span>
                    ) : null}
                  </>
                )}
                {opts.showCollapsed && item.badge && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#22C55E]" />
                )}
              </Link>
            )

            if (opts.showCollapsed) {
              return (
                <Tooltip key={itemKey} delayDuration={150}>
                  <TooltipTrigger asChild>
                    {navLink}
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12} className="bg-[#0D281A] text-[#F4F7F5] border-[#153D26] text-xs py-1 px-2.5 shadow-lg flex items-center gap-1.5">
                    <span>{item.title}</span>
                    {isLocked && <Lock className="h-3 w-3 text-[var(--portal-sidebar-muted)]" />}
                    {item.badge && <span className="text-[10px] font-bold text-[#22C55E]">({item.badge})</span>}
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
      {/* ── Desktop sidebar (md and above) ───────────────────────────────── */}
      <aside
        aria-label="Sidebar navigation"
        className={cn(
          "fixed left-0 top-0 z-40 hidden md:flex h-screen flex-col border-r border-[#0D281A] bg-[var(--portal-sidebar)] text-[var(--portal-sidebar-text)] transition-[width] duration-200 ease-out",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#0D281A] px-4">
          {!collapsed && (
            <Link href="/" className="group flex items-center gap-3 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C13]">
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
                <span className="text-[10px] text-[var(--portal-sidebar-muted)] font-medium -mt-0.5 tracking-wider uppercase">
                  {userType === "regulator" ? "Regulator" : "Dashboard"}
                </span>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/" aria-label="SheriaBot home" className="group mx-auto rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C13]">
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
          <nav className="flex flex-col gap-6" aria-label="Main Navigation">
            {renderGroups({ showCollapsed: collapsed })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-[#0D281A] p-3">
          <div className="flex flex-col gap-1">
            {collapsed ? (
              <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>
                  <Link
                    href="/settings"
                    aria-label="Settings"
                    className={cn(
                      "group flex h-10 w-10 mx-auto items-center justify-center rounded-lg text-[var(--portal-sidebar-muted)] transition-colors duration-150 hover:bg-[var(--portal-sidebar-raised)] hover:text-[var(--portal-sidebar-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C13]",
                      pathname.startsWith("/settings") && "bg-[var(--portal-sidebar-active)] text-[#22C55E]"
                    )}
                  >
                    <Settings className="h-5 w-5 shrink-0" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12} className="bg-[#0D281A] text-[#F4F7F5] border-[#153D26] text-xs py-1 px-2.5 shadow-lg">
                  Settings
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                href="/settings"
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--portal-sidebar-muted)] transition-colors duration-150 hover:bg-[var(--portal-sidebar-raised)] hover:text-[var(--portal-sidebar-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C13]",
                  pathname.startsWith("/settings") && "bg-[var(--portal-sidebar-active)] text-[var(--portal-sidebar-text)] font-semibold"
                )}
              >
                <Settings className={cn(
                  "h-5 w-5 shrink-0 transition-colors duration-150",
                  pathname.startsWith("/settings") ? "text-[#22C55E]" : "group-hover:text-[var(--portal-sidebar-text)]"
                )} />
                <span className="truncate">Settings</span>
              </Link>
            )}

            {collapsed ? (
              <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>
                  <Link
                    href="/support"
                    aria-label="Support"
                    className={cn(
                      "group flex h-10 w-10 mx-auto items-center justify-center rounded-lg text-[var(--portal-sidebar-muted)] transition-colors duration-150 hover:bg-[var(--portal-sidebar-raised)] hover:text-[var(--portal-sidebar-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C13]",
                      pathname.startsWith("/support") && "bg-[var(--portal-sidebar-active)] text-[#22C55E]"
                    )}
                  >
                    <HelpCircle className="h-5 w-5 shrink-0" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12} className="bg-[#0D281A] text-[#F4F7F5] border-[#153D26] text-xs py-1 px-2.5 shadow-lg">
                  Support
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                href="/support"
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--portal-sidebar-muted)] transition-colors duration-150 hover:bg-[var(--portal-sidebar-raised)] hover:text-[var(--portal-sidebar-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C13]",
                  pathname.startsWith("/support") && "bg-[var(--portal-sidebar-active)] text-[var(--portal-sidebar-text)] font-semibold"
                )}
              >
                <HelpCircle className={cn(
                  "h-5 w-5 shrink-0 transition-colors duration-150",
                  pathname.startsWith("/support") ? "text-[#22C55E]" : "group-hover:text-[var(--portal-sidebar-text)]"
                )} />
                <span className="truncate">Support</span>
              </Link>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className={cn(
              "mt-3 w-full rounded-lg text-[var(--portal-sidebar-muted)] hover:bg-[var(--portal-sidebar-raised)] hover:text-[var(--portal-sidebar-text)] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C13]",
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
        <SheetContent side="left" className="w-72 p-0 flex flex-col bg-[var(--portal-sidebar)] text-[var(--portal-sidebar-text)] border-r border-[#0D281A]">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

          {/* Logo */}
          <div className="flex h-16 items-center border-b border-[#0D281A] px-4">
            <Link href="/" className="group flex items-center gap-3 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]">
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
                <span className="text-[10px] text-[var(--portal-sidebar-muted)] font-medium -mt-0.5 tracking-wider uppercase">
                  {userType === "regulator" ? "Regulator" : "Dashboard"}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="flex flex-col gap-6">
              {renderGroups({ showCollapsed: false })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-[#0D281A] p-3">
            <div className="flex flex-col gap-1">
              <Link
                href="/settings"
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--portal-sidebar-muted)] transition-colors duration-150 hover:bg-[var(--portal-sidebar-raised)] hover:text-[var(--portal-sidebar-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]",
                  pathname.startsWith("/settings") && "bg-[var(--portal-sidebar-active)] text-[var(--portal-sidebar-text)]"
                )}
              >
                <Settings className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  pathname.startsWith("/settings") ? "text-[#22C55E]" : "group-hover:text-[var(--portal-sidebar-text)]"
                )} />
                <span>Settings</span>
              </Link>
              <Link
                href="/support"
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--portal-sidebar-muted)] transition-colors duration-150 hover:bg-[var(--portal-sidebar-raised)] hover:text-[var(--portal-sidebar-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]",
                  pathname.startsWith("/support") && "bg-[var(--portal-sidebar-active)] text-[var(--portal-sidebar-text)]"
                )}
              >
                <HelpCircle className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  pathname.startsWith("/support") ? "text-[#22C55E]" : "group-hover:text-[var(--portal-sidebar-text)]"
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
    </TooltipProvider>
  )
}


