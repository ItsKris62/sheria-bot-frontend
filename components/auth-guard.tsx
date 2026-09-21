"use client"

import React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import type { UserRole } from "@/lib/auth-store"
import { LoadingScreen } from "@/components/loading-screen"

interface AuthGuardProps {
  children: React.ReactNode
  /** If set, only these roles can access the page */
  allowedRoles?: UserRole[]
}

/** Map role to the dashboard base path it should access */
function getRoleBasePath(role: UserRole): string {
  switch (role) {
    case "REGULATOR":
      return "/regulator"
    case "ADMIN":
      return "/admin"
    case "ENTERPRISE":
    case "STARTUP":
    default:
      return "/startup"
  }
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isInitialized, user } = useAuthStore()

  useEffect(() => {
    if (!isInitialized) return

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    if (user?.mustChangePassword && pathname !== "/change-password") {
      router.replace("/change-password")
      return
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect to the user's own dashboard
      router.replace(getRoleBasePath(user.role))
    }
function DashboardShellSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col antialiased text-foreground" aria-busy="true" aria-live="polite">
      {/* Top navigation skeleton */}
      <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="h-7 w-32 bg-muted/60 rounded-md animate-pulse" />
          <div className="h-4 w-20 bg-muted/40 rounded animate-pulse hidden sm:block" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-24 bg-muted/40 rounded-lg animate-pulse hidden sm:block" />
          <div className="h-8 w-8 rounded-full bg-muted/60 animate-pulse" />
        </div>
      </header>

      {/* Main layout skeleton */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar skeleton */}
        <aside className="w-64 border-r border-border/40 bg-muted/10 p-4 space-y-4 hidden md:block">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted/40 rounded animate-pulse mb-3" />
            <div className="h-9 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-9 bg-muted/30 rounded-lg animate-pulse" />
            <div className="h-9 bg-muted/30 rounded-lg animate-pulse" />
            <div className="h-9 bg-muted/30 rounded-lg animate-pulse" />
          </div>
          <div className="pt-6 space-y-2 border-t border-border/30">
            <div className="h-4 w-20 bg-muted/40 rounded animate-pulse mb-3" />
            <div className="h-9 bg-muted/30 rounded-lg animate-pulse" />
            <div className="h-9 bg-muted/30 rounded-lg animate-pulse" />
          </div>
        </aside>

        {/* Content area skeleton */}
        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 w-48 sm:w-64 bg-muted/60 rounded-lg animate-pulse" />
              <div className="h-4 w-60 sm:w-80 bg-muted/40 rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-muted/50 rounded-lg animate-pulse" />
          </div>

          {/* Metric cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-32 bg-muted/25 border border-border/30 rounded-xl p-5 space-y-3 animate-pulse">
              <div className="h-4 w-24 bg-muted/40 rounded" />
              <div className="h-8 w-16 bg-muted/60 rounded" />
            </div>
            <div className="h-32 bg-muted/25 border border-border/30 rounded-xl p-5 space-y-3 animate-pulse">
              <div className="h-4 w-28 bg-muted/40 rounded" />
              <div className="h-8 w-20 bg-muted/60 rounded" />
            </div>
            <div className="h-32 bg-muted/25 border border-border/30 rounded-xl p-5 space-y-3 animate-pulse">
              <div className="h-4 w-32 bg-muted/40 rounded" />
              <div className="h-8 w-24 bg-muted/60 rounded" />
            </div>
          </div>

          {/* Main card skeleton */}
          <div className="h-72 bg-muted/20 border border-border/30 rounded-xl p-6 space-y-4 animate-pulse">
            <div className="h-5 w-40 bg-muted/50 rounded" />
            <div className="h-4 w-full bg-muted/30 rounded" />
            <div className="h-4 w-5/6 bg-muted/30 rounded" />
            <div className="h-4 w-3/4 bg-muted/30 rounded" />
          </div>
        </main>
      </div>
    </div>
  )
}

function AuthFormSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 border border-border/40 rounded-2xl bg-card shadow-sm space-y-6 animate-pulse">
        <div className="h-8 w-36 bg-muted/60 rounded mx-auto" />
        <div className="h-4 w-56 bg-muted/40 rounded mx-auto" />
        <div className="space-y-4 pt-4">
          <div className="h-10 bg-muted/30 rounded-lg" />
          <div className="h-10 bg-muted/30 rounded-lg" />
          <div className="h-11 bg-muted/60 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isInitialized, user } = useAuthStore()

  useEffect(() => {
    if (!isInitialized) return

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    if (user?.mustChangePassword && pathname !== "/change-password") {
      router.replace("/change-password")
      return
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace(getRoleBasePath(user.role))
    }
  }, [isInitialized, isAuthenticated, user, allowedRoles, router, pathname])

  if (!isInitialized) {
    return <DashboardShellSkeleton />
  }

  if (!isAuthenticated) {
    return null
  }

  if (user?.mustChangePassword && pathname !== "/change-password") {
    return null
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}

/** Redirect authenticated users away from auth pages.
 *  Exception: /verify-email must remain accessible to authenticated users
 *  so they can confirm their email even after logging in. */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isInitialized, user } = useAuthStore()

  const isVerifyEmailPage = pathname === '/verify-email'

  useEffect(() => {
    if (!isInitialized) return

    if (isAuthenticated && user?.mustChangePassword && pathname !== "/change-password") {
      router.replace("/change-password")
      return
    }

    if (isAuthenticated && user && !isVerifyEmailPage && pathname !== "/change-password") {
      router.replace(getRoleBasePath(user.role))
    }
  }, [isInitialized, isAuthenticated, user, router, isVerifyEmailPage, pathname])

  if (!isInitialized) {
    return <AuthFormSkeleton />
  }

  if (isAuthenticated && !isVerifyEmailPage && pathname !== "/change-password") {
    return null
  }

  return <>{children}</>
}
