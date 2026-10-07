import * as React from "react"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {
  getComplianceScoreTheme,
  getProvisionalScoreTheme,
  getUnassessedScoreTheme,
} from "@/lib/utils/compliance"
import { PortalStatusBadge } from "@/components/portal"
import type { DashboardData } from "./dashboard-types"
import { ScoreIcon } from "./compliance-category-item"

export type GaugeData = Omit<Partial<DashboardData>, "overallScore"> & {
  overallScore?: number | null
  scoreType?: "PROVISIONAL" | "FINAL" | null
  assessmentStatus?: "NOT_STARTED" | "IN_PROGRESS" | "ASSESSED" | string
  coveragePercent?: number
}

export function ComplianceScoreGauge({ data }: { data: GaugeData }) {
  const isUnassessed = data.overallScore === null || data.overallScore === undefined
  const isProvisional = data.scoreType === "PROVISIONAL"

  const theme = isUnassessed
    ? getUnassessedScoreTheme()
    : isProvisional
    ? getProvisionalScoreTheme()
    : getComplianceScoreTheme(data.overallScore!)

  const score = isUnassessed ? 0 : Math.max(0, Math.min(100, Math.round(data.overallScore!)))
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = isUnassessed
    ? circumference
    : circumference - (score / 100) * circumference

  const trend = data.trend
  const trendIcon = trend?.label === "increase" ? TrendingUp : trend?.label === "decrease" ? TrendingDown : Minus
  const trendStatus = trend?.label === "increase" ? "success" : trend?.label === "decrease" ? "danger" : "neutral"

  return (
    <div className="flex flex-col items-center justify-center gap-3.5 rounded-xl border border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface,#FFFFFF)] px-6 py-6 text-center sm:px-7">
      <div
        className="relative size-40 sm:size-44"
        role="img"
        aria-label={
          isUnassessed
            ? "Compliance posture not reviewed yet"
            : `Overall compliance score ${score} out of 100, ${theme.label}`
        }
      >
        <svg className="size-full -rotate-90" viewBox="0 0 144 144" aria-hidden="true">
          {/* Neutral track circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke="var(--portal-border, #E2E8E5)"
            strokeWidth="9"
          />
          {/* Active progress arc */}
          {!isUnassessed && (
            <circle
              cx="72"
              cy="72"
              r={radius}
              fill="none"
              stroke={theme.color}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
            />
          )}
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-semibold tracking-[-0.05em] text-[var(--portal-text-primary,#101814)]">
            {isUnassessed ? "—" : score}
          </span>
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--portal-text-muted,#64766D)]">
            {isUnassessed ? "Not Assessed" : "/ 100"}
          </span>
          {!isUnassessed && <span className="sr-only">{score}%</span>}
        </div>
      </div>

      {/* Semantic posture pill */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface-hover,#F0F4F2)] px-3 py-1 text-xs font-semibold text-[var(--portal-text-primary,#101814)]">
        <ScoreIcon icon={theme.icon} color={theme.color} className="h-3.5 w-3.5" />
        <span className="font-mono uppercase tracking-[0.12em]">
          {isProvisional ? "Provisional Posture" : theme.label}
        </span>
      </div>

      {/* 30+ Days Trend Badge (Only rendered when historical points exist) */}
      {trend && trend.points !== null && (
        <PortalStatusBadge status={trendStatus as "success" | "danger" | "neutral"} icon={trendIcon}>
          {trend.points > 0
            ? `+${trend.points} pts vs 30+ days ago`
            : trend.points < 0
            ? `${trend.points} pts vs 30+ days ago`
            : "No change vs 30+ days ago"}
        </PortalStatusBadge>
      )}

      {/* Micro Explanatory Text */}
      <p className="max-w-[210px] text-xs leading-relaxed text-[var(--portal-text-secondary,#53615A)]">
        {isUnassessed
          ? "Start reviewing baseline requirements to establish your posture."
          : isProvisional
          ? `${data.coveragePercent ?? 0}% assessed across active categories.`
          : score === 0
          ? "Start completing tracked requirements to build your posture."
          : "Based on active regulatory requirements across 5 categories."}
      </p>

      {data.lastUpdated && (
        <p className="font-mono text-[10px] text-[var(--portal-text-muted,#64766D)]">
          Calculated {formatDistanceToNow(new Date(data.lastUpdated), { addSuffix: true })}
        </p>
      )}
    </div>
  )
}
