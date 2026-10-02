"use client"

import React from "react"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { AuthGuard } from "@/components/auth-guard"
import { TrialCtaBanner } from "@/components/trial/TrialCtaBanner"
import { TrialStatusBanner } from "@/components/trial/TrialStatusBanner"
import { SidebarProvider } from "@/lib/sidebar-context"

export default function RegulatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard allowedRoles={["REGULATOR", "ADMIN"]}>
      <SidebarProvider>
        <DashboardShell
          sidebar={<DashboardSidebar userType="regulator" />}
          header={<DashboardHeader userType="regulator" />}
          banners={
            <div className="px-4 pt-4 md:px-6 md:pt-4 space-y-2">
              <TrialStatusBanner />
              <TrialCtaBanner />
            </div>
          }
        >
          {children}
        </DashboardShell>
      </SidebarProvider>
    </AuthGuard>
  )
}

