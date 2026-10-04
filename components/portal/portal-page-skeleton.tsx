import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { PortalSkeleton } from "./portal-skeleton"

interface PortalLoadingRegionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  label?: string
}

export function PortalLoadingRegion({
  children,
  className,
  label = "Loading page content",
  ...props
}: PortalLoadingRegionProps) {
  return (
    <section
      {...props}
      aria-busy="true"
      aria-label={label}
      className={cn("space-y-6", className)}
    >
      <span className="sr-only" role="status">{label}</span>
      {children}
    </section>
  )
}

export function PortalPageHeaderSkeleton({ showAction = true }: { showAction?: boolean }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <PortalSkeleton variant="text" className="h-8 w-56 max-w-full" />
        <PortalSkeleton variant="text" className="h-4 w-80 max-w-full" />
      </div>
      {showAction ? <PortalSkeleton variant="button" className="h-10 w-36" /> : null}
    </div>
  )
}

export function PortalMetricGridSkeleton({
  count = 4,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5"
        >
          <div className="flex items-center justify-between">
            <PortalSkeleton variant="text" className="w-28" />
            <PortalSkeleton variant="avatar" className="h-9 w-9 rounded-lg" />
          </div>
          <PortalSkeleton variant="text" className="h-8 w-20" />
          <PortalSkeleton variant="text" className="w-36" />
        </div>
      ))}
    </div>
  )
}

export function PortalFilterBarSkeleton({ controls = 3 }: { controls?: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-4 lg:flex-row">
      <PortalSkeleton variant="button" className="h-10 min-w-0 flex-1 lg:max-w-sm" />
      {Array.from({ length: controls }).map((_, index) => (
        <PortalSkeleton key={index} variant="button" className="h-10 w-full lg:w-40" />
      ))}
    </div>
  )
}

export function PortalTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)]">
      <div className="flex gap-4 border-b border-[var(--portal-divider)] px-4 py-3">
        <PortalSkeleton variant="text" className="w-1/3" />
        <PortalSkeleton variant="text" className="hidden w-1/5 sm:block" />
        <PortalSkeleton variant="text" className="ml-auto w-20" />
      </div>
      <div className="divide-y divide-[var(--portal-divider)]">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex min-h-14 items-center gap-4 px-4 py-3">
            <PortalSkeleton variant="avatar" className="h-8 w-8 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <PortalSkeleton variant="text" className="w-2/3 max-w-xs" />
              <PortalSkeleton variant="text" className="h-3 w-1/3 max-w-40" />
            </div>
            <PortalSkeleton variant="button" className="h-7 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function PortalListSkeleton({
  rows = 4,
  rowClassName,
}: {
  rows?: number
  rowClassName?: string
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "flex min-h-20 items-center gap-4 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-4",
            rowClassName
          )}
        >
          <PortalSkeleton variant="avatar" className="h-10 w-10 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <PortalSkeleton variant="text" className="w-2/3 max-w-md" />
            <PortalSkeleton variant="text" className="h-3 w-1/2 max-w-xs" />
          </div>
          <PortalSkeleton variant="button" className="hidden h-8 w-24 sm:block" />
        </div>
      ))}
    </div>
  )
}

export function PortalPanelSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5", className)}>
      <PortalSkeleton variant="text" className="h-6 w-44" />
      <PortalSkeleton variant="text" className="w-3/4" />
      <PortalSkeleton variant="card" className="h-44" />
    </div>
  )
}
