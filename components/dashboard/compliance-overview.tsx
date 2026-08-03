import * as React from "react"
import { PortalSurface, PortalSectionHeader, PortalStatusBadge, PortalSkeleton } from "@/components/portal"
import { getComplianceScoreTheme } from "@/lib/utils/compliance"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TrendingUp, TrendingDown, Minus, ShieldCheck, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ComplianceCategoryItem } from "./compliance-category-item"
import type { DashboardData } from "./dashboard-types"

export interface ComplianceOverviewProps {
  data?: DashboardData | null
  isLoading?: boolean
  isError?: boolean
}

export function ComplianceOverview({ data, isLoading, isError }: ComplianceOverviewProps) {
  if (isLoading) {
    return (
      <PortalSurface variant="raised" className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <PortalSkeleton variant="text" className="w-48 h-6" />
            <PortalSkeleton variant="text" className="w-64 h-4" />
          </div>
          <PortalSkeleton variant="button" className="w-20 h-10" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <PortalSkeleton key={i} variant="card" className="h-28" />
          ))}
        </div>
      </PortalSurface>
    )
  }

  if (isError || !data) {
    return (
      <PortalSurface variant="raised" className="p-8 text-center border-red-500/30">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" aria-hidden="true" />
        <p className="font-semibold text-[var(--portal-text-primary)]">Unable to load compliance posture</p>
        <p className="text-sm text-[var(--portal-text-secondary)] mt-1">
          We could not load your regulatory score right now. Please refresh to try again.
        </p>
      </PortalSurface>
    )
  }

  const overallTheme = getComplianceScoreTheme(data.overallScore)
  const trend = data.trend

  return (
    <PortalSurface variant="raised" className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between pb-6 border-b border-[var(--portal-border)]">
        <div>
          <PortalSectionHeader
            title="Compliance Posture"
            description="Weighted regulatory compliance status based on tracked checklist progress"
            icon={ShieldCheck}
            className="pb-0"
          />
        </div>
        <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p
                  className="text-4xl font-extrabold tracking-tight cursor-help focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] rounded px-1"
                  style={{ color: overallTheme.color }}
                  tabIndex={0}

                >
                  {data.overallScore}%
                </p>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs text-xs leading-relaxed bg-[var(--portal-surface-solid)] text-[var(--portal-text-primary)] border border-[var(--portal-border)]">
                Weighted calculation: Data Protection (25%), AML/KYC (25%), CBK Licensing (20%), Consumer Protection (15%), Cybersecurity (15%).
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Trend indicator */}
          {trend?.label === "increase" && trend.points !== null && (
            <PortalStatusBadge status="success" icon={TrendingUp}>
              +{trend.points} pts vs 30d ago
            </PortalStatusBadge>
          )}
          {trend?.label === "decrease" && trend.points !== null && (
            <PortalStatusBadge status="danger" icon={TrendingDown}>
              {trend.points} pts vs 30d ago
            </PortalStatusBadge>
          )}
          {trend?.label === "no_change" && (
            <PortalStatusBadge status="neutral" icon={Minus}>
              No change vs 30d ago
            </PortalStatusBadge>
          )}
          {trend?.label === "insufficient_history" && (
            <PortalStatusBadge status="neutral" icon={Minus}>
              Building history...
            </PortalStatusBadge>
          )}

          {data.lastUpdated && (
            <p className="text-[10px] text-[var(--portal-text-muted)] mt-1">
              Updated {formatDistanceToNow(new Date(data.lastUpdated), { addSuffix: true })}
            </p>
          )}
        </div>
      </div>

      {/* Category breakdown grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {data.categories.map((category) => (
          <ComplianceCategoryItem key={category.key} category={category} />
        ))}
      </div>
    </PortalSurface>
  )
}
