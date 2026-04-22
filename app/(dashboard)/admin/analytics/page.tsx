"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import {
  Users, Building2, Bot, CreditCard, TrendingUp, TrendingDown,
  Activity, BarChart2, DollarSign,
} from "lucide-react"
import { trpc } from "@/lib/trpc"

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", { month: "short", day: "numeric" })
}

function fmtMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", { month: "short", year: "2-digit" })
}

function fmtKES(n: number) {
  return `KES ${n.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`
}

interface StatCardProps {
  title: string
  value: string | number | undefined
  sub?: string
  icon: React.ComponentType<{ className?: string }>
  loading: boolean
  trend?: "up" | "down" | "neutral"
}

function StatCard({ title, value, sub, icon: Icon, loading, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <p className="text-2xl font-bold text-foreground mt-1">{value ?? "—"}</p>
            )}
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
            {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── User Growth Tab ──────────────────────────────────────────────────────────

function UserGrowthTab() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily")
  const dateFrom = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()

  const { data: stats, isLoading: statsLoading } = trpc.admin.getStats.useQuery()
  const { data: growth, isLoading: growthLoading } = trpc.admin.getUserGrowth.useQuery({ period, dateFrom })

  const s = stats as { users?: { total?: number; active?: number }; organizations?: { total?: number } } | undefined
  const series = (growth?.series ?? []) as Array<{ date: string; count: number }>

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Users" value={s?.users?.total?.toLocaleString()} icon={Users} loading={statsLoading} trend="up" />
        <StatCard title="Active Users" value={s?.users?.active?.toLocaleString()} icon={Activity} loading={statsLoading} sub="Logged in recently" />
        <StatCard title="Organizations" value={s?.organizations?.total?.toLocaleString()} icon={Building2} loading={statsLoading} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base">User Signups Over Time</CardTitle>
            <CardDescription>New user registrations by {period} period</CardDescription>
          </div>
          <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {growthLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : series.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground/40">
              <Users className="w-10 h-10" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <LineChart data={series} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={period === "monthly" ? fmtMonth : fmtDate} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [v, "New Users"]} labelFormatter={period === "monthly" ? fmtMonth : fmtDate} />
                <Line type="monotone" dataKey="count" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── AI Usage Tab ─────────────────────────────────────────────────────────────

function AIUsageTab() {
  const dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data: ai, isLoading } = trpc.admin.getAIUsageMetrics.useQuery({ dateFrom })

  const series = (ai?.series ?? []) as Array<{ date: string; count: number }>

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Queries" value={ai?.totalQueries?.toLocaleString()} icon={Bot} loading={isLoading} />
        <StatCard title="Total Policies" value={ai?.totalPolicies?.toLocaleString()} icon={BarChart2} loading={isLoading} />
        <StatCard title="Queries This Month" value={ai?.queriesThisMonth?.toLocaleString()} icon={Activity} loading={isLoading} trend="up" />
        <StatCard title="Policies This Month" value={ai?.policiesThisMonth?.toLocaleString()} icon={TrendingUp} loading={isLoading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily AI Query Volume (last 30 days)</CardTitle>
          <CardDescription>Number of AI queries processed per day</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : series.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground/40">
              <Bot className="w-10 h-10" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={series} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={fmtDate} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [v, "Queries"]} labelFormatter={fmtDate} />
                <Bar dataKey="count" fill={CHART_COLORS[0]} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Revenue Tab ──────────────────────────────────────────────────────────────

function RevenueTab() {
  const { data: revenue, isLoading } = trpc.admin.getRevenueMetrics.useQuery({
    dateFrom: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  })

  const series = (revenue?.series ?? []) as Array<{ date: string; amount: number }>
  const byProvider = revenue?.byProvider as { STRIPE?: number; MPESA?: number } | undefined
  const providerData = byProvider
    ? [
        { name: "Stripe", value: byProvider.STRIPE ?? 0 },
        { name: "M-Pesa", value: byProvider.MPESA ?? 0 },
      ].filter((d) => d.value > 0)
    : []

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={revenue ? fmtKES(revenue.totalRevenue) : undefined} icon={DollarSign} loading={isLoading} trend="up" />
        <StatCard title="This Month" value={revenue ? fmtKES(revenue.currentMonthRevenue) : undefined} icon={CreditCard} loading={isLoading} />
        <StatCard title="Last Month" value={revenue ? fmtKES(revenue.lastMonthRevenue) : undefined} icon={CreditCard} loading={isLoading} />
        <StatCard title="Success Rate" value={revenue ? `${revenue.successRate.toFixed(1)}%` : undefined} icon={TrendingUp} loading={isLoading} trend={revenue && revenue.successRate >= 90 ? "up" : "down"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Monthly Revenue (last 12 months)</CardTitle>
            <CardDescription>Total revenue collected per month in KES</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : series.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground/40">
                <DollarSign className="w-10 h-10" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={256}>
                <BarChart data={series} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={fmtMonth} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [fmtKES(v), "Revenue"]} labelFormatter={fmtMonth} />
                  <Bar dataKey="amount" fill={CHART_COLORS[0]} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Provider</CardTitle>
            <CardDescription>Stripe vs M-Pesa split</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : providerData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground/40">
                <CreditCard className="w-10 h-10" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={256}>
                <PieChart>
                  <Pie data={providerData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {providerData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmtKES(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── Subscriptions Tab ────────────────────────────────────────────────────────

function SubscriptionsTab() {
  const { data: subs, isLoading } = trpc.admin.getSubscriptionBreakdown.useQuery({})

  const byPlan = subs?.byPlan as Record<string, number> | undefined
  const byStatus = subs?.byStatus as Record<string, number> | undefined

  const planData = byPlan
    ? Object.entries(byPlan).map(([name, value]) => ({ name, value })).filter((d) => d.value > 0)
    : []

  const statusData = byStatus
    ? Object.entries(byStatus).map(([name, value]) => ({ name, value })).filter((d) => d.value > 0)
    : []

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Total Subscriptions" value={subs?.total?.toLocaleString()} icon={CreditCard} loading={isLoading} />
        <StatCard title="Active Plans" value={planData.length > 0 ? planData.length : undefined} icon={BarChart2} loading={isLoading} sub="Distinct plan types" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscriptions by Plan</CardTitle>
            <CardDescription>Distribution across Regulator, Startup, Business, Enterprise</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : planData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground/40">
                <CreditCard className="w-10 h-10" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={256}>
                <PieChart>
                  <Pie data={planData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                    {planData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscriptions by Status</CardTitle>
            <CardDescription>Active, trialing, cancelled, expired breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : statusData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground/40">
                <BarChart2 className="w-10 h-10" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={256}>
                <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="value" fill={CHART_COLORS[1]} radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Platform-wide metrics — user growth, AI usage, revenue, and subscription health.
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-muted/50 p-1">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            User Growth
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Bot className="h-4 w-4" />
            AI Usage
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Subscriptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserGrowthTab />
        </TabsContent>
        <TabsContent value="ai">
          <AIUsageTab />
        </TabsContent>
        <TabsContent value="revenue">
          <RevenueTab />
        </TabsContent>
        <TabsContent value="subscriptions">
          <SubscriptionsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
