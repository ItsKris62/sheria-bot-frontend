import * as React from "react"
import { PortalSurface, PortalSkeleton, PortalStatusBadge, type PortalStatusType } from "@/components/portal"
import { cn } from "@/lib/utils"

export interface AdminStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode
  value?: React.ReactNode
  helper?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  status?: PortalStatusType
  badge?: React.ReactNode
  isLoading?: boolean
}

export function AdminStatCard({
  label,
  value,
  helper,
  icon: Icon,
  status = "neutral",
  badge,
  isLoading,
  className,
  ...props
}: AdminStatCardProps) {
  return (
    <PortalSurface className={cn("h-full p-5", className)} {...props}>
      {isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <PortalSkeleton variant="text" className="w-32" />
            <PortalSkeleton variant="button" className="h-10 w-10 rounded-lg" />
          </div>
          <PortalSkeleton variant="text" className="h-8 w-20" />
          <PortalSkeleton variant="text" className="w-full" />
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-[var(--portal-text-secondary)]">{label}</p>
              <p className="mt-2 break-words text-2xl font-bold tabular-nums text-[var(--portal-text-primary)]">
                {value ?? "Not available"}
              </p>
            </div>
            {Icon && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--portal-accent-muted)] text-[var(--portal-accent)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
            )}
          </div>
          <div className="flex items-end justify-between gap-3">
            {helper && <p className="text-sm text-[var(--portal-text-secondary)]">{helper}</p>}
            {badge && (
              <PortalStatusBadge status={status} className="shrink-0">
                {badge}
              </PortalStatusBadge>
            )}
          </div>
        </div>
      )}
    </PortalSurface>
  )
}
