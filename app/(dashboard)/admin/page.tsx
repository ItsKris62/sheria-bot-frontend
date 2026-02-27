"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  FileText,
  Bot,
  CreditCard,
  Activity,
  Settings,
  AlertTriangle,
  ArrowRight,
  Building2,
  Shield,
} from "lucide-react"
import { useAdminStats } from "@/hooks/use-admin"
import { trpc } from "@/lib/trpc"

// static – no backend needed
const quickActions = [
  { label: "User Management", href: "/admin/users", icon: Users, description: "Manage users and permissions" },
  { label: "Knowledge Base", href: "/admin/content/knowledge-base", icon: FileText, description: "Edit regulatory content" },
  { label: "AI Configuration", href: "/admin/ai-config", icon: Bot, description: "Configure AI models and responses" },
  { label: "Billing & Plans", href: "/admin/billing", icon: CreditCard, description: "Manage subscriptions and payments" },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: Activity, description: "View system activity logs" },
  { label: "System Settings", href: "/admin/system", icon: Settings, description: "Platform configuration" },
]

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats()
  const { data: health } = trpc.admin.getDetailedHealth.useQuery()
  const { data: logsData } = trpc.admin.getLogs.useQuery({ page: 1, limit: 5 })
  const recentLogs = (logsData as any)?.logs ?? []

  const statCards = [
    { label: "Total Users", value: (stats as any)?.totalUsers?.toLocaleString(), icon: Users },
    { label: "Active Organizations", value: (stats as any)?.totalOrganizations?.toLocaleString(), icon: Building2 },
    { label: "AI Queries", value: (stats as any)?.totalQueries?.toLocaleString(), icon: Bot },
    { label: "Total Policies", value: (stats as any)?.totalPolicies?.toLocaleString(), icon: FileText },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and system management</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    {statsLoading
                      ? <Skeleton className="h-8 w-20 mt-1" />
                      : <p className="text-2xl font-bold text-foreground">{stat.value ?? "—"}</p>
                    }
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
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
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{action.label}</p>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform audit events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No recent activity</p>
                ) : (
                  recentLogs.map((log: any) => (
                    <div key={log.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{log.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.user?.email ?? log.userId ?? "System"}
                          {log.entityType ? ` · ${log.entityType}` : ""}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString("en-KE", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!(stats as any)?.recentActivity?.length ? (
                <p className="text-sm text-muted-foreground">No active alerts</p>
              ) : (
                (stats as any).recentActivity.slice(0, 3).map((item: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-foreground">{item.description ?? item.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.createdAt ?? Date.now()).toLocaleString("en-KE", { dateStyle: "short", timeStyle: "short" })}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Uptime</span>
                <Badge className="bg-primary/10 text-primary">
                  {(health as any)?.uptime ? `${Math.floor((health as any).uptime / 3600)}h` : "—"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database</span>
                <Badge className={(health as any)?.database ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}>
                  {(health as any)?.database ? "Healthy" : "Checking…"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">AI Service</span>
                <Badge className={(health as any)?.ai ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}>
                  {(health as any)?.ai ? "Operational" : "Checking…"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cache</span>
                <Badge className={(health as any)?.cache ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}>
                  {(health as any)?.cache ? "Connected" : "Checking…"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
