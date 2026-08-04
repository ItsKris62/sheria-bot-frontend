import * as React from "react"
import { PortalSurface } from "@/components/portal"
import { getComplianceScoreTheme, type ComplianceScoreIcon } from "@/lib/utils/compliance"
import { ShieldCheck, CheckCircle2, Info, AlertCircle, AlertTriangle } from "lucide-react"
import type { DashboardCategory } from "./dashboard-types"

export function ScoreIcon({
  icon,
  color,
  className = "h-5 w-5",
}: {
  icon: ComplianceScoreIcon
  color: string
  className?: string
}) {
  const props = { className, style: { color }, "aria-hidden": true }
  switch (icon) {
    case "shield-check": return <ShieldCheck {...props} />
    case "check-circle": return <CheckCircle2 {...props} />
    case "info": return <Info {...props} />
    case "alert-circle": return <AlertCircle {...props} />
    case "alert-triangle":
    default: return <AlertTriangle {...props} />
  }
}

export interface ComplianceCategoryItemProps {
  category: DashboardCategory
}

export function ComplianceCategoryItem({ category }: ComplianceCategoryItemProps) {
  const theme = getComplianceScoreTheme(category.score)

  return (
    <PortalSurface variant="solid" className="p-4 transition-all hover:border-[var(--portal-border-strong)]">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold tracking-tight" style={{ color: theme.color }}>
          {category.score}%
        </p>
        <ScoreIcon icon={theme.icon} color={theme.color} />
      </div>
      <p className="mt-1 text-xs font-medium text-[var(--portal-text-secondary)] truncate">
        {category.label}
      </p>
      {/* Progress Bar */}
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.max(0, Math.min(100, category.score))}%`,
            backgroundColor: theme.color,
          }}
        />
      </div>
      <p className="mt-2 text-[11px] text-[var(--portal-text-muted)]">
        {category.completedItems}/{category.totalItems} items completed
      </p>
    </PortalSurface>
  )
}
