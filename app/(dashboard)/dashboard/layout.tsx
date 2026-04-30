"use client"

import React, { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { AuthGuard } from "@/components/auth-guard"
import { SubscriptionStatusBanner } from "@/components/plan/subscription-status-banner"
import { TrialStatusBanner } from "@/components/trial/TrialStatusBanner"
import { TrialCtaBanner } from "@/components/trial/TrialCtaBanner"
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context"
import { cn } from "@/lib/utils"

function LayoutInner({ children, userType }: { children: React.ReactNode, userType: "startup" | "regulator" | "admin" }) {
  const { collapsed } = useSidebar()
  return (
    <div
      className={cn(
        "flex flex-1 flex-col transition-all duration-500 ease-out",
        collapsed ? "md:pl-[72px]" : "md:pl-64"
      )}
    >
      {/* @ts-ignore: DashboardHeader handles all these types */}
      <DashboardHeader userType={userType} />
      {userType === "startup" && (
        <>
          <SubscriptionStatusBanner />
          <div className="px-4 pt-1 md:px-6">
            <TrialStatusBanner />
          </div>
        </>
      )}
      {userType === "regulator" && (
        <div className="px-4 pt-4 md:px-6 md:pt-4 space-y-2">
          <TrialStatusBanner />
          <TrialCtaBanner />
        </div>
      )}
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}

export default function SharedDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const role = useAuthStore((state) => state.user?.role)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-background" />
  }

  const userType = role === "REGULATOR" ? "regulator" : role === "ADMIN" ? "admin" : "startup"

  return (
    <AuthGuard allowedRoles={["STARTUP", "ENTERPRISE", "REGULATOR", "ADMIN"]}>
      <SidebarProvider>
        <div className="flex min-h-screen">
          {userType === "admin" ? (
            <AdminSidebar />
          ) : (
            <DashboardSidebar userType={userType} />
          )}
          <LayoutInner userType={userType}>
            {children}
          </LayoutInner>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
