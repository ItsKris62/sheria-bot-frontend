"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  DollarSign, TrendingUp, CreditCard, CheckCircle2, AlertCircle, XCircle,
  Save, Loader2, Package, AlertTriangle, Activity, Users, ShieldAlert,
} from "lucide-react"
import { trpc, getErrorMessage } from "@/lib/trpc"
import { toast } from "sonner"

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

// ─── Plan Catalog Types ───────────────────────────────────────────────────────

interface PlanEntry {
  id: string
  name: string
  tagline: string
  badge: string | null
  popular: boolean
  trialDays: number
  editable: boolean
  price: { monthly: number | null; yearly: number | null; currency: string }
  stripe: { monthlyPriceId: string | null; yearlyPriceId: string | null } | null
  features: Array<{ text: string; included: boolean }>
}

interface PlanCatalog {
  plans: PlanEntry[]
  managedPlanIds: string[]
}

interface PlanEdit {
  id: string
  monthlyPrice: string
  yearlyPrice: string
  yearlyNull: boolean
  trialDays: string
  stripeMonthlyId: string
  stripeYearlyId: string
  stripeYearlyNull: boolean
}

function planToEdit(p: PlanEntry): PlanEdit {
  return {
    id: p.id,
    monthlyPrice: String(p.price.monthly ?? ""),
    yearlyPrice: String(p.price.yearly ?? ""),
    yearlyNull: p.price.yearly === null,
    trialDays: String(p.trialDays),
    stripeMonthlyId: p.stripe?.monthlyPriceId ?? "",
    stripeYearlyId: p.stripe?.yearlyPriceId ?? "",
    stripeYearlyNull: !p.stripe?.yearlyPriceId,
  }
}

// ─── Failed Payments Panel (TD-006) ──────────────────────────────────────────

interface FailedPaymentRow {
  id: string
  orgId: string
  orgName: string
  provider: string
  amount: number
  currency: string
  status: string
  invoiceNumber: string | null
  subscriptionPlan: string | null
  description: string | null
  metadata: Record<string, unknown> | null
  paidAt: string | null
  createdAt: string
}

function FailedPaymentsPanel() {
  const utils = trpc.useUtils()
  const { data, isLoading } = trpc.admin.getFailedPayments.useQuery({ limit: 50 })

  const items: FailedPaymentRow[] = (data?.items ?? []) as FailedPaymentRow[]
  const total: number = data?.total ?? 0

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Failed Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {total > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-red-200 bg-red-50">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm font-medium text-red-800">
            {total} failed payment{total !== 1 ? "s" : ""} require attention
          </p>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Failed Payments
                {total > 0 && (
                  <Badge className="bg-red-100 text-red-700 border-0 text-xs ml-1">{total}</Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-0.5">Payments with status FAILED across all organizations</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void utils.admin.getFailedPayments.invalidate()}
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <CheckCircle2 className="w-10 h-10 mb-3 text-green-400" />
              <p className="text-sm font-medium text-gray-600">No failed payments</p>
              <p className="text-xs mt-1">All payments are processing normally</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Organization</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Invoice</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Plan</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Provider</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Failed At</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((p) => {
                    const failureMsg = typeof p.metadata?.hostedInvoiceUrl === "string"
                      ? "Invoice available"
                      : p.description ?? "Payment declined"
                    return (
                      <tr key={p.id} className="hover:bg-red-50/40">
                        <td className="px-4 py-3 font-medium text-gray-800 max-w-[160px] truncate">{p.orgName}</td>
                        <td className="px-4 py-3 hidden md:table-cell font-mono text-xs text-gray-500">{p.invoiceNumber ?? p.id.slice(0, 8)}</td>
                        <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{p.subscriptionPlan ?? "—"}</td>
                        <td className="px-4 py-3 font-semibold text-red-700">{formatKES(p.amount)}</td>
                        <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">{p.provider}</td>
                        <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                          {new Date(p.createdAt).toLocaleDateString("en-KE", { dateStyle: "short" })}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs max-w-[180px] truncate">{failureMsg}</td>
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

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AdminBillingPage() {
  const utils = trpc.useUtils()
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1_000).toISOString()

  const { data: revenue, isLoading: revLoading } = trpc.admin.getRevenueMetrics.useQuery({ dateFrom: sixMonthsAgo })
  const { data: subOverview, isLoading: subLoading } = trpc.admin.getSubscriptionOverview.useQuery(undefined)
  const { data: subBreakdown, isLoading: breakLoading } = trpc.admin.getSubscriptionBreakdown.useQuery({})
  const { data: recentPayments, isLoading: paymentsLoading } = trpc.admin.getRecentPayments.useQuery({ limit: 15 })
  const { data: catalogData, isLoading: catalogLoading } = trpc.admin.getBillingPlanCatalog.useQuery(undefined)
  const { data: opsSummary, isLoading: opsLoading } = trpc.admin.getBillingOperationsSummary.useQuery()

  const updateCatalogMutation = trpc.admin.updateBillingPlanCatalog.useMutation({
    onSuccess: () => {
      void utils.admin.getBillingPlanCatalog.invalidate()
      toast.success("Plan catalog saved")
      setCatalogDirty(false)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const [planEdits, setPlanEdits] = useState<PlanEdit[]>([])
  const [catalogDirty, setCatalogDirty] = useState(false)

  useEffect(() => {
    if (catalogData && planEdits.length === 0) {
      const catalog = catalogData as PlanCatalog
      const editable = catalog.plans.filter((p) => p.editable)
      setPlanEdits(editable.map(planToEdit))
    }
  }, [catalogData, planEdits.length])

  function updatePlanEdit(planId: string, changes: Partial<PlanEdit>) {
    setPlanEdits((prev) => prev.map((e) => (e.id === planId ? { ...e, ...changes } : e)))
    setCatalogDirty(true)
  }

  function handleCatalogSave() {
    const plans = planEdits.map((e) => ({
      id: e.id as "STARTUP" | "BUSINESS",
      price: {
        monthly: Number(e.monthlyPrice),
        yearly: e.yearlyNull ? null : Number(e.yearlyPrice),
      },
      trialDays: Number(e.trialDays),
      stripe: {
        monthlyPriceId: e.stripeMonthlyId,
        yearlyPriceId: e.stripeYearlyNull ? null : e.stripeYearlyId,
      },
    }))
    updateCatalogMutation.mutate({ plans })
  }

  function handleCatalogReset() {
    if (catalogData) {
      const catalog = catalogData as PlanCatalog
      const editable = catalog.plans.filter((p) => p.editable)
      setPlanEdits(editable.map(planToEdit))
      setCatalogDirty(false)
    }
  }

  const kpiLoading = revLoading || subLoading

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing Management</h1>
        <p className="text-sm text-gray-500 mt-1">Revenue, subscriptions, and payment history</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="failed">Failed Payments</TabsTrigger>
          <TabsTrigger value="catalog">Plan Catalog</TabsTrigger>
        </TabsList>

        {/* ─── Overview Tab ─────────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-6 mt-6">
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
                    {Object.entries(subBreakdown.byPlan).map(([plan, rawCount]) => {
                      const count = Number(rawCount)
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
                      {recentPayments.map((p: { id: string; invoiceNumber: string | null; orgName: string; subscriptionPlan: string | null; provider: string; amount: number; status: string; paidAt: string | null }) => {
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
        </TabsContent>

        {/* ─── Failed Payments Tab (TD-006) ─────────────────────────────── */}
        <TabsContent value="failed" className="space-y-6 mt-6">
          <FailedPaymentsPanel />
        </TabsContent>

        {/* ─── Plan Catalog Tab ─────────────────────────────────────────── */}
        <TabsContent value="catalog" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">Plan Catalog</CardTitle>
                    <CardDescription className="mt-0.5">Edit pricing and Stripe IDs for STARTUP and BUSINESS plans</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {catalogDirty && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCatalogReset}
                      disabled={updateCatalogMutation.isPending}
                    >
                      Reset
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="bg-secondary hover:bg-secondary/90 text-white gap-2"
                    onClick={handleCatalogSave}
                    disabled={!catalogDirty || updateCatalogMutation.isPending}
                  >
                    {updateCatalogMutation.isPending
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Save className="h-4 w-4" />
                    }
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {catalogLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-xl" />
                  ))}
                </div>
              ) : !catalogData ? (
                <p className="text-sm text-gray-400 text-center py-10">Unable to load plan catalog</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {(catalogData as PlanCatalog).plans.map((plan) => {
                    const edit = planEdits.find((e) => e.id === plan.id)
                    return (
                      <div
                        key={plan.id}
                        className={`rounded-xl border p-5 space-y-4 ${plan.popular ? "border-primary/40 bg-primary/5" : "border-border/50 bg-card/50"}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{plan.name}</h3>
                              {plan.badge && (
                                <Badge className="text-xs bg-primary/10 text-primary border-0">
                                  {plan.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{plan.tagline}</p>
                          </div>
                          {!plan.editable && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              Read-only
                            </Badge>
                          )}
                        </div>

                        {plan.editable && edit ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Monthly Price (KES)</Label>
                                <Input
                                  type="number"
                                  min={0}
                                  value={edit.monthlyPrice}
                                  onChange={(e) => updatePlanEdit(plan.id, { monthlyPrice: e.target.value })}
                                  className="h-8 text-sm bg-muted/50"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">
                                  Yearly Price (KES)
                                  <button
                                    type="button"
                                    className="ml-2 text-muted-foreground underline text-xs"
                                    onClick={() => updatePlanEdit(plan.id, { yearlyNull: !edit.yearlyNull })}
                                  >
                                    {edit.yearlyNull ? "enable" : "set null"}
                                  </button>
                                </Label>
                                <Input
                                  type="number"
                                  min={0}
                                  value={edit.yearlyNull ? "" : edit.yearlyPrice}
                                  disabled={edit.yearlyNull}
                                  onChange={(e) => updatePlanEdit(plan.id, { yearlyPrice: e.target.value })}
                                  className="h-8 text-sm bg-muted/50"
                                  placeholder={edit.yearlyNull ? "null" : ""}
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Trial Days (0-90)</Label>
                              <Input
                                type="number"
                                min={0}
                                max={90}
                                value={edit.trialDays}
                                onChange={(e) => updatePlanEdit(plan.id, { trialDays: e.target.value })}
                                className="h-8 text-sm bg-muted/50"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Stripe Monthly Price ID</Label>
                              <Input
                                value={edit.stripeMonthlyId}
                                onChange={(e) => updatePlanEdit(plan.id, { stripeMonthlyId: e.target.value })}
                                className="h-8 text-sm bg-muted/50 font-mono"
                                placeholder="price_..."
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">
                                Stripe Yearly Price ID
                                <button
                                  type="button"
                                  className="ml-2 text-muted-foreground underline text-xs"
                                  onClick={() => updatePlanEdit(plan.id, { stripeYearlyNull: !edit.stripeYearlyNull })}
                                >
                                  {edit.stripeYearlyNull ? "enable" : "set null"}
                                </button>
                              </Label>
                              <Input
                                value={edit.stripeYearlyNull ? "" : edit.stripeYearlyId}
                                disabled={edit.stripeYearlyNull}
                                onChange={(e) => updatePlanEdit(plan.id, { stripeYearlyId: e.target.value })}
                                className="h-8 text-sm bg-muted/50 font-mono"
                                placeholder={edit.stripeYearlyNull ? "null" : "price_..."}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Monthly</span>
                              <span className="font-medium">{plan.price.monthly !== null ? formatKES(plan.price.monthly) : "—"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Yearly</span>
                              <span className="font-medium">{plan.price.yearly !== null ? formatKES(plan.price.yearly) : "—"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Trial Days</span>
                              <span className="font-medium">{plan.trialDays}</span>
                            </div>
                          </div>
                        )}

                        <div className="pt-2 border-t border-border/40">
                          <p className="text-xs text-muted-foreground mb-1.5">Features ({plan.features.filter((f) => f.included).length} included)</p>
                          <ul className="space-y-0.5">
                            {plan.features.slice(0, 4).map((f, idx) => (
                              <li key={idx} className={`text-xs flex items-center gap-1.5 ${f.included ? "text-foreground" : "text-muted-foreground line-through"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${f.included ? "bg-primary" : "bg-gray-300"}`} />
                                {f.text}
                              </li>
                            ))}
                            {plan.features.length > 4 && (
                              <li className="text-xs text-muted-foreground pl-3">+{plan.features.length - 4} more</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* ─── Operations Tab ─────────────────────────────────────────── */}
        <TabsContent value="operations" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Payment Health</p>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
                {opsLoading ? (
                  <Skeleton className="h-8 w-1/2" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {opsSummary?.overallStatus === 'healthy' ? (
                        <span className="text-green-600 flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Healthy</span>
                      ) : opsSummary?.overallStatus === 'degraded' ? (
                        <span className="text-yellow-600 flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Degraded</span>
                      ) : (
                        <span className="text-gray-500">{opsSummary?.overallStatus}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {opsSummary?.payments.failedLast30Days} failed payments in 30d
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Provider Status</p>
                  <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                </div>
                {opsLoading ? (
                  <Skeleton className="h-8 w-1/2" />
                ) : (
                  <>
                    <div className="text-lg font-semibold">{opsSummary?.provider.name}</div>
                    <Badge variant={opsSummary?.provider.status === 'unknown' ? 'secondary' : 'outline'} className="mt-1">
                      {opsSummary?.provider.message}
                    </Badge>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Subscriptions</p>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                {opsLoading ? (
                  <Skeleton className="h-8 w-1/2" />
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-500">Active:</span> <span className="font-medium">{opsSummary?.subscriptions.active}</span></div>
                    <div><span className="text-gray-500">Trialing:</span> <span className="font-medium">{opsSummary?.subscriptions.trialing}</span></div>
                    <div><span className="text-red-500">Past Due:</span> <span className="font-medium">{opsSummary?.subscriptions.pastDue}</span></div>
                    <div><span className="text-gray-500">Suspended:</span> <span className="font-medium">{opsSummary?.subscriptions.suspended}</span></div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Trial Expiry</p>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
                {opsLoading ? (
                  <Skeleton className="h-8 w-1/2" />
                ) : (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Active Trials:</span> <span className="font-medium">{opsSummary?.trials.activeTrials}</span></div>
                    <div className="flex justify-between"><span className="text-yellow-600">Expiring 7d:</span> <span className="font-medium">{opsSummary?.trials.expiringIn7Days}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Expired 7d:</span> <span className="font-medium">{opsSummary?.trials.expiredLast7Days}</span></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Problem Accounts</CardTitle>
                <CardDescription>Accounts needing intervention based on real events</CardDescription>
              </CardHeader>
              <CardContent>
                {opsLoading ? (
                  <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded" />)}</div>
                ) : !opsSummary?.problemAccounts.length ? (
                  <div className="text-center py-6 text-gray-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400 opacity-80" />
                    <p className="text-sm font-medium">No problem accounts</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {opsSummary.problemAccounts.map((account, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50/50">
                        <div>
                          <div className="font-medium text-sm">{account.organizationName || account.userEmail || 'Unknown Account'}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Issue: <span className="font-semibold">{account.issueType}</span>
                            {account.amount && ` (${formatKES(account.amount)})`}
                          </div>
                        </div>
                        {account.actionHref && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={account.actionHref}>View</a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recent Billing Events</CardTitle>
                <CardDescription>Latest system-level billing activity</CardDescription>
              </CardHeader>
              <CardContent>
                {opsLoading ? (
                  <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded" />)}</div>
                ) : !opsSummary?.recentEvents.length ? (
                  <div className="text-center py-6 text-gray-400">
                    <p className="text-sm">No recent events</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {opsSummary.recentEvents.map((evt) => (
                      <div key={evt.id} className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1.5 rounded-full ${evt.severity === 'critical' ? 'bg-red-100 text-red-600' : evt.severity === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                          {evt.severity === 'critical' ? <XCircle className="w-4 h-4" /> : evt.severity === 'warning' ? <AlertCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{evt.title}</div>
                          <div className="text-xs text-gray-500">{evt.description}</div>
                          <div className="text-[10px] text-gray-400 mt-1">{new Date(evt.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
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
