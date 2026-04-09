"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import {
  Users, FileText, Bot, CreditCard, Activity, Settings,
  AlertTriangle, ArrowRight, Building2, Shield, TrendingUp,
  CheckCircle2, XCircle, Zap,
} from "lucide-react"
import { useAdminStats } from "@/hooks/use-admin"
import { trpc } from "@/lib/trpc"

const quickActions = [
  { label: "User Management",   href: "/admin/users",                    icon: Users,    description: "Manage users and permissions" },
  { label: "Organizations",     href: "/admin/organizations",            icon: Building2, description: "View and manage all organizations" },
  { label: "Analytics",         href: "/admin/analytics",               icon: TrendingUp, description: "Platform metrics and revenue" },
  { label: "AI Configuration",  href: "/admin/ai-config",               icon: Bot,      description: "Configure AI models and responses" },
  { label: "Billing & Plans",   href: "/admin/billing",                 icon: CreditCard, description: "Manage subscriptions and payments" },
  { label: "System Settings",   href: "/admin/system",                  icon: Settings, description: "Platform configuration" },
]

function ServiceBadge({ status }: { status: string | undefined }) {
  if (!status) return <Badge variant="outline" className="text-gray-400">Checking...</Badge>
  if (status === "healthy") return <Badge className="bg-green-100 text-green-700 border-0">Healthy</Badge>
  if (status === "degraded") return <Badge className="bg-yellow-100 text-yellow-700 border-0">Degraded</Badge>
  return <Badge className="bg-red-100 text-red-700 border-0">Down</Badge>
}

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats()
  const { data: health } = trpc.admin.getDetailedHealth.useQuery(undefined, { refetchInterval: 30000 })
  const { data: logsData } = trpc.admin.getLogs.useQuery({ page: 1, limit: 5 })
  const { data: growth } = trpc.admin.getUserGrowth.useQuery({
    period: "daily",
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  })
  const { data: aiUsage } = trpc.admin.getAIUsageMetrics.useQuery({
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  })

  const recentLogs = (logsData as { items?: Array<{ id: string; action: string; userId: string | null; entityType: string | null; createdAt: Date }> })?.items ?? []

  type StatsShape = {
    users?: { total?: number; active?: number }
    organizations?: { total?: number }
    queries?: { total?: number }
    policies?: { total?: number }
  }
  const s = stats as StatsShape | undefined

  const statCards = [
    { label: "Total Users",         value: s?.users?.total?.toLocaleString(),         icon: Users,     color: "bg-primary" },
    { label: "Organizations",       value: s?.organizations?.total?.toLocaleString(), icon: Building2, color: "bg-secondary" },
    { label: "AI Queries",          value: s?.queries?.total?.toLocaleString(),        icon: Bot,       color: "bg-warning" },
    { label: "Total Policies",      value: s?.policies?.total?.toLocaleString(),       icon: FileText,  color: "bg-accent" },
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
            <Card key={stat.label}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    {statsLoading
                      ? <Skeleton className="h-8 w-20 mt-1" />
                      : <p className="text-2xl font-bold text-foreground mt-1">{stat.value ?? "—"}</p>
                    }
                  </div>
                  <div className={`p-2.5 rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5 text-white" />
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
            <CardTitle className="text-sm font-medium text-gray-600">User Signups (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {!growth?.series.length ? (
              <div className="h-36 flex items-center justify-center text-gray-300">
                <Users className="w-8 h-8" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={144}>
                <LineChart data={growth.series} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v: string) => new Date(v).toLocaleDateString("en-KE", { month: "short", day: "numeric" })} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} formatter={(v: number) => [v, "Users"]} />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">AI Queries (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {!aiUsage?.series.length ? (
              <div className="h-36 flex items-center justify-center text-gray-300">
                <Zap className="w-8 h-8" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={144}>
                <BarChart data={aiUsage.series} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v: string) => new Date(v).toLocaleDateString("en-KE", { month: "short", day: "numeric" })} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} formatter={(v: number) => [v, "Queries"]} />
                  <Bar dataKey="count" fill="hsl(var(--warning))" radius={[2, 2, 0, 0]} />
                </BarChart>
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
                        <ArrowRight className="h-4 w-4 text-gray-300 flex-shrink-0" />
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
                <p className="text-sm text-gray-400 py-4 text-center">No recent activity</p>
              ) : (
                <div className="space-y-3">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{log.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.userId ?? "System"}{log.entityType ? ` · ${log.entityType}` : ""}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-4">
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
                <span className="text-sm text-gray-500">Overall</span>
                <ServiceBadge status={typedHealth?.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Database</span>
                <ServiceBadge status={typedHealth?.services?.database?.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Redis Cache</span>
                <ServiceBadge status={typedHealth?.services?.redis?.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Storage (R2)</span>
                <ServiceBadge status={typedHealth?.services?.storage?.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Pinecone</span>
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
                <AlertTriangle className="h-4 w-4 text-yellow-500" /> Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Link href="/admin/users?status=pending" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Pending user approvals</span>
                <ArrowRight className="w-3 h-3 text-gray-300 ml-auto" />
              </Link>
              <Link href="/admin/support" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                <CheckCircle2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Open support tickets</span>
                <ArrowRight className="w-3 h-3 text-gray-300 ml-auto" />
              </Link>
              <Link href="/admin/security" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                <XCircle className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Failed login attempts</span>
                <ArrowRight className="w-3 h-3 text-gray-300 ml-auto" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
