"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc"
import { usePlan } from "@/lib/plan-context"
import type { SubscriptionStatusValue } from "@/lib/plan-context"
import { UsageCard } from "@/components/usage/usage-card"
import { UsageComparison } from "@/components/usage/usage-comparison"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Zap,
  ShieldCheck,
  XCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  Building2,
  Scale,
  Shield,
  Smartphone,
  Send,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  PLANS,
  PLAN_ORDER,
  PLAN_COMPARISON_ROWS,
  formatPrice,
  getAnnualSavings,
  type PlanId,
} from "@/lib/config/plans"

// ── Local type helpers ─────────────────────────────────────────────────────

type CheckoutInput = { plan: "STARTUP" | "BUSINESS" }
type SessionResult = { url: string | null }
type BillingCycle = "monthly" | "yearly"

interface PaymentRecord {
  id: string;
  provider: string;
  providerTransactionId: string | null;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  paidAt: string | null;
  createdAt: string;
  metadata: Record<string, unknown> | null;
}

interface EnterpriseFormState {
  name: string;
  email: string;
  message: string;
}

// ── Icon map ───────────────────────────────────────────────────────────────

const PLAN_ICONS: Record<PlanId, React.ComponentType<{ className?: string }>> = {
  REGULATOR: Shield,
  STARTUP: Zap,
  BUSINESS: Building2,
  ENTERPRISE: Scale,
}

// ── Status helpers ─────────────────────────────────────────────────────────

function statusBadge(status: SubscriptionStatusValue) {
  switch (status) {
    case "ACTIVE":
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
    case "TRIALING":
      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Trial</Badge>
    case "PAST_DUE":
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Past Due</Badge>
    case "GRACE_PERIOD":
      return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">Grace Period</Badge>
    case "CANCELLED":
    case "EXPIRED":
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Cancelled</Badge>
    default:
      return <Badge variant="outline">Free</Badge>
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })
}

function daysUntil(iso: string | null): number {
  if (!iso) return 0
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000))
}

// ── Skeleton ──────────────────────────────────────────────────────────────

function BillingSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-3" />
              {[1, 2, 3].map((j) => <Skeleton key={j} className="h-3 w-full mb-1" />)}
              <Skeleton className="h-9 w-full mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-6 w-full" />)}
        </CardContent>
      </Card>
    </div>
  )
}

// ── Payment status badge ───────────────────────────────────────────────────

function PaymentStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "COMPLETED":
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">Paid</Badge>
    case "FAILED":
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">Failed</Badge>
    case "REFUNDED":
      return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-xs">Refunded</Badge>
    default:
      return <Badge variant="outline" className="text-xs">Pending</Badge>
  }
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function BillingSettingsPage() {
  const router = useRouter()
  const { plan, usage, billing, isLoading } = usePlan()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [showComparison, setShowComparison] = useState(false)
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false)
  const [paymentPage, setPaymentPage] = useState(1)
  const [usageCompareOpen, setUsageCompareOpen] = useState(false)
  const [enterpriseForm, setEnterpriseForm] = useState<EnterpriseFormState>({ name: "", email: "", message: "" })
  const [enterpriseSuccess, setEnterpriseSuccess] = useState(false)

  const enterpriseMutation = trpc.billing.requestEnterprise.useMutation({
    onSuccess: () => {
      setEnterpriseSuccess(true)
    },
  })

  const checkoutMutation = trpc.billing.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      const result = data as SessionResult
      if (result?.url) router.push(result.url)
    },
  })

  const portalMutation = trpc.billing.createPortalSession.useMutation({
    onSuccess: (data) => {
      const result = data as SessionResult
      if (result?.url) router.push(result.url)
    },
  })

  const paymentHistoryQuery = trpc.payment.list.useQuery(
    { page: paymentPage, limit: 10 },
    { staleTime: 5 * 60 * 1000 },
  )

  function startCheckout(selectedPlan: "STARTUP" | "BUSINESS") {
    const input: CheckoutInput = { plan: selectedPlan }
    checkoutMutation.mutate(input)
  }

  function openPortal() {
    portalMutation.mutate()
  }

  if (isLoading) return <BillingSkeleton />

  const currentPlanId = (plan ?? "REGULATOR") as PlanId
  const status = billing?.subscriptionStatus ?? null
  const trialDays = daysUntil(billing?.trialEndsAt ?? null)
  const graceDays = daysUntil(billing?.gracePeriodEndsAt ?? null)
  const isManagedByStripe = billing?.stripeCustomerId != null
  const isRegulator = currentPlanId === "REGULATOR"
  const isEnterprise = currentPlanId === "ENTERPRISE"
  const isPastDue = status === "PAST_DUE"
  const isGracePeriod = status === "GRACE_PERIOD"
  const isExpired = status === "EXPIRED" || status === "CANCELLED"
  const isTrialing = status === "TRIALING"
  const isActive = status === "ACTIVE"
  const currentPlanIndex = PLAN_ORDER.indexOf(currentPlanId)

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing &amp; Subscription</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and payment methods</p>
      </div>

      {/* ── Status alerts ── */}
      {isPastDue && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">Payment past due</p>
            <p className="text-muted-foreground mt-0.5">
              Your last payment failed. Please update your payment method to avoid service interruption.
            </p>
          </div>
          <Button size="sm" variant="outline" className="ml-auto shrink-0" onClick={openPortal} disabled={portalMutation.isPending}>
            {portalMutation.isPending ? "Opening..." : "Update Payment"}
          </Button>
        </div>
      )}

      {isGracePeriod && (
        <div className="flex items-start gap-3 rounded-lg border border-orange-500/30 bg-orange-500/5 px-4 py-3 text-sm">
          <Clock className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">
              Grace period — {graceDays} day{graceDays !== 1 ? "s" : ""} remaining
            </p>
            <p className="text-muted-foreground mt-0.5">
              Your subscription was cancelled but you retain full {PLANS[currentPlanId].name} access
              until {formatDate(billing?.gracePeriodEndsAt ?? null)}.
            </p>
          </div>
          {!isEnterprise && (
            <Button
              size="sm"
              className="ml-auto shrink-0"
              onClick={() => startCheckout(currentPlanId === "BUSINESS" ? "BUSINESS" : "STARTUP")}
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending ? "Opening..." : "Reactivate"}
            </Button>
          )}
        </div>
      )}

      {isExpired && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
          <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">Subscription ended</p>
            <p className="text-muted-foreground mt-0.5">
              Your account has been moved to the free tier. Resubscribe to regain premium access.
            </p>
          </div>
        </div>
      )}

      {isTrialing && billing?.trialEndsAt && (
        <div className="flex items-start gap-3 rounded-lg border border-blue-500/30 bg-blue-500/5 px-4 py-3 text-sm">
          <ShieldCheck className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-muted-foreground">
            Free trial —{" "}
            <span className="font-medium text-foreground">
              {trialDays} day{trialDays !== 1 ? "s" : ""} remaining
            </span>
            . Trial ends {formatDate(billing.trialEndsAt)}. Add a payment method to continue uninterrupted.
          </p>
          {isManagedByStripe && (
            <Button size="sm" variant="outline" className="ml-auto shrink-0" onClick={openPortal} disabled={portalMutation.isPending}>
              {portalMutation.isPending ? "Opening..." : "Manage"}
            </Button>
          )}
        </div>
      )}

      {/* ── Plan selector ── */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Choose a Plan</h2>
            <p className="text-sm text-muted-foreground">Yearly billing saves 17% compared to monthly</p>
          </div>
          {/* Billing cycle toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                billingCycle === "yearly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PLAN_ORDER.map((planId) => {
            const planConfig = PLANS[planId]
            const Icon = PLAN_ICONS[planId]
            const isCurrent = planId === currentPlanId
            const isLowerTier = PLAN_ORDER.indexOf(planId) < currentPlanIndex
            const annualSavings = getAnnualSavings(planConfig)
            const displayPrice = billingCycle === "yearly" && planConfig.price.yearly !== null
              ? planConfig.price.yearly
              : planConfig.price.monthly

            return (
              <Card
                key={planId}
                className={`relative flex flex-col transition-all ${
                  isCurrent
                    ? "border-primary/60 shadow-md shadow-primary/10 bg-primary/5"
                    : planConfig.popular
                    ? "border-primary/30"
                    : "border-border/50"
                } ${isLowerTier ? "opacity-60" : ""}`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-xs whitespace-nowrap">
                      Current Plan
                    </Badge>
                  </div>
                )}
                {!isCurrent && planConfig.badge === "Most Popular" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-xs whitespace-nowrap">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-3 pt-5">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                      isCurrent ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base">{planConfig.name}</CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col pt-0">
                  {/* Price */}
                  <div className="mb-4">
                    {displayPrice !== null ? (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-foreground">
                            {formatPrice(displayPrice, 'KES')}
                          </span>
                          {displayPrice > 0 && (
                            <span className="text-xs text-muted-foreground">
                              /{billingCycle === "yearly" ? "yr" : "mo"}
                            </span>
                          )}
                        </div>
                        {billingCycle === "yearly" && annualSavings && (
                          <p className="text-xs text-emerald-600 mt-0.5">{annualSavings}</p>
                        )}
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-foreground">Custom</span>
                    )}
                  </div>

                  {/* Feature list */}
                  <ul className="flex-1 space-y-1.5 mb-4">
                    {planConfig.features.slice(0, 4).map((feature) => (
                      <li key={feature.text} className="flex items-start gap-1.5">
                        <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                          feature.included ? "text-primary" : "text-muted-foreground/30"
                        }`} />
                        <span className={`text-xs ${
                          feature.included ? "text-muted-foreground" : "text-muted-foreground/50 line-through"
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA button */}
                  {isCurrent ? (
                    <Button size="sm" variant="outline" disabled className="w-full text-xs">
                      Current Plan
                    </Button>
                  ) : isLowerTier ? (
                    <Button size="sm" variant="outline" disabled className="w-full text-xs opacity-50">
                      <Lock className="mr-1 h-3 w-3" />
                      Downgrade via Portal
                    </Button>
                  ) : planConfig.cta.type === "subscribe" ? (
                    <Button
                      size="sm"
                      className="w-full text-xs"
                      variant={planConfig.popular ? "default" : "outline"}
                      onClick={() => startCheckout(planId as "STARTUP" | "BUSINESS")}
                      disabled={checkoutMutation.isPending}
                    >
                      <Zap className="mr-1 h-3 w-3" />
                      {checkoutMutation.isPending ? "Opening..." : planConfig.cta.label}
                    </Button>
                  ) : planConfig.cta.type === "contact-sales" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => {
                        setEnterpriseSuccess(false)
                        setEnterpriseForm({ name: "", email: "", message: "" })
                        setShowEnterpriseModal(true)
                      }}
                    >
                      {planConfig.cta.label}
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ── Usage card ── */}
      <UsageCard
        compareOpen={usageCompareOpen}
        onCompareToggle={setUsageCompareOpen}
      />
      {usageCompareOpen && <UsageComparison />}

      {/* ── Feature comparison (collapsible) ── */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setShowComparison((v) => !v)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Feature Comparison</CardTitle>
            {showComparison
              ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
              : <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </div>
          <CardDescription>Compare what&apos;s included across all plans</CardDescription>
        </CardHeader>

        {showComparison && (
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left font-medium text-muted-foreground">Feature</th>
                    <th className="pb-3 text-center font-medium text-muted-foreground">Startup</th>
                    <th className={`pb-3 text-center font-medium ${currentPlanId === "BUSINESS" ? "text-primary" : "text-muted-foreground"}`}>
                      Business
                    </th>
                    <th className="pb-3 text-center font-medium text-muted-foreground">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {PLAN_COMPARISON_ROWS.map((row) => (
                    <tr key={row.feature} className="border-b border-border/40">
                      <td className="py-3 text-muted-foreground">{row.feature}</td>
                      <td className={`py-3 text-center ${currentPlanId === "STARTUP" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {row.startup}
                      </td>
                      <td className={`py-3 text-center ${currentPlanId === "BUSINESS" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {row.business}
                      </td>
                      <td className={`py-3 text-center ${currentPlanId === "ENTERPRISE" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {row.enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ── Payment methods ── */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4 text-primary" />
            Payment Methods
          </CardTitle>
          <CardDescription>Your saved payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isManagedByStripe && !isRegulator ? (
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Card on file</p>
                  <p className="text-xs text-muted-foreground">Managed securely via Stripe</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={openPortal} disabled={portalMutation.isPending}>
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                {portalMutation.isPending ? "Opening..." : "Manage"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-dashed border-border bg-muted/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No payment method on file</p>
              </div>
            </div>
          )}

          {/* M-Pesa coming soon */}
          <div className="flex items-center justify-between rounded-lg border border-dashed border-border bg-muted/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground/50" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">M-Pesa</p>
                <p className="text-xs text-muted-foreground">Mobile money payments</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs text-muted-foreground">Coming soon</Badge>
          </div>
        </CardContent>
      </Card>

      {/* ── Subscription management ── */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Subscription Management</CardTitle>
          <CardDescription>Manage your current subscription</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Current Plan</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">{PLANS[currentPlanId].name}</span>
                {statusBadge(status)}
              </div>
            </div>
          </div>

          {billing?.planStartDate && (
            <div>
              <p className="text-xs text-muted-foreground">
                Plan started: {formatDate(billing.planStartDate)}
                {(isActive || isTrialing) && billing.planEndDate && (
                  <> &middot; Next renewal: {formatDate(billing.planEndDate)}</>
                )}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {(isActive || isTrialing) && isManagedByStripe && !isRegulator && !isEnterprise && (
              <Button variant="outline" size="sm" onClick={openPortal} disabled={portalMutation.isPending}>
                <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                {portalMutation.isPending ? "Opening..." : "Manage Subscription"}
                <ExternalLink className="ml-1.5 h-3 w-3 opacity-60" />
              </Button>
            )}

            {(isExpired || isGracePeriod) && !isEnterprise && (
              <Button
                size="sm"
                onClick={() => startCheckout(currentPlanId === "BUSINESS" ? "BUSINESS" : "STARTUP")}
                disabled={checkoutMutation.isPending}
              >
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                {checkoutMutation.isPending ? "Opening..." : "Resubscribe"}
              </Button>
            )}

            {isPastDue && isManagedByStripe && (
              <Button size="sm" onClick={openPortal} disabled={portalMutation.isPending}>
                <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                {portalMutation.isPending ? "Opening..." : "Update Payment Method"}
                <ExternalLink className="ml-1.5 h-3 w-3 opacity-60" />
              </Button>
            )}

            {isRegulator && (
              <Button
                size="sm"
                onClick={() => startCheckout("STARTUP")}
                disabled={checkoutMutation.isPending}
              >
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                {checkoutMutation.isPending ? "Opening..." : "Start Free Trial"}
              </Button>
            )}

            {isEnterprise && (
              <p className="text-sm text-muted-foreground">
                Your Enterprise plan is managed by your dedicated account manager. Contact{" "}
                <span className="font-medium text-foreground">support@sheriabot.co.ke</span> for changes.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Payment history ── */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Receipt className="h-4 w-4 text-primary" />
            Payment History
          </CardTitle>
          <CardDescription>Your billing history and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentHistoryQuery.isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : paymentHistoryQuery.isError ? (
            <p className="text-sm text-muted-foreground">Unable to load payment history.</p>
          ) : !paymentHistoryQuery.data?.payments.length ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Receipt className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No payment history yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Your invoices and receipts will appear here once you start a paid subscription.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile card layout + desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="pb-3 text-left font-medium">Date</th>
                      <th className="pb-3 text-left font-medium">Description</th>
                      <th className="pb-3 text-right font-medium">Amount</th>
                      <th className="pb-3 text-center font-medium">Status</th>
                      <th className="pb-3 text-center font-medium">Provider</th>
                      <th className="pb-3 text-right font-medium">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(paymentHistoryQuery.data.payments as PaymentRecord[]).map((p) => {
                      const meta = p.metadata
                      const receiptUrl = meta?.hostedInvoiceUrl as string | null | undefined
                      return (
                        <tr key={p.id} className="border-b border-border/40">
                          <td className="py-3 text-muted-foreground">
                            {p.paidAt
                              ? new Date(p.paidAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })
                              : new Date(p.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
                          </td>
                          <td className="py-3 text-foreground max-w-[200px] truncate">
                            {p.description ?? "Payment"}
                          </td>
                          <td className="py-3 text-right font-medium tabular-nums">
                            {p.amount === 0 ? "—" : `${p.currency} ${(p.amount / 100).toLocaleString("en-KE")}`}
                          </td>
                          <td className="py-3 text-center">
                            <PaymentStatusBadge status={p.status} />
                          </td>
                          <td className="py-3 text-center text-muted-foreground capitalize text-xs">
                            {p.provider.toLowerCase()}
                          </td>
                          <td className="py-3 text-right">
                            {receiptUrl ? (
                              <a
                                href={receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                View
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {(paymentHistoryQuery.data.payments as PaymentRecord[]).map((p) => {
                  const meta = p.metadata
                  const receiptUrl = meta?.hostedInvoiceUrl as string | null | undefined
                  return (
                    <div key={p.id} className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {p.paidAt
                            ? new Date(p.paidAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })
                            : new Date(p.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                        <PaymentStatusBadge status={p.status} />
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">{p.description ?? "Payment"}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold tabular-nums">
                          {p.amount === 0 ? "—" : `${p.currency} ${(p.amount / 100).toLocaleString("en-KE")}`}
                        </span>
                        {receiptUrl && (
                          <a
                            href={receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            Receipt <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {(paymentHistoryQuery.data.totalPages ?? 1) > 1 && (
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/40">
                  <span className="text-xs text-muted-foreground">
                    Page {paymentHistoryQuery.data.page} of {paymentHistoryQuery.data.totalPages}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPaymentPage((p) => Math.max(1, p - 1))}
                      disabled={paymentPage <= 1 || paymentHistoryQuery.isFetching}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPaymentPage((p) => p + 1)}
                      disabled={
                        paymentPage >= (paymentHistoryQuery.data.totalPages ?? 1) ||
                        paymentHistoryQuery.isFetching
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Enterprise contact sales modal ── */}
      <Dialog
        open={showEnterpriseModal}
        onOpenChange={(open) => {
          setShowEnterpriseModal(open)
          if (!open) setEnterpriseSuccess(false)
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          {enterpriseSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Inquiry Received
                </DialogTitle>
                <DialogDescription>
                  Thanks for your interest in the Enterprise plan. Our team will reach out within 24 hours.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => setShowEnterpriseModal(false)}>Close</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Contact Sales</DialogTitle>
                <DialogDescription>
                  Tell us about your organization and we&apos;ll tailor an Enterprise plan for you.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ent-name">Your Name</Label>
                  <Input
                    id="ent-name"
                    placeholder="Jane Waweru"
                    value={enterpriseForm.name}
                    onChange={(e) => setEnterpriseForm((f) => ({ ...f, name: e.target.value }))}
                    disabled={enterpriseMutation.isPending}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ent-email">Work Email</Label>
                  <Input
                    id="ent-email"
                    type="email"
                    placeholder="jane@yourcompany.co.ke"
                    value={enterpriseForm.email}
                    onChange={(e) => setEnterpriseForm((f) => ({ ...f, email: e.target.value }))}
                    disabled={enterpriseMutation.isPending}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ent-message">Message (optional)</Label>
                  <Textarea
                    id="ent-message"
                    placeholder="Tell us about your compliance needs, team size, or any specific requirements..."
                    rows={4}
                    value={enterpriseForm.message}
                    onChange={(e) => setEnterpriseForm((f) => ({ ...f, message: e.target.value }))}
                    disabled={enterpriseMutation.isPending}
                  />
                </div>
                {enterpriseMutation.isError && (
                  <p className="text-sm text-destructive">
                    {enterpriseMutation.error?.message ?? "Something went wrong. Please try again."}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowEnterpriseModal(false)}
                  disabled={enterpriseMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    enterpriseMutation.mutate({
                      name:    enterpriseForm.name,
                      email:   enterpriseForm.email,
                      message: enterpriseForm.message || undefined,
                    })
                  }}
                  disabled={
                    !enterpriseForm.name.trim() ||
                    !enterpriseForm.email.trim() ||
                    enterpriseMutation.isPending
                  }
                >
                  <Send className="mr-1.5 h-4 w-4" />
                  {enterpriseMutation.isPending ? "Sending..." : "Send Inquiry"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
