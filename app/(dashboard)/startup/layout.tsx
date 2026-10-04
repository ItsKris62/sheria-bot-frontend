"use client"

import React from "react"
import { AuthGuard } from "@/components/auth-guard"

export default function StartupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard allowedRoles={["STARTUP", "ENTERPRISE", "ADMIN"]}>
      {children}
    </AuthGuard>
  )
}

