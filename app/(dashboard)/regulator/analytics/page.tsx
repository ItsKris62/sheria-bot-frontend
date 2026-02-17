"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const stats = [
  {
    title: "Total Queries",
    value: "2,847",
    change: "+12%",
    trend: "up",
    icon: Activity,
  },
  {
    title: "Policies Generated",
    value: "156",
    change: "+8%",
    trend: "up",
    icon: FileText,
  },
  {
    title: "Active Fintechs",
    value: "89",
    change: "+5%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Avg. Response Time",
    value: "2.3s",
    change: "-15%",
    trend: "down",
    icon: Clock,
  },
]

const topQueries = [
  { query: "Digital credit provider licensing requirements", count: 342 },
  { query: "AML/KYC compliance procedures", count: 289 },
  { query: "Data protection act requirements", count: 256 },
  { query: "Mobile money operator regulations", count: 198 },
  { query: "Consumer protection guidelines", count: 167 },
]

const policyCategories = [
  { name: "Consumer Protection", count: 45, percentage: 29 },
  { name: "AML/CFT", count: 38, percentage: 24 },
  { name: "Licensing", count: 32, percentage: 21 },
  { name: "Data Protection", count: 24, percentage: 15 },
  { name: "Cybersecurity", count: 17, percentage: 11 },
]

const recentActivity = [
  { action: "Policy generated", detail: "Consumer Protection Policy v2.1", time: "2 hours ago" },
  { action: "Framework published", detail: "DCP Compliance Framework", time: "4 hours ago" },
  { action: "Document updated", detail: "CBK Guidelines 2024", time: "6 hours ago" },
  { action: "Query spike detected", detail: "AML/KYC related queries +40%", time: "1 day ago" },
  { action: "New regulation added", detail: "Mobile Money Draft Regs", time: "2 days ago" },
]

export default function RegulatorAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Platform usage insights and regulatory intelligence metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30d">
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
          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge 
                  variant="outline" 
                  className={stat.trend === "up" 
                    ? "border-secondary/50 text-secondary" 
                    : "border-destructive/50 text-destructive"
                  }
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <p className="mt-4 text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Query Trends */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Top Query Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topQueries.map((item, index) => (
                <div key={index}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="truncate text-foreground">{item.query}</span>
                    <span className="ml-2 shrink-0 text-muted-foreground">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(item.count / topQueries[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Policy Distribution */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Policies by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {policyCategories.map((category, index) => {
                const colors = ["bg-primary", "bg-secondary", "bg-accent", "bg-chart-4", "bg-chart-5"]
                return (
                  <div key={category.name} className="flex items-center gap-4">
                    <div className={`h-3 w-3 rounded-full ${colors[index]}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{category.name}</span>
                        <span className="text-muted-foreground">{category.count} ({category.percentage}%)</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-muted">
                        <div
                          className={`h-1.5 rounded-full ${colors[index]}`}
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Platform Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 rounded-lg border border-border/50 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
