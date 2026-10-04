"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { JurisdictionPromptBanner } from "@/components/jurisdiction/jurisdiction-prompt-banner"
import { SubscriptionStatusBanner } from "@/components/plan/subscription-status-banner"
import { TrialCtaBanner } from "@/components/trial/TrialCtaBanner"
import { TrialStatusBanner } from "@/components/trial/TrialStatusBanner"
import { useAuthStore, type UserRole } from "@/lib/auth-store"
import { SidebarProvider } from "@/lib/sidebar-context"

export type PortalShellType = "startup" | "regulator" | "admin"

export function getPortalShellType(role: UserRole | undefined): PortalShellType {
  if (role === "ADMIN") return "admin"
  if (role === "REGULATOR") return "regulator"
  return "startup"
}

function renderPortalBanners(pathname: string, shellType: PortalShellType) {
  if (pathname.startsWith("/startup")) {
    return (
      <>
        <JurisdictionPromptBanner />
        <SubscriptionStatusBanner />
        <div className="min-w-0 px-4 pt-1 md:px-6">
          <TrialStatusBanner />
        </div>
      </>
    )
  }

  if (pathname.startsWith("/regulator")) {
    return (
      <div className="space-y-2 px-4 pt-4 md:px-6 md:pt-4">
        <TrialStatusBanner />
        <TrialCtaBanner />
      </div>
    )
  }

  if (pathname.startsWith("/dashboard/") && shellType === "startup") {
    return (
      <>
        <SubscriptionStatusBanner />
        <div className="px-4 pt-1 md:px-6">
          <TrialStatusBanner />
        </div>
      </>
    )
  }

  if (pathname.startsWith("/dashboard/") && shellType === "regulator") {
    return (
      <div className="space-y-2 px-4 pt-4 md:px-6 md:pt-4">
        <TrialStatusBanner />
        <TrialCtaBanner />
      </div>
    )
  }

  return null
}

export function AuthenticatedPortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const role = useAuthStore((state) => state.user?.role)
  const shellType = getPortalShellType(role)

  if (pathname.startsWith("/support")) {
    return children
  }

  const sidebar = shellType === "admin"
    ? <AdminSidebar />
    : <DashboardSidebar userType={shellType} />

  return (
    <SidebarProvider>
      <DashboardShell
        sidebar={sidebar}
        header={<DashboardHeader userType={shellType} />}
        banners={renderPortalBanners(pathname, shellType)}
      >
        {children}
      </DashboardShell>
    </SidebarProvider>
  )
}
