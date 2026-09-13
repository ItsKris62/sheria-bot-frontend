"use client"

/**
 * MpesaPaymentFlow
 *
 * Modal component that handles the full M-Pesa STK push & conversion flow:
 *   1. Initiation  — shows plan, pricing (monthly/yearly with 15% discount),
 *                    pilot-to-paid feature comparison, retained member/country
 *                    selectors where required, phone number, and Pay button
 *   2. Waiting     — STK push sent; polls billing.getMpesaPaymentStatus every 5s
 *                    with a 90-second countdown
 *   3. Success     — green checkmark; invalidates query caches
 *   4. Failure     — error state with retry button
 *   5. Timeout     — if 90 seconds pass without confirmation
 */

import { useState, useEffect, useRef } from "react"
import { trpc } from "@/lib/trpc"
import { useQueryClient } from "@tanstack/react-query"
import { getQueryKey } from "@trpc/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  X,
  Smartphone,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Users,
  Globe,
  HardDrive,
  Check,
  AlertTriangle,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { trackBeginCheckout, trackPurchase } from "@/lib/analytics"

// ── Types ──────────────────────────────────────────────────────────────────

type FlowState = "initiate" | "waiting" | "success" | "failed" | "timeout"

type Plan = "STARTER" | "GROWTH" | "BUSINESS" | "STARTUP" | "ENTERPRISE"
type PaymentPurpose = "INITIAL_PURCHASE" | "RENEWAL"
type BillingInterval = "monthly" | "yearly"

const PLAN_LABELS: Record<Plan, string> = {
  STARTER: "Starter",
  GROWTH: "Growth",
  STARTUP: "Startup",
  BUSINESS: "Business",
  ENTERPRISE: "Enterprise",
}

const POLL_INTERVAL_MS = 5000 // 5 seconds
const MAX_WAIT_SECONDS = 90

// ── Phone helpers ──────────────────────────────────────────────────────────

function normalisePhone(raw: string): string | null {
  const stripped = raw.replace(/[\s\-()]/g, "")
  let n = stripped
  if (n.startsWith("+")) n = n.slice(1)
  if (/^0[71]\d{8}$/.test(n)) n = "254" + n.slice(1)
  return /^254\d{9}$/.test(n) ? n : null
}

function formatPhoneDisplay(normalised: string): string {
  // 254712345678 -> 0712 345 678
  const local = "0" + normalised.slice(3)
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`
}

// ── Countdown hook ─────────────────────────────────────────────────────────

function useCountdown(seconds: number, active: boolean) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (!active) {
      return
    }
    queueMicrotask(() => setRemaining(seconds))
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [active, seconds])

  return active ? remaining : seconds
}

// ── Main component ─────────────────────────────────────────────────────────

interface MpesaPaymentFlowProps {
  plan: Plan
  planPriceKes?: number | null
  paymentPurpose?: PaymentPurpose
  storedPhone?: string | null
  onClose: () => void
  onSuccess?: () => void
}

export function MpesaPaymentFlow({
  plan,
  planPriceKes,
  paymentPurpose = "INITIAL_PURCHASE",
  storedPhone,
  onClose,
  onSuccess,
}: MpesaPaymentFlowProps) {
  const [flowState, setFlowState] = useState<FlowState>("initiate")
  const [interval, setInterval] = useState<BillingInterval>("monthly")
  const [phoneInput, setPhoneInput] = useState(
    storedPhone ? formatPhoneDisplay(storedPhone) : ""
  )
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [failReason, setFailReason] = useState<string | null>(null)

  // Retained member & jurisdiction selections for down-capacity transitions
  const [selectedMemberUserIds, setSelectedMemberUserIds] = useState<string[]>([])
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>([])

  const queryClient = useQueryClient()
  const pollingActive = flowState === "waiting"
  const countdown = useCountdown(MAX_WAIT_SECONDS, pollingActive)
  const timedOutRef = useRef(false)

  // Fetch plan conversion preview (pre-checkout comparison)
  const previewQuery = (trpc.billing as any).getPlanConversionPreview?.useQuery?.(
    { plan, interval },
    {
      enabled: paymentPurpose === "INITIAL_PURCHASE" && !!plan && flowState === "initiate",
      staleTime: 30000,
    }
  )

  const previewData = previewQuery?.data

  // Initialize retained members and jurisdictions when preview loads
  useEffect(() => {
    if (!previewData) return

    // Auto-select owner and default active members up to limit
    const owner = previewData.activeMembers?.find((m: any) => m.role === "OWNER")
    const seatsLimit = previewData.target?.seatsLimit ?? 1
    const candidateMembers = previewData.activeMembers ?? []

    const initialMembers: string[] = []
    if (owner) initialMembers.push(owner.userId)

    for (const member of candidateMembers) {
      if (initialMembers.length >= seatsLimit) break
      if (!initialMembers.includes(member.userId)) {
        initialMembers.push(member.userId)
      }
    }
    setSelectedMemberUserIds(initialMembers)

    // Auto-select home jurisdiction and available jurisdictions up to limit
    const homeCode = previewData.organization?.homeJurisdictionCode || "KE"
    const countriesLimit = previewData.target?.countriesLimit ?? 1
    const initialCountries = [homeCode]

    for (const code of previewData.availableJurisdictions ?? []) {
      if (initialCountries.length >= countriesLimit) break
      if (!initialCountries.includes(code)) {
        initialCountries.push(code)
      }
    }
    setSelectedJurisdictions(initialCountries)
  }, [previewData])

  // Handle 90-second timeout
  useEffect(() => {
    if (pollingActive && countdown === 0 && !timedOutRef.current) {
      timedOutRef.current = true
      queueMicrotask(() => setFlowState("timeout"))
    }
  }, [pollingActive, countdown])

  // Initiate payment mutation
  const initiateMutation = (trpc.billing as any).initiateMpesaPayment.useMutation({
    onSuccess: (data: any) => {
      setPaymentId(data.paymentId)
      timedOutRef.current = false
      setFlowState("waiting")
      trackBeginCheckout({
        plan_type: plan,
        payment_provider: "INTASEND",
        value: effectivePriceKes ?? undefined,
        currency: "KES",
        cycle: interval,
      })
    },
    onError: (err: any) => {
      toast.error(err.message ?? "Failed to initiate M-Pesa payment.")
      setFlowState("initiate")
    },
  })

  // Mutation to claim purchase telemetry atomically on backend
  const claimTelemetryMutation = (trpc.billing as any).claimPurchaseTelemetry?.useMutation?.()

  // Poll payment status
  const statusQuery = trpc.billing.getMpesaPaymentStatus.useQuery(
    { paymentId: paymentId ?? "" },
    {
      enabled: pollingActive && !!paymentId,
      refetchInterval: pollingActive ? POLL_INTERVAL_MS : false,
      staleTime: 0,
    }
  )

  const effectivePriceKes = previewData?.target?.price?.effective ?? planPriceKes ?? 0
  const isRenewal = paymentPurpose === "RENEWAL"
  const planLabel = PLAN_LABELS[plan] ?? plan

  // React to status updates from polling
  useEffect(() => {
    if (!statusQuery.data) return

    const status = statusQuery.data.status

    if (status === "COMPLETED") {
      queueMicrotask(() => setFlowState("success"))

      if (paymentId) {
        void trackPurchase({
          transaction_id: paymentId,
          plan_type: plan,
          payment_provider: "INTASEND",
          value: effectivePriceKes ?? undefined,
          currency: "KES",
          claimChecker: async () => {
            if (claimTelemetryMutation?.mutateAsync) {
              return claimTelemetryMutation.mutateAsync({ paymentId })
            }
            return { firstPurchaseTelemetry: true }
          },
        })
      }

      // Invalidate billing + payment history caches
      void queryClient.invalidateQueries({
        queryKey: getQueryKey(trpc.billing.getPlanAndUsage),
      })
      void queryClient.invalidateQueries({
        queryKey: getQueryKey(trpc.payment.list),
      })

      toast.success("Payment confirmed! Your subscription is now active.")
      onSuccess?.()
    } else if (status === "FAILED") {
      queueMicrotask(() => {
        setFlowState("failed")
        setFailReason("The M-Pesa payment was declined or cancelled.")
      })
    }
  }, [statusQuery.data, queryClient, onSuccess, paymentId, plan, effectivePriceKes, claimTelemetryMutation])

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handlePay() {
    setPhoneError(null)

    const raw = phoneInput.trim()
    const normalised = raw ? normalisePhone(raw) : storedPhone ?? null

    if (!normalised) {
      setPhoneError("Invalid number. Use format 07XX XXX XXX or 254XXXXXXXXX.")
      return
    }

    initiateMutation.mutate({
      plan,
      interval,
      phoneNumber: normalised,
      paymentPurpose,
      retainedMemberUserIds: selectedMemberUserIds,
      retainedJurisdictionCodes: selectedJurisdictions,
    })
  }

  function handleRetry() {
    setFlowState("initiate")
    setPaymentId(null)
    setFailReason(null)
    timedOutRef.current = false
  }

  function toggleMemberSelection(userId: string, isOwner: boolean) {
    if (isOwner) return // Owner is always retained
    const limit = previewData?.target?.seatsLimit ?? 1

    setSelectedMemberUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        if (prev.length >= limit) {
          toast.error(`Your selected plan includes a maximum of ${limit} seat${limit > 1 ? "s" : ""}.`)
          return prev
        }
        return [...prev, userId]
      }
    })
  }

  function toggleJurisdictionSelection(code: string, isHome: boolean) {
    if (isHome) return // Home jurisdiction is always retained
    const limit = previewData?.target?.countriesLimit ?? 1

    setSelectedJurisdictions((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code)
      } else {
        if (prev.length >= limit) {
          toast.error(`Your selected plan includes a maximum of ${limit} enabled countr${limit > 1 ? "ies" : "y"}.`)
          return prev
        }
        return [...prev, code]
      }
    })
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div className="relative w-full max-w-lg rounded-xl bg-card border border-border shadow-2xl overflow-hidden my-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* ── State: Initiate ── */}
          {flowState === "initiate" && (
            <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                  <Smartphone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {isRenewal ? `Renew ${planLabel}` : `Upgrade to ${planLabel}`}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Authoritative Safaricom M-Pesa Checkout
                  </p>
                </div>
              </div>

              {/* Billing Cycle Selector (with 15% annual discount badge) */}
              {!isRenewal && (
                <div className="flex rounded-lg border border-border/60 bg-muted/20 p-1">
                  <button
                    type="button"
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      interval === "monthly"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setInterval("monthly")}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                      interval === "yearly"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setInterval("yearly")}
                  >
                    <span>Annual Billing</span>
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-green-500/15 text-green-600 border-none font-bold">
                      Save 15%
                    </Badge>
                  </button>
                </div>
              )}

              {/* Plan & Price Summary */}
              <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{planLabel} Plan</p>
                    <p className="text-xs text-muted-foreground">
                      {interval === "yearly" ? "Billed annually upfront" : "Billed monthly"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      KES {effectivePriceKes.toLocaleString("en-KE")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {interval === "yearly" ? "/year" : "/month"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pre-Checkout Feature & Capacity Comparison (from getPlanConversionPreview) */}
              {previewData && (
                <div className="space-y-3 rounded-lg border border-border/60 bg-card p-4 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-green-600" />
                    <span>Plan Comparison & Allowances</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      <span>Seats: <strong className="text-foreground">{previewData.target.seatsLimit} Included</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      <span>Countries: <strong className="text-foreground">{previewData.target.countriesLimit} Allowed</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="h-3.5 w-3.5" />
                      <span>Vault: <strong className="text-foreground">{previewData.target.docStorageLimitMb} MB</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span>Queries: <strong className="text-foreground">{previewData.target.entitlements.complianceQueriesLimit}/mo</strong></span>
                    </div>
                  </div>

                  {/* Over Capacity: Member Selector */}
                  {previewData.comparison?.isOverSeatCapacity && (
                    <div className="mt-3 pt-3 border-t border-border/40 space-y-2">
                      <div className="flex items-center gap-1 text-amber-600 font-semibold">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Select Retained Members ({selectedMemberUserIds.length}/{previewData.target.seatsLimit})</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Your pilot has more active members than this plan. Selected members stay active; others are set to inactive without data loss.
                      </p>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {previewData.activeMembers.map((m: any) => {
                          const isOwner = m.role === "OWNER"
                          const isChecked = selectedMemberUserIds.includes(m.userId)
                          return (
                            <label
                              key={m.userId}
                              className={`flex items-center justify-between p-2 rounded border text-xs cursor-pointer ${
                                isChecked ? "border-primary/40 bg-primary/5" : "border-border/40 bg-muted/10"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={isChecked}
                                  disabled={isOwner}
                                  onCheckedChange={() => toggleMemberSelection(m.userId, isOwner)}
                                />
                                <span className="font-medium text-foreground truncate max-w-[180px]">
                                  {m.fullName || m.email}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-[10px] py-0">
                                {m.role}
                              </Badge>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Over Capacity: Country Selector */}
                  {previewData.comparison?.isOverCountryCapacity && (
                    <div className="mt-3 pt-3 border-t border-border/40 space-y-2">
                      <div className="flex items-center gap-1 text-amber-600 font-semibold">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Select Retained Jurisdictions ({selectedJurisdictions.length}/{previewData.target.countriesLimit})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {previewData.availableJurisdictions.map((code: string) => {
                          const isHome = code === (previewData.organization?.homeJurisdictionCode || "KE")
                          const isChecked = selectedJurisdictions.includes(code)
                          return (
                            <button
                              key={code}
                              type="button"
                              onClick={() => toggleJurisdictionSelection(code, isHome)}
                              className={`px-2.5 py-1 rounded text-xs font-medium border flex items-center gap-1.5 transition-all ${
                                isChecked
                                  ? "border-green-500 bg-green-500/10 text-green-700"
                                  : "border-border text-muted-foreground hover:border-foreground/40"
                              }`}
                            >
                              <Checkbox checked={isChecked} disabled={isHome} className="h-3 w-3" />
                              <span>{code} {isHome ? "(Home)" : ""}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Phone number */}
              <div className="space-y-2">
                <Label htmlFor="mpesa-phone" className="text-sm font-medium">
                  M-Pesa Phone Number
                </Label>
                <Input
                  id="mpesa-phone"
                  type="tel"
                  placeholder="e.g. 0712 345 678"
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value)
                    setPhoneError(null)
                  }}
                  className={phoneError ? "border-destructive" : ""}
                />
                {phoneError && (
                  <p className="text-xs text-destructive">{phoneError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Accepts formats: 07XX XXX XXX, 01XX XXX XXX, or 254XXXXXXXXX
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handlePay}
                disabled={initiateMutation.isPending}
              >
                {initiateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending prompt...
                  </>
                ) : (
                  <>
                    <Smartphone className="mr-2 h-4 w-4" />
                    Pay KES {effectivePriceKes.toLocaleString("en-KE")} with M-Pesa
                  </>
                )}
              </Button>
            </div>
          )}

          {/* ── State: Waiting ── */}
          {flowState === "waiting" && (
            <div className="p-8 text-center space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                  <Smartphone className="h-10 w-10 text-green-600" />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                    <Loader2 className="h-3 w-3 text-white animate-spin" />
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Check your phone</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    An M-Pesa payment prompt has been sent to your phone.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border/40 bg-muted/10 p-4 space-y-1.5 text-left">
                <p className="text-xs font-medium text-foreground">Instructions:</p>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Open the M-Pesa notification on your phone</li>
                  <li>Enter your M-Pesa PIN to authorize</li>
                  <li>Wait for confirmation</li>
                </ol>
              </div>

              {/* Countdown */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Waiting for confirmation{" "}
                  <span
                    className={`font-medium tabular-nums ${
                      countdown <= 15 ? "text-amber-600" : "text-foreground"
                    }`}
                  >
                    ({countdown}s)
                  </span>
                </span>
              </div>

              <p className="text-xs text-muted-foreground/70">
                Polling for payment status every 5 seconds...
              </p>
            </div>
          )}

          {/* ── State: Success ── */}
          {flowState === "success" && (
            <div className="p-8 text-center space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Payment successful!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your {planLabel} subscription is now active.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm">
                <p className="font-medium text-foreground">{planLabel} Plan</p>
                <p className="text-muted-foreground mt-0.5">
                  KES {effectivePriceKes.toLocaleString("en-KE")} - active for{" "}
                  {interval === "yearly" ? "1 year" : "30 days"}
                </p>
              </div>

              <Button className="w-full" onClick={onClose}>
                Go to Dashboard
              </Button>
            </div>
          )}

          {/* ── State: Failed ── */}
          {flowState === "failed" && (
            <div className="p-8 text-center space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                  <XCircle className="h-12 w-12 text-destructive" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Payment failed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {failReason ?? "The M-Pesa payment could not be processed."}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleRetry}>
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* ── State: Timeout ── */}
          {flowState === "timeout" && (
            <div className="p-8 text-center space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
                  <Clock className="h-12 w-12 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Payment not confirmed yet
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We didn&apos;t receive confirmation within 90 seconds.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-left space-y-1">
                <p className="font-medium text-foreground">What to do:</p>
                <ul className="text-muted-foreground space-y-1 list-disc list-inside text-xs">
                  <li>Check your M-Pesa messages for a confirmation SMS</li>
                  <li>If you received a confirmation, your subscription will activate shortly</li>
                  <li>If not, try initiating the payment again</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Close
                </Button>
                <Button className="flex-1" onClick={handleRetry}>
                  Retry Payment
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
