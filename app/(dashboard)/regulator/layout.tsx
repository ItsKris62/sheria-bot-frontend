"use client"

import React from "react"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { AuthGuard } from "@/components/auth-guard"
import { TrialCtaBanner } from "@/components/trial/TrialCtaBanner"
import { TrialStatusBanner } from "@/components/trial/TrialStatusBanner"
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context"
import { cn } from "@/lib/utils"

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()
  return (
    <div
      className={cn(
        "flex flex-1 flex-col transition-all duration-500 ease-out",
        collapsed ? "md:pl-[72px]" : "md:pl-64"
      )}
    >
      <DashboardHeader userType="regulator" />
      <div className="px-4 pt-4 md:px-6 md:pt-4 space-y-2">
        <TrialStatusBanner />
        <TrialCtaBanner />
      </div>
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}

export default function RegulatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard allowedRoles={["REGULATOR", "ADMIN"]}>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <DashboardSidebar userType="regulator" />
          <LayoutInner>{children}</LayoutInner>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
