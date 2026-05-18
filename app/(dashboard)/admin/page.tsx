"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import {
  Users, FileText, Bot, CreditCard, Activity, Settings,
  AlertTriangle, ArrowRight, Building2, Shield, TrendingUp,
  CheckCircle2, XCircle, Zap,
} from "lucide-react"
import { trpc } from "@/lib/trpc"

const quickActions = [
  { label: "User Management",   href: "/admin/users",         icon: Users,      description: "Manage users and permissions" },
  { label: "Organizations",     href: "/admin/organizations", icon: Building2,  description: "View and manage all organizations" },
  { label: "Analytics",         href: "/admin/analytics",     icon: TrendingUp, description: "Platform metrics and revenue" },
  { label: "AI Configuration",  href: "/admin/ai-config",     icon: Bot,        description: "Configure AI models and responses" },
  { label: "Billing & Plans",   href: "/admin/billing",       icon: CreditCard, description: "Manage subscriptions and payments" },
  { label: "System Settings",   href: "/admin/system",        icon: Settings,   description: "Platform configuration" },
]

const CHART_COLORS = {
  users: "#22c55e",
  active: "#14b8a6",
  organizations: "#3b82f6",
  queries: "#f97316",
}

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  color: "hsl(var(--popover-foreground))",
  fontSize: 11,
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.35)",
}

function getLastThirtyDaysRange() {
  const dateTo = new Date()
  const dateFrom = new Date(dateTo)
  dateFrom.setDate(dateTo.getDate() - 29)
  dateFrom.setHours(0, 0, 0, 0)

  return {
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
  }
}

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString("en-KE", { month: "short", day: "numeric" })
}

function formatCount(value: number | null | undefined) {
  return typeof value === "number" ? value.toLocaleString("en-KE") : undefined
}

function resolveCount(primary: number | null | undefined, fallback: number | null | undefined) {
  if (typeof primary === "number" && primary > 0) return primary
  if (typeof fallback === "number" && fallback > 0) return fallback
  return primary ?? fallback
}

function ServiceBadge({ status }: { status: string | undefined }) {
  if (!status) return <Badge variant="outline" className="text-muted-foreground">Checking...</Badge>
  if (status === "healthy") return <Badge className="bg-primary/15 text-primary border-0">Healthy</Badge>
  if (status === "degraded") return <Badge className="bg-warning/15 text-warning border-0">Degraded</Badge>
  return <Badge className="bg-destructive/15 text-destructive border-0">Down</Badge>
}

function hasSeriesActivity(series: Array<{ count: number }> | undefined) {
  return Boolean(series?.some((point) => point.count > 0))
}

type StatsShape = {
  users?: { total?: number; active?: number }
  organizations?: { total?: number }
  queries?: { total?: number }
  policies?: { total?: number }
}

export default function AdminDashboard() {
  const thirtyDayRange = useMemo(() => getLastThirtyDaysRange(), [])

  const { data: rawStats, isLoading: statsLoading } = trpc.admin.getStats.useQuery(undefined, {
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  })
  const { data: health } = trpc.admin.getDetailedHealth.useQuery(undefined, { refetchInterval: 30000 })
  const { data: logsData } = trpc.admin.getLogs.useQuery({ page: 1, limit: 5 })
  const { data: usersFallback, isLoading: usersFallbackLoading } = trpc.admin.listUsers.useQuery({ page: 1, limit: 1 })
  const { data: activeUsersFallback, isLoading: activeUsersFallbackLoading } = trpc.admin.listUsers.useQuery({ page: 1, limit: 1, status: "active" })
  const { data: organizationsFallback, isLoading: organizationsFallbackLoading } = trpc.admin.getAllOrganizations.useQuery({ page: 1, limit: 1 })
  const { data: growth } = trpc.admin.getUserGrowth.useQuery({
    period: "daily",
    ...thirtyDayRange,
  })
  const { data: aiUsage } = trpc.admin.getAIUsageMetrics.useQuery(thirtyDayRange)

  const stats = rawStats as StatsShape | undefined

  const recentLogs = (logsData as { items?: Array<{ id: string; action: string; userId: string | null; entityType: string | null; createdAt: Date }> })?.items ?? []
  const userTotal = resolveCount(stats?.users?.total, usersFallback?.pagination?.total)
  const activeUserTotal = resolveCount(stats?.users?.active, activeUsersFallback?.pagination?.total)
  const organizationTotal = resolveCount(stats?.organizations?.total, organizationsFallback?.total)
  const aiQueryTotal = resolveCount(stats?.queries?.total, aiUsage?.totalQueries)
  const cardLoading = statsLoading || usersFallbackLoading || activeUsersFallbackLoading || organizationsFallbackLoading

  const statCards = [
    { label: "Total Users",    value: formatCount(userTotal),         icon: Users,     color: CHART_COLORS.users },
    { label: "Active Users",   value: formatCount(activeUserTotal),   icon: Activity,  color: CHART_COLORS.active },
    { label: "Organizations",  value: formatCount(organizationTotal), icon: Building2, color: CHART_COLORS.organizations },
    { label: "AI Queries",     value: formatCount(aiQueryTotal),      icon: Bot,       color: CHART_COLORS.queries },
  ]

  const typedHealth = health as {
    uptime?: number
    status?: string
    services?: {
      database?: { status: string; latencyMs?: number }
      redis?: { status: string; latencyMs?: number }
      storage?: { status: string }
      pinecone?: { status: string }
    }
  } | undefined

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and system management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow-green-sm">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    {cardLoading
                      ? <Skeleton className="h-8 w-20 mt-1" />
                      : <p className="text-2xl font-bold text-foreground mt-1">{stat.value ?? "0"}</p>
                    }
                  </div>
                  <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${stat.color}22` }}>
                    <Icon className="h-5 w-5" style={{ color: stat.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">User Signups (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {!growth?.series?.length || !hasSeriesActivity(growth.series) ? (
              <div className="h-36 flex items-center justify-center text-muted-foreground/40">
                <Users className="w-8 h-8" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={144}>
                <LineChart data={growth.series} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={formatShortDate} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [value, "Users"]} labelFormatter={formatShortDate} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={CHART_COLORS.users}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                    isAnimationActive
                    animationDuration={650}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Queries (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {!aiUsage?.series?.length || !hasSeriesActivity(aiUsage.series) ? (
              <div className="h-36 flex items-center justify-center text-muted-foreground/40">
                <Zap className="w-8 h-8" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={144}>
                <LineChart data={aiUsage.series} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={formatShortDate} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [value, "Queries"]} labelFormatter={formatShortDate} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={CHART_COLORS.queries}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                    isAnimationActive
                    animationDuration={650}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions + Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link key={action.label} href={action.href}>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-card hover:bg-muted transition-colors cursor-pointer border border-border/50">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">{action.label}</p>
                          <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="w-4 h-4" /> Recent Activity</CardTitle>
              <CardDescription>Latest audit log entries</CardDescription>
            </CardHeader>
            <CardContent>
              {recentLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No recent activity</p>
              ) : (
                <div className="space-y-3">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{log.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.userId ?? "System"}{log.entityType ? ` · ${log.entityType}` : ""}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-4">
                        {new Date(log.createdAt).toLocaleString("en-KE", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/admin/audit-logs" className="block mt-3 text-xs text-primary hover:underline text-center">
                View all audit logs →
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall</span>
                <ServiceBadge status={typedHealth?.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database</span>
                <ServiceBadge status={typedHealth?.services?.database?.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Redis Cache</span>
                <ServiceBadge status={typedHealth?.services?.redis?.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Storage (R2)</span>
                <ServiceBadge status={typedHealth?.services?.storage?.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pinecone</span>
                <ServiceBadge status={typedHealth?.services?.pinecone?.status} />
              </div>
              {typedHealth?.uptime && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="text-sm font-medium text-foreground">
                    {Math.floor(typedHealth.uptime / 3600)}h {Math.floor((typedHealth.uptime % 3600) / 60)}m
                  </span>
                </div>
              )}
              <Link href="/admin/system" className="block mt-2 text-xs text-primary hover:underline text-center">
                Full system status →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" /> Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Link href="/admin/users?status=pending" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Pending user approvals</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground/40 ml-auto" />
              </Link>
              <Link href="/admin/support" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Open support tickets</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground/40 ml-auto" />
              </Link>
              <Link href="/admin/security" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                <XCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Failed login attempts</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground/40 ml-auto" />
              </Link>
              <Link href="/admin/pilot" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Pilot programme</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground/40 ml-auto" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
