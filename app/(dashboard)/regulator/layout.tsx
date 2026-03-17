"use client"

import React from "react"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { AuthGuard } from "@/components/auth-guard"
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
