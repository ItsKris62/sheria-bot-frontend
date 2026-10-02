import * as React from "react"
import Link from "next/link"
import { PortalSurface, PortalSectionHeader, PortalStatusBadge, PortalSkeleton } from "@/components/portal"
import { Button } from "@/components/ui/button"
import { Bell, ArrowRight, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { AlertItem } from "./dashboard-types"
import { trackFeatureUsage } from "@/lib/analytics"

export interface RegulatoryAlertsCardProps {
  alerts?: AlertItem[]
  isLoading?: boolean
  isError?: boolean
}

export function RegulatoryAlertsCard({ alerts = [], isLoading, isError }: RegulatoryAlertsCardProps) {
  React.useEffect(() => {
    trackFeatureUsage({
      feature_name: "regulatory_alerts",
      status: "viewed",
    })
  }, [])

  return (
    <PortalSurface variant="raised" className="p-6">
      <PortalSectionHeader
        title="Regulatory Alerts"
        description="Recent regulatory changes affecting your business"
        icon={Bell}
        action={
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs text-[var(--portal-text-secondary,#53615A)] hover:bg-[var(--portal-surface-hover,#F0F4F2)] hover:text-[var(--portal-text-primary,#101814)] transition-colors"
          >
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
            <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
            <p className="text-sm text-[var(--portal-text-secondary,#53615A)]">
              We could not load regulatory alerts right now.
            </p>
          </div>
        ) : alerts.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--portal-text-muted,#64766D)]">
            No active regulatory alerts for your current plan window.
          </p>
        ) : (
          alerts.map((alert) => {
            const severity = alert.severity?.toLowerCase() ?? "low"
            const publishedAt = alert.publishedAt ? new Date(alert.publishedAt) : null
            const statusType =
              severity === "critical" || severity === "high"
                ? "danger"
                : severity === "medium"
                ? "warning"
                : "neutral"

            return (
              <Link
                key={alert.id}
                href={`/dashboard/alerts/${alert.id}`}
                className={`group flex items-start justify-between gap-3.5 rounded-lg border p-3.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--portal-focus,#0A5C36)] ${
                  !alert.isRead
                    ? "border-[var(--portal-accent-border,#A3D9BE)] bg-[var(--portal-accent-muted,#E8F5EE)]/30 hover:bg-[var(--portal-accent-muted,#E8F5EE)]/50"
                    : "border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface,#FFFFFF)] hover:bg-[var(--portal-surface-hover,#F0F4F2)] hover:border-[var(--portal-border-strong,#B8C7C0)]"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Left severity indicator dot */}
                  <div
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                      statusType === "danger"
                        ? "border border-red-200 bg-red-50 text-red-700"
                        : statusType === "warning"
                        ? "border border-amber-200 bg-amber-50 text-amber-700"
                        : "border border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-xs font-semibold text-[var(--portal-text-primary,#101814)] group-hover:text-[var(--portal-accent,#0A5C36)]">
                        {alert.title}
                      </p>
                      {!alert.isRead && (
                        <span
                          className="h-2 w-2 shrink-0 rounded-full bg-[var(--portal-accent,#0A5C36)]"
                          title="Unread"
                        />
                      )}
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--portal-text-secondary,#53615A)]">
                      {alert.summary}
                    </p>

                    <div className="mt-1.5 flex items-center gap-2 font-mono text-[11px] text-[var(--portal-text-muted,#64766D)]">
                      <span className="font-semibold text-[var(--portal-text-secondary,#53615A)]">
                        {alert.regulatoryBody}
                      </span>
                      {publishedAt && (
                        <>
                          <span>·</span>
                          <span>{formatDistanceToNow(publishedAt, { addSuffix: true })}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-center">
                  <PortalStatusBadge status={statusType} className="capitalize text-[10px]">
                    {severity}
                  </PortalStatusBadge>
                  <ArrowRight
                    className="h-4 w-4 text-[var(--portal-text-muted,#64766D)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--portal-accent,#0A5C36)]"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            )
          })
        )}
      </div>
    </PortalSurface>
  )
}
