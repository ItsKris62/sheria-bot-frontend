"use client"

import { useAuthStore } from "@/lib/auth-store"
import { trpc } from "@/lib/trpc"
import { usePlan } from "@/lib/plan-context"
import { useQueryClient } from "@tanstack/react-query"
import { getQueryKey } from "@trpc/react-query"
import { FeatureGate, LockedFeatureCard } from "@/components/plan/feature-gate"
import { getComplianceScoreTheme } from "@/lib/utils/compliance"
import type { ComplianceScoreIcon } from "@/lib/utils/compliance"
import { PRIORITY_CONFIG } from "@/lib/calendar-config"
import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"
import { AllQueriesDialog } from "@/components/compliance/all-queries-dialog"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Search,
  ClipboardCheck,
  AlertTriangle,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Bell,
  ShieldCheck,
  Info,
  Clock,
} from "lucide-react"

// -------------------------------------------------------------------------
// Local types mirroring the backend response shape.
// The backend uses @/ path aliases that the frontend tsconfig cannot resolve,
// so tRPC hook data types infer as {}. These explicit definitions are the
// established workaround (see project memory). Keep in sync with
// compliance.module.ts getComplianceDashboardData return type.
// -------------------------------------------------------------------------
type DashboardCategory = {
  key: string
  label: string
  score: number
  completedItems: number
  totalItems: number
}
type DashboardTrend = {
  points: number | null
  label: "increase" | "decrease" | "no_change" | "insufficient_history"
  comparedAt: string | null
  windowDays: 30
}

// -------------------------------------------------------------------------
// Score icon helper
// -------------------------------------------------------------------------

function ScoreIcon({
  icon,
  color,
  className = "h-5 w-5",
}: {
  icon: ComplianceScoreIcon
  color: string
  className?: string
}) {
  const props = { className, style: { color } }
  switch (icon) {
    case "shield-check": return <ShieldCheck {...props} />
    case "check-circle": return <CheckCircle2 {...props} />
    case "info": return <Info {...props} />
    case "alert-circle": return <AlertCircle {...props} />
    case "alert-triangle":
    default: return <AlertTriangle {...props} />
  }
}

// -------------------------------------------------------------------------
// Skeleton while compliance data loads
// -------------------------------------------------------------------------

function ComplianceScoreSkeleton() {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="h-10 w-20 ml-auto" />
            <Skeleton className="h-6 w-28 ml-auto" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-8 w-14" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-1 w-full rounded-full" />
              <Skeleton className="h-3 w-20 mt-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// -------------------------------------------------------------------------
// Main dashboard component
// -------------------------------------------------------------------------

export default function StartupDashboard() {
  const user = useAuthStore((state) => state.user)
  const displayName = user?.name?.split(" ")[0] ?? "there"
  const queryClient = useQueryClient()

  // Derive calendar feature entitlement from plan context so the query is
  // never fired for users who don't have access (avoids noisy FORBIDDEN errors).
  const { hasFeature } = usePlan()
  const calendarEnabled = hasFeature("complianceCalendar")

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
  } = trpc.complianceDashboard.getComplianceDashboard.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    retry: 1,
    // Block until the auth store has hydrated. AuthGuard ensures the user is
    // authenticated, but the Zustand store populates asynchronously from the
    // persisted session, so !!user is the correct readiness signal here.
    enabled: !!user,
  })

  // Mutation for toggling compliance items. Invalidates the dashboard query on
  // success so the score refreshes without a page reload (fixes F-02 dead cache).
  // The trigger UI (per-item checkbox) lives in the category drill-down component;
  // this hook is defined here so the invalidation keys are co-located with the query.
  const { mutate: toggleItemCompleted } = trpc.complianceDashboard.updateDashboardItem.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getQueryKey(trpc.complianceDashboard.getComplianceDashboard),
      })
      void queryClient.invalidateQueries({
        queryKey: getQueryKey(trpc.complianceDashboard.getChecklistByCategory),
      })
      toast.success("Item updated")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const {
    data: upcomingDeadlines = [],
    isLoading: deadlinesLoading,
  } = trpc.calendar.upcoming.useQuery(
    { daysAhead: 30 },
    { staleTime: 5 * 60 * 1000, enabled: calendarEnabled },
  )

  const {
    data: alertsData,
    isLoading: alertsLoading,
    isError: alertsError,
  } = trpc.alert.getAlerts.useQuery(
    { page: 1, limit: 3 },
    { staleTime: 60 * 1000, enabled: !!user },
  )

  type AlertItem = {
    id: string
    title: string
    summary: string
    severity: string
    regulatoryBody: string
    publishedAt: Date | string | null
    isRead: boolean
  }
  const regulatoryAlerts: AlertItem[] = Array.isArray(alertsData?.alerts)
    ? (alertsData.alerts as AlertItem[])
    : []

  const overallTheme = dashboardData
    ? getComplianceScoreTheme(dashboardData.overallScore)
    : null

  const trendInfo = (dashboardData as { trend?: DashboardTrend } | undefined)?.trend ?? null

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Welcome back, {displayName}</h1>
          <p className="text-muted-foreground">Track your compliance status and stay ahead of regulations</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/startup/compliance-query">
            <Search className="mr-2 h-4 w-4" />
            Ask Compliance Question
          </Link>
        </Button>
      </div>

      {/* Compliance Overview */}
      {isDashboardLoading ? (
        <ComplianceScoreSkeleton />
      ) : dashboardError ? (
        <Card className="border-destructive/50 bg-card">
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
            <p className="font-medium text-foreground">Failed to load compliance scores</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please try refreshing the page. If the problem persists, contact support.
            </p>
          </CardContent>
        </Card>
      ) : dashboardData ? (
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Compliance Score</CardTitle>
                <CardDescription>Overall regulatory compliance status</CardDescription>
              </div>
              <div className="text-right">
                {/* Score with weighting tooltip */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p
                        className="text-4xl font-bold cursor-help focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                        style={{ color: overallTheme?.color }}
                        tabIndex={0}
                      >
                        {dashboardData.overallScore}%
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs text-xs leading-relaxed">
                      Overall score is a weighted average: Data Protection (25%), AML/KYC (25%),
                      CBK Licensing (20%), Consumer Protection (15%), Cybersecurity (15%).
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Trend badge - discriminated on label, never shows raw "%" as if percent change */}
                {trendInfo?.label === "insufficient_history" && (
                  <Badge variant="outline" className="mt-1 border-muted-foreground/40 text-muted-foreground">
                    <Minus className="mr-1 h-3 w-3" />
                    Building history...
                  </Badge>
                )}
                {trendInfo?.label === "no_change" && (
                  <Badge variant="outline" className="mt-1 border-muted-foreground/50 text-muted-foreground">
                    <Minus className="mr-1 h-3 w-3" />
                    No change vs 30 days ago
                  </Badge>
                )}
                {trendInfo?.label === "increase" && trendInfo.points !== null && (
                  <Badge variant="outline" className="mt-1 border-green-500/50 text-green-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +{trendInfo.points} pts vs 30 days ago
                  </Badge>
                )}
                {trendInfo?.label === "decrease" && trendInfo.points !== null && (
                  <Badge variant="outline" className="mt-1 border-red-500/50 text-red-500">
                    <TrendingDown className="mr-1 h-3 w-3" />
                    {trendInfo.points} pts vs 30 days ago
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {dashboardData.categories.map((category: DashboardCategory) => {
                const theme = getComplianceScoreTheme(category.score)
                return (
                  <div
                    key={category.key}
                    className={`rounded-lg p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-default ${theme.tailwindBgMuted}`}
                  >
                    <div className="flex items-center justify-between">
                      <p
                        className="text-2xl font-bold"
                        style={{ color: theme.color }}
                      >
                        {category.score}%
                      </p>
                      <ScoreIcon icon={theme.icon} color={theme.color} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{category.label}</p>
                    {/* Custom progress bar - color driven by score threshold */}
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted/40">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${category.score}%`,
                          backgroundColor: theme.color,
                        }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {category.completedItems}/{category.totalItems} items
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Deadlines - gated behind complianceCalendar entitlement */}
        <FeatureGate
          feature="complianceCalendar"
          fallback={
            <LockedFeatureCard
              feature="complianceCalendar"
              title="Upcoming Deadlines"
              description="Track upcoming regulatory deadlines. Available on the Startup plan and above."
              requiredPlan="STARTUP"
            />
          }
        >
          <Card className="border-border/50 bg-card transition-all duration-200 hover:border-border hover:shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Upcoming Deadlines</CardTitle>
                <CardDescription>Don&apos;t miss these important dates</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/startup/calendar">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deadlinesLoading ? (
                  <>
                    <Skeleton className="h-[72px] rounded-lg" />
                    <Skeleton className="h-[72px] rounded-lg" />
                    <Skeleton className="h-[72px] rounded-lg" />
                  </>
                ) : upcomingDeadlines.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No upcoming compliance deadlines in the next 30 days.
                  </p>
                ) : (
                  (upcomingDeadlines as Array<{
                    id: string
                    title: string
                    dueDate: string | Date
                    priority: string
                    status: string
                    category: string
                    regulation: string | null
                  }>).map((event) => {
                    const dueDate = new Date(event.dueDate)
                    const daysUntil = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    const isUrgent = daysUntil <= 3 && daysUntil > 0
                    const isOverdue = daysUntil <= 0
                    const priCfg = PRIORITY_CONFIG[event.priority as keyof typeof PRIORITY_CONFIG]
                      ?? PRIORITY_CONFIG["MEDIUM"]

                    return (
                      <div
                        key={event.id}
                        className={`flex items-center gap-4 rounded-lg border p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm cursor-default ${isUrgent ? "border-orange-300/60 bg-orange-50/40 dark:bg-orange-950/20" :
                          isOverdue ? "border-destructive/40 bg-destructive/5" :
                            "border-border/50"
                          }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                          {isUrgent ? (
                            <span className="relative flex h-5 w-5 items-center justify-center">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-50" />
                              <Calendar className="relative h-4 w-4 text-orange-500" />
                            </span>
                          ) : (
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {dueDate.toLocaleDateString("en-KE", { dateStyle: "medium" })}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {isOverdue ? (
                            <span className="text-xs font-bold text-destructive">OVERDUE</span>
                          ) : (
                            <Badge variant={daysUntil <= 7 ? "destructive" : "outline"}>
                              {daysUntil}d left
                            </Badge>
                          )}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${priCfg.color}`}>
                            {priCfg.label}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </FeatureGate>

        {/* Regulatory Alerts */}
        <Card className="lg:col-span-2 border-border/50 bg-card transition-all duration-200 hover:border-border hover:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Bell className="h-5 w-5 text-primary" />
                Regulatory Alerts
              </CardTitle>
              <CardDescription>Recent regulatory changes affecting your business</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/startup/monitor">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertsLoading ? (
                <>
                  <Skeleton className="h-[88px] rounded-lg" />
                  <Skeleton className="h-[88px] rounded-lg" />
                  <Skeleton className="h-[88px] rounded-lg" />
                </>
              ) : alertsError ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                  <AlertCircle className="h-6 w-6 text-destructive/60" />
                  <p className="text-sm text-muted-foreground">Could not load regulatory alerts</p>
                </div>
              ) : regulatoryAlerts.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No active regulatory alerts for your current plan window.
                </p>
              ) : regulatoryAlerts.map((alert) => {
                const severity = alert.severity.toLowerCase()
                const publishedAt = alert.publishedAt ? new Date(alert.publishedAt) : null
                return (
                  <Link
                    key={alert.id}
                    href={`/dashboard/alerts/${alert.id}`}
                    className={`flex items-start gap-4 rounded-lg border p-4 transition-all duration-200 hover:shadow-sm hover:border-primary/30 ${alert.isRead ? "border-border/50" : "border-primary/50 bg-primary/5"
                      }`}
                  >
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${severity === "critical" || severity === "high"
                      ? "bg-destructive/10 text-destructive"
                      : severity === "medium"
                        ? "bg-warning/10 text-warning"
                        : "bg-muted text-muted-foreground"
                      }`}>
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{alert.title}</p>
                        {!alert.isRead && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{alert.summary}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {alert.regulatoryBody}
                        {publishedAt ? ` - ${formatDistanceToNow(publishedAt, { addSuffix: true })}` : ""}
                      </p>
                    </div>
                    <Badge variant={
                      severity === "critical" || severity === "high" ? "destructive" :
                        severity === "medium" ? "secondary" : "outline"
                    }>
                      {severity} impact
                    </Badge>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Queries */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="border-border/50 bg-card transition-all duration-200 hover:border-border hover:shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>Common compliance tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="justify-start bg-transparent transition-all duration-200 hover:bg-primary/5 hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30">
                <Link href="/startup/compliance-query">
                  <Search className="mr-2 h-4 w-4 text-primary" />
                  Ask Compliance Question
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start bg-transparent transition-all duration-200 hover:bg-secondary/5 hover:border-secondary/40 focus-visible:ring-2 focus-visible:ring-secondary/30">
                <Link href="/startup/checklists">
                  <ClipboardCheck className="mr-2 h-4 w-4 text-secondary" />
                  Generate Checklist
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start bg-transparent transition-all duration-200 hover:bg-warning/5 hover:border-warning/40 focus-visible:ring-2 focus-visible:ring-warning/30">
                <Link href="/startup/gap-analysis">
                  <AlertTriangle className="mr-2 h-4 w-4 text-warning" />
                  Run Gap Analysis
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start bg-transparent transition-all duration-200 hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-border">
                <Link href="/startup/documents">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  View Documents
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Queries */}
        <RecentQueriesCard />
      </div>
    </div>
  )
}

// -------------------------------------------------------------------------
// Recent Queries card (extracted so the live-data hooks live in the component)
// -------------------------------------------------------------------------

function RecentQueriesCard() {
  const [showAllQueries, setShowAllQueries] = useState(false)

  const { data, isLoading, isError } = trpc.compliance.history.useQuery(
    { page: 1, limit: 3 }
  )

  type QueryItem = { id: string; query: string; createdAt: Date }
  const queries: QueryItem[] =
    Array.isArray(data?.queries) ? (data.queries as QueryItem[]) : []

  return (
    <>
      <Card className="lg:col-span-2 border-border/50 bg-card transition-all duration-200 hover:border-border hover:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Recent Queries</CardTitle>
            <CardDescription>Your recent compliance questions</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            {queries.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllQueries(true)}
              >
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/startup/compliance-query">
                New query
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
              <AlertCircle className="h-6 w-6 text-destructive/60" />
              <p className="text-sm text-muted-foreground">
                Could not load recent queries
              </p>
            </div>
          ) : queries.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No queries yet. Ask your first question!
            </p>
          ) : (
            <div className="space-y-3">
              {queries.map((item) => (
                <Link
                  key={item.id}
                  href={`/startup/compliance-query/${item.id}`}
                  className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {item.query}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AllQueriesDialog
        open={showAllQueries}
        onOpenChange={setShowAllQueries}
      />
    </>
  )
}
