"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  FileText,
  Bot,
  CreditCard,
  Activity,
  Settings,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Building2,
  Shield,
} from "lucide-react"

const stats = [
  { label: "Total Users", value: "1,247", change: "+12%", icon: Users },
  { label: "Active Organizations", value: "89", change: "+8%", icon: Building2 },
  { label: "AI Queries Today", value: "3,456", change: "+23%", icon: Bot },
  { label: "Monthly Revenue", value: "KES 2.4M", change: "+15%", icon: CreditCard },
]

const quickActions = [
  { label: "User Management", href: "/admin/users", icon: Users, description: "Manage users and permissions" },
  { label: "Knowledge Base", href: "/admin/content/knowledge-base", icon: FileText, description: "Edit regulatory content" },
  { label: "AI Configuration", href: "/admin/ai-config", icon: Bot, description: "Configure AI models and responses" },
  { label: "Billing & Plans", href: "/admin/billing", icon: CreditCard, description: "Manage subscriptions and payments" },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: Activity, description: "View system activity logs" },
  { label: "System Settings", href: "/admin/system", icon: Settings, description: "Platform configuration" },
]

const recentActivity = [
  { user: "john@safaricom.co.ke", action: "Generated PSP License Checklist", time: "2 min ago" },
  { user: "mary@mpesa.co.ke", action: "Queried KYC requirements", time: "5 min ago" },
  { user: "admin@cbk.go.ke", action: "Published new regulation update", time: "15 min ago" },
  { user: "peter@equity.co.ke", action: "Upgraded to Enterprise plan", time: "1 hour ago" },
  { user: "jane@kcb.co.ke", action: "Completed compliance checklist", time: "2 hours ago" },
]

const systemAlerts = [
  { type: "warning", message: "AI response latency increased by 15%", time: "10 min ago" },
  { type: "info", message: "Database backup completed successfully", time: "1 hour ago" },
  { type: "warning", message: "3 users reported incorrect AI responses", time: "3 hours ago" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Platform overview and system management
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="mt-2">
                  <Badge className="bg-primary/10 text-primary text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change} this month
                  </Badge>
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
              <CardDescription>Latest platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
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
              {systemAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    alert.type === "warning" ? "bg-warning/10" : "bg-muted/50"
                  }`}
                >
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              ))}
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
                <span className="text-sm text-muted-foreground">API Uptime</span>
                <Badge className="bg-primary/10 text-primary">99.9%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database Status</span>
                <Badge className="bg-primary/10 text-primary">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">AI Service</span>
                <Badge className="bg-primary/10 text-primary">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Storage</span>
                <Badge className="bg-warning/10 text-warning">78% Used</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
