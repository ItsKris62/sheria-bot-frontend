"use client"

import React from "react"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { AuthGuard } from "@/components/auth-guard"
import { SubscriptionStatusBanner } from "@/components/plan/subscription-status-banner"
import { TrialStatusBanner } from "@/components/trial/TrialStatusBanner"
import { JurisdictionPromptBanner } from "@/components/jurisdiction/jurisdiction-prompt-banner"
import { SidebarProvider } from "@/lib/sidebar-context"

export default function StartupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard allowedRoles={["STARTUP", "ENTERPRISE", "ADMIN"]}>
      <SidebarProvider>
        <DashboardShell
          sidebar={<DashboardSidebar userType="startup" />}
          header={<DashboardHeader userType="startup" />}
          banners={
            <>
              <JurisdictionPromptBanner />
              <SubscriptionStatusBanner />
              <div className="min-w-0 px-4 pt-1 md:px-6">
                <TrialStatusBanner />
              </div>
            </>
          }
        >
          {children}
        </DashboardShell>
      </SidebarProvider>
    </AuthGuard>
  )
}

