"use client"

/**
 * UsageComparison
 *
 * Renders the comparison panel: month selector + side-by-side usage breakdown
 * + Recharts trend mini-chart.
 *
 * Built in Task 5 — this file is the entry point imported by the billing page
 * and by UsageCard's compare toggle.
 */

import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowDown, ArrowUp, Minus, TrendingUp } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

// ── Local types ───────────────────────────────────────────────────────────────

interface PeriodSummary {
  periodId:    string
  periodStart: Date | string
  periodEnd:   Date | string
  planTier:    string
  categories:  CategorySummary[]
}

interface CategorySummary {
  key:         string
  label:       string
  current:     number
  limit:       number
  available:   boolean
  percentUsed: number
}

interface ChangeItem {
  key:           string
  label:         string
  currentCount:  number
  previousCount: number
  changePercent: number
  direction:     "up" | "down" | "same"
}

interface ComparisonData {
  current:  PeriodSummary
  previous: PeriodSummary
  changes:  ChangeItem[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format a UTC date boundary as the EAT calendar month it represents. */
function toEATMonthLabel(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-KE", {
    timeZone: "Africa/Nairobi",
    month:    "long",
    year:     "numeric",
  })
}

/** Short month label for the period selector buttons. */
function toEATShortMonth(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-KE", {
    timeZone: "Africa/Nairobi",
    month:    "short",
    year:     "numeric",
  })
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ComparisonSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3.5 w-56 mt-1" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-7 w-24 rounded-full shrink-0" />)}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-7 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Direction indicator ───────────────────────────────────────────────────────

function DirectionBadge({ item }: { item: ChangeItem }) {
  if (item.direction === "same") {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Minus className="h-3 w-3" />
        <span>No change</span>
      </div>
    )
  }
  if (item.direction === "up") {
    return (
      <div className="flex items-center gap-1 text-xs text-amber-600">
        <ArrowUp className="h-3 w-3" />
        <span>+{item.changePercent}%</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 text-xs text-emerald-600">
      <ArrowDown className="h-3 w-3" />
      <span>{item.changePercent}%</span>
    </div>
  )
}

// ── Category comparison row ───────────────────────────────────────────────────

function ComparisonRow({
  change,
  currentCat,
  prevCat,
}: {
  change:     ChangeItem
  currentCat: CategorySummary | undefined
  prevCat:    CategorySummary | undefined
}) {
  const currPct  = currentCat?.percentUsed ?? 0
  const prevPct  = prevCat?.percentUsed   ?? 0

  const barColor = (pct: number) =>
    pct >= 90 ? "bg-destructive" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500"

  const formatCount = (cat: CategorySummary | undefined): string => {
    if (!cat || !cat.available) return "—"
    if (cat.limit === -1) return `${cat.current.toLocaleString()} (∞)`
    return `${cat.current.toLocaleString()} / ${cat.limit.toLocaleString()}`
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-foreground flex-1">{change.label}</span>
        <DirectionBadge item={change} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {/* Current period bar */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>This month</span>
            <span className="tabular-nums">{formatCount(currentCat)}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full ${barColor(currPct)}`}
              style={{ width: `${Math.min(100, currPct)}%` }}
            />
          </div>
        </div>
        {/* Previous period bar */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Previous</span>
            <span className="tabular-nums">{formatCount(prevCat)}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full opacity-60 ${barColor(prevPct)}`}
              style={{ width: `${Math.min(100, prevPct)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Trend chart ───────────────────────────────────────────────────────────────

interface TrendChartProps {
  categoryKey:   string
  categoryLabel: string
  history:       PeriodSummary[]
  current:       PeriodSummary
}

function TrendChart({ categoryKey, categoryLabel, history, current }: TrendChartProps) {
  // Merge history (oldest first) + current period
  const allPeriods = [...history].reverse().concat([current])

  const chartData = allPeriods.map((p, i) => {
    const cat = p.categories.find((c) => c.key === categoryKey)
    return {
      month:     toEATShortMonth(p.periodStart),
      count:     cat?.current ?? 0,
      isCurrent: i === allPeriods.length - 1,
    }
  })

  return (
    <div className="mt-4">
      <div className="flex items-center gap-1.5 mb-2">
        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-medium">
          {categoryLabel} — 6 month trend
        </span>
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background:  "hsl(var(--card))",
              border:      "1px solid hsl(var(--border))",
              borderRadius: "6px",
              fontSize:    12,
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            itemStyle={{ color: "hsl(var(--muted-foreground))" }}
            formatter={(val: number) => [val.toLocaleString(), categoryLabel]}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.isCurrent ? "#D4A843" : "#00875A"}
                opacity={entry.isCurrent ? 1 : 0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-3 mt-1">
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "#00875A" }} />
          <span className="text-[10px] text-muted-foreground">Previous months</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "#D4A843" }} />
          <span className="text-[10px] text-muted-foreground">This month</span>
        </div>
      </div>
    </div>
  )
}

// ── Plan change indicator ─────────────────────────────────────────────────────

function PlanChangedNote({
  currentPlan,
  previousPlan,
}: {
  currentPlan:  string
  previousPlan: string
}) {
  if (currentPlan === previousPlan) return null
  return (
    <div className="flex items-center gap-1.5 rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1.5 text-xs text-blue-700">
      <AlertCircle className="h-3 w-3 shrink-0" />
      Plan changed: {previousPlan} → {currentPlan}. Limits reflect each period&apos;s plan.
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * Renders the usage comparison panel.
 *
 * Fetches the last 6 months of usage history, lets the user pick a comparison
 * month, then fetches a side-by-side comparison with the current period.
 *
 * Also renders a Recharts bar chart showing the 6-month trend for the first
 * metered category (compliance queries by default).
 */
export function UsageComparison() {
  const [selectedPeriodStart, setSelectedPeriodStart] = useState<string | null>(null)
  const [chartCategory, setChartCategory] = useState("complianceQueries")

  // Fetch last 6 completed months for the period selector
  const historyQuery = trpc.usage.history.useQuery(
    { months: 6 },
    { staleTime: 5 * 60 * 1000 },
  )

  const history = (historyQuery.data ?? []) as PeriodSummary[]

  // Auto-select the most recent month when history loads
  const effectiveSelected = selectedPeriodStart ?? history[0]?.periodStart?.toString() ?? null

  // Fetch comparison only when a period is selected
  const compareQuery = trpc.usage.compare.useQuery(
    { comparePeriodStart: effectiveSelected! },
    {
      enabled:   effectiveSelected !== null,
      staleTime: 60 * 1000,
    },
  )

  const comparison = (compareQuery.data ?? null) as ComparisonData | null

  // ── Empty state: first billing period ─────────────────────────────────────
  if (!historyQuery.isLoading && history.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="py-8 text-center space-y-2">
          <TrendingUp className="h-10 w-10 text-muted-foreground/30 mx-auto" />
          <p className="text-sm font-medium text-muted-foreground">No comparison data yet</p>
          <p className="text-xs text-muted-foreground/70">
            Usage comparison will be available next month once your first billing period completes.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (historyQuery.isLoading) return <ComparisonSkeleton />

  if (historyQuery.isError) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="pt-5 flex items-center gap-3 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
          Unable to load usage history.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Compare Usage</CardTitle>
        <CardDescription className="text-xs">
          Current month vs a previous billing period
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ── Month selector ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {history.map((period) => {
            const key      = period.periodStart.toString()
            const isActive = key === (effectiveSelected ?? "")
            return (
              <button
                key={key}
                onClick={() => setSelectedPeriodStart(key)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                {toEATShortMonth(period.periodStart)}
                {period.planTier !== comparison?.current.planTier && (
                  <span className="ml-1 text-[10px] opacity-60">({period.planTier})</span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Comparison content ── */}
        {compareQuery.isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        )}

        {compareQuery.isError && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 text-destructive" />
            Unable to load comparison data.
          </div>
        )}

        {comparison && !compareQuery.isLoading && (
          <>
            {/* Plan change notice */}
            <PlanChangedNote
              currentPlan={comparison.current.planTier}
              previousPlan={comparison.previous.planTier}
            />

            {/* Period labels */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <Badge variant="outline" className="text-[10px] bg-amber-50 border-amber-200 text-amber-700">
                  This month
                </Badge>
                <p className="mt-1 text-muted-foreground">{toEATMonthLabel(comparison.current.periodStart)}</p>
              </div>
              <div>
                <Badge variant="outline" className="text-[10px]">
                  Previous
                </Badge>
                <p className="mt-1 text-muted-foreground">{toEATMonthLabel(comparison.previous.periodStart)}</p>
              </div>
            </div>

            {/* Per-category comparison rows */}
            <div className="space-y-3 divide-y divide-border/40">
              {comparison.changes.map((change) => {
                const currentCat  = comparison.current.categories.find((c) => c.key === change.key)
                const prevCat     = comparison.previous.categories.find((c) => c.key === change.key)
                return (
                  <div key={change.key} className="pt-3 first:pt-0">
                    <ComparisonRow
                      change={change}
                      currentCat={currentCat}
                      prevCat={prevCat}
                    />
                  </div>
                )
              })}
            </div>

            {/* ── Trend chart ── */}
            {history.length > 0 && (
              <>
                {/* Category selector for chart */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 pt-1">
                  {comparison.changes
                    .filter((c) => comparison.current.categories.find((cc) => cc.key === c.key)?.available)
                    .map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setChartCategory(c.key)}
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium border transition-colors ${
                          chartCategory === c.key
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "bg-muted/30 text-muted-foreground border-border hover:bg-muted"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                </div>

                <TrendChart
                  categoryKey={chartCategory}
                  categoryLabel={
                    comparison.changes.find((c) => c.key === chartCategory)?.label ?? chartCategory
                  }
                  history={history}
                  current={comparison.current}
                />
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
