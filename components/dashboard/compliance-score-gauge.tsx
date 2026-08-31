import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { getComplianceScoreTheme } from "@/lib/utils/compliance"
import { PortalStatusBadge } from "@/components/portal"
import type { DashboardData } from "./dashboard-types"
import { ScoreIcon } from "./compliance-category-item"

export function ComplianceScoreGauge({ data }: { data: DashboardData }) {
  const theme = getComplianceScoreTheme(data.overallScore)
  const score = Math.max(0, Math.min(100, data.overallScore))
  const circumference = 2 * Math.PI * 62
  const trend = data.trend
  const trendIcon = trend?.label === "increase" ? TrendingUp : trend?.label === "decrease" ? TrendingDown : Minus
  const trendStatus = trend?.label === "increase" ? "success" : trend?.label === "decrease" ? "danger" : "neutral"

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-background)]/50 px-6 py-7 text-center sm:px-8">
      <div className="relative size-44" role="img" aria-label={`Overall compliance score ${score} out of 100, ${theme.label}`}>
        <svg className="size-full -rotate-90" viewBox="0 0 144 144" aria-hidden="true">
          <circle cx="72" cy="72" r="62" fill="none" stroke="var(--portal-border)" strokeWidth="10" />
          <circle
            cx="72" cy="72" r="62" fill="none" stroke={theme.color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={circumference - (score / 100) * circumference}
            className="animate-score-ring transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
            style={{ filter: `drop-shadow(0 0 8px ${theme.color}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-semibold tracking-[-0.06em]" style={{ color: theme.color }}>{score}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--portal-text-muted)]">/ 100</span>
          <span className="sr-only">{score}%</span>
        </div>
      </div>
      <div className="flex items-center gap-2" style={{ color: theme.color }}>
        <ScoreIcon icon={theme.icon} color={theme.color} className="h-4 w-4" />
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em]">{theme.label}</span>
      </div>
      {trend && <PortalStatusBadge status={trendStatus as "success" | "danger" | "neutral"} icon={trendIcon}>
        {trend.label === "increase" ? `+${trend.points} pts vs 30d ago` : trend.label === "decrease" ? `${trend.points} pts vs 30d ago` : "No change vs 30d ago"}
      </PortalStatusBadge>}
      <p className="max-w-[220px] text-xs leading-5 text-[var(--portal-text-muted)]">
        {score === 0 ? "Start completing tracked requirements to build your posture." : "Based on your tracked regulatory requirements."}
      </p>
      {data.lastUpdated && <p className="text-[10px] text-[var(--portal-text-muted)]">Last calculated {formatDistanceToNow(new Date(data.lastUpdated), { addSuffix: true })}</p>}
    </div>
  )
}
