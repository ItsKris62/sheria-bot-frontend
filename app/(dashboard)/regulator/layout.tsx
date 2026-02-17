import React from "react"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"

export default function RegulatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar userType="regulator" />
      <div className="flex flex-1 flex-col pl-64">
        <DashboardHeader userType="regulator" />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
