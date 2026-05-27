'use client'

import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  CartesianGrid,
} from "recharts"
import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react"

export interface UsageTrendDataPoint {
  /** Short month label (e.g. "Mar", "Apr") */
  month: string
  /** Absolute usage count for this period */
  count: number
  /** Monthly limit at the time of this period (snapshotted) */
  limit: number
  /** Percent of limit used (0-100; 0 when unlimited or unavailable) */
  percentUsed: number
  /** True when this metric was available on the plan tier active during this period */
  available: boolean
  /** True only for the current month (rendered with different fill + opacity) */
  isCurrent: boolean
}

export interface UsageTrendChartProps {
  /** The metric being charted, for the title and tooltip labels (e.g. "Compliance Queries") */
  categoryLabel: string
  /** Ordered oldest-first, including the current month as the final entry */
  data: UsageTrendDataPoint[]
  /**
   * Percent change of current vs previous period (signed: positive = up, negative = down).
   * Pass null when no previous period exists (e.g. first billing cycle).
   */
  changePercent: number | null
  /** Direction matching changePercent for the insight banner icon */
  direction: "up" | "down" | "same" | null
}

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  categoryLabel: string
}

function CustomTooltip({ active, payload, label, categoryLabel }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null

  const dataPoint = payload[0].payload as UsageTrendDataPoint
  const { count, limit, percentUsed, available } = dataPoint

  let limitText = ""
  let percentText = ""
  let percentColorClass = "text-muted-foreground"

  if (!available) {
    limitText = "Not available on plan"
  } else if (limit === -1) {
    limitText = `${count.toLocaleString()} (unlimited)`
  } else {
    limitText = `${count.toLocaleString()} of ${limit.toLocaleString()}`
    percentText = `${percentUsed}% of cap`
    if (percentUsed >= 90) {
      percentColorClass = "text-destructive font-semibold"
    } else if (percentUsed >= 70) {
      percentColorClass = "text-amber-500 font-semibold"
    } else {
      percentColorClass = "text-emerald-500 font-semibold"
    }
  }

  return (
    <div
      className="bg-card border border-border rounded-lg p-3 shadow-[0_8px_24px_rgba(0,0,0,0.4)] text-xs text-foreground space-y-1"
      style={{ fontSize: 12 }}
    >
      <div className="font-bold text-foreground">{label}</div>
      <div className="text-muted-foreground">
        Used: <span className="text-foreground font-medium">{limitText}</span>
      </div>
      {percentText && (
        <div className={percentColorClass} aria-label={`Usage is ${percentText}`}>
          {percentText}
        </div>
      )}
    </div>
  )
}

export function UsageTrendChart({
  categoryLabel,
  data,
  changePercent,
  direction,
}: UsageTrendChartProps) {
  const currentPoint = data[data.length - 1]
  const isCurrentAvailable = currentPoint?.available ?? false
  const currentLimit = currentPoint?.limit ?? -1

  // 1. Insight banner logic
  let insightIcon = <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
  let insightText = (
    <span>
      {categoryLabel} - this is your first full month on this metric.
    </span>
  )

  if (currentPoint && !isCurrentAvailable) {
    insightIcon = <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
    insightText = (
      <span>
        {categoryLabel} is not included on your current plan. Upgrade to track this metric.
      </span>
    )
  } else if (changePercent !== null && direction !== null) {
    const absChange = Math.abs(changePercent)
    const formattedChange = `${absChange.toLocaleString()}%`

    if (direction === "up") {
      insightIcon = <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0" />
    } else if (direction === "down") {
      insightIcon = <TrendingDown className="h-4 w-4 text-destructive shrink-0" />
    } else {
      insightIcon = <Minus className="h-4 w-4 text-muted-foreground shrink-0" />
    }

    const directionVerb = direction === "up" ? "up" : direction === "down" ? "down" : "unchanged"

    if (currentLimit === -1) {
      insightText = (
        <span>
          {categoryLabel} are{" "}
          <strong className="text-foreground font-semibold">
            {direction === "same" ? "unchanged" : `${directionVerb} ${formattedChange}`}
          </strong>{" "}
          vs last month - you&apos;ve used{" "}
          <strong className="text-foreground font-semibold">
            {currentPoint.count.toLocaleString()}
          </strong>{" "}
          this month.
        </span>
      )
    } else {
      insightText = (
        <span>
          {categoryLabel} are{" "}
          <strong className="text-foreground font-semibold">
            {direction === "same" ? "unchanged" : `${directionVerb} ${formattedChange}`}
          </strong>{" "}
          vs last month - you&apos;ve used{" "}
          <strong className="text-foreground font-semibold">
            {currentPoint.percentUsed}%
          </strong>{" "}
          of your monthly cap.
        </span>
      )
    }
  }

  // YAxis visibility logic
  const allZero = data.every((d) => d.count === 0)

  // ReferenceLine conditions
  const renderCapLine = isCurrentAvailable && currentLimit > 0

  return (
    <div
      role="region"
      aria-label={`${categoryLabel} usage trend`}
      className="space-y-4 w-full"
    >
      {/* Insight banner */}
      <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50 text-xs text-muted-foreground">
        {insightIcon}
        <div className="leading-snug">{insightText}</div>
      </div>

      {/* Chart container */}
      {data.length > 0 && (
        <div className="w-full h-[200px] md:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.4}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                hide={allZero}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={40}
                tickFormatter={(v) => v.toLocaleString()}
              />
              <Tooltip
                content={<CustomTooltip categoryLabel={categoryLabel} />}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={56}>
                {data.map((entry, index) => {
                  let barColor = "#22C55E" // Previous months green
                  let barOpacity = 0.85

                  if (!entry.available) {
                    barColor = "hsl(var(--muted))"
                    barOpacity = 0.3
                  } else if (entry.isCurrent) {
                    barColor = "#F59E0B" // Current month amber
                    barOpacity = 1.0
                  }

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={barColor}
                      opacity={barOpacity}
                    />
                  )
                })}
              </Bar>
              {renderCapLine && (
                <ReferenceLine
                  y={currentLimit}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: "Cap",
                    position: "insideRight",
                    fontSize: 10,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer legend */}
      {data.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-muted-foreground select-none">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded bg-[#22C55E]" aria-hidden="true" />
            <span>Previous months</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded bg-[#F59E0B]" aria-hidden="true" />
            <span>This month</span>
          </div>
          {renderCapLine && (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-0.5 border-t-2 border-dashed border-muted-foreground" aria-hidden="true" />
              <span>Monthly cap ({currentLimit.toLocaleString()})</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
