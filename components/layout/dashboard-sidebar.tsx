"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Scale,
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
  Bell,
  Sparkles,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const regulatorNav: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/regulator", icon: LayoutDashboard },
    ],
  },
  {
    title: "Policy Tools",
    items: [
      { title: "Policy Generator", href: "/regulator/policy-generator", icon: Sparkles, badge: "AI" },
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
]

const startupNav: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/startup", icon: LayoutDashboard },
    ],
  },
  {
    title: "Compliance",
    items: [
      { title: "Compliance Query", href: "/startup/compliance-query", icon: Search, badge: "AI" },
      { title: "Checklists", href: "/startup/checklists", icon: ClipboardCheck },
      { title: "Gap Analysis", href: "/startup/gap-analysis", icon: AlertTriangle },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Applications", href: "/startup/applications", icon: FileText },
      { title: "Calendar", href: "/startup/calendar", icon: Calendar },
      { title: "Documents", href: "/startup/documents", icon: Folder },
      { title: "Monitor", href: "/startup/monitor", icon: Bell, badge: 3 },
    ],
  },
]

interface DashboardSidebarProps {
  userType: "regulator" | "startup"
}

export function DashboardSidebar({ userType }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  
  const navGroups = userType === "regulator" ? regulatorNav : startupNav

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-500 ease-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
        {!collapsed && (
          <Link href="/" className="group flex items-center gap-3 transition-all duration-300 hover:scale-105">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 transition-all duration-300 group-hover:shadow-primary/50">
              <Scale className="h-4 w-4 text-primary-foreground" />
              <div className="absolute inset-0 rounded-xl bg-primary/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground tracking-tight">SheriaBot</span>
              <span className="text-[10px] text-primary font-medium -mt-0.5 tracking-wider uppercase">Dashboard</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="group mx-auto">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 transition-all duration-300 group-hover:shadow-primary/50 group-hover:scale-110">
              <Scale className="h-4 w-4 text-primary-foreground" />
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-6">
        <nav className="flex flex-col gap-8">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-primary/70">
                  {group.title}
                </p>
              )}
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                        isActive
                          ? "bg-primary/15 text-primary shadow-sm"
                          : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
                        collapsed && "justify-center px-2"
                      )}
                      title={collapsed ? item.title : undefined}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                      )}
                      <item.icon className={cn(
                        "h-5 w-5 shrink-0 transition-all duration-300",
                        isActive ? "text-primary" : "group-hover:text-primary"
                      )} />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className={cn(
                              "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold transition-all duration-300",
                              typeof item.badge === "number"
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "bg-primary/20 text-primary"
                            )}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border/50 p-3">
        <div className="flex flex-col gap-1">
          <Link
            href="/settings"
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-foreground",
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
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-foreground",
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
  )
}
