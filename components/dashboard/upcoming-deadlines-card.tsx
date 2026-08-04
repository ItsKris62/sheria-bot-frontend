import * as React from "react"
import Link from "next/link"
import { FeatureGate, LockedFeatureCard } from "@/components/plan/feature-gate"
import { PortalSurface, PortalSectionHeader, PortalStatusBadge, PortalSkeleton } from "@/components/portal"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import { PRIORITY_CONFIG } from "@/lib/calendar-config"
import type { DeadlineItem } from "./dashboard-types"

export interface UpcomingDeadlinesCardProps {
  deadlines?: DeadlineItem[]
  isLoading?: boolean
  isError?: boolean
  deadlinesUpdatedAt?: number
}

function UpcomingDeadlinesContent({
  deadlines = [],
  isLoading,
  isError,
  deadlinesUpdatedAt,
}: UpcomingDeadlinesCardProps) {
  const [fallbackReferenceTime] = React.useState(() => Date.now())
  const referenceTime = deadlinesUpdatedAt ?? fallbackReferenceTime

  return (
    <PortalSurface variant="raised" className="p-6">
      <PortalSectionHeader
        title="Upcoming Deadlines"
        description="Don't miss these important dates"
        icon={Calendar}
        action={
          <Button variant="ghost" size="sm" asChild className="text-xs text-[var(--portal-text-secondary)] hover:text-white">
            <Link href="/startup/calendar">
              View all
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <>
            <PortalSkeleton variant="card" className="h-16" />
            <PortalSkeleton variant="card" className="h-16" />
            <PortalSkeleton variant="card" className="h-16" />
          </>
        ) : isError ? (
          <p className="py-6 text-center text-sm text-[var(--portal-text-secondary)]">
            We could not load upcoming deadlines right now.
          </p>
        ) : deadlines.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--portal-text-muted)]">
            No upcoming compliance deadlines in the next 30 days.
          </p>
        ) : (
          deadlines.map((event) => {
            const dueDate = new Date(event.dueDate)
            const daysUntil = Math.ceil((dueDate.getTime() - referenceTime) / (1000 * 60 * 60 * 24))
            const isUrgent = daysUntil <= 3 && daysUntil > 0
            const isOverdue = daysUntil <= 0
            const priCfg = PRIORITY_CONFIG[event.priority as keyof typeof PRIORITY_CONFIG]
              ?? PRIORITY_CONFIG["MEDIUM"]

            return (
              <div
                key={event.id}
                className={`flex items-center gap-3.5 rounded-lg border p-3.5 transition-colors ${
                  isUrgent
                    ? "border-amber-500/40 bg-amber-500/5"
                    : isOverdue
                    ? "border-red-500/40 bg-red-500/5"
                    : "border-[var(--portal-border)] bg-[var(--portal-surface-solid)]"
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/30">
                  <Calendar className={`h-4 w-4 ${isUrgent ? "text-amber-400" : isOverdue ? "text-red-400" : "text-[var(--portal-text-secondary)]"}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--portal-text-primary)] truncate">
                    {event.title}
                  </p>
                  <p className="text-[11px] text-[var(--portal-text-muted)]">
                    {dueDate.toLocaleDateString("en-KE", { dateStyle: "medium" })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <PortalStatusBadge status={isOverdue ? "danger" : isUrgent ? "warning" : "info"} className="text-[10px]">
                    {isOverdue ? "OVERDUE" : `${daysUntil}d left`}
                  </PortalStatusBadge>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${priCfg.color}`}>
                    {priCfg.label}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </PortalSurface>
  )
}

export function UpcomingDeadlinesCard(props: UpcomingDeadlinesCardProps) {
  return (
    <FeatureGate
      feature="complianceCalendar"
      fallback={
        <LockedFeatureCard
          feature="complianceCalendar"
          title="Upcoming Deadlines"
          description="Track upcoming regulatory deadlines. Available on the Business plan and above."
          requiredPlan="BUSINESS"
        />
      }
    >
      <UpcomingDeadlinesContent {...props} />
    </FeatureGate>
  )
}
