"use client"

/**
 * MpesaPaymentFlow
 *
 * Modal component that handles the full M-Pesa STK push flow:
 *   1. Initiation  — user confirms plan, amount, phone number and clicks Pay
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
import { Skeleton } from "@/components/ui/skeleton"
import { X, Smartphone, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react"
import { toast } from "sonner"

// ── Types ──────────────────────────────────────────────────────────────────

type FlowState = "initiate" | "waiting" | "success" | "failed" | "timeout"

type Plan = "STARTUP" | "BUSINESS"

const PLAN_PRICES: Record<Plan, { kes: number; label: string }> = {
  STARTUP:  { kes: 25000, label: "Startup" },
  BUSINESS: { kes: 75000, label: "Business" },
}

const POLL_INTERVAL_MS  = 5000   // 5 seconds
const MAX_WAIT_SECONDS  = 90

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
      setRemaining(seconds)
      return
    }
    setRemaining(seconds)
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

  return remaining
}

// ── Main component ─────────────────────────────────────────────────────────

interface MpesaPaymentFlowProps {
  plan:              Plan
  storedPhone?:      string | null
  onClose:           () => void
  onSuccess?:        () => void
}

export function MpesaPaymentFlow({ plan, storedPhone, onClose, onSuccess }: MpesaPaymentFlowProps) {
  const [flowState,  setFlowState]  = useState<FlowState>("initiate")
  const [phoneInput, setPhoneInput] = useState(
    storedPhone ? formatPhoneDisplay(storedPhone) : ""
  )
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [paymentId,  setPaymentId]  = useState<string | null>(null)
  const [failReason, setFailReason] = useState<string | null>(null)

  const queryClient  = useQueryClient()
  const pollingActive = flowState === "waiting"
  const countdown    = useCountdown(MAX_WAIT_SECONDS, pollingActive)
  const timedOutRef  = useRef(false)

  // Handle 90-second timeout
  useEffect(() => {
    if (pollingActive && countdown === 0 && !timedOutRef.current) {
      timedOutRef.current = true
      setFlowState("timeout")
    }
  }, [pollingActive, countdown])

  // Initiate payment mutation
  const initiateMutation = trpc.billing.initiateMpesaPayment.useMutation({
    onSuccess: (data) => {
      setPaymentId(data.paymentId)
      timedOutRef.current = false
      setFlowState("waiting")
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to initiate M-Pesa payment.")
      setFlowState("initiate")
    },
  })

  // Poll payment status
  const statusQuery = trpc.billing.getMpesaPaymentStatus.useQuery(
    { paymentId: paymentId ?? "" },
    {
      enabled:        pollingActive && !!paymentId,
      refetchInterval: pollingActive ? POLL_INTERVAL_MS : false,
      staleTime:      0,
    },
  )

  // React to status updates from polling
  useEffect(() => {
    if (!statusQuery.data) return

    const status = statusQuery.data.status

    if (status === "COMPLETED") {
      setFlowState("success")

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
      setFlowState("failed")
      setFailReason("The M-Pesa payment was declined or cancelled.")
    }
  }, [statusQuery.data, queryClient, onSuccess])

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handlePay() {
    setPhoneError(null)

    const raw      = phoneInput.trim()
    const normalised = raw ? normalisePhone(raw) : (storedPhone ?? null)

    if (!normalised) {
      setPhoneError("Invalid number. Use format 07XX XXX XXX or 254XXXXXXXXX.")
      return
    }

    initiateMutation.mutate({ plan, phoneNumber: normalised })
  }

  function handleRetry() {
    setFlowState("initiate")
    setPaymentId(null)
    setFailReason(null)
    timedOutRef.current = false
  }

  const planInfo = PLAN_PRICES[plan]

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="relative w-full max-w-md rounded-xl bg-card border border-border shadow-2xl overflow-hidden">
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
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                  <Smartphone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Pay with M-Pesa</h3>
                  <p className="text-xs text-muted-foreground">Safaricom mobile money</p>
                </div>
              </div>

              {/* Plan summary */}
              <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{planInfo.label} Plan</p>
                    <p className="text-xs text-muted-foreground">Monthly subscription</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      KES {planInfo.kes.toLocaleString("en-KE")}
                    </p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                </div>
              </div>

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
                    Pay KES {planInfo.kes.toLocaleString("en-KE")}
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
                  <span className={`font-medium tabular-nums ${countdown <= 15 ? "text-amber-600" : "text-foreground"}`}>
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
                    Your {planInfo.label} subscription is now active.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm">
                <p className="font-medium text-foreground">{planInfo.label} Plan</p>
                <p className="text-muted-foreground mt-0.5">
                  KES {planInfo.kes.toLocaleString("en-KE")} — active for 30 days
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
                  <h3 className="text-base font-semibold text-foreground">Payment not confirmed yet</h3>
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
