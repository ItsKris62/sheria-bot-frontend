"use client"

import { useAuthStore } from "@/lib/auth-store"
import { trpc } from "@/lib/trpc"
import { usePlan } from "@/lib/plan-context"
import { FeatureGate, LockedFeatureCard } from "@/components/plan/feature-gate"
import { getComplianceScoreTheme } from "@/lib/utils/compliance"
import type { ComplianceScoreIcon } from "@/lib/utils/compliance"
import { PRIORITY_CONFIG } from "@/lib/calendar-config"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
} from "lucide-react"

// -------------------------------------------------------------------------
// Static fixtures (non-compliance sections — no backend change needed yet)
// -------------------------------------------------------------------------

const regulatoryAlerts = [
  {
    id: 1,
    title: "New CBK Digital Lending Regulations",
    description: "Updated requirements for digital credit providers effective March 2026",
    date: "Feb 3, 2026",
    impact: "high",
    read: false,
  },
  {
    id: 2,
    title: "Data Protection Act Amendment",
    description: "Changes to consent requirements for financial data processing",
    date: "Feb 1, 2026",
    impact: "medium",
    read: false,
  },
  {
    id: 3,
    title: "Mobile Money Interoperability Guidelines",
    description: "CBK publishes final guidelines for cross-platform transactions",
    date: "Jan 28, 2026",
    impact: "low",
    read: true,
  },
]

const recentQueries = [
  {
    id: 1,
    query: "What are the KYC requirements for digital lending?",
    date: "2 hours ago",
  },
  {
    id: 2,
    query: "Consumer data protection obligations",
    date: "Yesterday",
  },
  {
    id: 3,
    query: "CBK reporting requirements for payment providers",
    date: "3 days ago",
  },
]

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
    case "shield-check":   return <ShieldCheck {...props} />
    case "check-circle":   return <CheckCircle2 {...props} />
    case "info":           return <Info {...props} />
    case "alert-circle":   return <AlertCircle {...props} />
    case "alert-triangle":
    default:               return <AlertTriangle {...props} />
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

  // Derive calendar feature entitlement from plan context so the query is
  // never fired for users who don't have access (avoids noisy FORBIDDEN errors).
  const { hasFeature } = usePlan()
  const calendarEnabled = hasFeature("complianceCalendar")

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
  } = trpc.compliance.getComplianceDashboard.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  const {
    data: upcomingDeadlines = [],
    isLoading: deadlinesLoading,
  } = trpc.calendar.upcoming.useQuery(
    { daysAhead: 30 },
    { staleTime: 5 * 60 * 1000, enabled: calendarEnabled },
  )

  const overallTheme = dashboardData
    ? getComplianceScoreTheme(dashboardData.overallScore)
    : null

  const trend = dashboardData?.trend ?? 0

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
              {dashboardError.message ?? "Please try refreshing the page."}
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
                <p
                  className="text-4xl font-bold"
                  style={{ color: overallTheme?.color }}
                >
                  {dashboardData.overallScore}%
                </p>
                <Badge
                  variant="outline"
                  className={`mt-1 ${
                    trend > 0
                      ? "border-green-500/50 text-green-500"
                      : trend < 0
                      ? "border-red-500/50 text-red-500"
                      : "border-muted-foreground/50 text-muted-foreground"
                  }`}
                >
                  {trend > 0 ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : trend < 0 ? (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  ) : (
                    <Minus className="mr-1 h-3 w-3" />
                  )}
                  {trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : "No change"} this month
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {dashboardData.categories.map((category: {
                key: string;
                label: string;
                score: number;
                completedItems: number;
                totalItems: number;
              }) => {
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
                    {/* Custom progress bar — color driven by score threshold */}
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
        {/* Upcoming Deadlines — gated behind complianceCalendar entitlement */}
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
                    const dueDate   = new Date(event.dueDate)
                    const daysUntil = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    const isUrgent  = daysUntil <= 3 && daysUntil > 0
                    const isOverdue = daysUntil <= 0
                    const priCfg    = PRIORITY_CONFIG[event.priority as keyof typeof PRIORITY_CONFIG]
                                      ?? PRIORITY_CONFIG["MEDIUM"]

                    return (
                      <div
                        key={event.id}
                        className={`flex items-center gap-4 rounded-lg border p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm cursor-default ${
                          isUrgent  ? "border-orange-300/60 bg-orange-50/40 dark:bg-orange-950/20" :
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
              {regulatoryAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-4 rounded-lg border p-4 transition-all duration-200 hover:shadow-sm hover:border-primary/30 cursor-default ${
                    alert.read ? "border-border/50" : "border-primary/50 bg-primary/5"
                  }`}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    alert.impact === "high"
                      ? "bg-destructive/10 text-destructive"
                      : alert.impact === "medium"
                      ? "bg-warning/10 text-warning"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{alert.title}</p>
                      {!alert.read && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{alert.date}</p>
                  </div>
                  <Badge variant={
                    alert.impact === "high" ? "destructive" :
                    alert.impact === "medium" ? "secondary" : "outline"
                  }>
                    {alert.impact} impact
                  </Badge>
                </div>
              ))}
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
        <Card className="lg:col-span-2 border-border/50 bg-card transition-all duration-200 hover:border-border hover:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Recent Queries</CardTitle>
              <CardDescription>Your recent compliance questions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/startup/compliance-query">
                New query
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentQueries.map((query) => (
                <Link
                  key={query.id}
                  href={`/startup/compliance-query/${query.id}`}
                  className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{query.query}</p>
                    <p className="text-sm text-muted-foreground">{query.date}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
