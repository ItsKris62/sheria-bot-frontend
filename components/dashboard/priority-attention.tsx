import * as React from "react"
import Link from "next/link"
import { PortalSurface, PortalSectionHeader, PortalStatusBadge } from "@/components/portal"
import { AlertTriangle, Calendar, Bell, CheckCircle2, ArrowRight } from "lucide-react"
import type { AlertItem, DeadlineItem } from "./dashboard-types"

export interface PriorityAttentionProps {
  deadlines?: DeadlineItem[]
  alerts?: AlertItem[]
  deadlinesUpdatedAt?: number
}

export function PriorityAttention({
  deadlines = [],
  alerts = [],
  deadlinesUpdatedAt,
}: PriorityAttentionProps) {
  const [fallbackReferenceTime] = React.useState(() => Date.now())
  const referenceTime = deadlinesUpdatedAt ?? fallbackReferenceTime

  // Select urgent deadlines (<= 3 days left or overdue)
  const urgentDeadlines = deadlines.filter((item) => {
    const dueDate = new Date(item.dueDate)
    const daysUntil = Math.ceil((dueDate.getTime() - referenceTime) / (1000 * 60 * 60 * 24))
    return daysUntil <= 3
  })

  // Select critical unread alerts
  const criticalAlerts = alerts.filter((alert) => {
    const sev = alert.severity?.toLowerCase()
    return (sev === "critical" || sev === "high") && !alert.isRead
  })

  const totalUrgentCount = urgentDeadlines.length + criticalAlerts.length

  if (totalUrgentCount === 0) {
    return (
      <PortalSurface
        variant="raised"
        className="flex items-center gap-3.5 border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface,#FFFFFF)] p-4"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-700">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--portal-text-primary,#101814)]">
            No urgent items requiring immediate action
          </p>
          <p className="text-xs text-[var(--portal-text-secondary,#53615A)]">
            All critical regulatory alerts and upcoming deadlines are up to date.
          </p>
        </div>
      </PortalSurface>
    )
  }

  return (
    <PortalSurface
      variant="raised"
      className="flex h-full flex-col justify-between border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface,#FFFFFF)] p-6"
    >
      <div>
        <PortalSectionHeader
          title="Priority Attention Required"
          description={`${totalUrgentCount} urgent compliance ${
            totalUrgentCount === 1 ? "item requires" : "items require"
          } action`}
          icon={AlertTriangle}
          className="pb-3 border-b border-[var(--portal-border,#E2E8E5)]"
        />

        <div className="mt-4 flex flex-col gap-2.5">
          {/* Urgent Deadlines */}
          {urgentDeadlines.map((item) => {
            const dueDate = new Date(item.dueDate)
            const daysUntil = Math.ceil((dueDate.getTime() - referenceTime) / (1000 * 60 * 60 * 24))
            const isOverdue = daysUntil <= 0

            return (
              <Link
                key={item.id}
                href="/startup/calendar"
                className="group flex items-center justify-between gap-3 rounded-lg border border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface,#FFFFFF)] p-3 transition-colors hover:border-amber-400 hover:bg-[var(--portal-surface-hover,#F0F4F2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--portal-focus,#0A5C36)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-amber-700">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[var(--portal-text-primary,#101814)] group-hover:text-[var(--portal-accent,#0A5C36)]">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[var(--portal-text-secondary,#53615A)]">
                      Due {dueDate.toLocaleDateString("en-KE", { dateStyle: "medium" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <PortalStatusBadge status={isOverdue ? "danger" : "warning"}>
                    {isOverdue ? "OVERDUE" : `${daysUntil}d left`}
                  </PortalStatusBadge>
                  <span className="hidden sm:inline-flex items-center text-xs font-medium text-[var(--portal-text-muted,#64766D)] group-hover:text-[var(--portal-accent,#0A5C36)]">
                    View
                    <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            )
          })}

          {/* Critical Unread Alerts */}
          {criticalAlerts.map((alert) => (
            <Link
              key={alert.id}
              href={`/dashboard/alerts/${alert.id}`}
              className="group flex items-center justify-between gap-3 rounded-lg border border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface,#FFFFFF)] p-3 transition-colors hover:border-red-400 hover:bg-[var(--portal-surface-hover,#F0F4F2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--portal-focus,#0A5C36)]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700">
                  <Bell className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[var(--portal-text-primary,#101814)] group-hover:text-red-700">
                    {alert.title}
                  </p>
                  <p className="truncate text-[11px] text-[var(--portal-text-secondary,#53615A)]">
                    {alert.regulatoryBody}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <PortalStatusBadge status="danger">
                  Critical Alert
                </PortalStatusBadge>
                <span className="hidden sm:inline-flex items-center text-xs font-medium text-[var(--portal-text-muted,#64766D)] group-hover:text-red-700">
                  Review
                  <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PortalSurface>
  )
}
