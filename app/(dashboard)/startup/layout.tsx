"use client"

import React from "react"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { AuthGuard } from "@/components/auth-guard"

export default function StartupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard allowedRoles={["STARTUP", "ENTERPRISE", "FINTECH_USER", "ADMIN"]}>
      <div className="flex min-h-screen">
        <DashboardSidebar userType="startup" />
        <div className="flex flex-1 flex-col pl-64">
          <DashboardHeader userType="startup" />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
