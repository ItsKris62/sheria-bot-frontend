import * as React from "react"
import { getComplianceScoreTheme, type ComplianceScoreIcon } from "@/lib/utils/compliance"
import { ShieldCheck, CheckCircle2, Info, AlertCircle, AlertTriangle } from "lucide-react"
import type { DashboardCategory } from "./dashboard-types"

export function ScoreIcon({
  icon,
  color,
  className = "h-4 w-4",
}: {
  icon: ComplianceScoreIcon
  color: string
  className?: string
}) {
  const props = { className, style: { color }, "aria-hidden": true }
  switch (icon) {
    case "shield-check":
      return <ShieldCheck {...props} />
    case "check-circle":
      return <CheckCircle2 {...props} />
    case "info":
      return <Info {...props} />
    case "alert-circle":
      return <AlertCircle {...props} />
    default:
      return <AlertTriangle {...props} />
  }
}

export function ComplianceCategoryItem({ category }: { category: DashboardCategory }) {
  const theme = getComplianceScoreTheme(category.score)
  const score = Math.max(0, Math.min(100, Math.round(category.score)))

  return (
    <div className="group border-b border-[var(--portal-border,#E2E8E5)] py-3.5 last:border-b-0 first:pt-0 sm:grid sm:grid-cols-[minmax(180px,1.1fr)_minmax(180px,1.5fr)_auto] sm:items-center sm:gap-6">
      {/* Category Name & Met Count */}
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface-hover,#F0F4F2)]"
          aria-hidden="true"
        >
          <ScoreIcon icon={theme.icon} color={theme.color} className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--portal-text-primary,#101814)]">
            {category.label}
          </p>
          <p className="text-xs text-[var(--portal-text-secondary,#53615A)]">
            {category.completedItems} of {category.totalItems} requirements complete
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-2.5 sm:mt-0">
        <div className="mb-1.5 flex items-center justify-between sm:hidden">
          <span className="text-xs text-[var(--portal-text-muted,#64766D)]">Compliance Score</span>
          <span className="font-mono text-xs font-semibold text-[var(--portal-text-primary,#101814)]">
            {score}%
          </span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-[var(--portal-border,#E2E8E5)]"
          role="progressbar"
          aria-label={`${category.label} compliance score ${score} out of 100`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={score}
        >
          <div
            className="h-full origin-left rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
            style={{ width: `${score}%`, backgroundColor: theme.color }}
          />
        </div>
      </div>

      {/* Score and Status Pill (Desktop) */}
      <div className="hidden items-center justify-end gap-2.5 sm:flex">
        <span className="font-mono text-sm font-semibold text-[var(--portal-text-primary,#101814)]">
          {score}%
        </span>
        <span
          className="rounded-md border border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface-hover,#F0F4F2)] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--portal-text-secondary,#53615A)]"
        >
          {theme.label}
        </span>
      </div>
    </div>
  )
}
