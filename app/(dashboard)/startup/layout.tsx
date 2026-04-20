"use client"

import React from "react"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { AuthGuard } from "@/components/auth-guard"
import { SubscriptionStatusBanner } from "@/components/plan/subscription-status-banner"
import { TrialStatusBanner } from "@/components/trial/TrialStatusBanner"
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context"
import { cn } from "@/lib/utils"

/** Inner wrapper reads collapsed state from context to adjust left padding. */
function LayoutInner({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()
  return (
    <div
      className={cn(
        "flex flex-1 flex-col transition-all duration-500 ease-out",
        // Mobile: no offset (sidebar is a drawer overlay)
        // md+: match collapsed (72px) or expanded (256px) sidebar width
        collapsed ? "md:pl-[72px]" : "md:pl-64"
      )}
    >
      <DashboardHeader userType="startup" />
      <SubscriptionStatusBanner />
      <div className="px-4 pt-1 md:px-6">
        <TrialStatusBanner />
      </div>
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}

export default function StartupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard allowedRoles={["STARTUP", "ENTERPRISE", "ADMIN"]}>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <DashboardSidebar userType="startup" />
          <LayoutInner>{children}</LayoutInner>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
