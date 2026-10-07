import * as React from "react"
import { AlertCircle, ShieldCheck } from "lucide-react"
import { PortalSectionHeader, PortalSkeleton, PortalSurface } from "@/components/portal"
import { ComplianceCategoryItem } from "./compliance-category-item"
import { ComplianceScoreGauge } from "./compliance-score-gauge"
import type { DashboardData } from "./dashboard-types"

export interface ComplianceOverviewProps {
  data?: any | null
  isLoading?: boolean
  isError?: boolean
  onReviewCategory?: (categoryKey: string) => void
}

export function ComplianceOverview({
  data,
  isLoading,
  isError,
  onReviewCategory,
}: ComplianceOverviewProps) {
  if (isLoading) {
    return (
      <PortalSurface variant="raised" className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <PortalSkeleton variant="text" className="h-6 w-48" />
            <PortalSkeleton variant="text" className="h-4 w-72" />
          </div>
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <PortalSkeleton variant="card" className="mx-auto size-44 rounded-xl" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <PortalSkeleton key={i} variant="card" className="h-14" />
              ))}
            </div>
          </div>
        </div>
      </PortalSurface>
    )
  }

  if (isError || !data) {
    return (
      <PortalSurface
        variant="raised"
        className="border-red-500/20 bg-red-500/5 p-8 text-center"
      >
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-600" aria-hidden="true" />
        <p className="font-semibold text-[var(--portal-text-primary,#101814)]">
          Unable to load compliance posture
        </p>
        <p className="mt-1 text-sm text-[var(--portal-text-secondary,#53615A)]">
          We could not load your regulatory score right now. Please refresh to try again.
        </p>
      </PortalSurface>
    )
  }

  return (
    <PortalSurface variant="raised" className="p-6 lg:p-7">
      <div className="flex flex-col gap-2 border-b border-[var(--portal-border,#E2E8E5)] pb-5 sm:flex-row sm:items-start sm:justify-between">
        <PortalSectionHeader
          title="Compliance Posture"
          description="Your regulatory health across tracked requirements"
          icon={ShieldCheck}
          className="pb-0"
        />
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-md border border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface-hover,#F0F4F2)] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--portal-text-secondary,#53615A)]">
            {data.categories.length} Areas Monitored
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-start">
        {/* Left Column: Overall Score Gauge */}
        <ComplianceScoreGauge data={data} />

        {/* Right Column: Category Rows */}
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between border-b border-[var(--portal-border,#E2E8E5)] pb-2">
            <div>
              <h3 className="text-sm font-semibold text-[var(--portal-text-primary,#101814)]">
                Regulatory Areas
              </h3>
              <p className="text-xs text-[var(--portal-text-secondary,#53615A)]">
                Compare posture and requirements completion at a glance
              </p>
            </div>
            <span className="font-mono text-xs text-[var(--portal-text-muted,#64766D)]">
              Weight: Balanced
            </span>
          </div>

          {data.categories.length > 0 ? (
            <div className="space-y-1">
              {data.categories.map((category: any) => (
                <ComplianceCategoryItem
                  key={category.key || category.category}
                  category={{
                    key: category.key || category.category,
                    label: category.label || category.categoryName,
                    score: category.score,
                    completedItems: category.completedItems || category.compliantItems || 0,
                    totalItems: category.totalItems || 0,
                    assessedItems: category.assessedItems,
                    reviewStatus: category.reviewStatus,
                  }}
                  onReview={onReviewCategory}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[var(--portal-border,#E2E8E5)] p-6 text-center">
              <p className="text-sm font-medium text-[var(--portal-text-primary,#101814)]">
                No regulatory areas tracked yet
              </p>
              <p className="mt-1 text-xs text-[var(--portal-text-secondary,#53615A)]">
                Complete baseline compliance checklist items to populate your score.
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalSurface>
  )
}
