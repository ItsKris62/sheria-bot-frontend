"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock, XCircle, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/lib/plan-context";
import { trpc } from "@/lib/trpc";

// ── Helpers ────────────────────────────────────────────────────────────────

function daysUntil(iso: string | null): number {
  if (!iso) return 0;
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
}

type SessionResult = { url: string | null };

// ── Component ──────────────────────────────────────────────────────────────

/**
 * SubscriptionStatusBanner
 *
 * A thin contextual bar rendered below the DashboardHeader on every startup
 * dashboard page. Surfaces actionable subscription alerts:
 *
 *   TRIALING (≤ 7 days)  → blue  — "Trial ends in X days"
 *   PAST_DUE             → amber — "Payment failed"
 *   GRACE_PERIOD         → orange — "Subscription cancelled — X days left"
 *   EXPIRED / CANCELLED  → red   — "Premium access ended"
 *
 * Renders nothing when status is ACTIVE, null, or plan is REGULATOR.
 * Dismissible for the current browser session (useState — no persistence needed).
 */
export function SubscriptionStatusBanner() {
  const router = useRouter();
  const { plan, billing, isLoading } = usePlan();
  const [dismissed, setDismissed] = useState(false);

  const portalMutation = trpc.billing.createPortalSession.useMutation({
    onSuccess: (data) => {
      const result = data as SessionResult;
      if (result?.url) router.push(result.url);
    },
  });

  // Nothing to show while loading, dismissed, or for unauthenticated / REGULATOR users
  if (isLoading || dismissed || !plan || plan === "REGULATOR") return null;

  const status   = billing?.subscriptionStatus ?? null;
  const trialDays = daysUntil(billing?.trialEndsAt ?? null);
  const graceDays = daysUntil(billing?.gracePeriodEndsAt ?? null);

  // Determine banner config — return null for non-alerting states
  type BannerConfig = {
    bg:    string;
    border: string;
    icon:  React.ReactNode;
    text:  React.ReactNode;
    cta?:  React.ReactNode;
  };

  let config: BannerConfig | null = null;

  if (status === "TRIALING" && trialDays <= 7) {
    config = {
      bg:     "bg-blue-500/5",
      border: "border-blue-500/20",
      icon:   <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />,
      text:   (
        <span className="text-muted-foreground text-xs">
          Free trial ends in{" "}
          <span className="font-semibold text-foreground">
            {trialDays} day{trialDays !== 1 ? "s" : ""}
          </span>
          . Add a payment method to avoid interruption.
        </span>
      ),
      cta: (
        <Button
          size="sm"
          variant="outline"
          className="h-6 px-3 text-xs"
          onClick={() => portalMutation.mutate()}
          disabled={portalMutation.isPending}
        >
          {portalMutation.isPending ? "Opening…" : "Add Payment Method"}
        </Button>
      ),
    };
  } else if (status === "PAST_DUE") {
    config = {
      bg:     "bg-amber-500/5",
      border: "border-amber-500/20",
      icon:   <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />,
      text:   (
        <span className="text-muted-foreground text-xs">
          <span className="font-semibold text-foreground">Payment failed.</span>{" "}
          Update your payment method to avoid service interruption.
        </span>
      ),
      cta: (
        <Button
          size="sm"
          variant="outline"
          className="h-6 px-3 text-xs"
          onClick={() => portalMutation.mutate()}
          disabled={portalMutation.isPending}
        >
          {portalMutation.isPending ? "Opening…" : "Update Payment"}
        </Button>
      ),
    };
  } else if (status === "GRACE_PERIOD") {
    config = {
      bg:     "bg-orange-500/5",
      border: "border-orange-500/20",
      icon:   <Clock className="h-3.5 w-3.5 text-orange-500 shrink-0" />,
      text:   (
        <span className="text-muted-foreground text-xs">
          Subscription cancelled —{" "}
          <span className="font-semibold text-foreground">
            {graceDays} day{graceDays !== 1 ? "s" : ""}
          </span>{" "}
          of full access remaining.
        </span>
      ),
      cta: (
        <Link href="/settings/billing">
          <Button size="sm" variant="outline" className="h-6 px-3 text-xs">
            Reactivate
          </Button>
        </Link>
      ),
    };
  } else if (status === "EXPIRED" || status === "CANCELLED") {
    config = {
      bg:     "bg-destructive/5",
      border: "border-destructive/20",
      icon:   <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />,
      text:   (
        <span className="text-muted-foreground text-xs">
          <span className="font-semibold text-foreground">Premium access ended.</span>{" "}
          Resubscribe to restore full access.
        </span>
      ),
      cta: (
        <Link href="/settings/billing">
          <Button size="sm" variant="default" className="h-6 px-3 text-xs">
            Resubscribe
          </Button>
        </Link>
      ),
    };
  }

  if (!config) return null;

  return (
    <div
      className={`flex items-center justify-between gap-3 border-b px-4 py-1.5 ${config.bg} ${config.border}`}
      role="alert"
    >
      <div className="flex items-center gap-2 min-w-0">
        {config.icon}
        <div className="truncate">{config.text}</div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {config.cta}
        <button
          onClick={() => setDismissed(true)}
          className="rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
