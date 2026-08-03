import * as React from "react"
import Link from "next/link"
import { PortalSurface, PortalSectionHeader, PortalStatusBadge } from "@/components/portal"
import { AlertTriangle, Calendar, Bell, ArrowRight, CheckCircle2 } from "lucide-react"
import type { AlertItem, DeadlineItem } from "./dashboard-types"

export interface PriorityAttentionProps {
  deadlines?: DeadlineItem[]
  alerts?: AlertItem[]
  deadlinesUpdatedAt?: number
}

export function PriorityAttention({
  deadlines = [],
  alerts = [],
  deadlinesUpdatedAt = Date.now(),
}: PriorityAttentionProps) {
  // Select urgent deadlines (<= 3 days left or overdue)
  const urgentDeadlines = deadlines.filter((item) => {
    const dueDate = new Date(item.dueDate)
    const daysUntil = Math.ceil((dueDate.getTime() - deadlinesUpdatedAt) / (1000 * 60 * 60 * 24))
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
      <PortalSurface variant="raised" className="p-4 bg-green-500/5 border-green-500/20">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--portal-text-primary)]">
              No urgent items requiring immediate action
            </p>
            <p className="text-xs text-[var(--portal-text-secondary)]">
              All critical regulatory alerts and upcoming deadlines are up to date.
            </p>
          </div>
        </div>
      </PortalSurface>
    )
  }

  return (
    <PortalSurface variant="raised" className="p-6 border-amber-500/30 bg-amber-500/5">
      <PortalSectionHeader
        title="Priority Attention Required"
        description={`${totalUrgentCount} urgent compliance ${totalUrgentCount === 1 ? "item requires" : "items require"} action`}
        icon={AlertTriangle}
        className="pb-3"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Urgent Deadlines */}
        {urgentDeadlines.map((item) => {
          const dueDate = new Date(item.dueDate)
          const daysUntil = Math.ceil((dueDate.getTime() - deadlinesUpdatedAt) / (1000 * 60 * 60 * 24))
          const isOverdue = daysUntil <= 0

          return (
            <Link
              key={item.id}
              href="/startup/calendar"
              className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-[var(--portal-surface-solid)] p-3.5 transition-colors hover:border-amber-500/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <Calendar className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--portal-text-primary)] truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-[var(--portal-text-muted)]">
                  {dueDate.toLocaleDateString("en-KE", { dateStyle: "medium" })}
                </p>
              </div>
              <PortalStatusBadge status={isOverdue ? "danger" : "warning"}>
                {isOverdue ? "OVERDUE" : `${daysUntil}d left`}
              </PortalStatusBadge>
            </Link>
          )
        })}

        {/* Critical Unread Alerts */}
        {criticalAlerts.map((alert) => (
          <Link
            key={alert.id}
            href={`/dashboard/alerts/${alert.id}`}
            className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-[var(--portal-surface-solid)] p-3.5 transition-colors hover:border-red-500/60"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <Bell className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--portal-text-primary)] truncate">
                {alert.title}
              </p>
              <p className="text-[11px] text-[var(--portal-text-muted)] truncate">
                {alert.regulatoryBody}
              </p>
            </div>
            <PortalStatusBadge status="danger">
              Critical Alert
            </PortalStatusBadge>
          </Link>
        ))}
      </div>
    </PortalSurface>
  )
}
