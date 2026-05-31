"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { getQueryKey } from "@trpc/react-query"
import { trpc } from "@/lib/trpc"
import { usePlan } from "@/lib/plan-context"
import type { SubscriptionStatusValue } from "@/lib/plan-context"
import { UsageCard } from "@/components/usage/usage-card"
import { UsageComparison } from "@/components/usage/usage-comparison"
import { InvoiceModal } from "@/components/billing/InvoiceModal"
import { MpesaPaymentFlow } from "@/components/billing/MpesaPaymentFlow"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"
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
  Smartphone,
  Send,
  Receipt,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import {
  PLANS,
  PLAN_ORDER,
  PUBLIC_PRICING_PLANS,
  PLAN_COMPARISON_ROWS,
  type PlanId,
} from "@/lib/config/plans"

// -- Local type helpers -----------------------------------------------------

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
  // Invoice fields (may be null on older records)
  invoiceNumber:      string | null;
  subscriptionPlan:   string | null;
  billingPeriodStart: string | null;
  billingPeriodEnd:   string | null;
}

type PaymentMethodProvider = "STRIPE" | "MPESA"
type MpesaPlan = "STARTUP" | "BUSINESS"

interface EnterpriseFormState {
  name: string;
  email: string;
  message: string;
}

// -- Icon map ---------------------------------------------------------------

// -- Status helpers ---------------------------------------------------------

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
  if (!iso) return "--"
  return new Date(iso).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })
}

function daysUntil(iso: string | null): number {
  if (!iso) return 0
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000))
}

// -- Skeleton --------------------------------------------------------------

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

// -- Payment status badge ---------------------------------------------------

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

// -- Main page -------------------------------------------------------------

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3)
}

function CompactAnimatedPrice({ value }: { value: number | null }) {
  const numericValue = value
  const [displayValue, setDisplayValue] = useState(numericValue ?? 0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const displayValueRef = useRef(displayValue)

  useEffect(() => {
    displayValueRef.current = displayValue
  }, [displayValue])

  useEffect(() => {
    if (numericValue === null) {
      setIsTransitioning(false)
      return
    }

    let animationFrame = 0
    let transitionTimer = 0
    let startTime: number | null = null
    const startValue = displayValueRef.current
    const duration = 520

    setIsTransitioning(true)

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const nextValue = Math.round(startValue + (numericValue - startValue) * easeOutCubic(progress))

      displayValueRef.current = nextValue
      setDisplayValue(nextValue)

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate)
      } else {
        displayValueRef.current = numericValue
        setDisplayValue(numericValue)
        transitionTimer = window.setTimeout(() => setIsTransitioning(false), 90)
      }
    }

    animationFrame = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(transitionTimer)
    }
  }, [numericValue])

  if (value === null) {
    return <span>Custom</span>
  }

  return (
    <span
      className={`inline-flex items-baseline gap-1.5 transition duration-500 ease-out ${
        isTransitioning ? "opacity-80 blur-[0.25px]" : "opacity-100 blur-0"
      }`}
      aria-live="polite"
    >
      <span className="text-[0.45em] font-semibold uppercase tracking-[0.12em] text-[#7F8A85]">
        KES
      </span>
      <span>{displayValue.toLocaleString("en-KE")}</span>
    </span>
  )
}

function CompactBillingToggle({
  cycle,
  onChange,
}: {
  cycle: BillingCycle
  onChange: (cycle: BillingCycle) => void
}) {
  const isYearly = cycle === "yearly"

  return (
    <div className="relative inline-grid h-11 w-[244px] grid-cols-2 items-center rounded-full border border-[#1D2925] bg-[#0A100D]/90 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_14px_40px_rgba(0,0,0,0.24)] sm:w-[286px]">
      <span
        className={`absolute left-1 top-1 h-9 w-[calc(50%-4px)] rounded-full bg-[#1ED760] shadow-[0_8px_22px_rgba(30,215,96,0.18)] transition duration-500 ease-out ${
          isYearly ? "translate-x-full" : "translate-x-0"
        }`}
        aria-hidden="true"
      />
      <button
        type="button"
        className={`relative z-10 h-9 rounded-full text-xs font-semibold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1ED760]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-sm ${
          !isYearly ? "text-[#06110A]" : "text-[#B8C0BC] hover:text-[#F5F7F6]"
        }`}
        onClick={() => onChange("monthly")}
        aria-pressed={!isYearly}
      >
        Monthly
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={isYearly}
        aria-label="Use yearly billing"
        className={`relative z-10 flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1ED760]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-sm ${
          isYearly ? "text-[#06110A]" : "text-[#B8C0BC] hover:text-[#F5F7F6]"
        }`}
        onClick={() => onChange("yearly")}
      >
        Yearly
        <span
          className={`hidden rounded-full border px-1.5 py-0.5 text-[10px] font-bold transition duration-500 sm:inline-flex ${
            isYearly
              ? "border-[#06110A]/20 bg-[#06110A]/10 text-[#06110A]"
              : "border-[#1D2925] bg-[#101814] text-[#7F8A85]"
          }`}
        >
          Save 17%
        </span>
      </button>
    </div>
  )
}

function getCompactCardClasses(planId: PlanId) {
  if (planId === "BUSINESS") {
    return "border-[#1ED760]/40 bg-[radial-gradient(circle_at_top,rgba(30,215,96,0.14),transparent_42%),linear-gradient(180deg,#12251B_0%,#07100C_100%)] shadow-[0_18px_60px_rgba(30,215,96,0.09),0_1px_0_rgba(255,255,255,0.06)_inset]"
  }

  if (planId === "ENTERPRISE") {
    return "border-[#C6A15B]/30 bg-[linear-gradient(180deg,rgba(198,161,91,0.08),transparent_35%),linear-gradient(180deg,#111411_0%,#070A09_100%)] shadow-[0_18px_54px_rgba(0,0,0,0.25),0_1px_0_rgba(255,255,255,0.04)_inset]"
  }

  return "border-[#1D2925] bg-[linear-gradient(180deg,#0D1411_0%,#080D0B_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.22),0_1px_0_rgba(255,255,255,0.04)_inset]"
}

export default function BillingSettingsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { plan, usage, billing, isLoading } = usePlan()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [showComparison, setShowComparison] = useState(false)
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false)
  const [paymentPage, setPaymentPage] = useState(1)
  const [usageCompareOpen, setUsageCompareOpen] = useState(false)
  const [enterpriseForm, setEnterpriseForm] = useState<EnterpriseFormState>({ name: "", email: "", message: "" })
  const [enterpriseSuccess, setEnterpriseSuccess] = useState(false)

  // Invoice modal state
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)

  // M-Pesa payment flow state
  const [mpesaFlowPlan, setMpesaFlowPlan] = useState<MpesaPlan | null>(null)

  // Payment method selector state
  const [selectedProvider, setSelectedProvider] = useState<PaymentMethodProvider | null>(null)
  const [mpesaPhoneInput, setMpesaPhoneInput] = useState("")
  const [mpesaPhoneError, setMpesaPhoneError] = useState<string | null>(null)

  const updatePaymentMethodMutation = trpc.billing.updatePaymentMethod.useMutation({
    onSuccess: () => {
      toast.success("Payment method updated.")
      setMpesaPhoneError(null)
      void queryClient.invalidateQueries({ queryKey: getQueryKey(trpc.billing.getPlanAndUsage) })
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to update payment method.")
    },
  })

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

      {/* -- Status alerts -- */}
      {isPastDue && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">Payment past due</p>
            <p className="text-muted-foreground mt-0.5">
              Your last payment failed. Please update your payment method to avoid service interruption.
            </p>
          </div>
          <LoadingButton size="sm" variant="outline" className="ml-auto shrink-0" onClick={openPortal} loading={portalMutation.isPending} loadingText="Opening...">
            Update Payment
          </LoadingButton>
        </div>
      )}

      {isGracePeriod && (
        <div className="flex items-start gap-3 rounded-lg border border-orange-500/30 bg-orange-500/5 px-4 py-3 text-sm">
          <Clock className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">
              Grace period -- {graceDays} day{graceDays !== 1 ? "s" : ""} remaining
            </p>
            <p className="text-muted-foreground mt-0.5">
              Your subscription was cancelled but you retain full {PLANS[currentPlanId].name} access
              until {formatDate(billing?.gracePeriodEndsAt ?? null)}.
            </p>
          </div>
          {!isEnterprise && (
            <LoadingButton
              size="sm"
              className="ml-auto shrink-0"
              onClick={() => startCheckout(currentPlanId === "BUSINESS" ? "BUSINESS" : "STARTUP")}
              loading={checkoutMutation.isPending}
              loadingText="Opening..."
            >
              Reactivate
            </LoadingButton>
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
            Free trial --{" "}
            <span className="font-medium text-foreground">
              {trialDays} day{trialDays !== 1 ? "s" : ""} remaining
            </span>
            . Trial ends {formatDate(billing.trialEndsAt)}. Add a payment method to continue uninterrupted.
          </p>
          {isManagedByStripe && (
            <LoadingButton size="sm" variant="outline" className="ml-auto shrink-0" onClick={openPortal} loading={portalMutation.isPending} loadingText="Opening...">
              Manage
            </LoadingButton>
          )}
        </div>
      )}

      {/* -- Plan selector -- */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Choose a Plan</h2>
            <p className="text-sm text-muted-foreground">Yearly billing saves 17% compared to monthly</p>
          </div>
          <CompactBillingToggle cycle={billingCycle} onChange={setBillingCycle} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {PUBLIC_PRICING_PLANS.map((planConfig) => {
            const planId = planConfig.id
            const isBusinessPlan = planId === "BUSINESS"
            const isEnterprisePlan = planId === "ENTERPRISE"
            const isCurrent = planId === currentPlanId
            const isLowerTier = PLAN_ORDER.indexOf(planId) < currentPlanIndex
            const displayPrice = billingCycle === "yearly" && planConfig.price.yearly !== null
              ? planConfig.price.yearly
              : planConfig.price.monthly

            return (
              <article
                key={planId}
                className={`group relative flex min-h-[25rem] flex-col overflow-hidden rounded-[22px] border p-5 transition duration-500 ease-out hover:-translate-y-0.5 hover:border-[#1ED760]/45 ${getCompactCardClasses(planId)} ${isLowerTier ? "opacity-60" : ""}`}
              >
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                {isBusinessPlan && (
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_50%_0%,rgba(30,215,96,0.18),transparent_62%)] opacity-90 transition duration-500 group-hover:opacity-100" />
                )}
                {isCurrent && (
                  <div className="absolute right-4 top-4 z-20">
                    <Badge className="border border-[#1ED760]/25 bg-[#1ED760] text-xs text-[#06110A] whitespace-nowrap">
                      Current Plan
                    </Badge>
                  </div>
                )}
                {!isCurrent && planConfig.badge === "Most Popular" && (
                  <div className="absolute right-4 top-4 z-20">
                    <Badge className="border border-[#1ED760]/25 bg-[#1ED760]/10 text-xs text-[#1ED760] whitespace-nowrap">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="relative z-10 pt-3">
                  <h3 className="text-xl font-bold leading-tight text-[#F5F7F6]">
                    {planConfig.name}
                  </h3>
                  <p className="mt-3 min-h-[3.5rem] text-sm leading-6 text-[#B8C0BC]">
                    {planConfig.tagline}
                  </p>
                </div>

                <div className="relative z-10 mt-5 border-y border-[#1D2925]/80 py-5">
                  <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                    <div className="font-numeric text-[32px] font-extrabold leading-none text-[#F5F7F6]">
                      <CompactAnimatedPrice value={displayPrice} />
                    </div>
                    {displayPrice !== null && displayPrice > 0 && (
                      <span className="pb-1 text-xs font-medium text-[#7F8A85]">
                        /{billingCycle === "yearly" ? "year" : "month"}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[#7F8A85]">
                    {billingCycle === "yearly" && displayPrice !== null
                      ? "Annual billing with two months of budget returned."
                      : isEnterprisePlan
                        ? "Sales-led pricing for governed rollout and integrations."
                        : "Trial included. No credit card required."}
                  </p>
                </div>

                <ul className="relative z-10 mt-5 flex-1 space-y-3">
                  {planConfig.features.filter((feature) => feature.included).slice(0, 5).map((feature) => (
                    <li key={feature.text} className="flex gap-2.5 text-xs leading-5 text-[#DDE3E0]">
                      <CheckCircle2
                        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                          isEnterprisePlan ? "text-[#D8B76E]" : "text-[#1ED760]"
                        }`}
                        aria-hidden="true"
                      />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative z-10 mt-6">
                  {isCurrent ? (
                    <Button size="sm" disabled className="w-full border border-[#1D2925] bg-[#101814] text-xs text-[#7F8A85] hover:bg-[#101814]">
                      Current Plan
                    </Button>
                  ) : isLowerTier ? (
                    <Button size="sm" disabled className="w-full border border-[#1D2925] bg-[#101814] text-xs text-[#7F8A85] opacity-70 hover:bg-[#101814]">
                      <Lock className="mr-1 h-3 w-3" />
                      Downgrade via Portal
                    </Button>
                  ) : planConfig.cta.type === "subscribe" ? (
                    <LoadingButton
                      size="sm"
                      className={`w-full text-xs font-bold ${
                        isBusinessPlan
                          ? "bg-[#1ED760] text-[#06110A] hover:bg-[#33E875]"
                          : "border border-[#27342F] bg-[#101814] text-[#F5F7F6] hover:border-[#1ED760]/50 hover:bg-[#122018]"
                      }`}
                      onClick={() => {
                        const preferredMethod = billing?.preferredPaymentMethod ?? null
                        if (preferredMethod === "MPESA") {
                          setMpesaFlowPlan(planId as MpesaPlan)
                        } else {
                          startCheckout(planId as "STARTUP" | "BUSINESS")
                        }
                      }}
                      loading={checkoutMutation.isPending}
                      loadingText="Opening..."
                    >
                      {(() => {
                        const preferredMethod = billing?.preferredPaymentMethod ?? null
                        return preferredMethod === "MPESA"
                          ? <><Smartphone className="mr-1 h-3 w-3" />{planConfig.cta.label}</>
                          : <><Zap className="mr-1 h-3 w-3" />{planConfig.cta.label}</>
                      })()}
                    </LoadingButton>
                  ) : planConfig.cta.type === "contact-sales" ? (
                    <Button
                      size="sm"
                      className="w-full border border-[#C6A15B]/34 bg-[#0B0D0C] text-xs font-bold text-[#F5F7F6] hover:border-[#D8B76E]/70 hover:bg-[#14120C]"
                      onClick={() => {
                        setEnterpriseSuccess(false)
                        setEnterpriseForm({ name: "", email: "", message: "" })
                        setShowEnterpriseModal(true)
                      }}
                    >
                      {planConfig.cta.label}
                    </Button>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* -- Usage card -- */}
      <UsageCard
        compareOpen={usageCompareOpen}
        onCompareToggle={setUsageCompareOpen}
      />
      {usageCompareOpen && <UsageComparison />}

      {/* -- Feature comparison (collapsible) -- */}
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

      {/* -- Payment methods -- */}
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
              <LoadingButton size="sm" variant="outline" onClick={openPortal} loading={portalMutation.isPending} loadingText="Opening...">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Manage
              </LoadingButton>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-dashed border-border bg-muted/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No payment method on file</p>
              </div>
            </div>
          )}

          {/* M-Pesa selector */}
          {(() => {
            const isMpesaActive = selectedProvider === "MPESA"
            const storedPhone = billing && "mpesaPhoneNumber" in billing
              ? (billing as unknown as { mpesaPhoneNumber?: string | null }).mpesaPhoneNumber ?? null
              : null

            function savePaymentMethod() {
              if (selectedProvider === "MPESA") {
                const raw = mpesaPhoneInput.trim()
                if (!raw && !storedPhone) {
                  setMpesaPhoneError("Phone number is required for M-Pesa.")
                  return
                }
                const n = raw
                  ? (() => {
                    const s = raw.replace(/[\s\-()]/g, "")
                    let v = s
                    if (v.startsWith("+")) v = v.slice(1)
                    if (/^0[71]\d{8}$/.test(v)) v = "254" + v.slice(1)
                    return /^254\d{9}$/.test(v) ? v : null
                  })()
                  : null
                if (raw && !n) {
                  setMpesaPhoneError("Invalid number. Use 07XX XXX XXX or 254XXXXXXXXX.")
                  return
                }
                updatePaymentMethodMutation.mutate({
                  provider: "MPESA",
                  ...(n ? { mpesaPhoneNumber: n } : {}),
                })
              } else if (selectedProvider === "STRIPE") {
                updatePaymentMethodMutation.mutate({ provider: "STRIPE" })
              }
              setSelectedProvider(null)
            }

            return (
              <div className="space-y-3">
                {/* Card option */}
                <button
                  type="button"
                  onClick={() => setSelectedProvider(prev => prev === "STRIPE" ? null : "STRIPE")}
                  className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                    selectedProvider === "STRIPE"
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Card (Stripe)</p>
                      <p className="text-xs text-muted-foreground">Credit / debit card</p>
                    </div>
                  </div>
                  {selectedProvider === "STRIPE" && (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  )}
                </button>

                {/* M-Pesa option */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProvider(prev => prev === "MPESA" ? null : "MPESA")}
                    className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                      isMpesaActive
                        ? "border-green-500/50 bg-green-500/5"
                        : "border-border/50 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-foreground">M-Pesa</p>
                        <p className="text-xs text-muted-foreground">
                          {storedPhone
                            ? `Saved: ${storedPhone.slice(0, 6)}****${storedPhone.slice(-3)}`
                            : "Safaricom mobile money"}
                        </p>
                      </div>
                    </div>
                    {isMpesaActive && (
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    )}
                  </button>

                  {/* Phone number input -- shown when M-Pesa is selected */}
                  {isMpesaActive && (
                    <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4 space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="mpesa-phone-selector" className="text-xs font-medium">
                          M-Pesa Phone Number
                        </Label>
                        <Input
                          id="mpesa-phone-selector"
                          type="tel"
                          placeholder={storedPhone ? `Current: ${storedPhone.slice(0, 6)}...${storedPhone.slice(-3)}` : "e.g. 0712 345 678"}
                          value={mpesaPhoneInput}
                          onChange={(e) => {
                            setMpesaPhoneInput(e.target.value)
                            setMpesaPhoneError(null)
                          }}
                          className={`text-sm ${mpesaPhoneError ? "border-destructive" : ""}`}
                        />
                        {mpesaPhoneError && (
                          <p className="text-xs text-destructive">{mpesaPhoneError}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Accepts: 07XX XXX XXX, 01XX XXX XXX, or 254XXXXXXXXX
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <LoadingButton
                          size="sm"
                          onClick={savePaymentMethod}
                          loading={updatePaymentMethodMutation.isPending}
                          loadingText="Saving..."
                          className="text-xs"
                        >
                          Save M-Pesa
                        </LoadingButton>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { setSelectedProvider(null); setMpesaPhoneError(null) }}
                          className="text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Save button for Card selection */}
                {selectedProvider === "STRIPE" && (
                  <LoadingButton
                    size="sm"
                    onClick={savePaymentMethod}
                    loading={updatePaymentMethodMutation.isPending}
                    loadingText="Saving..."
                    className="text-xs"
                  >
                    Save Card as Default
                  </LoadingButton>
                )}
              </div>
            )
          })()}
        </CardContent>
      </Card>

      {/* -- Subscription management -- */}
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
              <LoadingButton variant="outline" size="sm" onClick={openPortal} loading={portalMutation.isPending} loadingText="Opening...">
                <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                Manage Subscription
                <ExternalLink className="ml-1.5 h-3 w-3 opacity-60" />
              </LoadingButton>
            )}

            {(isExpired || isGracePeriod) && !isEnterprise && (
              <LoadingButton
                size="sm"
                onClick={() => startCheckout(currentPlanId === "BUSINESS" ? "BUSINESS" : "STARTUP")}
                loading={checkoutMutation.isPending}
                loadingText="Opening..."
              >
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Resubscribe
              </LoadingButton>
            )}

            {isPastDue && isManagedByStripe && (
              <LoadingButton size="sm" onClick={openPortal} loading={portalMutation.isPending} loadingText="Opening...">
                <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                Update Payment Method
                <ExternalLink className="ml-1.5 h-3 w-3 opacity-60" />
              </LoadingButton>
            )}

            {isRegulator && (
              <LoadingButton
                size="sm"
                onClick={() => startCheckout("STARTUP")}
                loading={checkoutMutation.isPending}
                loadingText="Opening..."
              >
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Start Free Trial
              </LoadingButton>
            )}

            {isEnterprise && (
              <p className="text-sm text-muted-foreground">
                Your Enterprise plan is managed by your dedicated account manager. Contact{" "}
                <span className="font-medium text-foreground">support@sheriabot.com</span> for changes.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* -- Payment history -- */}
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
                      <th className="pb-3 text-left font-medium">Invoice #</th>
                      <th className="pb-3 text-left font-medium">Description</th>
                      <th className="pb-3 text-right font-medium">Amount</th>
                      <th className="pb-3 text-center font-medium">Status</th>
                      <th className="pb-3 text-center font-medium">Method</th>
                      <th className="pb-3 text-right font-medium">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(paymentHistoryQuery.data.payments as PaymentRecord[]).map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-border/40 hover:bg-muted/20 cursor-pointer transition-colors"
                        onClick={() => setSelectedPaymentId(p.id)}
                      >
                        <td className="py-3 text-muted-foreground whitespace-nowrap">
                          {p.paidAt
                            ? new Date(p.paidAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })
                            : new Date(p.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
                        </td>
                        <td className="py-3 text-muted-foreground font-mono text-xs whitespace-nowrap">
                          {p.invoiceNumber ?? "--"}
                        </td>
                        <td className="py-3 text-foreground max-w-[160px] truncate">
                          {p.description ?? "Payment"}
                        </td>
                        <td className="py-3 text-right font-medium tabular-nums whitespace-nowrap">
                          {p.amount === 0 ? "--" : `${p.currency} ${(p.amount / 100).toLocaleString("en-KE")}`}
                        </td>
                        <td className="py-3 text-center">
                          <PaymentStatusBadge status={p.status} />
                        </td>
                        <td className="py-3 text-center">
                          {p.provider === "MPESA" ? (
                            <Badge className="bg-green-500/10 text-green-700 border-green-500/20 text-xs gap-1">
                              <Smartphone className="h-3 w-3" />
                              M-Pesa
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs gap-1">
                              <CreditCard className="h-3 w-3" />
                              Card
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedPaymentId(p.id) }}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <FileText className="h-3 w-3" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {(paymentHistoryQuery.data.payments as PaymentRecord[]).map((p) => (
                  <div
                    key={p.id}
                    className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2 cursor-pointer hover:border-border transition-colors"
                    onClick={() => setSelectedPaymentId(p.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {p.paidAt
                          ? new Date(p.paidAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })
                          : new Date(p.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                      <PaymentStatusBadge status={p.status} />
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{p.description ?? "Payment"}</p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tabular-nums">
                          {p.amount === 0 ? "--" : `${p.currency} ${(p.amount / 100).toLocaleString("en-KE")}`}
                        </span>
                        {p.provider === "MPESA" ? (
                          <Badge className="bg-green-500/10 text-green-700 border-green-500/20 text-xs gap-1">
                            <Smartphone className="h-3 w-3" />
                            M-Pesa
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs gap-1">
                            <CreditCard className="h-3 w-3" />
                            Card
                          </Badge>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedPaymentId(p.id) }}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
                      >
                        <FileText className="h-3 w-3" />
                        {p.invoiceNumber ?? "View"}
                      </button>
                    </div>
                  </div>
                ))}
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

      {/* -- Enterprise contact sales modal -- */}
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
                <LoadingButton
                  onClick={() => {
                    enterpriseMutation.mutate({
                      name:    enterpriseForm.name,
                      email:   enterpriseForm.email,
                      message: enterpriseForm.message || undefined,
                    })
                  }}
                  disabled={!enterpriseForm.name.trim() || !enterpriseForm.email.trim()}
                  loading={enterpriseMutation.isPending}
                  loadingText="Sending..."
                >
                  <Send className="mr-1.5 h-4 w-4" />
                  Send Inquiry
                </LoadingButton>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* -- Invoice modal -- */}
      {selectedPaymentId && (
        <InvoiceModal
          paymentId={selectedPaymentId}
          onClose={() => setSelectedPaymentId(null)}
        />
      )}

      {/* -- M-Pesa payment flow modal -- */}
      {mpesaFlowPlan && (
        <MpesaPaymentFlow
          plan={mpesaFlowPlan}
          storedPhone={
            billing && "mpesaPhoneNumber" in billing
              ? (billing as unknown as { mpesaPhoneNumber?: string | null }).mpesaPhoneNumber ?? null
              : null
          }
          onClose={() => setMpesaFlowPlan(null)}
          onSuccess={() => setMpesaFlowPlan(null)}
        />
      )}
    </div>
  )
}
