import { getComplianceScoreTheme, type ComplianceScoreIcon } from "@/lib/utils/compliance"
import { ShieldCheck, CheckCircle2, Info, AlertCircle, AlertTriangle } from "lucide-react"
import type { DashboardCategory } from "./dashboard-types"

export function ScoreIcon({ icon, color, className = "h-5 w-5" }: { icon: ComplianceScoreIcon; color: string; className?: string }) {
  const props = { className, style: { color }, "aria-hidden": true }
  switch (icon) {
    case "shield-check": return <ShieldCheck {...props} />
    case "check-circle": return <CheckCircle2 {...props} />
    case "info": return <Info {...props} />
    case "alert-circle": return <AlertCircle {...props} />
    default: return <AlertTriangle {...props} />
  }
}

export function ComplianceCategoryItem({ category }: { category: DashboardCategory }) {
  const theme = getComplianceScoreTheme(category.score)
  const score = Math.max(0, Math.min(100, category.score))

  return (
    <div className="group border-b border-[var(--portal-border)] py-4 last:border-b-0 first:pt-0 sm:grid sm:grid-cols-[minmax(170px,0.9fr)_minmax(180px,1.5fr)_auto] sm:items-center sm:gap-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--portal-surface-hover)]" aria-hidden="true">
          <ScoreIcon icon={theme.icon} color={theme.color} className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[var(--portal-text-primary)]">{category.label}</p>
          <p className="text-xs text-[var(--portal-text-muted)]">{category.completedItems}/{category.totalItems} requirements complete</p>
        </div>
      </div>
      <div className="mt-3 sm:mt-0">
        <div className="mb-2 flex items-center justify-between sm:hidden"><span className="text-xs text-[var(--portal-text-muted)]">Posture</span><span className="font-mono text-xs font-semibold" style={{ color: theme.color }}>{score}%</span></div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--portal-border)]" role="progressbar" aria-label={`${category.label} compliance score ${score} out of 100`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}>
          <div className="h-full origin-left animate-score-bar rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none" style={{ width: `${score}%`, backgroundColor: theme.color }} />
        </div>
      </div>
      <div className="hidden items-center justify-end gap-2 sm:flex">
        <span className="font-mono text-sm font-semibold" style={{ color: theme.color }}>{score}%</span>
        <span className="rounded-full px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider" style={{ color: theme.color, backgroundColor: `${theme.color}1A` }}>{theme.label}</span>
      </div>
    </div>
  )
}
