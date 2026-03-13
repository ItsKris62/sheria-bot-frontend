"use client";

import React from "react";
import { Lock, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlan } from "@/lib/plan-context";
import type { FeatureKey, PlanName } from "@/lib/plan-context";

// ============================================================================
// Shared helpers
// ============================================================================

const PLAN_ORDER: PlanName[] = ["REGULATOR", "STARTUP", "BUSINESS", "ENTERPRISE"];

const PLAN_LABELS: Record<PlanName, string> = {
  REGULATOR:  "Regulator (Free)",
  STARTUP:    "Startup",
  BUSINESS:   "Business",
  ENTERPRISE: "Enterprise",
};

const PLAN_BADGE_VARIANT: Record<
  PlanName,
  "default" | "secondary" | "outline" | "destructive"
> = {
  REGULATOR:  "outline",
  STARTUP:    "secondary",
  BUSINESS:   "default",
  ENTERPRISE: "default",
};

// ============================================================================
// FeatureGate
// ============================================================================

interface FeatureGateProps {
  /** The entitlements key to check. */
  feature: FeatureKey;
  /**
   * Content to render when the feature IS available on the current plan.
   * Can also be passed as `children`.
   */
  children: React.ReactNode;
  /**
   * Fallback content to render when the feature is NOT available.
   * Defaults to a `<LockedFeatureCard>` with the `feature` prop forwarded.
   */
  fallback?: React.ReactNode;
  /** When true the feature gate is skipped entirely (always renders children). */
  bypass?: boolean;
}

/**
 * Conditionally renders `children` only when the authenticated user's plan
 * includes the given `feature`. Renders `fallback` (default: LockedFeatureCard)
 * otherwise.
 *
 * Renders nothing while the plan is loading and the user is authenticated.
 */
export function FeatureGate({
  feature,
  children,
  fallback,
  bypass = false,
}: FeatureGateProps) {
  const { hasFeature, isLoading, plan } = usePlan();

  // Allow if plan bypasses gate or plan hasn't loaded yet for unauthenticated users
  if (bypass) return <>{children}</>;

  // While loading for authenticated users, render nothing to avoid layout shift
  if (isLoading) return null;

  // No plan = unauthenticated; render nothing (auth guard handles redirect)
  if (!plan) return null;

  if (hasFeature(feature)) return <>{children}</>;

  return (
    <>
      {fallback ?? (
        <LockedFeatureCard feature={feature} />
      )}
    </>
  );
}

// ============================================================================
// LockedFeatureCard
// ============================================================================

interface LockedFeatureCardProps {
  feature: FeatureKey;
  /** Override the card title. Defaults to a generic message. */
  title?: string;
  /** Override the card description. */
  description?: string;
  /** Minimum plan required. If omitted, "Business" is assumed. */
  requiredPlan?: PlanName;
  className?: string;
}

const FEATURE_LABELS: Partial<Record<FeatureKey, string>> = {
  gapAnalysis:          "Gap Analysis",
  policyGeneration:     "AI Policy Generator",
  customIntegrations:   "Custom Integrations",
  teamCollaboration:    "Team Collaboration",
  apiAccess:            "API Access",
  checklistGenerations: "Compliance Checklists",
  documentRepository:   "Document Vault",
  analytics:            "Advanced Analytics",
  sso:                  "Single Sign-On (SSO)",
};

const FEATURE_DESCRIPTIONS: Partial<Record<FeatureKey, string>> = {
  gapAnalysis:
    "Identify compliance gaps in your operations and get actionable remediation steps powered by AI.",
  policyGeneration:
    "Automatically generate CBK-compliant policies, SOPs, and regulatory documents tailored to your business.",
  customIntegrations:
    "Connect SheriaBot to your internal systems via webhooks and a dedicated REST API.",
  teamCollaboration:
    "Invite team members to collaborate on compliance workflows, checklists, and policy reviews.",
  apiAccess:
    "Integrate SheriaBot's compliance intelligence directly into your own applications via API.",
  checklistGenerations:
    "Generate comprehensive, regulation-specific compliance checklists for your business stage.",
  documentRepository:
    "Upload and manage compliance documents, licenses, and regulatory filings in a secure vault.",
  analytics:
    "Track compliance trends, team activity, and regulatory risk across your organisation.",
  sso:
    "Enable enterprise Single Sign-On (SSO) via SAML / OIDC for seamless access management.",
};

/**
 * A card displayed in place of a locked feature — shows the feature name,
 * description, required plan badge, and an upgrade CTA.
 */
export function LockedFeatureCard({
  feature,
  title,
  description,
  requiredPlan,
  className,
}: LockedFeatureCardProps) {
  const { plan } = usePlan();

  // Determine the minimum plan that unlocks this feature
  const currentPlanIndex  = plan ? PLAN_ORDER.indexOf(plan) : 0;
  const defaultUpgradePlan: PlanName =
    currentPlanIndex < PLAN_ORDER.indexOf("BUSINESS") ? "BUSINESS" : "ENTERPRISE";
  const upgradePlan = requiredPlan ?? defaultUpgradePlan;

  const featureLabel  = title       ?? FEATURE_LABELS[feature]       ?? String(feature);
  const featureDesc   = description ?? FEATURE_DESCRIPTIONS[feature] ?? "Upgrade your plan to unlock this feature.";

  return (
    <Card
      className={`relative overflow-hidden border-dashed border-muted-foreground/30 bg-muted/20 ${className ?? ""}`}
    >
      {/* Lock overlay accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/40 pointer-events-none" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-muted p-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-base text-muted-foreground">
              {featureLabel}
            </CardTitle>
          </div>
          <Badge variant={PLAN_BADGE_VARIANT[upgradePlan]} className="shrink-0 text-xs">
            {PLAN_LABELS[upgradePlan]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{featureDesc}</p>
        <UpgradeBanner requiredPlan={upgradePlan} compact />
      </CardContent>
    </Card>
  );
}

// ============================================================================
// UsageIndicator
// ============================================================================

interface UsageIndicatorProps {
  /** Display label (e.g. "Compliance Queries"). */
  label: string;
  /** Current usage count. */
  current: number;
  /** Monthly limit. -1 = unlimited, 0 = unavailable. */
  limit: number;
  className?: string;
}

/**
 * Renders a labelled progress bar showing quota consumption.
 * Hidden when `limit === -1` (unlimited). Shows "Unavailable" when `limit === 0`.
 */
export function UsageIndicator({ label, current, limit, className }: UsageIndicatorProps) {
  if (limit === -1) {
    // Unlimited — show a simple "Unlimited" pill instead of a bar
    return (
      <div className={`flex items-center justify-between text-sm ${className ?? ""}`}>
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-emerald-500">Unlimited</span>
      </div>
    );
  }

  if (limit === 0) {
    return (
      <div className={`flex items-center justify-between text-sm ${className ?? ""}`}>
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-muted-foreground">Unavailable</span>
      </div>
    );
  }

  const pct     = Math.min(100, Math.round((current / limit) * 100));
  const isHigh  = pct >= 80;
  const isFull  = pct >= 100;

  const barColor = isFull
    ? "bg-destructive"
    : isHigh
    ? "bg-amber-500"
    : "bg-primary";

  return (
    <div className={`space-y-1 ${className ?? ""}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={`font-medium tabular-nums ${
            isFull ? "text-destructive" : isHigh ? "text-amber-500" : ""
          }`}
        >
          {current.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>

      {/* Custom progress bar (shadcn Progress uses bg-primary which can't be overridden) */}
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {isHigh && !isFull && (
        <p className="text-xs text-amber-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {pct}% used — consider upgrading soon
        </p>
      )}
      {isFull && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Monthly limit reached
        </p>
      )}
    </div>
  );
}

// ============================================================================
// UpgradeBanner
// ============================================================================

interface UpgradeBannerProps {
  /**
   * The minimum plan required for the desired feature.
   * Used to tailor the CTA message.
   */
  requiredPlan?: PlanName;
  /**
   * `compact` renders a single-line inline CTA instead of a full banner card.
   * Used inside LockedFeatureCard to avoid double-card nesting.
   */
  compact?: boolean;
  className?: string;
}

const PLAN_PRICES: Partial<Record<PlanName, string>> = {
  STARTUP:    "KES 25,000 / month",
  BUSINESS:   "KES 75,000 / month",
  ENTERPRISE: "Custom pricing",
};

/**
 * A banner or inline CTA prompting the user to upgrade their plan.
 *
 * - Full mode: renders as a standalone card with plan price and two CTAs.
 * - Compact mode: renders as a small inline row with a single "Upgrade" button.
 */
export function UpgradeBanner({
  requiredPlan = "BUSINESS",
  compact = false,
  className,
}: UpgradeBannerProps) {
  const { plan, planDisplayName } = usePlan();
  const upgradeLabel = PLAN_LABELS[requiredPlan];
  const price        = PLAN_PRICES[requiredPlan] ?? "Custom pricing";

  // Don't show banner to users already on the required plan or higher
  if (plan && PLAN_ORDER.indexOf(plan) >= PLAN_ORDER.indexOf(requiredPlan)) {
    return null;
  }

  if (compact) {
    return (
      <div
        className={`flex items-center justify-between gap-3 rounded-md border border-dashed border-primary/30 bg-primary/5 p-3 ${className ?? ""}`}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4 text-primary shrink-0" />
          <span>
            Upgrade to <span className="font-medium text-foreground">{upgradeLabel}</span>
          </span>
        </div>
        <Button size="sm" variant="default" asChild>
          <a href="/settings/billing">Upgrade</a>
        </Button>
      </div>
    );
  }

  return (
    <Card
      className={`border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 ${className ?? ""}`}
    >
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2 mt-0.5">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-sm">
              Upgrade to {upgradeLabel}
            </p>
            {planDisplayName && (
              <p className="text-xs text-muted-foreground">
                You are on <span className="font-medium">{planDisplayName}</span>.
                Unlock this feature starting at{" "}
                <span className="font-medium text-foreground">{price}</span>.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1" asChild>
            <a href="/settings/billing">
              <Zap className="mr-1.5 h-3.5 w-3.5" />
              Upgrade Plan
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href="/pricing" target="_blank" rel="noopener noreferrer">
              View Plans
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
