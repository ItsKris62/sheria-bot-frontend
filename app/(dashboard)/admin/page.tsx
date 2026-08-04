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
import {
  AdminDataPanel,
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPageHeader,
  AdminStatCard,
} from "@/components/admin/portal"
import { PortalSurface, PortalStatusBadge } from "@/components/portal"
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

const toneStyles: Record<MetricTone, { badge: string; border: string; status: "success" | "warning" | "danger" | "info" | "neutral" }> = {
  good: {
    badge: "bg-primary/10 text-primary border-primary/20",
    border: "hover:border-primary/40",
    status: "success",
  },
  neutral: {
    badge: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    border: "hover:border-blue-500/40",
    status: "info",
  },
  warning: {
    badge: "bg-warning/10 text-warning border-warning/20",
    border: "hover:border-warning/40",
    status: "warning",
  },
  critical: {
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    border: "hover:border-destructive/40",
    status: "danger",
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

function MetricTile({ card }: { card: MetricCard }) {
  const Icon = card.icon
  const tone = toneStyles[card.tone]

  return (
    <Link href={card.href} className="group block h-full">
      <AdminStatCard
        label={card.label}
        value={card.value}
        helper={card.helper}
        icon={Icon}
        status={tone.status}
        badge={card.badge}
        className={cn("transition duration-200 hover:-translate-y-0.5 hover:shadow-glow-green-sm", tone.border)}
      />
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
    <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-8">
      <AdminPageHeader
        title="Operational Overview"
        description="Pilot monitoring across users, queries, feedback, support, billing, security, and system health."
        icon={Activity}
        metadata={
          <PortalStatusBadge status="info" icon={RefreshCw}>
            Auto-refreshes every minute
          </PortalStatusBadge>
        }
        action={
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
        }
      />

      {overviewQuery.isError ? (
        <AdminErrorState
          title="Could not load operational overview."
          description="Refresh the page or try again shortly. Internal service details have been hidden for safety."
          retryLabel="Try again"
          onRetry={() => overviewQuery.refetch()}
        />
      ) : null}

      {hasSystemWarning ? (
        <PortalSurface variant="solid" className="border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-400" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-[var(--portal-text-primary)]">Some system checks are currently unavailable.</p>
              <p className="mt-1 text-sm text-[var(--portal-text-secondary)]">
                Review System Health for details. No secrets or environment values are shown here.
              </p>
            </div>
          </div>
        </PortalSurface>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {overviewQuery.isLoading
          ? Array.from({ length: 9 }).map((_, index) => (
              <AdminStatCard key={index} label="Loading metric" isLoading />
            ))
          : metricCards.map((card) => <MetricTile key={card.label} card={card} />)}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminDataPanel
          className="lg:col-span-2"
          title="Recent Operational Activity"
          description="Latest audit trail events relevant to admin monitoring."
          icon={Activity}
          action={
            <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
              <Link href="/admin/audit-logs">
                Audit logs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        >
            {overviewQuery.isLoading ? (
              <AdminLoadingState rows={5} />
            ) : !overview?.recentActivity.length ? (
              <AdminEmptyState
                title="No recent admin activity"
                description="Operational events will appear here as the pilot runs."
              />
            ) : (
              <div className="space-y-3">
                {overview.recentActivity.map((item) => {
                  const tone = toneStyles[severityTone(item.severity)]
                  return (
                    <PortalSurface key={item.id} variant="solid" className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="break-words font-medium text-[var(--portal-text-primary)]">{item.title}</p>
                          <Badge variant="outline" className={cn("text-xs", tone.badge)}>{item.type}</Badge>
                        </div>
                        {item.description ? <p className="mt-1 break-words text-sm text-[var(--portal-text-secondary)]">{item.description}</p> : null}
                      </div>
                      <span className="shrink-0 text-xs text-[var(--portal-text-muted)]">{relativeDate(item.createdAt)}</span>
                    </PortalSurface>
                  )
                })}
              </div>
            )}
        </AdminDataPanel>

        <AdminDataPanel
          title="Pilot Pulse"
          description="Small signals that should stay visible during onboarding."
          icon={TrendingUp}
        >
          <div className="space-y-4">
            {overviewQuery.isLoading ? (
              <AdminLoadingState rows={4} />
            ) : overview ? (
              <>
                <div className="flex items-center justify-between rounded-lg bg-[var(--portal-surface-solid)] p-3">
                  <span className="text-sm text-[var(--portal-text-secondary)]">New users, 7 days</span>
                  <span className="font-semibold text-[var(--portal-text-primary)]">{formatCount(overview.users.newLast7Days)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[var(--portal-surface-solid)] p-3">
                  <span className="text-sm text-[var(--portal-text-secondary)]">Open corpus gaps</span>
                  <span className="font-semibold text-[var(--portal-text-primary)]">{formatCount(overview.corpusGaps.open)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[var(--portal-surface-solid)] p-3">
                  <span className="text-sm text-[var(--portal-text-secondary)]">Trial organizations</span>
                  <span className="font-semibold text-[var(--portal-text-primary)]">{formatCount(overview.billing.trialUsers)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[var(--portal-surface-solid)] p-3">
                  <span className="text-sm text-[var(--portal-text-secondary)]">Stale support tickets</span>
                  <span className="font-semibold text-[var(--portal-text-primary)]">{formatCount(overview.support.overdueOrStale)}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-[var(--portal-text-secondary)]">Pilot pulse is unavailable right now.</p>
            )}
          </div>
        </AdminDataPanel>
      </div>
    </div>
  )
}
