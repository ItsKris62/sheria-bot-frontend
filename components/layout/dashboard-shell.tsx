"use client"

import React from "react"
import { useSidebar } from "@/lib/sidebar-context"
import { cn } from "@/lib/utils"

export interface DashboardShellProps {
  /** The desktop & mobile sidebar component */
  sidebar: React.ReactNode
  /** The top bar / header component */
  header: React.ReactNode
  /** Optional top announcement, trial or status banners */
  banners?: React.ReactNode
  /** Primary workspace children content */
  children: React.ReactNode
  /** Additional styling on the inner main container */
  mainClassName?: string
}

/**
 * Presentational shell component for authenticated dashboard layouts.
 * Manages desktop offset transition between expanded (256px) and collapsed (72px) states.
 * Owns ZERO business logic, auth checks, queries, or routing logic.
 */
export function DashboardShell({
  sidebar,
  header,
  banners,
  children,
  mainClassName,
}: DashboardShellProps) {
  const { collapsed } = useSidebar()

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-background">
      {sidebar}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col overflow-x-clip transition-[padding-left] duration-200 ease-out",
          // Mobile: no offset (sidebar is a drawer overlay)
          // Desktop (md+): offset matches collapsed (72px) or expanded (256px)
          collapsed ? "md:pl-[72px]" : "md:pl-64"
        )}
      >
        {header}
        {banners && <div className="min-w-0">{banners}</div>}
        <main className={cn("min-w-0 flex-1 overflow-x-clip p-4 md:p-6", mainClassName)}>
          {children}
        </main>
      </div>
    </div>
  )
}
