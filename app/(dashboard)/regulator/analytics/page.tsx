"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Clock,
  Download,
  Calendar,
  Activity,
  PieChart,
} from "lucide-react"
import { useOrgDashboard, useComplianceTrends, useExportAnalytics } from "@/hooks/use-analytics"
import { toast } from "@/hooks/use-toast"

const colors = ["bg-primary", "bg-secondary", "bg-accent", "bg-chart-4", "bg-chart-5"]

function StatSkeleton() {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6 space-y-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-28" />
      </CardContent>
    </Card>
  )
}

export default function RegulatorAnalyticsPage() {
  const [period, setPeriod] = useState("30d")
  const periodDays = period === "7d" ? 7 : period === "90d" ? 90 : period === "1y" ? 365 : 30

  const { data: dashboard, isLoading: dashLoading } = useOrgDashboard()
  const { data: trendsData, isLoading: trendsLoading } = useComplianceTrends({ periods: 6 })
  const exportMutation = useExportAnalytics()

  const d = dashboard as any
  const trends: any[] = (trendsData as any) ?? []

  const statCards = [
    { title: "Total Queries", value: d?.totalQueries?.toLocaleString() ?? "—", icon: Activity, trend: "up", change: d?.queriesGrowth ?? "" },
    { title: "Policies Generated", value: d?.totalPolicies?.toLocaleString() ?? "—", icon: FileText, trend: "up", change: d?.policiesGrowth ?? "" },
    { title: "Active Users", value: d?.activeUsers?.toLocaleString() ?? "—", icon: Users, trend: "up", change: d?.usersGrowth ?? "" },
    { title: "Avg. Response Time", value: d?.avgResponseTime ? `${d.avgResponseTime}s` : "—", icon: Clock, trend: "down", change: d?.responseTimeChange ?? "" },
  ]

  const queryTopics: any[] = d?.topQueryTopics ?? []
  const policyCategories: any[] = d?.policyCategories ?? []
  const recentActivity: any[] = d?.recentActivity ?? []

  async function handleExport() {
    try {
      await exportMutation.mutateAsync({ format: "json", type: "queries" } as any)
      toast({ title: "Export started", description: "Your data export is being prepared." })
    } catch {
      toast({ title: "Export failed", variant: "destructive" })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Platform usage insights and regulatory intelligence metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-transparent" onClick={handleExport} disabled={exportMutation.isPending}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          statCards.map((stat) => (
            <Card key={stat.title} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  {stat.change && (
                    <Badge variant="outline" className={stat.trend === "up" ? "border-secondary/50 text-secondary" : "border-destructive/50 text-destructive"}>
                      {stat.trend === "up" ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                      {stat.change}
                    </Badge>
                  )}
                </div>
                <p className="mt-4 text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Query Trends / Top Topics */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Top Query Topics</CardTitle>
          </CardHeader>
          <CardContent>
            {dashLoading ? (
              <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
            ) : queryTopics.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No query data yet</p>
            ) : (
              <div className="space-y-4">
                {queryTopics.map((item: any, index: number) => (
                  <div key={index}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="truncate text-foreground">{item.query ?? item.topic ?? item.label}</span>
                      <span className="ml-2 shrink-0 text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(100, (item.count / (queryTopics[0]?.count || 1)) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Policy Distribution */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5 text-primary" />Policies by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {dashLoading ? (
              <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</div>
            ) : policyCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No policy data yet</p>
            ) : (
              <div className="space-y-4">
                {policyCategories.map((category: any, index: number) => (
                  <div key={category.name} className="flex items-center gap-4">
                    <div className={`h-3 w-3 rounded-full ${colors[index % colors.length]}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{category.name}</span>
                        <span className="text-muted-foreground">{category.count} ({category.percentage}%)</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-muted">
                        <div className={`h-1.5 rounded-full ${colors[index % colors.length]}`} style={{ width: `${category.percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" />Recent Platform Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-border/50">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-48" /></div>
                </div>
              ))
            ) : recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            ) : (
              recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-start gap-4 rounded-lg border border-border/50 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.action ?? activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.detail ?? activity.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {activity.time ?? (activity.createdAt ? new Date(activity.createdAt).toLocaleString("en-KE", { dateStyle: "short", timeStyle: "short" }) : "")}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
