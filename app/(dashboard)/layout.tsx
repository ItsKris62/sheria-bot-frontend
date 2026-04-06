"use client"

import React from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuthStore } from "@/lib/auth-store"
import { useIdleTimeout } from "@/hooks/use-idle-timeout"
import { SessionTimeoutWarning } from "@/components/session-timeout-warning"

function IdleTimeoutWrapper({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { showWarning, remainingSeconds, resetTimer, logout, isSensitivePage } =
    useIdleTimeout()

  return (
    <>
      {children}
      {isAuthenticated && (
        <SessionTimeoutWarning
          open={showWarning}
          remainingSeconds={remainingSeconds}
          onStayLoggedIn={resetTimer}
          onLogout={logout}
          isSensitivePage={isSensitivePage}
        />
      )}
    </>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <IdleTimeoutWrapper>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </IdleTimeoutWrapper>
    </AuthGuard>
  )
}
