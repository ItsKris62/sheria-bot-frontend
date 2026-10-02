"use client"

import React from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { SidebarProvider } from "@/lib/sidebar-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <SidebarProvider>
        <DashboardShell
          sidebar={<AdminSidebar />}
          header={<DashboardHeader userType="admin" />}
        >
          {children}
        </DashboardShell>
      </SidebarProvider>
    </AuthGuard>
  )
}

