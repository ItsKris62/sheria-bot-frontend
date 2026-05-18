"use client"

import { useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Activity,
  BarChart2,
  Bot,
  Building2,
  CreditCard,
  DollarSign,
  FileText,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trpc } from "@/lib/trpc"

const CHART_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f97316",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#facc15",
  "#ef4444",
]

const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "180", label: "Last 6 months" },
  { value: "365", label: "Last 12 months" },
] as const

type RangeValue = (typeof RANGE_OPTIONS)[number]["value"]
type PeriodValue = "daily" | "weekly" | "monthly"
type DateFilter = { dateFrom: string; dateTo: string }

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  color: "hsl(var(--popover-foreground))",
  fontSize: 12,
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.35)",
}

function getDateFilter(days: RangeValue): DateFilter {
  const dateTo = new Date()
  const dateFrom = new Date(dateTo)
  dateFrom.setDate(dateTo.getDate() - (Number(days) - 1))

  return {
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
  }
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", { month: "short", day: "numeric" })
}

function fmtMonth(iso: string) {
  const safeIso = iso.length === 7 ? `${iso}-01T00:00:00.000Z` : iso
  return new Date(safeIso).toLocaleDateString("en-KE", { month: "short", year: "2-digit" })
}

function fmtKES(n: number) {
  return `KES ${n.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function sumValues(data: Array<{ value: number }>) {
  return data.reduce((total, item) => total + item.value, 0)
}

interface StatCardProps {
  title: string
  value: string | number | undefined
  sub?: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  loading: boolean
  trend?: "up" | "down" | "neutral"
  color?: string
}

function StatCard({ title, value, sub, icon: Icon, loading, trend, color = CHART_COLORS[0] }: StatCardProps) {
  return (
    <Card className="overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow-green-sm">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="mt-2 h-8 w-24" />
            ) : (
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{value ?? "0"}</p>
            )}
            {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="rounded-lg p-2" style={{ backgroundColor: `${color}20` }}>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
            {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface EmptyChartProps {
  icon: React.ComponentType<{ className?: string }>
  message: string
}

function EmptyChart({ icon: Icon, message }: EmptyChartProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground/60">
      <Icon className="h-10 w-10" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

function ChartLoading() {
  return (
    <div className="h-64 w-full rounded-md border border-border/60 bg-muted/20 p-4">
      <div className="flex h-full items-end gap-3">
        {[42, 68, 50, 82, 60, 74, 92, 56, 78].map((height, index) => (
          <div key={index} className="flex flex-1 items-end">
            <div
              className="w-full animate-pulse rounded-t-md"
              style={{
                height: `${height}%`,
                backgroundColor: `${CHART_COLORS[index % CHART_COLORS.length]}40`,
                animationDelay: `${index * 80}ms`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

interface AnalyticsFiltersProps {
  range: RangeValue
  setRange: (value: RangeValue) => void
  period: PeriodValue
  setPeriod: (value: PeriodValue) => void
}

function AnalyticsFilters({ range, setRange, period, setPeriod }: AnalyticsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Select value={range} onValueChange={(value) => setRange(value as RangeValue)}>
        <SelectTrigger className="h-9 w-full sm:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {RANGE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={period} onValueChange={(value) => setPeriod(value as PeriodValue)}>
        <SelectTrigger className="h-9 w-full sm:w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function UserGrowthTab({ filters, period }: { filters: DateFilter; period: PeriodValue }) {
  const { data: stats, isLoading: statsLoading } = trpc.admin.getStats.useQuery()
  const { data: growth, isLoading: growthLoading } = trpc.admin.getUserGrowth.useQuery({ period, ...filters })

  const series = growth?.series ?? []
  const users = stats?.users
  const organizations = stats?.organizations

  return (
    <div className="space-y-4 animate-fade-slide-up">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Users" value={users?.total.toLocaleString()} icon={Users} loading={statsLoading} trend="up" color={CHART_COLORS[0]} />
        <StatCard title="Active Users" value={users?.active.toLocaleString()} icon={Activity} loading={statsLoading} sub="Logged in recently" color={CHART_COLORS[1]} />
        <StatCard title="Organizations" value={organizations?.total.toLocaleString()} icon={Building2} loading={statsLoading} color={CHART_COLORS[3]} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Signups Over Time</CardTitle>
          <CardDescription>New registrations grouped by the selected period.</CardDescription>
        </CardHeader>
        <CardContent>
          {growthLoading ? (
            <ChartLoading />
          ) : series.length === 0 ? (
            <EmptyChart icon={Users} message="No signups found for this range." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={series} margin={{ top: 8, right: 14, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGrowthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.42} />
                    <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={period === "monthly" ? fmtMonth : fmtDate} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [value, "New users"]} labelFormatter={period === "monthly" ? fmtMonth : fmtDate} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={3}
                  fill="url(#userGrowthFill)"
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                  isAnimationActive
                  animationDuration={700}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function AIUsageTab({ filters }: { filters: DateFilter }) {
  const { data: ai, isLoading } = trpc.admin.getAIUsageMetrics.useQuery(filters)
  const series = ai?.series ?? []

  const workloadData = [
    { name: "Queries", value: ai?.totalQueries ?? 0 },
    { name: "Policies", value: ai?.totalPolicies ?? 0 },
    { name: "Checklists", value: ai?.totalChecklists ?? 0 },
    { name: "Gap analyses", value: ai?.totalGapAnalyses ?? 0 },
  ].filter((item) => item.value > 0)

  return (
    <div className="space-y-4 animate-fade-slide-up">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Queries" value={ai?.totalQueries.toLocaleString()} icon={Bot} loading={isLoading} color={CHART_COLORS[1]} />
        <StatCard title="Total Policies" value={ai?.totalPolicies.toLocaleString()} icon={FileText} loading={isLoading} color={CHART_COLORS[3]} />
        <StatCard title="Queries This Month" value={ai?.queriesThisMonth.toLocaleString()} icon={Activity} loading={isLoading} trend="up" color={CHART_COLORS[0]} />
        <StatCard title="Policies This Month" value={ai?.policiesThisMonth.toLocaleString()} icon={TrendingUp} loading={isLoading} color={CHART_COLORS[4]} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">AI Query Volume</CardTitle>
            <CardDescription>Compliance queries processed per day in the selected range.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartLoading />
            ) : series.length === 0 ? (
              <EmptyChart icon={Bot} message="No AI query activity found for this range." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={series} margin={{ top: 8, right: 14, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={fmtDate} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: `${CHART_COLORS[1]}18` }} formatter={(value: number) => [value, "Queries"]} labelFormatter={fmtDate} />
                  <Bar dataKey="count" fill={CHART_COLORS[1]} radius={[5, 5, 0, 0]} activeBar={{ fill: CHART_COLORS[2] }} isAnimationActive animationDuration={650} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Workload Mix</CardTitle>
            <CardDescription>Generated assets and query volume.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartLoading />
            ) : workloadData.length === 0 ? (
              <EmptyChart icon={BarChart2} message="No AI workload data found." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={workloadData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={90}
                    paddingAngle={4}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    isAnimationActive
                    animationDuration={750}
                  >
                    {workloadData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => value.toLocaleString()} />
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

function RevenueTab({ filters }: { filters: DateFilter }) {
  const { data: revenue, isLoading } = trpc.admin.getRevenueMetrics.useQuery(filters)

  const series = revenue?.series ?? []
  const providerData = [
    { name: "Stripe", value: revenue?.byProvider.STRIPE ?? 0 },
    { name: "M-Pesa", value: revenue?.byProvider.MPESA ?? 0 },
  ].filter((item) => item.value > 0)

  return (
    <div className="space-y-4 animate-fade-slide-up">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={revenue ? fmtKES(revenue.totalRevenue) : undefined} icon={DollarSign} loading={isLoading} trend="up" color={CHART_COLORS[0]} />
        <StatCard title="This Month" value={revenue ? fmtKES(revenue.currentMonthRevenue) : undefined} icon={CreditCard} loading={isLoading} color={CHART_COLORS[1]} />
        <StatCard title="Last Month" value={revenue ? fmtKES(revenue.lastMonthRevenue) : undefined} icon={CreditCard} loading={isLoading} color={CHART_COLORS[2]} />
        <StatCard title="Success Rate" value={revenue ? `${revenue.successRate.toFixed(1)}%` : undefined} icon={TrendingUp} loading={isLoading} trend={revenue && revenue.successRate >= 90 ? "up" : "down"} color={CHART_COLORS[5]} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Monthly Revenue</CardTitle>
            <CardDescription>Completed payment volume in KES for the selected range.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartLoading />
            ) : series.length === 0 ? (
              <EmptyChart icon={DollarSign} message="No completed payments found for this range." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={series} margin={{ top: 8, right: 14, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={fmtMonth} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [fmtKES(value), "Revenue"]} labelFormatter={fmtMonth} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke={CHART_COLORS[0]}
                    strokeWidth={3}
                    dot={{ r: 3, fill: CHART_COLORS[0], strokeWidth: 0 }}
                    activeDot={{ r: 7, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                    isAnimationActive
                    animationDuration={700}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Provider</CardTitle>
            <CardDescription>Payment channel split for completed payments.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartLoading />
            ) : providerData.length === 0 ? (
              <EmptyChart icon={CreditCard} message="No provider revenue found." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={providerData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={92}
                    paddingAngle={6}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    isAnimationActive
                    animationDuration={750}
                  >
                    {providerData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => fmtKES(value)} />
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

function SubscriptionsTab({ filters }: { filters: DateFilter }) {
  const { data: subs, isLoading } = trpc.admin.getSubscriptionBreakdown.useQuery(filters)

  const planData = Object.entries(subs?.byPlan ?? {})
    .map(([name, value]) => ({ name: formatLabel(name), value: Number(value ?? 0) }))
    .filter((item) => item.value > 0)

  const statusData = Object.entries(subs?.byStatus ?? {})
    .map(([name, value]) => ({ name: formatLabel(name), value: Number(value ?? 0) }))
    .filter((item) => item.value > 0)

  const planTotal = sumValues(planData)

  return (
    <div className="space-y-4 animate-fade-slide-up">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Subscriptions" value={subs?.total.toLocaleString()} icon={CreditCard} loading={isLoading} color={CHART_COLORS[1]} />
        <StatCard title="Active Plans" value={planData.length > 0 ? planData.length : undefined} icon={BarChart2} loading={isLoading} sub="Distinct plan types" color={CHART_COLORS[3]} />
        <StatCard title="Plan Coverage" value={planTotal.toLocaleString()} icon={Building2} loading={isLoading} sub="Organizations in range" color={CHART_COLORS[5]} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscriptions by Plan</CardTitle>
            <CardDescription>Distribution across regulator, startup, business, and enterprise plans.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartLoading />
            ) : planData.length === 0 ? (
              <EmptyChart icon={CreditCard} message="No subscription plan data found for this range." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={planData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={94}
                    paddingAngle={4}
                    label={({ name, value }) => `${name}: ${value}`}
                    isAnimationActive
                    animationDuration={750}
                  >
                    {planData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscriptions by Status</CardTitle>
            <CardDescription>Lifecycle health across active, trialing, cancelled, and expired accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartLoading />
            ) : statusData.length === 0 ? (
              <EmptyChart icon={BarChart2} message="No subscription status data found for this range." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={statusData} layout="vertical" margin={{ top: 8, right: 24, left: 70, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={70} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: `${CHART_COLORS[3]}18` }} />
                  <Bar dataKey="value" radius={[0, 5, 5, 0]} activeBar={{ fill: CHART_COLORS[4] }} isAnimationActive animationDuration={650}>
                    {statusData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<RangeValue>("90")
  const [period, setPeriod] = useState<PeriodValue>("daily")
  const filters = useMemo(() => getDateFilter(range), [range])

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <BarChart2 className="h-6 w-6 text-primary" />
            Analytics
          </h1>
          <p className="mt-1 text-muted-foreground">
            Platform-wide metrics for user growth, AI usage, revenue, and subscription health.
          </p>
        </div>
        <AnalyticsFilters range={range} setRange={setRange} period={period} setPeriod={setPeriod} />
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
          <UserGrowthTab filters={filters} period={period} />
        </TabsContent>
        <TabsContent value="ai">
          <AIUsageTab filters={filters} />
        </TabsContent>
        <TabsContent value="revenue">
          <RevenueTab filters={filters} />
        </TabsContent>
        <TabsContent value="subscriptions">
          <SubscriptionsTab filters={filters} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
