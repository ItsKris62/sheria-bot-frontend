import type { ReactNode } from "react"
import { AuthGuard } from "@/components/auth-guard"

export default function SharedDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <AuthGuard allowedRoles={["STARTUP", "ENTERPRISE", "REGULATOR", "ADMIN"]}>
      {children}
    </AuthGuard>
  )
}
