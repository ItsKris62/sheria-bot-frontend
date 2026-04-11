"use client"

import { useState, type ElementType } from "react"
import { Activity, BarChart2, DollarSign, Download, PieChart as PieIcon, TrendingUp, Users, Zap } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trpc } from "@/lib/trpc"

type DateRange = "7d" | "30d" | "90d" | "1y"

const LIVE_QUERY_OPTIONS = { refetchInterval: 10_000, refetchIntervalInBackground: true }
const RANGE_DAYS: Record<DateRange, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 }
const RANGE_LABELS: Record<DateRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 3 months",
  "1y": "Last 12 months",
}
const PLAN_DISPLAY: Record<string, string> = {
  REGULATOR: "Regulator",
  STARTUP: "Startup",
  BUSINESS: "Business",
  ENTERPRISE: "Enterprise",
}
const PLAN_COLORS: Record<string, string> = {
  REGULATOR: "hsl(var(--chart-1))",
  STARTUP: "hsl(var(--chart-2))",
  BUSINESS: "hsl(var(--chart-3))",
  ENTERPRISE: "hsl(var(--chart-4))",
}
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "hsl(var(--chart-2))",
  TRIALING: "hsl(var(--chart-1))",
  PAST_DUE: "hsl(var(--chart-4))",
  CANCELLED: "hsl(var(--chart-5))",
  GRACE_PERIOD: "hsl(var(--chart-3))",
  EXPIRED: "hsl(var(--muted-foreground))",
}

const userGrowthConfig = {
  count: { label: "New users", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

const revenueConfig = {
  amount: { label: "Revenue", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

const aiConfig = {
  count: { label: "AI queries", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

function formatKES(amount: number) {
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(0)}K`
  return `KES ${amount.toLocaleString("en-KE", { maximumFractionDigits: amount % 1 === 0 ? 0 : 2 })}`
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`
}

function formatMonthLabel(value: string) {
  return new Date(`${value}-01`).toLocaleDateString("en-KE", { month: "short", year: "2-digit" })
}

function formatSeriesLabel(value: string, period: "daily" | "weekly" | "monthly") {
  if (period === "monthly") return formatMonthLabel(value)
  return new Date(value).toLocaleDateString("en-KE", { month: "short", day: "numeric" })
}

function formatStatusLabel(status: string) {
  return status.replace(/_/g, " ").toLowerCase().replace(/^./, (char) => char.toUpperCase())
}

function getPercentDelta(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

function getPeakPoint<T>(items: T[], getValue: (item: T) => number) {
  return items.reduce<T | null>((peak, item) => (!peak || getValue(item) > getValue(peak) ? item : peak), null)
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone,
}: {
  label: string
  value: string | number
  sub?: string
  icon: ElementType
  tone: string
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            {sub ? <p className="text-xs text-muted-foreground">{sub}</p> : null}
          </div>
          <div className="rounded-xl p-2.5" style={{ backgroundColor: tone }}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ icon: Icon, message }: { icon: ElementType; message: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center text-muted-foreground">
      <div className="text-center">
        <Icon className="mx-auto mb-2 h-10 w-10 opacity-30" />
        <p>{message}</p>
      </div>
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [growthPeriod, setGrowthPeriod] = useState<"daily" | "weekly" | "monthly">("daily")
  const [dateRange, setDateRange] = useState<DateRange>("30d")

  const dateFrom = new Date(Date.now() - RANGE_DAYS[dateRange] * 24 * 60 * 60 * 1000).toISOString()
  const rangeLabel = RANGE_LABELS[dateRange]

  const growthQuery = trpc.admin.getUserGrowth.useQuery({ period: growthPeriod, dateFrom }, LIVE_QUERY_OPTIONS)
  const revenueQuery = trpc.admin.getRevenueMetrics.useQuery({ dateFrom }, LIVE_QUERY_OPTIONS)
  const aiQuery = trpc.admin.getAIUsageMetrics.useQuery({ dateFrom }, LIVE_QUERY_OPTIONS)
  const breakdownQuery = trpc.admin.getSubscriptionBreakdown.useQuery(undefined, LIVE_QUERY_OPTIONS)
  const overviewQuery = trpc.admin.getSubscriptionOverview.useQuery(undefined, LIVE_QUERY_OPTIONS)

  const growth = growthQuery.data
  const revenue = revenueQuery.data
  const aiUsage = aiQuery.data
  const subBreakdown = breakdownQuery.data
  const subOverview = overviewQuery.data
  const isRefreshing = [
    growthQuery.isFetching,
    revenueQuery.isFetching,
    aiQuery.isFetching,
    breakdownQuery.isFetching,
    overviewQuery.isFetching,
  ].some(Boolean)

  const growthSeries = growth?.series ?? []
  const revenueSeries = revenue?.series ?? []
  const aiSeries = aiUsage?.series ?? []

  const planChartData = subBreakdown
    ? Object.entries(subBreakdown.byPlan)
        .filter(([, value]) => value > 0)
        .map(([plan, value]) => ({
          plan,
          name: PLAN_DISPLAY[plan] ?? plan,
          value,
          fill: PLAN_COLORS[plan] ?? "hsl(var(--chart-5))",
        }))
    : []

  const statusRows = subBreakdown
    ? Object.entries(subBreakdown.byStatus)
        .filter(([, value]) => value > 0)
        .sort(([, a], [, b]) => b - a)
        .map(([status, value]) => ({
          status,
          label: formatStatusLabel(status),
          value,
          percent: subBreakdown.total > 0 ? Math.round((value / subBreakdown.total) * 100) : 0,
          color: STATUS_COLORS[status] ?? "hsl(var(--chart-5))",
        }))
    : []

  const monthlyDelta = revenue ? getPercentDelta(revenue.currentMonthRevenue, revenue.lastMonthRevenue) : 0
  const peakGrowthDay = getPeakPoint(growthSeries, (item) => item.count)
  const peakRevenueMonth = getPeakPoint(revenueSeries, (item) => item.amount)
  const peakUsageDay = getPeakPoint(aiSeries, (item) => item.count)

  function handleExportCSV() {
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
    const rows: string[] = ["Section,Label,Value"]

    if (subBreakdown) {
      Object.entries(subBreakdown.byPlan).forEach(([plan, count]) => {
        rows.push([esc("Plan breakdown"), esc(PLAN_DISPLAY[plan] ?? plan), count].join(","))
      })
      Object.entries(subBreakdown.byStatus).forEach(([status, count]) => {
        rows.push([esc("Status breakdown"), esc(formatStatusLabel(status)), count].join(","))
      })
      rows.push([esc("Totals"), esc("All organizations"), subBreakdown.total].join(","))
    }

    if (revenue) {
      rows.push([esc("Revenue"), esc("Total all-time (KES)"), revenue.totalRevenue].join(","))
      rows.push([esc("Revenue"), esc("This month (KES)"), revenue.currentMonthRevenue].join(","))
      rows.push([esc("Revenue"), esc("Last month (KES)"), revenue.lastMonthRevenue].join(","))
      rows.push([esc("Revenue"), esc("Stripe volume (KES)"), revenue.byProvider.STRIPE].join(","))
      rows.push([esc("Revenue"), esc("M-Pesa volume (KES)"), revenue.byProvider.MPESA].join(","))
      rows.push([esc("Revenue"), esc("Payment success rate (%)"), revenue.successRate].join(","))
    }

    if (aiUsage) {
      rows.push([esc("AI usage"), esc("Queries in range"), aiUsage.totalQueries].join(","))
      rows.push([esc("AI usage"), esc("Policies completed"), aiUsage.totalPolicies].join(","))
      rows.push([esc("AI usage"), esc("Checklists generated"), aiUsage.totalChecklists].join(","))
      rows.push([esc("AI usage"), esc("Gap analyses"), aiUsage.totalGapAnalyses].join(","))
    }

    const csv = rows.join("\r\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `sheriabot-analytics-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <Badge variant="secondary" className="gap-2 border border-border/60 bg-muted/60 text-foreground">
              <span className={`h-2 w-2 rounded-full ${isRefreshing ? "animate-pulse" : ""}`} style={{ backgroundColor: "hsl(var(--chart-2))" }} />
              Live refresh every 10s
            </Badge>
          </div>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Executive visibility into growth, revenue performance, AI adoption, and subscription health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={!subBreakdown && !revenue && !aiUsage}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>

          <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {revenueQuery.isLoading || growthQuery.isLoading || aiQuery.isLoading || overviewQuery.isLoading ? (
          Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-28 rounded-xl" />)
        ) : (
          <>
            <StatCard label="Revenue booked" value={revenue ? formatKES(revenue.totalRevenue) : "—"} sub="All-time completed payments" icon={DollarSign} tone="hsl(var(--chart-2))" />
            <StatCard label="This month" value={revenue ? formatKES(revenue.currentMonthRevenue) : "—"} sub={revenue ? `${formatPercent(monthlyDelta)} vs last month` : "—"} icon={TrendingUp} tone="hsl(var(--chart-1))" />
            <StatCard label="New users" value={growth ? growth.total.toLocaleString() : "—"} sub={rangeLabel} icon={Users} tone="hsl(var(--chart-3))" />
            <StatCard label="Trial conversion" value={subOverview ? formatPercent(subOverview.trialConversionRate) : "—"} sub={subOverview ? `${subOverview.totalActive} active organizations` : "Subscription health"} icon={PieIcon} tone="hsl(var(--chart-4))" />
            <StatCard label="AI queries this month" value={aiUsage ? aiUsage.queriesThisMonth.toLocaleString() : "—"} sub={aiUsage ? `${aiUsage.totalQueries.toLocaleString()} in ${rangeLabel.toLowerCase()}` : "—"} icon={Zap} tone="hsl(var(--chart-5))" />
          </>
        )}
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
          <TabsTrigger value="users" className="gap-2"><Users className="h-4 w-4" />Users</TabsTrigger>
          <TabsTrigger value="revenue" className="gap-2"><DollarSign className="h-4 w-4" />Revenue</TabsTrigger>
          <TabsTrigger value="ai" className="gap-2"><Zap className="h-4 w-4" />AI usage</TabsTrigger>
          <TabsTrigger value="subscriptions" className="gap-2"><PieIcon className="h-4 w-4" />Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base">User growth trend</CardTitle>
                  <CardDescription>Net new signups across {rangeLabel.toLowerCase()}.</CardDescription>
                </div>
                <Select value={growthPeriod} onValueChange={(value) => setGrowthPeriod(value as "daily" | "weekly" | "monthly")}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {growthQuery.isLoading ? (
                <Skeleton className="h-[320px] w-full rounded-lg" />
              ) : !growthSeries.length ? (
                <EmptyState icon={BarChart2} message="No signup activity was recorded for this period." />
              ) : (
                <ChartContainer config={userGrowthConfig} className="h-[320px] w-full">
                  <LineChart data={growthSeries} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis axisLine={false} tickLine={false} dataKey="date" tickFormatter={(value) => formatSeriesLabel(value, growthPeriod)} />
                    <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          indicator="line"
                          labelFormatter={(value) => formatSeriesLabel(String(value), growthPeriod)}
                          formatter={(value) => <span className="font-medium text-foreground">{Number(value).toLocaleString()} new users</span>}
                        />
                      }
                    />
                    <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
                  </LineChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Peak signup period</p><p className="mt-2 text-xl font-semibold text-foreground">{peakGrowthDay ? `${peakGrowthDay.count.toLocaleString()} users` : "—"}</p><p className="mt-1 text-xs text-muted-foreground">{peakGrowthDay ? formatSeriesLabel(peakGrowthDay.date, growthPeriod) : "No data"}</p></CardContent></Card>
            <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Average per bucket</p><p className="mt-2 text-xl font-semibold text-foreground">{growthSeries.length && growth ? Math.round(growth.total / growthSeries.length).toLocaleString() : "0"}</p><p className="mt-1 text-xs text-muted-foreground">Measured by selected cadence</p></CardContent></Card>
            <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Range total</p><p className="mt-2 text-xl font-semibold text-foreground">{growth ? growth.total.toLocaleString() : "0"}</p><p className="mt-1 text-xs text-muted-foreground">Updated automatically in real time</p></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {revenueQuery.isLoading ? (
              Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-xl" />)
            ) : (
              <>
                <StatCard label="Payment success rate" value={revenue ? formatPercent(revenue.successRate) : "—"} sub="Completed vs attempted payments" icon={Activity} tone="hsl(var(--chart-1))" />
                <StatCard label="Stripe volume" value={revenue ? formatKES(revenue.byProvider.STRIPE) : "—"} sub="Selected period" icon={DollarSign} tone="hsl(var(--chart-2))" />
                <StatCard label="M-Pesa volume" value={revenue ? formatKES(revenue.byProvider.MPESA) : "—"} sub="Selected period" icon={DollarSign} tone="hsl(var(--chart-3))" />
              </>
            )}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Revenue trend</CardTitle>
              <CardDescription>Monthly completed revenue in Kenyan shillings.</CardDescription>
            </CardHeader>
            <CardContent>
              {revenueQuery.isLoading ? (
                <Skeleton className="h-[320px] w-full rounded-lg" />
              ) : !revenueSeries.length ? (
                <EmptyState icon={DollarSign} message="No completed revenue has been recorded yet." />
              ) : (
                <ChartContainer config={revenueConfig} className="h-[320px] w-full">
                  <BarChart data={revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis axisLine={false} tickLine={false} dataKey="date" tickFormatter={formatMonthLabel} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${Math.round(Number(value) / 1000)}K`} />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          indicator="dot"
                          labelFormatter={(value) => formatMonthLabel(String(value))}
                          formatter={(value) => <span className="font-medium text-foreground">{formatKES(Number(value))}</span>}
                        />
                      }
                    />
                    <Bar dataKey="amount" fill="var(--color-amount)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Top revenue month</p><p className="mt-2 text-xl font-semibold text-foreground">{peakRevenueMonth ? formatKES(peakRevenueMonth.amount) : "—"}</p><p className="mt-1 text-xs text-muted-foreground">{peakRevenueMonth ? formatMonthLabel(peakRevenueMonth.date) : "No data"}</p></CardContent></Card>
            <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Month-over-month movement</p><p className="mt-2 text-xl font-semibold text-foreground">{revenue ? formatPercent(monthlyDelta) : "—"}</p><p className="mt-1 text-xs text-muted-foreground">Current calendar month versus previous month</p></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {aiQuery.isLoading ? (
              Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-xl" />)
            ) : aiUsage ? (
              [
                { label: "Queries in range", value: aiUsage.totalQueries.toLocaleString() },
                { label: "Policies completed", value: aiUsage.totalPolicies.toLocaleString() },
                { label: "Checklists generated", value: aiUsage.totalChecklists.toLocaleString() },
                { label: "Gap analyses", value: aiUsage.totalGapAnalyses.toLocaleString() },
              ].map((item, index) => (
                <Card key={item.label} className="border-border/60">
                  <CardContent className="pt-5 pb-4">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{item.value}</p>
                    <div className="mt-3 h-1.5 rounded-full" style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }} />
                  </CardContent>
                </Card>
              ))
            ) : null}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">AI engagement trend</CardTitle>
              <CardDescription>Operational usage of AI workflows across {rangeLabel.toLowerCase()}.</CardDescription>
            </CardHeader>
            <CardContent>
              {aiQuery.isLoading ? (
                <Skeleton className="h-[320px] w-full rounded-lg" />
              ) : !aiSeries.length ? (
                <EmptyState icon={Zap} message="No AI usage was recorded for this period." />
              ) : (
                <ChartContainer config={aiConfig} className="h-[320px] w-full">
                  <LineChart data={aiSeries} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis axisLine={false} tickLine={false} dataKey="date" tickFormatter={(value) => formatSeriesLabel(value, "daily")} />
                    <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          indicator="line"
                          labelFormatter={(value) => formatSeriesLabel(String(value), "daily")}
                          formatter={(value) => <span className="font-medium text-foreground">{Number(value).toLocaleString()} queries</span>}
                        />
                      }
                    />
                    <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
                  </LineChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Peak AI usage day</p><p className="mt-2 text-xl font-semibold text-foreground">{peakUsageDay ? `${peakUsageDay.count.toLocaleString()} queries` : "—"}</p><p className="mt-1 text-xs text-muted-foreground">{peakUsageDay ? formatSeriesLabel(peakUsageDay.date, "daily") : "No data"}</p></CardContent></Card>
            <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Current month throughput</p><p className="mt-2 text-xl font-semibold text-foreground">{aiUsage ? aiUsage.queriesThisMonth.toLocaleString() : "0"}</p><p className="mt-1 text-xs text-muted-foreground">Real-time demand signal for AI features</p></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {overviewQuery.isLoading ? (
              Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-xl" />)
            ) : (
              <>
                <StatCard label="Active organizations" value={subOverview ? subOverview.totalActive.toLocaleString() : "—"} sub="Currently in active billing state" icon={PieIcon} tone="hsl(var(--chart-2))" />
                <StatCard label="Churn rate" value={subOverview ? formatPercent(subOverview.churnRate) : "—"} sub="Cancelled or expired organizations" icon={TrendingUp} tone="hsl(var(--chart-5))" />
                <StatCard label="Tracked organizations" value={subBreakdown ? subBreakdown.total.toLocaleString() : "—"} sub="Full subscription base" icon={Users} tone="hsl(var(--chart-4))" />
              </>
            )}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Organization mix by plan</CardTitle>
                <CardDescription>Distribution across the available subscription tiers.</CardDescription>
              </CardHeader>
              <CardContent>
                {breakdownQuery.isLoading ? (
                  <Skeleton className="h-[320px] w-full rounded-lg" />
                ) : !planChartData.length ? (
                  <EmptyState icon={PieIcon} message="No subscription plan data is available." />
                ) : (
                  <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-center">
                    <ChartContainer config={{ plans: { label: "Organizations", color: "hsl(var(--chart-1))" } }} className="mx-auto h-[280px] max-w-[320px]">
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              hideLabel
                              formatter={(value, _name, item) => (
                                <span className="font-medium text-foreground">
                                  {String(item?.payload?.name ?? "")} : {Number(value).toLocaleString()}
                                </span>
                              )}
                            />
                          }
                        />
                        <Pie data={planChartData} dataKey="value" nameKey="name" innerRadius={72} outerRadius={108} paddingAngle={3} strokeWidth={0}>
                          {planChartData.map((entry) => <Cell key={entry.plan} fill={entry.fill} />)}
                        </Pie>
                      </PieChart>
                    </ChartContainer>

                    <div className="space-y-4">
                      {planChartData.map((entry) => {
                        const percent = subBreakdown && subBreakdown.total > 0 ? Math.round((entry.value / subBreakdown.total) * 100) : 0
                        return (
                          <div key={entry.plan} className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                                <span className="text-sm font-medium text-foreground">{entry.name}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{entry.value.toLocaleString()} ({percent}%)</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted">
                              <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: entry.fill }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Subscription status health</CardTitle>
                <CardDescription>Live state of the billing lifecycle across all organizations.</CardDescription>
              </CardHeader>
              <CardContent>
                {breakdownQuery.isLoading ? (
                  <Skeleton className="h-[320px] w-full rounded-lg" />
                ) : !statusRows.length ? (
                  <EmptyState icon={PieIcon} message="No subscription status data is available." />
                ) : (
                  <div className="space-y-4 pt-1">
                    {statusRows.map((row) => (
                      <div key={row.status} className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-foreground">{row.label}</span>
                          <span className="text-sm text-muted-foreground">{row.value.toLocaleString()} ({row.percent}%)</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-muted">
                          <div className="h-full rounded-full" style={{ width: `${row.percent}%`, backgroundColor: row.color }} />
                        </div>
                      </div>
                    ))}
                    <p className="pt-2 text-xs text-muted-foreground">All subscription analytics sync automatically every 10 seconds.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
