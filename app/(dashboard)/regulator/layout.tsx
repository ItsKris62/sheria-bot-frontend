"use client"

import React from "react"
import { AuthGuard } from "@/components/auth-guard"

export default function RegulatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard allowedRoles={["REGULATOR", "ADMIN"]}>
      {children}
    </AuthGuard>
  )
}
