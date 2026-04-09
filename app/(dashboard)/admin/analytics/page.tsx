"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Users,
  TrendingUp,
  DollarSign,
  Zap,
  BarChart2,
  PieChart as PieIcon,
} from "lucide-react"
import { trpc } from "@/lib/trpc"

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--warning))", "#4A5568", "#6366f1", "#f43f5e"]

const PLAN_DISPLAY: Record<string, string> = {
  REGULATOR: "Regulator",
  STARTUP: "Startup",
  BUSINESS: "Business",
  ENTERPRISE: "Enterprise",
}

function formatKES(amount: number) {
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(0)}K`
  return `KES ${amount.toLocaleString()}`
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  color: string
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
          </div>
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

type DateRange = "7d" | "30d" | "90d" | "1y"

const RANGE_DAYS: Record<DateRange, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 }
const RANGE_LABELS: Record<DateRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 3 months",
  "1y": "Last 12 months",
}

export default function AdminAnalyticsPage() {
  const [growthPeriod, setGrowthPeriod] = useState<"daily" | "weekly" | "monthly">("daily")
  const [dateRange, setDateRange] = useState<DateRange>("30d")

  const dateFrom = new Date(Date.now() - RANGE_DAYS[dateRange] * 24 * 60 * 60 * 1000).toISOString()
  const rangeLabel = RANGE_LABELS[dateRange]

  const { data: growth, isLoading: growthLoading } = trpc.admin.getUserGrowth.useQuery({
    period: growthPeriod,
    dateFrom,
  })

  const { data: revenue, isLoading: revenueLoading } = trpc.admin.getRevenueMetrics.useQuery({
    dateFrom,
  })

  const { data: aiUsage, isLoading: aiLoading } = trpc.admin.getAIUsageMetrics.useQuery({
    dateFrom,
  })

  const { data: subBreakdown, isLoading: subLoading } = trpc.admin.getSubscriptionBreakdown.useQuery()

  const planPieData = subBreakdown
    ? Object.entries(subBreakdown.byPlan).map(([name, value]) => ({
        name: PLAN_DISPLAY[name] ?? name,
        value,
      }))
    : []

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Platform metrics and growth insights</p>
        </div>
        <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
          <SelectTrigger className="w-44">
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

      {/* Overview KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {revenueLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : (
          <>
            <StatCard
              label="Total Revenue"
              value={revenue ? formatKES(revenue.totalRevenue) : "—"}
              sub="All time"
              icon={DollarSign}
              color="bg-secondary"
            />
            <StatCard
              label="This Month"
              value={revenue ? formatKES(revenue.currentMonthRevenue) : "—"}
              sub={`Last month: ${revenue ? formatKES(revenue.lastMonthRevenue) : "—"}`}
              icon={TrendingUp}
              color="bg-primary"
            />
            <StatCard
              label="New Users"
              value={growth?.total ?? "—"}
              sub={rangeLabel}
              icon={Users}
              color="bg-accent"
            />
            <StatCard
              label="AI Queries (month)"
              value={aiUsage?.queriesThisMonth ?? "—"}
              sub={`Total: ${aiUsage?.totalQueries ?? "—"}`}
              icon={Zap}
              color="bg-warning"
            />
          </>
        )}
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users"><Users className="w-4 h-4 mr-1.5" />Users</TabsTrigger>
          <TabsTrigger value="revenue"><DollarSign className="w-4 h-4 mr-1.5" />Revenue</TabsTrigger>
          <TabsTrigger value="ai"><Zap className="w-4 h-4 mr-1.5" />AI Usage</TabsTrigger>
          <TabsTrigger value="subscriptions"><PieIcon className="w-4 h-4 mr-1.5" />Subscriptions</TabsTrigger>
        </TabsList>

        {/* USERS TAB */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">User Growth</CardTitle>
                  <CardDescription>New signups — {rangeLabel}</CardDescription>
                </div>
                <Select value={growthPeriod} onValueChange={(v) => setGrowthPeriod(v as "daily" | "weekly" | "monthly")}>
                  <SelectTrigger className="w-36">
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
              {growthLoading ? (
                <Skeleton className="h-64 w-full rounded-lg" />
              ) : !growth?.series.length ? (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No signup data for this period</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={growth.series} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(v: string) => {
                        const d = new Date(v)
                        return growthPeriod === "monthly"
                          ? d.toLocaleDateString("en-KE", { month: "short", year: "2-digit" })
                          : d.toLocaleDateString("en-KE", { month: "short", day: "numeric" })
                      }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      formatter={(value: number) => [value, "New Users"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* REVENUE TAB */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {revenueLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
            ) : revenue ? (
              <>
                <Card>
                  <CardContent className="pt-5 pb-4 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Success Rate</p>
                    <p className="text-3xl font-bold text-primary mt-1">{revenue.successRate}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5 pb-4 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Stripe Revenue</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{formatKES(revenue.byProvider.STRIPE)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5 pb-4 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">M-Pesa Revenue</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{formatKES(revenue.byProvider.MPESA)}</p>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Monthly Revenue (KES)</CardTitle>
              <CardDescription>{rangeLabel}</CardDescription>
            </CardHeader>
            <CardContent>
              {revenueLoading ? (
                <Skeleton className="h-64 w-full rounded-lg" />
              ) : !revenue?.series.length ? (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No revenue data available</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={revenue.series} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(v: string) => {
                        const d = new Date(v + "-01")
                        return d.toLocaleDateString("en-KE", { month: "short", year: "2-digit" })
                      }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      formatter={(value: number) => [formatKES(value), "Revenue"]}
                    />
                    <Bar dataKey="amount" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI USAGE TAB */}
        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {aiLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
            ) : aiUsage ? (
              [
                { label: "Queries (period)", value: aiUsage.totalQueries },
                { label: "Policies completed", value: aiUsage.totalPolicies },
                { label: "Checklists generated", value: aiUsage.totalChecklists },
                { label: "Gap analyses done", value: aiUsage.totalGapAnalyses },
              ].map((s) => (
                <Card key={s.label}>
                  <CardContent className="pt-4 pb-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{s.value.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </CardContent>
                </Card>
              ))
            ) : null}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">AI Queries — {rangeLabel}</CardTitle>
            </CardHeader>
            <CardContent>
              {aiLoading ? (
                <Skeleton className="h-64 w-full rounded-lg" />
              ) : !aiUsage?.series.length ? (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Zap className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No AI usage data for this period</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={aiUsage.series} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(v: string) => new Date(v).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      formatter={(value: number) => [value, "Queries"]}
                    />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUBSCRIPTIONS TAB */}
        <TabsContent value="subscriptions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan breakdown pie */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Organizations by Plan</CardTitle>
              </CardHeader>
              <CardContent>
                {subLoading ? (
                  <Skeleton className="h-64 w-full rounded-lg" />
                ) : !planPieData.length ? (
                  <div className="h-64 flex items-center justify-center text-gray-400">No data</div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={planPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                        labelLine={false}
                      >
                        {planPieData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Status breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">By Subscription Status</CardTitle>
              </CardHeader>
              <CardContent>
                {subLoading ? (
                  <Skeleton className="h-64 w-full rounded-lg" />
                ) : !subBreakdown ? (
                  <div className="h-64 flex items-center justify-center text-gray-400">No data</div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {(Object.entries(subBreakdown.byStatus) as [string, number][]).map(([status, count], i) => {
                      const pct = subBreakdown.total > 0 ? Math.round((count / subBreakdown.total) * 100) : 0
                      return (
                        <div key={status}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 capitalize">{status.replace(/_/g, " ")}</span>
                            <span className="font-medium">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                            />
                          </div>
                        </div>
                      )
                    })}
                    <p className="text-xs text-gray-400 pt-2">Total: {subBreakdown.total} organizations</p>
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
