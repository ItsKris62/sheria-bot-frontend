"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { DollarSign, TrendingUp, CreditCard, CheckCircle2, AlertCircle, XCircle } from "lucide-react"
import { trpc } from "@/lib/trpc"

function formatKES(amount: number) {
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(0)}K`
  return `KES ${amount.toLocaleString()}`
}

const STATUS_STYLES: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700", icon: CheckCircle2 },
  PENDING:   { label: "Pending",   className: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
  FAILED:    { label: "Failed",    className: "bg-red-100 text-red-700", icon: XCircle },
  REFUNDED:  { label: "Refunded",  className: "bg-gray-100 text-gray-600", icon: CreditCard },
}

export default function AdminBillingPage() {
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()

  const { data: revenue, isLoading: revLoading } = trpc.admin.getRevenueMetrics.useQuery({ dateFrom: sixMonthsAgo })
  const { data: subOverview, isLoading: subLoading } = trpc.admin.getSubscriptionOverview.useQuery()
  const { data: subBreakdown, isLoading: breakLoading } = trpc.admin.getSubscriptionBreakdown.useQuery()
  const { data: recentPayments, isLoading: paymentsLoading } = trpc.admin.getRecentPayments.useQuery({ limit: 15 })

  const kpiLoading = revLoading || subLoading

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing Management</h1>
        <p className="text-sm text-gray-500 mt-1">Revenue, subscriptions, and payment history</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : (
          <>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{revenue ? formatKES(revenue.totalRevenue) : "—"}</p>
                    <p className="text-xs text-gray-400">All time</p>
                  </div>
                  <div className="p-2 rounded-lg bg-secondary"><DollarSign className="w-5 h-5 text-white" /></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">This Month</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{revenue ? formatKES(revenue.currentMonthRevenue) : "—"}</p>
                    <p className="text-xs text-gray-400">Last: {revenue ? formatKES(revenue.lastMonthRevenue) : "—"}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary"><TrendingUp className="w-5 h-5 text-white" /></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Active Orgs</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{subOverview?.totalActive ?? "—"}</p>
                    <p className="text-xs text-gray-400">Churn: {subOverview?.churnRate ?? 0}%</p>
                  </div>
                  <div className="p-2 rounded-lg bg-accent"><CreditCard className="w-5 h-5 text-white" /></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Success</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{revenue ? `${revenue.successRate}%` : "—"}</p>
                    <p className="text-xs text-gray-400">Last 6 months</p>
                  </div>
                  <div className="p-2 rounded-lg bg-warning"><CheckCircle2 className="w-5 h-5 text-white" /></div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Monthly Revenue (KES)</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              {revLoading ? (
                <Skeleton className="h-52 w-full rounded-lg" />
              ) : !revenue?.series.length ? (
                <div className="h-52 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No payment data yet</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={revenue.series} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={(v: string) => new Date(v + "-01").toLocaleDateString("en-KE", { month: "short" })} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(value: number) => [formatKES(value), "Revenue"]} />
                    <Bar dataKey="amount" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Plan distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Plan Distribution</CardTitle>
            <CardDescription>Organizations by tier</CardDescription>
          </CardHeader>
          <CardContent>
            {breakLoading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-7 w-full rounded" />)}</div>
            ) : !subBreakdown ? (
              <p className="text-sm text-gray-400 text-center py-8">No data</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(subBreakdown.byPlan).map(([plan, count]) => {
                  const pct = subBreakdown.total > 0 ? Math.round((count / subBreakdown.total) * 100) : 0
                  const colors: Record<string, string> = { REGULATOR: "bg-slate-400", STARTUP: "bg-blue-500", BUSINESS: "bg-purple-500", ENTERPRISE: "bg-emerald-500" }
                  return (
                    <div key={plan}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{plan}</span>
                        <span className="font-medium">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${colors[plan] ?? "bg-gray-400"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
                <div className="pt-2 border-t mt-3 flex gap-4 text-xs text-gray-500">
                  <span>Stripe: {revenue ? formatKES(revenue.byProvider.STRIPE) : "—"}</span>
                  <span>M-Pesa: {revenue ? formatKES(revenue.byProvider.MPESA) : "—"}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Payments</CardTitle>
          <CardDescription>Latest transactions across all organizations</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentsLoading ? (
            <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}</div>
          ) : !recentPayments?.length ? (
            <div className="text-center py-10 text-gray-400">
              <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No payment records found</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Invoice</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Organization</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Plan</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Provider</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentPayments.map((p) => {
                    const style = STATUS_STYLES[p.status] ?? STATUS_STYLES.PENDING
                    const Icon = style.icon
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.invoiceNumber ?? p.id.slice(0, 8)}</td>
                        <td className="px-4 py-3 hidden md:table-cell text-gray-700 max-w-[160px] truncate">{p.orgName}</td>
                        <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{p.subscriptionPlan ?? "—"}</td>
                        <td className="px-4 py-3 hidden md:table-cell text-gray-500">{p.provider}</td>
                        <td className="px-4 py-3 font-medium">{formatKES(p.amount)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${style.className}`}>
                            <Icon className="w-3 h-3" />
                            {style.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                          {p.paidAt ? new Date(p.paidAt).toLocaleDateString("en-KE") : "—"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
