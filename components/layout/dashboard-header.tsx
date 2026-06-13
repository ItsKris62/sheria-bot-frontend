"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Building2,
  ChevronDown,
  FileText,
  Loader2,
  Menu,
  Shield,
  ClipboardCheck,
  UserCircle,
  LifeBuoy,
  Megaphone,
  ArrowRight,
  Clock,
  Hash,
  Sparkles,
  Zap,
  ExternalLink,
} from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { useAuth } from "@/hooks/use-auth"
import { useUnreadCount, useNotifications, useNotificationActions } from "@/hooks/use-notifications"
import { useAlertNotifications } from "@/hooks/use-alert-notifications"
import { useProfile } from "@/hooks/use-user"
import { useSidebar } from "@/lib/sidebar-context"
import { trpc } from "@/lib/trpc"
import { UserAvatar } from "@/components/ui/user-avatar"
import { startupNav, regulatorNav } from "@/components/layout/dashboard-sidebar"
import { adminNav } from "@/components/layout/admin-sidebar"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

// --- Enhanced Search Types & Helpers ----------------------------------------

type SearchItemType = "page" | "action" | "setting" | "tool"

interface SearchableItem {
  id: string
  title: string
  description: string
  type: SearchItemType
  icon: React.ComponentType<{ className?: string }>
  href?: string
  action?: () => void
  keywords: string[]
  group: string
  badge?: string
}

const TYPE_CONFIG: Record<SearchItemType, { label: string; className: string }> = {
  page:    { label: "Page",    className: "bg-[#22C55E]/8 text-[#22C55E]/80 border-[#22C55E]/15" },
  action:  { label: "Action",  className: "bg-[#C6A15B]/10 text-[#C6A15B]/80 border-[#C6A15B]/20" },
  setting: { label: "Setting", className: "bg-muted text-muted-foreground border-border/40" },
  tool:    { label: "Tool",    className: "bg-[#22C55E]/12 text-[#22C55E] border-[#22C55E]/20" },
}

const RECENT_SEARCHES_KEY = "sheria-recent-searches"
const MAX_RECENT = 5

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? (JSON.parse(stored) as string[]).slice(0, MAX_RECENT) : []
  } catch {
    return []
  }
}

function saveRecentSearch(query: string) {
  if (typeof window === "undefined" || !query.trim()) return
  try {
    const existing = getRecentSearches()
    const filtered = existing.filter((s) => s.toLowerCase() !== query.toLowerCase())
    const updated = [query.trim(), ...filtered].slice(0, MAX_RECENT)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {
    // localStorage not available
  }
}

function clearRecentSearches() {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch {
    // ignore
  }
}

/** Build the full list of searchable items based on role */
function buildSearchItems(
  userType: "regulator" | "startup" | "admin",
  logout: () => void
): SearchableItem[] {
  const items: SearchableItem[] = []

  const navGroups =
    userType === "admin" ? adminNav :
    userType === "regulator" ? regulatorNav : startupNav

  const pageDescriptions: Record<string, string> = {
    "/admin": "Overview of platform metrics and activity",
    "/admin/analytics": "Platform-wide analytics and usage statistics",
    "/admin/users": "Manage user accounts, roles, and permissions",
    "/admin/organizations": "View and manage organizations",
    "/admin/support": "Manage customer support tickets",
    "/admin/content/knowledge-base": "Manage knowledge base articles",
    "/admin/content/blog": "Manage blog posts and publications",
    "/admin/ai-config": "Configure AI model settings and parameters",
    "/admin/billing": "Manage billing plans and subscriptions",
    "/admin/audit-logs": "View security and activity audit trail",
    "/admin/security": "Platform security settings and policies",
    "/admin/system": "System configuration and maintenance",
    "/regulator": "Regulatory dashboard overview",
    "/regulator/policy-generator": "Generate regulatory policies with AI",
    "/regulator/legal-corpus": "Browse and search legal documents",
    "/regulator/frameworks": "Regulatory frameworks and templates",
    "/regulator/collaboration": "Team collaboration workspace",
    "/regulator/analytics": "Regulatory analytics and insights",
    "/regulator/intelligence-feed": "Latest regulatory news and updates",
    "/startup": "Startup compliance dashboard overview",
    "/startup/compliance-query": "Ask AI compliance questions",
    "/startup/checklists": "Compliance checklists and progress tracking",
    "/startup/gap-analysis": "Identify compliance gaps in your organization",
    "/startup/applications": "Manage license and permit applications",
    "/startup/calendar": "Compliance deadlines and calendar events",
    "/startup/documents": "Document vault and file management",
    "/startup/monitor": "Monitor regulatory changes and alerts",
  }

  for (const group of navGroups) {
    for (const item of group.items) {
      items.push({
        id: `nav-${item.href}`,
        title: item.title,
        description: pageDescriptions[item.href] || `Navigate to ${item.title}`,
        type: "page",
        icon: item.icon,
        href: item.href,
        keywords: [item.title, group.title, item.href.split("/").pop() || ""],
        group: group.title,
        badge: "badge" in item && typeof item.badge === "string" ? item.badge : undefined,
      })
    }
  }

  if (userType === "startup") {
    items.push(
      {
        id: "action-compliance-query",
        title: "Ask a Compliance Question",
        description: "Get instant AI-powered answers to regulatory questions",
        type: "tool",
        icon: Sparkles,
        href: "/startup/compliance-query",
        keywords: ["ask", "question", "ai", "compliance", "query", "help", "regulation"],
        group: "Quick Actions",
        badge: "AI",
      },
      {
        id: "action-upload-document",
        title: "Upload a Document",
        description: "Upload files to your secure document vault",
        type: "action",
        icon: FileText,
        href: "/startup/documents",
        keywords: ["upload", "document", "file", "vault", "pdf"],
        group: "Quick Actions",
      },
      {
        id: "action-check-deadlines",
        title: "Check Upcoming Deadlines",
        description: "View compliance deadlines and important dates",
        type: "action",
        icon: ClipboardCheck,
        href: "/startup/calendar",
        keywords: ["deadline", "date", "calendar", "due", "upcoming", "schedule"],
        group: "Quick Actions",
      }
    )
  } else if (userType === "regulator") {
    items.push(
      {
        id: "action-generate-policy",
        title: "Generate a Policy",
        description: "Use AI to draft regulatory policy documents",
        type: "tool",
        icon: Sparkles,
        href: "/regulator/policy-generator",
        keywords: ["generate", "policy", "draft", "create", "ai", "regulation"],
        group: "Quick Actions",
        badge: "AI",
      },
      {
        id: "action-search-legal",
        title: "Search Legal Corpus",
        description: "Search through legal documents and regulations",
        type: "action",
        icon: Search,
        href: "/regulator/legal-corpus",
        keywords: ["legal", "search", "law", "act", "regulation", "document", "corpus"],
        group: "Quick Actions",
      }
    )
  } else if (userType === "admin") {
    items.push(
      {
        id: "action-manage-users",
        title: "Manage Users",
        description: "View, edit, or invite users to the platform",
        type: "action",
        icon: User,
        href: "/admin/users",
        keywords: ["user", "manage", "invite", "edit", "role", "permission"],
        group: "Quick Actions",
      },
      {
        id: "action-view-tickets",
        title: "View Support Tickets",
        description: "Review and respond to customer support requests",
        type: "action",
        icon: LifeBuoy,
        href: "/admin/support",
        keywords: ["ticket", "support", "help", "issue", "customer"],
        group: "Quick Actions",
      }
    )
  }

  items.push(
    {
      id: "setting-profile",
      title: "Profile Settings",
      description: "Update your name, email, and avatar",
      type: "setting",
      icon: User,
      href: "/settings",
      keywords: ["profile", "name", "email", "avatar", "account", "personal"],
      group: "Settings",
    },
    {
      id: "setting-organization",
      title: "Organization Settings",
      description: "Manage your organization details and team",
      type: "setting",
      icon: Building2,
      href: "/settings/organization",
      keywords: ["organization", "company", "team", "org", "business"],
      group: "Settings",
    },
    {
      id: "setting-security",
      title: "Security Settings",
      description: "Manage passwords, two-factor authentication, and sessions",
      type: "setting",
      icon: Shield,
      href: "/settings/security",
      keywords: ["security", "password", "2fa", "authentication", "session", "mfa"],
      group: "Settings",
    },
    {
      id: "setting-notifications",
      title: "Notification Preferences",
      description: "Configure email and push notification settings",
      type: "setting",
      icon: Bell,
      href: "/settings/notifications",
      keywords: ["notification", "email", "alert", "preference", "push"],
      group: "Settings",
    },
    {
      id: "setting-billing",
      title: "Billing & Subscription",
      description: "View invoices, manage your plan, and payment methods",
      type: "setting",
      icon: FileText,
      href: "/settings/billing",
      keywords: ["billing", "invoice", "subscription", "plan", "payment", "price"],
      group: "Settings",
    },
    {
      id: "setting-api-keys",
      title: "API Keys",
      description: "Generate and manage API access keys",
      type: "setting",
      icon: Hash,
      href: "/settings/api-keys",
      keywords: ["api", "key", "token", "developer", "integration"],
      group: "Settings",
    }
  )

  items.push(
    {
      id: "system-support",
      title: "Help & Support",
      description: "Get help, submit a ticket, or browse FAQs",
      type: "page",
      icon: LifeBuoy,
      href: "/support",
      keywords: ["help", "support", "ticket", "faq", "contact", "issue"],
      group: "System",
    },
    {
      id: "system-logout",
      title: "Sign Out",
      description: "Log out of your account securely",
      type: "action",
      icon: LogOut,
      action: logout,
      keywords: ["logout", "sign out", "exit", "leave", "disconnect"],
      group: "System",
    }
  )

  return items
}

// --- Notification types ------------------------------------------------------

interface NotificationItem {
  id: string
  type: string
  category: NotificationCategoryName
  title: string
  message: string
  link: string | null
  read: boolean
  readAt: Date | null
  createdAt: Date | string
}

type NotificationCategoryName = "SECURITY" | "COMPLIANCE" | "DOCUMENTS" | "ACCOUNT" | "SUPPORT" | "SYSTEM"

const CATEGORY_CONFIG: Record<NotificationCategoryName, { label: string; Icon: React.ElementType; iconCls: string; bgCls: string }> = {
  SECURITY:   { label: "Security",   Icon: Shield,         iconCls: "text-destructive",   bgCls: "bg-destructive/10" },
  COMPLIANCE: { label: "Compliance", Icon: ClipboardCheck, iconCls: "text-yellow-600",    bgCls: "bg-yellow-500/10" },
  DOCUMENTS:  { label: "Documents",  Icon: FileText,       iconCls: "text-primary",        bgCls: "bg-primary/10" },
  ACCOUNT:    { label: "Account",    Icon: UserCircle,     iconCls: "text-emerald-600",    bgCls: "bg-emerald-500/10" },
  SUPPORT:    { label: "Support",    Icon: LifeBuoy,       iconCls: "text-purple-600",     bgCls: "bg-purple-500/10" },
  SYSTEM:     { label: "System",     Icon: Megaphone,      iconCls: "text-muted-foreground", bgCls: "bg-muted" },
}

const CATEGORY_TABS: Array<{ value: NotificationCategoryName | "ALL"; label: string }> = [
  { value: "ALL",        label: "All" },
  { value: "SECURITY",   label: "Security" },
  { value: "COMPLIANCE", label: "Compliance" },
  { value: "DOCUMENTS",  label: "Documents" },
  { value: "ACCOUNT",    label: "Account" },
  { value: "SUPPORT",    label: "Support" },
  { value: "SYSTEM",     label: "System" },
]

// --- Alert types -------------------------------------------------------------

type AlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

const ALERT_SEVERITY_CONFIG: Record<AlertSeverity, { iconCls: string; bgCls: string; pillCls: string }> = {
  CRITICAL: { iconCls: "text-red-600",    bgCls: "bg-red-500/10",    pillCls: "bg-red-500/10 text-red-600 border border-red-500/20" },
  HIGH:     { iconCls: "text-orange-600", bgCls: "bg-orange-500/10", pillCls: "bg-orange-500/10 text-orange-600 border border-orange-500/20" },
  MEDIUM:   { iconCls: "text-yellow-600", bgCls: "bg-yellow-500/10", pillCls: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20" },
  LOW:      { iconCls: "text-emerald-600", bgCls: "bg-emerald-500/10", pillCls: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" },
}

interface AlertItem {
  id: string
  title: string
  summary: string
  regulatoryBody: string
  severity: string
  publishedAt: string | Date
  isRead: boolean
  notificationId: string | null
}

// --- Helpers -----------------------------------------------------------------

function relativeTime(dateStr: string | Date): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? "" : "s"} ago`
}

// --- Component ---------------------------------------------------------------

interface DashboardHeaderProps {
  userType: "regulator" | "startup" | "admin"
}

export function DashboardHeader({ userType }: DashboardHeaderProps) {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<NotificationCategoryName | "ALL">("ALL")
  const [activePanel, setActivePanel] = useState<"NOTIFICATIONS" | "ALERTS">("NOTIFICATIONS")
  const authUser = useAuthStore((s) => s.user)
  const { logout } = useAuth()
  const { setMobileOpen } = useSidebar()
  const utils = trpc.useUtils()
  const { data: profileData } = useProfile()
  const avatarUrl = (profileData as { avatar?: string | null } | undefined)?.avatar ?? null

  const user = {
    name: authUser?.name || (userType === "regulator" ? "Regulator" : "User"),
    email: authUser?.email || "",
    organization: userType === "regulator" ? "Regulator" : "Startup",
    role: authUser?.role || userType.toUpperCase(),
  }

  // Existing notification data
  const { data: unreadData } = useUnreadCount()
  const { data: notifData, isLoading: isLoadingNotifs } = useNotifications({
    limit: 20,
    category: activeCategory === "ALL" ? undefined : activeCategory,
  })
  const { markAllAsRead, isMarkingAllAsRead } = useNotificationActions()

  const unreadCount = unreadData?.count ?? 0
  const notificationList = (notifData?.items ?? []) as NotificationItem[]

  // Alert data
  const { alertUnreadCount, markAllAsRead: markAllAlertsAsRead, isMarkingAllAsRead: isMarkingAllAlertsAsRead } = useAlertNotifications()
  const { data: alertsData, isLoading: isLoadingAlerts } = trpc.alert.getAlerts.useQuery(
    { page: 1, limit: 20 },
    { enabled: activePanel === "ALERTS" }
  )
  const alertList = ((alertsData as { alerts?: unknown[] } | undefined)?.alerts ?? []) as AlertItem[]

  // Combined badge count
  const totalUnreadCount = unreadCount + alertUnreadCount

  // Search items
  const searchItems = useMemo(() => buildSearchItems(userType, logout), [userType, logout])

  useEffect(() => {
    if (searchOpen) {
      setRecentSearches(getRecentSearches())
      setSearchQuery("")
    }
  }, [searchOpen])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      } else if (e.key === "/") {
        if (
          e.target instanceof HTMLElement &&
          (e.target.isContentEditable || e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT")
        ) {
          return
        }
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = useCallback((command: () => unknown, searchTerm?: string) => {
    if (searchTerm) saveRecentSearch(searchTerm)
    setSearchOpen(false)
    setSearchQuery("")
    command()
  }, [])

  const handleClearRecent = useCallback(() => {
    clearRecentSearches()
    setRecentSearches([])
  }, [])

  const groupedItems = useMemo(() => {
    const groups = new Map<string, SearchableItem[]>()
    const order = ["Quick Actions", "Overview", "Compliance", "Policy Tools", "Management", "Collaboration", "Users", "Support", "Content", "System (Admin)", "Settings", "System"]
    for (const item of searchItems) {
      if (!groups.has(item.group)) groups.set(item.group, [])
      groups.get(item.group)!.push(item)
    }
    const sorted = new Map<string, SearchableItem[]>()
    for (const key of order) {
      if (groups.has(key)) sorted.set(key, groups.get(key)!)
    }
    for (const [key, value] of groups) {
      if (!sorted.has(key)) sorted.set(key, value)
    }
    return sorted
  }, [searchItems])

  function handlePanelOpen(open: boolean) {
    setNotificationsOpen(open)
    if (open) {
      utils.notification.list.invalidate()
      utils.notification.getUnreadCount.invalidate()
      utils.alert.getUnreadCount.invalidate()
    }
  }

  function handleAlertClick(alertId: string) {
    setNotificationsOpen(false)
    utils.alert.getAlerts.invalidate()
    utils.alert.getUnreadCount.invalidate()
    router.push(`/dashboard/alerts/${alertId}`)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
      {/* Left side */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <button
          type="button"
          className="hidden w-64 h-9 items-center gap-2.5 rounded-xl border border-border/50 bg-muted/30 px-3 text-sm text-muted-foreground transition-all duration-200 hover:border-[#22C55E]/30 hover:bg-[#22C55E]/[0.04] hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:flex"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="ml-auto flex items-center gap-0.5 rounded-md border border-border/40 bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/70">
            <span className="text-[11px]">⌘</span>K
          </kbd>
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications + Alerts Sheet */}
        <Sheet open={notificationsOpen} onOpenChange={handlePanelOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {totalUnreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-0.5 text-[10px] font-medium text-primary-foreground">
                  {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:w-[28rem]">
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>

            {/* Panel switcher */}
            <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              <button
                onClick={() => setActivePanel("NOTIFICATIONS")}
                className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] ${
                  activePanel === "NOTIFICATIONS"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Updates
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActivePanel("ALERTS")}
                className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] ${
                  activePanel === "ALERTS"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Regulatory Alerts
                {alertUnreadCount > 0 && (
                  <span className="rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-medium text-destructive-foreground">
                    {alertUnreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* -- NOTIFICATIONS PANEL -- */}
            {activePanel === "NOTIFICATIONS" && (
              <>
                <div className="mt-3 flex items-center justify-between">
                  {unreadCount > 0 && (
                    <>
                      <Badge variant="secondary">{unreadCount} new</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground"
                        onClick={() => markAllAsRead()}
                        disabled={isMarkingAllAsRead}
                      >
                        {isMarkingAllAsRead && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                        Mark all read
                      </Button>
                    </>
                  )}
                </div>

                {/* Category filter tabs */}
                <div className="mt-3 flex flex-wrap gap-1 border-b border-border pb-3">
                  {CATEGORY_TABS.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setActiveCategory(tab.value)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        activeCategory === tab.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/70"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <ScrollArea className="mt-4 h-[calc(100vh-16rem)]">
                  <div className="flex flex-col gap-2">
                    {isLoadingNotifs ? (
                      <div className="flex items-center justify-center py-8 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Loading...
                      </div>
                    ) : notificationList.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">No notifications yet</p>
                    ) : (
                      notificationList.map((notification) => {
                        const catName = (notification.category ?? "SYSTEM") as NotificationCategoryName
                        const config = CATEGORY_CONFIG[catName] ?? CATEGORY_CONFIG.SYSTEM
                        const isUnread = !notification.read
                        const Icon = config.Icon
                        return (
                          <div
                            key={notification.id}
                            className={`flex gap-3 rounded-lg p-3 transition-colors ${isUnread ? "bg-muted/50" : "bg-transparent"}`}
                          >
                            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.bgCls} ${config.iconCls}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground text-sm">{notification.title}</p>
                              <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{relativeTime(notification.createdAt)}</p>
                            </div>
                            {isUnread && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />}
                          </div>
                        )
                      })
                    )}
                  </div>
                </ScrollArea>
              </>
            )}

            {/* -- ALERTS PANEL -- */}
            {activePanel === "ALERTS" && (
              <>
                <div className="mt-3 flex items-center justify-between">
                  {alertUnreadCount > 0 && (
                    <>
                      <Badge variant="secondary">{alertUnreadCount} unread</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground"
                        onClick={() => markAllAlertsAsRead()}
                        disabled={isMarkingAllAlertsAsRead}
                      >
                        {isMarkingAllAlertsAsRead && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                        Mark all read
                      </Button>
                    </>
                  )}
                </div>

                <ScrollArea className="mt-4 h-[calc(100vh-14rem)]">
                  <div className="flex flex-col gap-2">
                    {isLoadingAlerts ? (
                      <div className="flex items-center justify-center py-8 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Loading...
                      </div>
                    ) : alertList.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">No regulatory alerts</p>
                    ) : (
                      alertList.map((alert) => {
                        const severity = (alert.severity ?? "MEDIUM") as AlertSeverity
                        const cfg = ALERT_SEVERITY_CONFIG[severity] ?? ALERT_SEVERITY_CONFIG.MEDIUM
                        return (
                          <button
                            key={alert.id}
                            onClick={() => handleAlertClick(alert.id)}
                            className={`w-full text-left flex gap-3 rounded-lg p-3 transition-colors hover:bg-muted/60 ${!alert.isRead ? "bg-muted/40" : "bg-transparent"}`}
                          >
                            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${cfg.bgCls} ${cfg.iconCls}`}>
                              <Megaphone className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${cfg.pillCls}`}>
                                  {severity}
                                </span>
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                                  {alert.regulatoryBody}
                                </span>
                              </div>
                              <p className="font-medium text-foreground text-sm leading-snug line-clamp-2">
                                {alert.title}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {relativeTime(alert.publishedAt)}
                              </p>
                            </div>
                            {!alert.isRead && <div className="h-2 w-2 rounded-full bg-destructive shrink-0 mt-2" />}
                          </button>
                        )
                      })
                    )}
                  </div>

                  {/* View all link */}
                  <div className="mt-3 border-t border-border pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground text-xs"
                      onClick={() => { setNotificationsOpen(false); router.push(userType === "admin" ? "/admin/alerts" : "/dashboard/alerts") }}
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      View all regulatory alerts
                    </Button>
                  </div>
                </ScrollArea>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Help */}
        <Button variant="ghost" size="icon" asChild>
          <Link href="/support">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Link>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <UserAvatar user={{ name: user.name, avatar: avatarUrl }} size="sm" />
              <div className="hidden text-left lg:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.organization}</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-foreground">{user.name}</p>
                <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/organization" className="cursor-pointer">
                <Building2 className="mr-2 h-4 w-4" />
                Organization
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput
          placeholder="Search pages, actions, settings..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-4">
              <Search className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground/70">Try searching for pages, settings, or actions</p>
            </div>
          </CommandEmpty>

          {!searchQuery && recentSearches.length > 0 && (
            <CommandGroup heading={
              <span className="flex items-center justify-between w-full">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleClearRecent() }}
                  className="rounded text-[10px] font-normal text-muted-foreground/60 hover:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#22C55E] focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                >
                  Clear
                </button>
              </span>
            }>
              {recentSearches.map((term) => (
                <CommandItem
                  key={`recent-${term}`}
                  value={`recent: ${term}`}
                  onSelect={() => setSearchQuery(term)}
                >
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground/50" />
                  <span>{term}</span>
                  <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground/40" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!searchQuery && recentSearches.length === 0 && (
            <CommandGroup heading={
              <span className="flex items-center gap-1.5">
                <Zap className="h-3 w-3" />
                Suggestions
              </span>
            }>
              {searchItems.filter(i => i.group === "Quick Actions").slice(0, 3).map((item) => (
                <CommandItem
                  key={`suggest-${item.id}`}
                  value={`${item.title} ${item.keywords.join(" ")}`}
                  onSelect={() => {
                    const action = item.action
                      ? () => item.action!()
                      : () => router.push(item.href!)
                    runCommand(action, item.title)
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-sm">{item.title}</span>
                    <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                  </div>
                  {item.badge && (
                    <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                      {item.badge}
                    </span>
                  )}
                  <span className={`ml-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${TYPE_CONFIG[item.type].className}`}>
                    {TYPE_CONFIG[item.type].label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {Array.from(groupedItems.entries()).map(([groupName, items], idx) => (
            <React.Fragment key={groupName}>
              {idx > 0 && <CommandSeparator />}
              <CommandGroup heading={groupName}>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.title} ${item.description} ${item.keywords.join(" ")}`}
                    onSelect={() => {
                      const action = item.action
                        ? () => item.action!()
                        : () => router.push(item.href!)
                      runCommand(action, searchQuery || item.title)
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4 shrink-0" />
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.title}</span>
                        {item.badge && (
                          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                    </div>
                    <span className={`ml-auto shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium ${TYPE_CONFIG[item.type].className}`}>
                      {TYPE_CONFIG[item.type].label}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          ))}

          <div className="flex items-center justify-between border-t border-border/40 px-4 py-2.5 text-[11px] text-muted-foreground/70">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="rounded-md border border-border/30 bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/80">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded-md border border-border/30 bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/80">↵</kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded-md border border-border/30 bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/80">esc</kbd>
                close
              </span>
            </div>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]/70" />
              {searchItems.length} items
            </span>
          </div>
        </CommandList>
      </CommandDialog>
    </header>
  )
}
