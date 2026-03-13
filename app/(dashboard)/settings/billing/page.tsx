"use client"

import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc"
import { usePlan } from "@/lib/plan-context"
import type { SubscriptionStatusValue } from "@/lib/plan-context"
import { UsageIndicator } from "@/components/plan/feature-gate"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Zap,
  ShieldCheck,
  XCircle,
} from "lucide-react"

// ── Local type helpers ─────────────────────────────────────────────────────

type CheckoutInput = { plan: "STARTUP" | "BUSINESS" }
type SessionResult = { url: string | null }

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

// ── Plan info ─────────────────────────────────────────────────────────────

const PLAN_LABELS: Record<string, string> = {
  REGULATOR: "Regulator (Free)",
  STARTUP: "Startup",
  BUSINESS: "Business",
  ENTERPRISE: "Enterprise",
}

const PLAN_PRICES: Record<string, string> = {
  STARTUP: "KES 25,000 / month",
  BUSINESS: "KES 75,000 / month",
  ENTERPRISE: "Custom pricing",
}

const PLAN_FEATURES: Record<string, string[]> = {
  REGULATOR: [
    "5 compliance queries / month",
    "Read-only regulatory knowledge base",
    "Community support",
  ],
  STARTUP: [
    "50 compliance queries / month",
    "5 AI checklist generations / month",
    "AI gap analysis",
    "Policy generation",
    "Email support (48hr)",
  ],
  BUSINESS: [
    "200 compliance queries / month",
    "20 AI checklist generations / month",
    "Advanced analytics",
    "Custom integrations & API access",
    "Team collaboration",
    "Priority support (24hr)",
  ],
  ENTERPRISE: [
    "Unlimited compliance queries",
    "Unlimited checklists & templates",
    "Custom integrations",
    "Dedicated account manager",
    "SLA guarantee",
    "On-premise deployment option",
  ],
}

// ── Skeleton ──────────────────────────────────────────────────────────────

function BillingSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-40" />
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-4 w-full" />)}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => <Skeleton key={i} className="h-6 w-full" />)}
        </CardContent>
      </Card>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function BillingSettingsPage() {
  const router = useRouter()
  const { plan, usage, billing, isLoading } = usePlan()

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

  function startCheckout(selectedPlan: "STARTUP" | "BUSINESS") {
    const input: CheckoutInput = { plan: selectedPlan }
    checkoutMutation.mutate(input)
  }

  function openPortal() {
    portalMutation.mutate()
  }

  if (isLoading) return <BillingSkeleton />

  const planName = plan ?? "REGULATOR"
  const status   = billing?.subscriptionStatus ?? null
  const features = PLAN_FEATURES[planName] ?? []
  const trialDays = daysUntil(billing?.trialEndsAt ?? null)
  const graceDays = daysUntil(billing?.gracePeriodEndsAt ?? null)
  const isManagedByStripe = billing?.stripeCustomerId != null
  const isRegulator   = planName === "REGULATOR"
  const isEnterprise  = planName === "ENTERPRISE"
  const isPastDue     = status === "PAST_DUE"
  const isGracePeriod = status === "GRACE_PERIOD"
  const isExpired     = status === "EXPIRED" || status === "CANCELLED"
  const isTrialing    = status === "TRIALING"
  const isActive      = status === "ACTIVE"

  return (
    <div className="space-y-6">
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
            {portalMutation.isPending ? "Opening…" : "Update Payment"}
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
              Your subscription was cancelled but you retain full {PLAN_LABELS[planName]} access
              until {formatDate(billing?.gracePeriodEndsAt ?? null)}.
            </p>
          </div>
          {!isEnterprise && (
            <Button size="sm" className="ml-auto shrink-0"
              onClick={() => startCheckout(planName === "BUSINESS" ? "BUSINESS" : "STARTUP")}
              disabled={checkoutMutation.isPending}>
              {checkoutMutation.isPending ? "Opening…" : "Reactivate"}
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
            Free trial — <span className="font-medium text-foreground">{trialDays} day{trialDays !== 1 ? "s" : ""} remaining</span>.
            Trial ends {formatDate(billing.trialEndsAt)}. Add a payment method to continue uninterrupted.
          </p>
          {isManagedByStripe && (
            <Button size="sm" variant="outline" className="ml-auto shrink-0" onClick={openPortal} disabled={portalMutation.isPending}>
              {portalMutation.isPending ? "Opening…" : "Manage"}
            </Button>
          )}
        </div>
      )}

      {/* ── Current plan card ── */}
      <Card className="bg-card/50 backdrop-blur border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{PLAN_LABELS[planName] ?? planName} Plan</CardTitle>
              <CardDescription>Your current subscription</CardDescription>
            </div>
            {statusBadge(status)}
          </div>
        </CardHeader>

        <CardContent>
          {/* Price line */}
          {!isRegulator && PLAN_PRICES[planName] && (
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-foreground">
                {PLAN_PRICES[planName].split(" / ")[0]}
              </span>
              <span className="text-muted-foreground">/ month</span>
            </div>
          )}

          {/* Features */}
          <div className="space-y-2 mb-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span className="text-foreground">{f}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {isRegulator && (
              <>
                <Button onClick={() => startCheckout("STARTUP")} disabled={checkoutMutation.isPending}>
                  <Zap className="mr-1.5 h-4 w-4" />
                  {checkoutMutation.isPending ? "Opening…" : "Start Free Trial"}
                </Button>
                <Button variant="outline" onClick={() => startCheckout("BUSINESS")} disabled={checkoutMutation.isPending}>
                  Upgrade to Business
                </Button>
              </>
            )}

            {(isActive || isTrialing) && !isRegulator && !isEnterprise && isManagedByStripe && (
              <Button variant="outline" onClick={openPortal} disabled={portalMutation.isPending}>
                <CreditCard className="mr-1.5 h-4 w-4" />
                {portalMutation.isPending ? "Opening…" : "Manage Subscription"}
                <ExternalLink className="ml-1.5 h-3.5 w-3.5 opacity-60" />
              </Button>
            )}

            {(isExpired || isGracePeriod) && !isEnterprise && (
              <Button
                onClick={() => startCheckout(planName === "BUSINESS" ? "BUSINESS" : "STARTUP")}
                disabled={checkoutMutation.isPending}
              >
                <Zap className="mr-1.5 h-4 w-4" />
                {checkoutMutation.isPending ? "Opening…" : "Resubscribe"}
              </Button>
            )}

            {isPastDue && isManagedByStripe && (
              <Button onClick={openPortal} disabled={portalMutation.isPending}>
                <CreditCard className="mr-1.5 h-4 w-4" />
                {portalMutation.isPending ? "Opening…" : "Update Payment Method"}
                <ExternalLink className="ml-1.5 h-3.5 w-3.5 opacity-60" />
              </Button>
            )}

            {isEnterprise && (
              <p className="text-sm text-muted-foreground">
                Your Enterprise plan is managed by your dedicated account manager. Contact{" "}
                <span className="font-medium text-foreground">support@sheriabot.co.ke</span> for changes.
              </p>
            )}
          </div>

          {/* Billing dates */}
          {billing?.planStartDate && (
            <p className="text-xs text-muted-foreground mt-4">
              Plan started: {formatDate(billing.planStartDate)}
              {isActive && billing.planEndDate && (
                <> · Next renewal: {formatDate(billing.planEndDate)}</>
              )}
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Usage card ── */}
      {usage && (
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">This Month&apos;s Usage</CardTitle>
            <CardDescription>Resets on the 1st of each month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UsageIndicator
              label="Compliance Queries"
              current={usage.complianceQueries.current}
              limit={usage.complianceQueries.limit}
            />
            <UsageIndicator
              label="Checklist Generations"
              current={usage.checklistGenerations.current}
              limit={usage.checklistGenerations.limit}
            />
            <UsageIndicator
              label="API Calls"
              current={usage.apiCalls.current}
              limit={usage.apiCalls.limit}
            />
            <UsageIndicator
              label="Document Storage"
              current={usage.documentStorageMB.current}
              limit={usage.documentStorageMB.limit}
            />
          </CardContent>
        </Card>
      )}

      {/* ── Payment & invoices via Stripe Portal ── */}
      {isManagedByStripe && !isRegulator && (
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4 text-primary" />
              Payment &amp; Invoices
            </CardTitle>
            <CardDescription>Manage payment methods and download past invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Payment methods and billing history are managed securely via Stripe.
            </p>
            <Button variant="outline" onClick={openPortal} disabled={portalMutation.isPending}>
              <ExternalLink className="mr-1.5 h-4 w-4" />
              {portalMutation.isPending ? "Opening…" : "Open Billing Portal"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
