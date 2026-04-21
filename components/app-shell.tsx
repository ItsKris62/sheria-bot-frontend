'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Menu,
  Bell,
  Settings,
  LogOut,
  Search,
  Moon,
  Sun,
  Command,
} from 'lucide-react'

interface TopBarProps {
  title?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  showThemeToggle?: boolean
}

export function TopBar({
  title = 'SheriaBot',
  searchPlaceholder = 'Search...',
  onSearch,
  showThemeToggle = true,
}: TopBarProps) {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (isDark) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 py-3 md:px-6">
      <div className="flex h-14 items-center gap-4">
        <div className="flex flex-1 items-center gap-4">
          <Link href="/" className="font-bold text-lg text-primary hidden md:block">
            {title}
          </Link>

          <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3 py-2 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="bg-transparent border-0 placeholder:text-muted-foreground focus:outline-none focus-visible:ring-0"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {showThemeToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-full bg-primary/10"
              >
                <span className="text-sm font-semibold text-primary">JK</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="font-medium text-sm">James Kipchoge</p>
                <p className="text-xs text-muted-foreground">james@sheriabot.com</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

interface SidebarItem {
  icon: React.ReactNode
  label: string
  href: string
  badge?: string
  subItems?: SidebarItem[]
}

interface SidebarProps {
  items: SidebarItem[]
  currentPath?: string
  collapsed?: boolean
}

export function Sidebar({ items, currentPath = '/', collapsed = false }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleItem = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    )
  }

  const isActive = (href: string) => currentPath === href || currentPath.startsWith(href + '/')

  const renderItem = (item: SidebarItem, depth = 0) => {
    const isItemActive = isActive(item.href)
    const isItemExpanded = expandedItems.includes(item.label)
    const hasSubItems = item.subItems && item.subItems.length > 0

    return (
      <div key={item.label}>
        <Link href={item.href}>
          <button
            onClick={(e) => {
              if (hasSubItems) {
                e.preventDefault()
                toggleItem(item.label)
              }
            }}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              'hover:bg-sidebar-accent',
              isItemActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground'
            )}
          >
            <div className="flex-shrink-0">{item.icon}</div>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="text-xs bg-primary px-2 py-0.5 rounded-full text-primary-foreground">
                {item.badge}
              </span>
            )}
            {hasSubItems && (
              <span className={cn('text-muted-foreground transition-transform', isItemExpanded && 'rotate-180')}>
                ▼
              </span>
            )}
          </button>
        </Link>

        {hasSubItems && isItemExpanded && (
          <div className="ml-4 space-y-1">
            {item.subItems!.map((subItem) => renderItem(subItem, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (collapsed) {
    return (
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-16 border-r border-sidebar-border bg-sidebar-background flex flex-col gap-4 p-2">
        {items.map((item) => (
          <Link key={item.label} href={item.href} title={item.label}>
            <button
              className={cn(
                'w-full h-10 rounded-md flex items-center justify-center transition-colors',
                'hover:bg-sidebar-accent',
                isActive(item.href) && 'bg-sidebar-accent text-sidebar-accent-foreground'
              )}
            >
              {item.icon}
            </button>
          </Link>
        ))}
      </aside>
    )
  }

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r border-sidebar-border bg-sidebar-background overflow-y-auto">
      <nav className="p-4 space-y-2">{items.map((item) => renderItem(item))}</nav>
    </aside>
  )
}

interface AppShellProps {
  children: React.ReactNode
  sidebarItems: SidebarItem[]
  currentPath?: string
  title?: string
  collapsedSidebar?: boolean
}

export function AppShell({
  children,
  sidebarItems,
  currentPath = '/',
  title = 'SheriaBot',
  collapsedSidebar = false,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(collapsedSidebar)

  return (
    <div className="min-h-screen bg-background">
      <TopBar title={title} />
      <div className="flex">
        <Sidebar items={sidebarItems} currentPath={currentPath} collapsed={collapsed} />
        <main
          className={cn(
            'flex-1 pt-16 transition-all',
            collapsed ? 'ml-16' : 'ml-64'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export function MobileNavigation({ items }: { items: SidebarItem[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <nav className="p-4 space-y-2">
          {items.map((item) => (
            <Link key={item.label} href={item.href}>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted">
                {item.icon}
                <span>{item.label}</span>
              </button>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
