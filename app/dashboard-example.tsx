'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard, EmptyState, PageHeader } from '@/components/ui/dashboard-components'
import { SimpleLineChart, SimpleBarChart } from '@/components/charts/dashboard-charts'
import { mockData } from '@/lib/mock-data'
import {
  Users,
  Building2,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Activity,
} from 'lucide-react'

export default function AdminDashboard() {
  // Prepare mock data
  const users = mockData.users
  const orgs = mockData.fintechOrganizations
  const auditLogs = mockData.auditLogs.slice(0, 10)
  const revenueData = mockData.timeSeriesData.revenue.slice(-30)
  const userGrowthData = mockData.timeSeriesData.users.slice(-30)

  const activeUsers = users.filter((u) => u.status === 'active').length
  const activeOrgs = orgs.filter((o) => o.status === 'active').length

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <PageHeader
          title="Admin Dashboard"
          description="Platform overview and real-time monitoring"
          breadcrumbs={[{ label: 'Admin' }]}
        />

        {/* Key Metrics */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Users"
            value={users.length}
            change={12}
            changeLabel="vs last month"
            icon={<Users className="w-6 h-6" />}
            variant="default"
          />
          <StatCard
            label="Active Organizations"
            value={activeOrgs}
            change={5}
            changeLabel="vs last month"
            icon={<Building2 className="w-6 h-6" />}
            variant="default"
          />
          <StatCard
            label="Platform Revenue"
            value="₭2.4M"
            change={18}
            changeLabel="vs last month"
            icon={<TrendingUp className="w-6 h-6" />}
            variant="success"
          />
          <StatCard
            label="Critical Alerts"
            value={12}
            change={-3}
            changeLabel="vs last month"
            icon={<AlertCircle className="w-6 h-6" />}
            variant="destructive"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SimpleLineChart
            data={revenueData}
            title="Revenue Trend"
            description="Monthly recurring revenue over the last 30 days"
            showComparison
          />
          <SimpleBarChart
            data={userGrowthData}
            title="User Growth"
            description="Active users trend over the last 30 days"
            showComparison
          />
        </div>

        {/* Recent Activity Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Audit Logs */}
          <Card className="lg:col-span-2 border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Recent Activity</CardTitle>
                <CardDescription>Latest system actions and user activities</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 border-b border-border pb-4 last:border-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{log.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString('en-KE')}
                      </p>
                    </div>
                    <Badge variant={log.status === 'success' ? 'outline' : 'destructive'} className="flex-shrink-0">
                      {log.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">System Health</CardTitle>
              <CardDescription>Platform status overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">API Uptime</span>
                <span className="text-lg font-bold text-success">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Response Time</span>
                <span className="text-lg font-bold text-foreground">145ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Active Sessions</span>
                <span className="text-lg font-bold text-foreground">{activeUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Database Load</span>
                <span className="text-lg font-bold text-warning">73%</span>
              </div>
              <Button className="w-full mt-4 gap-2">
                <CheckCircle2 className="h-4 w-4" />
                All Systems Operational
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Pending Administrative Tasks</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { task: 'Review 5 pending organization approvals', priority: 'high', dueDate: 'Today' },
                { task: 'Update security policies', priority: 'medium', dueDate: 'Tomorrow' },
                { task: 'Migrate 3 legacy accounts', priority: 'medium', dueDate: 'Mar 25' },
                { task: 'Audit API access logs', priority: 'low', dueDate: 'Mar 28' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.task}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.dueDate}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      item.priority === 'high'
                        ? 'destructive'
                        : item.priority === 'medium'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
