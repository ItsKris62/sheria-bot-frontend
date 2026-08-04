import * as React from "react"
import { PortalSurface, PortalSkeleton } from "@/components/portal"

export function DashboardLoadingState() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <PortalSkeleton variant="text" className="h-8 w-64" />
        <PortalSkeleton variant="text" className="h-4 w-96" />
      </div>

      {/* Compliance overview skeleton */}
      <PortalSurface variant="raised" className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <PortalSkeleton variant="text" className="h-6 w-48" />
          <PortalSkeleton variant="button" className="h-10 w-20" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <PortalSkeleton key={i} variant="card" className="h-28" />
          ))}
        </div>
      </PortalSurface>

      {/* Grid skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <PortalSurface variant="raised" className="lg:col-span-2 p-6 space-y-4">
          <PortalSkeleton variant="text" className="h-6 w-40" />
          <PortalSkeleton variant="card" className="h-20" />
          <PortalSkeleton variant="card" className="h-20" />
        </PortalSurface>

        <PortalSurface variant="raised" className="p-6 space-y-4">
          <PortalSkeleton variant="text" className="h-6 w-32" />
          <PortalSkeleton variant="card" className="h-16" />
          <PortalSkeleton variant="card" className="h-16" />
        </PortalSurface>
      </div>
    </div>
  )
}
