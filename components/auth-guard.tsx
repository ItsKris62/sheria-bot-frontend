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
    case "FINTECH_USER":
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

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect to the user's own dashboard
      router.replace(getRoleBasePath(user.role))
    }
  }, [isInitialized, isAuthenticated, user, allowedRoles, router, pathname])

  if (!isInitialized) {
    return <LoadingScreen fullScreen />
  }

  if (!isAuthenticated) {
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

  // Verification link must work for both authed and unauthed users
  const isVerifyEmailPage = pathname === '/verify-email'

  useEffect(() => {
    if (!isInitialized) return

    if (isAuthenticated && user && !isVerifyEmailPage) {
      router.replace(getRoleBasePath(user.role))
    }
  }, [isInitialized, isAuthenticated, user, router, isVerifyEmailPage])

  if (!isInitialized) {
    return <LoadingScreen fullScreen />
  }

  if (isAuthenticated && !isVerifyEmailPage) {
    return null
  }

  return <>{children}</>
}
