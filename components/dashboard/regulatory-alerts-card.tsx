import * as React from "react"
import Link from "next/link"
import { PortalSurface, PortalSectionHeader, PortalStatusBadge, PortalSkeleton } from "@/components/portal"
import { Button } from "@/components/ui/button"
import { Bell, ArrowRight, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { AlertItem } from "./dashboard-types"

export interface RegulatoryAlertsCardProps {
  alerts?: AlertItem[]
  isLoading?: boolean
  isError?: boolean
}

export function RegulatoryAlertsCard({ alerts = [], isLoading, isError }: RegulatoryAlertsCardProps) {
  return (
    <PortalSurface variant="raised" className="p-6">
      <PortalSectionHeader
        title="Regulatory Alerts"
        description="Recent regulatory changes affecting your business"
        icon={Bell}
        action={
          <Button variant="ghost" size="sm" asChild className="text-xs text-[var(--portal-text-secondary)] hover:text-white">
            <Link href="/dashboard/alerts">
              View all
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <>
            <PortalSkeleton variant="card" className="h-20" />
            <PortalSkeleton variant="card" className="h-20" />
            <PortalSkeleton variant="card" className="h-20" />
          </>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
            <AlertCircle className="h-6 w-6 text-red-400" aria-hidden="true" />
            <p className="text-sm text-[var(--portal-text-secondary)]">We could not load regulatory alerts right now.</p>
          </div>
        ) : alerts.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--portal-text-muted)]">
            No active regulatory alerts for your current plan window.
          </p>
        ) : (
          alerts.map((alert) => {
            const severity = alert.severity?.toLowerCase() ?? "low"
            const publishedAt = alert.publishedAt ? new Date(alert.publishedAt) : null
            const statusType = severity === "critical" || severity === "high" ? "danger" : severity === "medium" ? "warning" : "info"

            return (
              <Link
                key={alert.id}
                href={`/dashboard/alerts/${alert.id}`}
                className={`flex items-start gap-3.5 rounded-lg border p-3.5 transition-colors ${
                  !alert.isRead
                    ? "border-[var(--portal-accent-border)] bg-[var(--portal-accent-muted)]/30"
                    : "border-[var(--portal-border)] bg-[var(--portal-surface-solid)]"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    statusType === "danger"
                      ? "bg-red-500/10 text-red-400"
                      : statusType === "warning"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-blue-500/10 text-blue-400"
                  }`}
                >
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-[var(--portal-text-primary)] truncate">
                      {alert.title}
                    </p>
                    {!alert.isRead && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--portal-accent)]" title="Unread" />
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--portal-text-secondary)]">
                    {alert.summary}
                  </p>
                  <p className="mt-1.5 text-[11px] text-[var(--portal-text-muted)]">
                    {alert.regulatoryBody}
                    {publishedAt ? ` · ${formatDistanceToNow(publishedAt, { addSuffix: true })}` : ""}
                  </p>
                </div>
                <PortalStatusBadge status={statusType} className="shrink-0 text-[10px]">
                  {severity}
                </PortalStatusBadge>
              </Link>
            )
          })
        )}
      </div>
    </PortalSurface>
  )
}
