"use client"

import type { ComponentType, ReactNode } from "react"
import { usePathname } from "next/navigation"
import {
  Bell,
  Building2,
  CreditCard,
  FileQuestion,
  Key,
  Shield,
  User,
  Users,
} from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { PendingNavigationLink } from "@/components/navigation/pending-navigation-link"

type SettingsNavItem = {
  title: string
  href: string
  icon: ComponentType<{ className?: string }>
}

export const settingsNav: SettingsNavItem[] = [
  { title: "Profile", href: "/settings", icon: User },
  { title: "Organization", href: "/settings/organization", icon: Building2 },
  { title: "Team", href: "/settings/team", icon: Users },
  { title: "Security", href: "/settings/security", icon: Shield },
  { title: "Billing", href: "/settings/billing", icon: CreditCard },
  { title: "Notifications", href: "/settings/notifications", icon: Bell },
  { title: "Corpus Reports", href: "/settings/corpus-reports", icon: FileQuestion },
  { title: "API Keys", href: "/settings/api-keys", icon: Key },
]

export function isSettingsRouteActive(pathname: string, href: string) {
  return href === "/settings"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`)
}

function SettingsNavigation({ pathname, mobile = false }: { pathname: string; mobile?: boolean }) {
  const links = settingsNav.map((item) => {
    const isActive = isSettingsRouteActive(pathname, item.href)

    return (
      <PendingNavigationLink
        key={item.href}
        href={item.href}
        pendingLabel={item.title}
        pendingTone="surface"
        prefetchStrategy="intent"
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group relative flex items-center gap-2.5 rounded-lg text-sm font-medium transition-colors",
          mobile ? "h-10 shrink-0 px-3" : "min-h-10 px-3",
          isActive
            ? "bg-[var(--portal-accent-subtle)] text-[#0A5C36]"
            : "text-[var(--portal-text-secondary)] hover:bg-[var(--portal-surface-hover)] hover:text-[var(--portal-text-primary)]"
        )}
      >
        {!mobile && isActive && (
          <span className="absolute inset-y-2 left-0 w-0.5 rounded-r bg-[var(--portal-accent)]" aria-hidden="true" />
        )}
        <item.icon
          className={cn(
            "h-4 w-4 shrink-0",
            isActive ? "text-[var(--portal-accent)]" : "text-[var(--portal-text-muted)] group-hover:text-[var(--portal-text-secondary)]"
          )}
          aria-hidden="true"
        />
        <span className="whitespace-nowrap">{item.title}</span>
      </PendingNavigationLink>
    )
  })

  if (mobile) {
    return (
      <ScrollArea className="w-full whitespace-nowrap xl:hidden">
        <nav aria-label="Settings navigation" className="flex w-max gap-1 pb-3">
          {links}
        </nav>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    )
  }

  return (
    <aside className="hidden xl:block">
      <nav
        aria-label="Settings navigation"
        className="sticky top-24 flex flex-col gap-1 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-2 shadow-[var(--portal-shadow-sm)]"
      >
        {links}
      </nav>
    </aside>
  )
}

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div data-settings-workspace="true" className="mx-auto w-full max-w-[1400px]">
      <header className="mb-6 border-b border-[var(--portal-divider)] pb-5 md:mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight text-[var(--portal-text-primary)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--portal-text-secondary)]">
          Manage your account, organization, and preferences.
        </p>
      </header>

      <SettingsNavigation pathname={pathname} mobile />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-8">
        <SettingsNavigation pathname={pathname} />
        <div className="min-w-0 max-w-[1000px]">{children}</div>
      </div>
    </div>
  )
}
