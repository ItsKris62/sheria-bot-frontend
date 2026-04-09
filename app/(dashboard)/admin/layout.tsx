"use client"

import React from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
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
      {/* @ts-ignore: DashboardHeader userType will be updated shortly */}
      <DashboardHeader userType="admin" />
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <LayoutInner>{children}</LayoutInner>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
