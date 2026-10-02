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
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs text-[var(--portal-text-secondary,#53615A)] hover:bg-[var(--portal-surface-hover,#F0F4F2)] hover:text-[var(--portal-text-primary,#101814)] transition-colors"
          >
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
          <p className="py-6 text-center text-sm text-[var(--portal-text-secondary,#53615A)]">
            We could not load upcoming deadlines right now.
          </p>
        ) : deadlines.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--portal-text-muted,#64766D)]">
            No upcoming compliance deadlines in the next 30 days.
          </p>
        ) : (
          deadlines.map((event) => {
            const dueDate = new Date(event.dueDate)
            const daysUntil = Math.ceil((dueDate.getTime() - referenceTime) / (1000 * 60 * 60 * 24))
            const isUrgent = daysUntil <= 3 && daysUntil > 0
            const isOverdue = daysUntil <= 0
            const priCfg =
              PRIORITY_CONFIG[event.priority as keyof typeof PRIORITY_CONFIG] ??
              PRIORITY_CONFIG["MEDIUM"]

            const dayNum = isNaN(dueDate.getTime()) ? "—" : dueDate.getDate()
            const monthShort = isNaN(dueDate.getTime())
              ? "—"
              : dueDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase()

            return (
              <Link
                key={event.id}
                href="/startup/calendar"
                className="group flex items-center justify-between gap-3.5 rounded-lg border border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface,#FFFFFF)] p-3.5 transition-colors hover:border-[var(--portal-border-strong,#B8C7C0)] hover:bg-[var(--portal-surface-hover,#F0F4F2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--portal-focus,#0A5C36)]"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Calendar Date Block */}
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface-hover,#F0F4F2)] text-center leading-none">
                    <span className="font-mono text-sm font-bold text-[var(--portal-text-primary,#101814)]">
                      {dayNum}
                    </span>
                    <span className="mt-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--portal-text-secondary,#53615A)]">
                      {monthShort}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[var(--portal-text-primary,#101814)] group-hover:text-[var(--portal-accent,#0A5C36)]">
                      {event.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-[var(--portal-text-secondary,#53615A)] truncate">
                      {event.category || event.regulation || "Regulatory Requirement"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <PortalStatusBadge
                    status={isOverdue ? "danger" : isUrgent ? "warning" : "neutral"}
                    className="text-[10px]"
                  >
                    {isOverdue ? "OVERDUE" : `${daysUntil}d left`}
                  </PortalStatusBadge>
                  <span className="font-mono text-[10px] text-[var(--portal-text-muted,#64766D)]">
                    {priCfg.label}
                  </span>
                </div>
              </Link>
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
