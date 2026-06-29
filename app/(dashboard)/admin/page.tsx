"use client"

import Link from "next/link"
import { useMemo, type ComponentType } from "react"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  CreditCard,
  FileQuestion,
  Heart,
  LifeBuoy,
  RefreshCw,
  Shield,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { trpc } from "@/lib/trpc"
import { cn } from "@/lib/utils"

type OperationalStatus = "healthy" | "degraded" | "down" | "unknown"
type OperationalSeverity = "info" | "warning" | "critical"

type OperationalOverview = {
  users: {
    total: number
    activeToday: number
    activeLast7Days: number
    newLast7Days: number
  }
  queries: {
    total: number
    last24Hours: number
    last7Days: number
    failedLast7Days: number
    failureRateLast7Days: number
  }
  feedback: {
    totalVotesLast30Days: number
    upVotesLast30Days: number
    downVotesLast30Days: number
    satisfactionRate: number
  }
  corpusGaps: {
    pending: number
    open: number
    resolvedLast7Days: number
  }
  support: {
    open: number
    urgent: number
    overdueOrStale: number
  }
  billing: {
    failedPaymentsLast30Days: number
    recentRevenueLast30Days: number
    activeSubscriptions: number
    trialUsers: number
  }
  security: {
    failedLoginsLast24Hours: number
    suspiciousLoginEvents: number
    recentRoleChanges: number
  }
  system: {
    overallStatus: OperationalStatus
    database: OperationalStatus
    redis: OperationalStatus
    storage: OperationalStatus
    pinecone: OperationalStatus
  }
  recentActivity: Array<{
    id: string
    type: string
    title: string
    description?: string
    severity?: OperationalSeverity
    createdAt: string
  }>
}

type MetricTone = "good" | "neutral" | "warning" | "critical"

type MetricCard = {
  label: string
  value: string
  helper: string
  href: string
  icon: ComponentType<{ className?: string }>
  tone: MetricTone
  badge?: string
}

const toneStyles: Record<MetricTone, { icon: string; badge: string; border: string }> = {
  good: {
    icon: "bg-primary/10 text-primary",
    badge: "bg-primary/10 text-primary border-primary/20",
    border: "hover:border-primary/40",
  },
  neutral: {
    icon: "bg-blue-500/10 text-blue-500",
    badge: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    border: "hover:border-blue-500/40",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    badge: "bg-warning/10 text-warning border-warning/20",
    border: "hover:border-warning/40",
  },
  critical: {
    icon: "bg-destructive/10 text-destructive",
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    border: "hover:border-destructive/40",
  },
}

function formatCount(value: number | undefined) {
  return (value ?? 0).toLocaleString("en-KE")
}

function formatCurrency(value: number | undefined) {
  return `KES ${(value ?? 0).toLocaleString("en-KE", { maximumFractionDigits: 0 })}`
}

function formatPercent(value: number | undefined) {
  return `${(value ?? 0).toLocaleString("en-KE", { maximumFractionDigits: 1 })}%`
}

function systemTone(status: OperationalStatus): MetricTone {
  if (status === "healthy") return "good"
  if (status === "degraded" || status === "unknown") return "warning"
  return "critical"
}

function statusLabel(status: OperationalStatus) {
  if (status === "healthy") return "Healthy"
  if (status === "degraded") return "Degraded"
  if (status === "down") return "Down"
  return "Unknown"
}

function severityTone(severity: OperationalSeverity | undefined): MetricTone {
  if (severity === "critical") return "critical"
  if (severity === "warning") return "warning"
  return "neutral"
}

function relativeDate(value: string) {
  return new Date(value).toLocaleString("en-KE", { dateStyle: "short", timeStyle: "short" })
}

function MetricSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  )
}

function MetricTile({ card }: { card: MetricCard }) {
  const Icon = card.icon
  const tone = toneStyles[card.tone]

  return (
    <Link href={card.href} className="group block h-full">
      <Card className={cn("h-full border-border/50 bg-card/50 transition duration-200 hover:-translate-y-0.5 hover:shadow-glow-green-sm", tone.border)}>
        <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{card.value}</p>
            </div>
            <div className={cn("rounded-lg p-2.5", tone.icon)}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-3">
            <p className="text-sm text-muted-foreground">{card.helper}</p>
            {card.badge ? (
              <Badge variant="outline" className={cn("shrink-0", tone.badge)}>{card.badge}</Badge>
            ) : (
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition group-hover:text-primary" />
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function AdminDashboard() {
  const overviewQuery = trpc.admin.getOperationalOverview.useQuery(undefined, {
    refetchInterval: 60_000,
    retry: 2,
  })

  const overview = overviewQuery.data as OperationalOverview | undefined

  const metricCards = useMemo<MetricCard[]>(() => {
    if (!overview) return []

    const failureTone: MetricTone = overview.queries.failureRateLast7Days >= 10
      ? "critical"
      : overview.queries.failureRateLast7Days > 0
        ? "warning"
        : "good"
    const feedbackTone: MetricTone = overview.feedback.totalVotesLast30Days === 0
      ? "neutral"
      : overview.feedback.satisfactionRate >= 70
        ? "good"
        : overview.feedback.satisfactionRate >= 40
          ? "warning"
          : "critical"
    const corpusTone: MetricTone = overview.corpusGaps.pending > 0 ? "warning" : "good"
    const supportTone: MetricTone = overview.support.urgent > 0 ? "critical" : overview.support.open > 0 ? "warning" : "good"
    const billingTone: MetricTone = overview.billing.failedPaymentsLast30Days > 0 ? "critical" : "good"
    const securityTone: MetricTone = overview.security.suspiciousLoginEvents > 0 || overview.security.failedLoginsLast24Hours >= 10
      ? "critical"
      : overview.security.failedLoginsLast24Hours > 0 || overview.security.recentRoleChanges > 0
        ? "warning"
        : "good"

    return [
      {
        label: "Active Users",
        value: formatCount(overview.users.activeToday),
        helper: `${formatCount(overview.users.activeLast7Days)} active in 7 days, ${formatCount(overview.users.newLast7Days)} new`,
        href: "/admin/users",
        icon: Users,
        tone: overview.users.activeToday > 0 ? "good" : "neutral",
        badge: `${formatCount(overview.users.total)} total`,
      },
      {
        label: "Compliance Queries",
        value: formatCount(overview.queries.last24Hours),
        helper: `${formatCount(overview.queries.last7Days)} in 7 days, ${formatCount(overview.queries.total)} all time`,
        href: "/admin/analytics",
        icon: Bot,
        tone: "neutral",
        badge: "24h",
      },
      {
        label: "Failed Query Rate",
        value: formatPercent(overview.queries.failureRateLast7Days),
        helper: `${formatCount(overview.queries.failedLast7Days)} failed or errored in 7 days`,
        href: "/admin/analytics",
        icon: XCircle,
        tone: failureTone,
      },
      {
        label: "Feedback Satisfaction",
        value: overview.feedback.totalVotesLast30Days > 0 ? formatPercent(overview.feedback.satisfactionRate) : "No votes",
        helper: `${formatCount(overview.feedback.upVotesLast30Days)} up, ${formatCount(overview.feedback.downVotesLast30Days)} down in 30 days`,
        href: "/admin/analytics/feedback",
        icon: Heart,
        tone: feedbackTone,
      },
      {
        label: "Corpus Gaps",
        value: formatCount(overview.corpusGaps.pending),
        helper: `${formatCount(overview.corpusGaps.open)} open, ${formatCount(overview.corpusGaps.resolvedLast7Days)} resolved in 7 days`,
        href: "/admin/corpus-gap-reports",
        icon: FileQuestion,
        tone: corpusTone,
        badge: "pending",
      },
      {
        label: "Support Tickets",
        value: formatCount(overview.support.open),
        helper: `${formatCount(overview.support.urgent)} urgent, ${formatCount(overview.support.overdueOrStale)} stale over 48h`,
        href: "/admin/support",
        icon: LifeBuoy,
        tone: supportTone,
      },
      {
        label: "Billing Issues",
        value: formatCount(overview.billing.failedPaymentsLast30Days),
        helper: `${formatCurrency(overview.billing.recentRevenueLast30Days)} revenue in 30 days`,
        href: "/admin/billing",
        icon: CreditCard,
        tone: billingTone,
        badge: `${formatCount(overview.billing.activeSubscriptions)} active`,
      },
      {
        label: "System Health",
        value: statusLabel(overview.system.overallStatus),
        helper: `DB ${statusLabel(overview.system.database)}, Redis ${statusLabel(overview.system.redis)}, R2 ${statusLabel(overview.system.storage)}`,
        href: "/admin/system",
        icon: Activity,
        tone: systemTone(overview.system.overallStatus),
        badge: `RAG ${statusLabel(overview.system.pinecone)}`,
      },
      {
        label: "Security Warnings",
        value: formatCount(overview.security.failedLoginsLast24Hours + overview.security.suspiciousLoginEvents),
        helper: `${formatCount(overview.security.failedLoginsLast24Hours)} failed logins, ${formatCount(overview.security.recentRoleChanges)} role changes`,
        href: "/admin/security",
        icon: Shield,
        tone: securityTone,
      },
    ]
  }, [overview])

  const hasSystemWarning = overview
    ? Object.values(overview.system).some((status) => status !== "healthy")
    : false

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Operational Overview</h1>
          <p className="mt-1 text-muted-foreground">
            Pilot monitoring across users, queries, feedback, support, billing, security, and system health.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-fit gap-2"
          onClick={() => overviewQuery.refetch()}
          disabled={overviewQuery.isFetching}
        >
          <RefreshCw className={cn("h-4 w-4", overviewQuery.isFetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {overviewQuery.isError ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-foreground">Could not load operational overview.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Refresh the page or try again shortly. Internal service details have been hidden for safety.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => overviewQuery.refetch()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {hasSystemWarning ? (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-warning" />
            <div>
              <p className="text-sm font-medium text-foreground">Some system checks are currently unavailable.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Review System Health for details. No secrets or environment values are shown here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {overviewQuery.isLoading
          ? Array.from({ length: 9 }).map((_, index) => <MetricSkeleton key={index} />)
          : metricCards.map((card) => <MetricTile key={card.label} card={card} />)}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/50 bg-card/50 lg:col-span-2">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Operational Activity
              </CardTitle>
              <CardDescription>Latest audit trail events relevant to admin monitoring.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
              <Link href="/admin/audit-logs">
                Audit logs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {overviewQuery.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between gap-4 rounded-lg border border-border/50 p-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-44" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : !overview?.recentActivity.length ? (
              <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
                <CheckCircle2 className="h-10 w-10 text-primary/70" />
                <p className="mt-3 text-sm font-medium text-foreground">No recent admin activity</p>
                <p className="mt-1 text-sm text-muted-foreground">Operational events will appear here as the pilot runs.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {overview.recentActivity.map((item) => {
                  const tone = toneStyles[severityTone(item.severity)]
                  return (
                    <div key={item.id} className="flex flex-col gap-3 rounded-lg border border-border/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-foreground">{item.title}</p>
                          <Badge variant="outline" className={cn("text-xs", tone.badge)}>{item.type}</Badge>
                        </div>
                        {item.description ? <p className="mt-1 text-sm text-muted-foreground">{item.description}</p> : null}
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{relativeDate(item.createdAt)}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Pilot Pulse
            </CardTitle>
            <CardDescription>Small signals that should stay visible during onboarding.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {overviewQuery.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-10 w-full" />)}
              </div>
            ) : overview ? (
              <>
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                  <span className="text-sm text-muted-foreground">New users, 7 days</span>
                  <span className="font-semibold text-foreground">{formatCount(overview.users.newLast7Days)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                  <span className="text-sm text-muted-foreground">Open corpus gaps</span>
                  <span className="font-semibold text-foreground">{formatCount(overview.corpusGaps.open)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                  <span className="text-sm text-muted-foreground">Trial organizations</span>
                  <span className="font-semibold text-foreground">{formatCount(overview.billing.trialUsers)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                  <span className="text-sm text-muted-foreground">Stale support tickets</span>
                  <span className="font-semibold text-foreground">{formatCount(overview.support.overdueOrStale)}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Pilot pulse is unavailable right now.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}