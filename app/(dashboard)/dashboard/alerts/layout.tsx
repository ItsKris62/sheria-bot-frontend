"use client"

import { useAuthStore } from "@/lib/auth-store"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { AuthGuard } from "@/components/auth-guard"

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  const role = useAuthStore((s) => s.user?.role)
  const userType =
    role === "REGULATOR" ? "regulator" :
    role === "ADMIN" ? "admin" : "startup"

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader userType={userType} />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
