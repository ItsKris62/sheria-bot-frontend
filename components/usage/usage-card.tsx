"use client"

import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertCircle,
  ArrowRightLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Infinity,
  Lock,
  Zap,
} from "lucide-react"

// ── Local types (mirror backend UsageSummary output) ─────────────────────────

interface CategorySummary {
  key: string
  label: string
  current: number
  limit: number
  available: boolean
  percentUsed: number
}

interface UsagePeriod {
  start: Date | string
  end: Date | string
  daysRemaining: number
  daysTotal: number
}

interface UsageSummaryData {
  period: UsagePeriod
  planTier: string
  categories: CategorySummary[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PLAN_BADGE: Record<string, string> = {
  REGULATOR:  "bg-slate-100 text-slate-600 border-slate-300",
  STARTUP:    "bg-amber-50 text-amber-700 border-amber-300",
  BUSINESS:   "bg-blue-50 text-blue-700 border-blue-300",
  ENTERPRISE: "bg-emerald-50 text-emerald-700 border-emerald-300",
}

const PLAN_LABELS: Record<string, string> = {
  REGULATOR:  "Regulator (Free)",
  STARTUP:    "Startup Plan",
  BUSINESS:   "Business Plan",
  ENTERPRISE: "Enterprise Plan",
}

/** Format a date using EAT (Africa/Nairobi, UTC+3) locale formatting. */
function formatEAT(date: Date | string, opts: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString("en-KE", { timeZone: "Africa/Nairobi", ...opts })
}

/** Build "Mar 1 – Mar 31, 2026" style label from period boundaries. */
function formatPeriodRange(start: Date | string, end: Date | string): string {
  const s = new Date(start)
  const e = new Date(end)
  const startLabel = formatEAT(s, { month: "short", day: "numeric" })
  const endLabel   = formatEAT(e, { month: "short", day: "numeric", year: "numeric" })
  return `${startLabel} – ${endLabel}`
}

/**
 * Return the Tailwind classes for a progress bar fill based on percentage used.
 *
 * Thresholds (per spec):
 *   0 – 70 % → Emerald green
 *  70 – 90 % → Gold / amber
 *  90 – 100% → Red / destructive
 */
function barColorClass(pct: number): string {
  if (pct >= 90) return "bg-destructive"
  if (pct >= 70) return "bg-amber-500"
  return "bg-emerald-500"
}

/** Text color class matching the bar color. */
function textColorClass(pct: number): string {
  if (pct >= 90) return "text-destructive"
  if (pct >= 70) return "text-amber-600"
  return ""
}

// ── Sub-components ────────────────────────────────────────────────────────────

function UsageCardSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-48" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3.5 w-16" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
        <Skeleton className="h-8 w-full mt-2" />
      </CardContent>
    </Card>
  )
}

function ErrorCard() {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardContent className="pt-5 flex items-center gap-3 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
        Unable to load usage data. Please refresh.
      </CardContent>
    </Card>
  )
}

interface CategoryRowProps {
  category: CategorySummary
}

function CategoryRow({ category }: CategoryRowProps) {
  const { label, current, limit, available, percentUsed } = category

  // Feature not on this plan
  if (!available) {
    return (
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground/60">
          <Lock className="h-3 w-3" />
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground/60">Unavailable</span>
          <Button variant="ghost" size="sm" className="h-5 px-1.5 py-0 text-xs text-primary" asChild>
            <a href="/settings/billing">Upgrade</a>
          </Button>
        </div>
      </div>
    )
  }

  // Unlimited (-1)
  if (limit === -1) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <div className="flex items-center gap-1.5">
          <Infinity className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-emerald-500 font-medium text-xs">Unlimited</span>
        </div>
      </div>
    )
  }

  const remaining = Math.max(0, limit - current)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-medium tabular-nums text-sm ${textColorClass(percentUsed)}`}>
          {current.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>

      {/* Custom progress bar — shadcn Progress uses bg-primary which cannot be overridden */}
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColorClass(percentUsed)}`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>

      {percentUsed >= 90 && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {percentUsed >= 100
            ? "Monthly limit reached — upgrade to continue"
            : `${remaining.toLocaleString()} remaining`}
        </p>
      )}
      {percentUsed >= 70 && percentUsed < 90 && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {remaining.toLocaleString()} remaining
        </p>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface UsageCardProps {
  /** Called when the user clicks "Compare Usage" — parent mounts the comparison panel. */
  onCompareToggle?: (open: boolean) => void
  compareOpen?: boolean
}

/**
 * Enhanced usage card for the billing settings page and (optionally) the dashboard.
 *
 * Data source: `trpc.usage.current` (live Redis counters + lazy DB sync).
 * StaleTime: 60 s — usage data changes infrequently within a single session.
 *
 * Shows:
 *   - Billing period context ("Mar 1 – Mar 31, 2026" with days remaining)
 *   - Plan tier badge
 *   - Per-category progress bars with threshold-based colour coding
 *   - Unavailable categories with inline Upgrade link
 *   - Unlimited categories with ∞ indicator
 *   - "Compare Usage" button that triggers the comparison panel (Task 5)
 */
export function UsageCard({ onCompareToggle, compareOpen = false }: UsageCardProps) {
  const [internalCompareOpen, setInternalCompareOpen] = useState(false)

  const { data: rawData, isLoading, isError } = trpc.usage.current.useQuery(undefined, {
    staleTime: 60 * 1000,
    retry: (count, error) => {
      const code = (error as { data?: { code?: string } })?.data?.code
      if (code === "UNAUTHORIZED" || code === "FORBIDDEN") return false
      return count < 2
    },
  })

  const data = rawData as UsageSummaryData | undefined

  // Use external toggle if provided (parent controls state), else use internal state
  const isCompareOpen   = onCompareToggle ? compareOpen : internalCompareOpen
  const toggleCompare   = () => {
    if (onCompareToggle) {
      onCompareToggle(!compareOpen)
    } else {
      setInternalCompareOpen((v) => !v)
    }
  }

  if (isLoading) return <UsageCardSkeleton />
  if (isError || !data) return <ErrorCard />

  const { period, planTier, categories } = data
  const periodLabel   = formatPeriodRange(period.start, period.end)
  const planBadge     = PLAN_BADGE[planTier] ?? "bg-muted text-muted-foreground border-border"
  const planLabel     = PLAN_LABELS[planTier] ?? planTier

  // Determine days-remaining copy
  const daysLabel =
    period.daysRemaining === 0
      ? "Resets today"
      : period.daysRemaining === 1
      ? "1 day remaining"
      : `${period.daysRemaining} days remaining`

  // Check if any category is near/at limit (for summary indicator in header)
  const hasCritical  = categories.some((c) => c.available && c.limit > 0 && c.percentUsed >= 90)
  const hasWarning   = !hasCritical && categories.some((c) => c.available && c.limit > 0 && c.percentUsed >= 70)

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">This Month&apos;s Usage</CardTitle>
              {hasCritical && <AlertCircle className="h-4 w-4 text-destructive" />}
              {hasWarning  && <AlertCircle className="h-4 w-4 text-amber-500" />}
              {!hasCritical && !hasWarning && <CheckCircle2 className="h-4 w-4 text-emerald-500/70" />}
            </div>
            <CardDescription className="flex items-center gap-1.5 text-xs">
              <CalendarDays className="h-3.5 w-3.5" />
              {periodLabel} &middot; {daysLabel}
            </CardDescription>
          </div>

          <Badge
            variant="outline"
            className={`text-xs font-medium px-2 py-0.5 ${planBadge}`}
          >
            <Zap className="h-3 w-3 mr-1" />
            {planLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Per-category usage rows */}
        {categories.map((cat) => (
          <CategoryRow key={cat.key} category={cat} />
        ))}

        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No usage data available for this period.
          </p>
        )}

        {/* Compare toggle */}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 text-xs gap-1.5"
          onClick={toggleCompare}
        >
          <ArrowRightLeft className="h-3.5 w-3.5" />
          {isCompareOpen ? "Hide Comparison" : "Compare with Previous Month"}
          {isCompareOpen ? <ChevronUp className="h-3.5 w-3.5 ml-auto" /> : <ChevronDown className="h-3.5 w-3.5 ml-auto" />}
        </Button>
      </CardContent>
    </Card>
  )
}
