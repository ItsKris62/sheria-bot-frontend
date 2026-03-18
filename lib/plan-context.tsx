"use client";

import React, { createContext, useContext, useMemo } from "react";
import { trpc } from "./trpc";
import { useAuthStore } from "./auth-store";

// ============================================================================
// Local type definitions (mirrors backend entitlements.config + billing router)
// Cannot import from backend directly — @/ aliases are not resolvable in the
// frontend tsconfig. Types are kept in sync manually.
// ============================================================================

export type PlanName = "REGULATOR" | "STARTUP" | "BUSINESS" | "ENTERPRISE";

export type SupportTier  = "community" | "email-48hr" | "priority-24hr" | "dedicated";
export type AnalyticsTier = "none" | "basic" | "advanced";

export interface QuotaEntitlement {
  /** -1 = unlimited, 0 = not available, n = cap for the given period */
  limit: number;
  /** 'month' = reset on billing cycle; 'lifetime' = never resets */
  period: "month" | "lifetime";
}

export interface StorageEntitlement {
  /** -1 = unlimited, 0 = not available */
  limitMB: number;
}

export type ApiAccessEntitlement = false | QuotaEntitlement;

export interface PlanEntitlements {
  complianceQueries:    QuotaEntitlement;
  checklistGenerations: QuotaEntitlement;
  apiAccess:            ApiAccessEntitlement;
  gapAnalysis:          boolean;
  policyGeneration:     boolean;
  customIntegrations:   boolean;
  teamCollaboration:    boolean;
  regulatoryDashboard:  boolean;
  regulatoryAlerts:     boolean;
  documentRepository:   StorageEntitlement;
  maxSeats:             number;
  supportTier:          SupportTier;
  analytics:            AnalyticsTier;
  knowledgeBaseAccess:  "read-only" | "full";
  sso?:                        boolean;
  onPremise?:                  boolean;
  slaGuarantee?:               string;
  legalCorpusManagement?:      boolean;
  dedicatedAccountManager?:    boolean;
}

export type FeatureKey = keyof PlanEntitlements;

export interface PlanUsage {
  complianceQueries:    { current: number; limit: number };
  checklistGenerations: { current: number; limit: number };
  apiCalls:             { current: number; limit: number };
  documentStorageMB:    { current: number; limit: number };
}

export type SubscriptionStatusValue =
  | "ACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "CANCELLED"
  | "GRACE_PERIOD"
  | "EXPIRED"
  | null;

export interface PlanBilling {
  planStartDate:      string | null;
  planEndDate:        string | null;
  stripeCustomerId:   string | null;
  subscriptionStatus: SubscriptionStatusValue;
  trialEndsAt:        string | null;
  gracePeriodEndsAt:  string | null;
  cancelledAt:        string | null;
  subscriptionEndsAt: string | null;
}

export interface PlanData {
  plan:         PlanName;
  entitlements: PlanEntitlements;
  usage:        PlanUsage;
  billing:      PlanBilling;
}

// ============================================================================
// Context shape
// ============================================================================

interface PlanContextValue {
  /** Current subscription plan name, or null while loading / unauthenticated. */
  plan: PlanName | null;

  /** Full entitlements object for the current plan. */
  entitlements: PlanEntitlements | null;

  /** Current-month usage counters. */
  usage: PlanUsage | null;

  /** Billing / Stripe metadata. */
  billing: PlanBilling | null;

  /** True while the billing query is in-flight. */
  isLoading: boolean;

  /** True if the billing query failed. */
  isError: boolean;

  /**
   * Returns true if the current plan includes the given feature.
   *
   * Feature availability rules:
   *  - boolean field: value must be `true`
   *  - quota field   (`{ limit }`): limit must be !== 0  (-1 = unlimited)
   *  - storage field (`{ limitMB }`): limitMB must be !== 0
   *  - apiAccess     (`false | { limit }`): must not be `false`
   */
  hasFeature: (key: FeatureKey) => boolean;

  /**
   * Returns the numeric limit for a quota feature.
   * -1 = unlimited, 0 = unavailable, n = monthly cap.
   *
   * Returns 0 for non-quota features (boolean / storage / apiAccess=false).
   */
  getLimit: (key: FeatureKey) => number;

  /**
   * Returns true if a quota feature has an unlimited (-1) limit.
   * Useful for hiding usage bars when there is no cap.
   */
  isUnlimited: (key: FeatureKey) => boolean;

  /** Human-readable plan display name. */
  planDisplayName: string;
}

// ============================================================================
// Context + default
// ============================================================================

const PlanContext = createContext<PlanContextValue>({
  plan: null,
  entitlements: null,
  usage: null,
  billing: null,
  isLoading: false,
  isError: false,
  hasFeature: () => false,
  getLimit: () => 0,
  isUnlimited: () => false,
  planDisplayName: "",
});

// ============================================================================
// Helpers
// ============================================================================

function resolvePlanDisplayName(plan: PlanName | null): string {
  switch (plan) {
    case "REGULATOR":  return "Regulator (Free)";
    case "STARTUP":    return "Startup";
    case "BUSINESS":   return "Business";
    case "ENTERPRISE": return "Enterprise";
    default:           return "";
  }
}

function resolveHasFeature(entitlements: PlanEntitlements, key: FeatureKey): boolean {
  const val = entitlements[key];
  if (val === null || val === undefined) return false;
  if (val === false) return false;
  if (val === true)  return true;
  if (typeof val === "string") return true; // supportTier / analytics / knowledgeBaseAccess
  if (typeof val === "number") return val !== 0; // maxSeats
  // QuotaEntitlement | StorageEntitlement
  if (typeof val === "object") {
    if ("limit" in val)   return (val as QuotaEntitlement).limit !== 0;
    if ("limitMB" in val) return (val as StorageEntitlement).limitMB !== 0;
  }
  return false;
}

function resolveGetLimit(entitlements: PlanEntitlements, key: FeatureKey): number {
  const val = entitlements[key];
  if (val === false || val === null || val === undefined) return 0;
  if (val === true)  return -1;
  if (typeof val === "number") return val; // maxSeats
  if (typeof val === "object") {
    if ("limit" in val)   return (val as QuotaEntitlement).limit;
    if ("limitMB" in val) return (val as StorageEntitlement).limitMB;
  }
  return 0;
}

// ============================================================================
// Provider
// ============================================================================

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized   = useAuthStore((s) => s.isInitialized);

  // Cast to PlanData — tRPC cannot resolve backend @/ aliases in the frontend
  // tsconfig, so inference resolves to {}. The shape is kept in sync with
  // billing.router.ts manually via the local types above.
  const { data: rawData, isLoading: queryLoading, isError } =
    trpc.billing.getPlanAndUsage.useQuery(undefined, {
      enabled: isInitialized && isAuthenticated,
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        const code = (error as { data?: { code?: string } })?.data?.code;
        if (code === "UNAUTHORIZED" || code === "FORBIDDEN") return false;
        return failureCount < 2;
      },
    });

  const data = rawData as PlanData | undefined;

  const isLoading = !isInitialized || (isAuthenticated && queryLoading && !data);

  const value = useMemo<PlanContextValue>(() => {
    const plan         = data?.plan         ?? null;
    const entitlements = data?.entitlements ?? null;
    const usage        = data?.usage        ?? null;
    const billing      = data?.billing      ?? null;

    return {
      plan,
      entitlements,
      usage,
      billing,
      isLoading,
      isError,

      hasFeature: (key) => {
        if (!entitlements) return false;
        return resolveHasFeature(entitlements, key);
      },

      getLimit: (key) => {
        if (!entitlements) return 0;
        return resolveGetLimit(entitlements, key);
      },

      isUnlimited: (key) => {
        if (!entitlements) return false;
        return resolveGetLimit(entitlements, key) === -1;
      },

      planDisplayName: resolvePlanDisplayName(plan),
    };
  }, [data, isLoading, isError]);

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Returns the full plan context: plan name, entitlements, usage counters, and
 * helper functions for feature gating.
 *
 * Must be used inside `<PlanProvider>` (i.e. inside `<Providers>`).
 */
export function usePlan(): PlanContextValue {
  return useContext(PlanContext);
}

/**
 * Quick check — returns true if the current plan includes `feature`.
 * Sugar over `usePlan().hasFeature(key)`.
 */
export function useHasFeature(key: FeatureKey): boolean {
  return usePlan().hasFeature(key);
}

/**
 * Returns the numeric usage limit for a quota feature.
 * -1 = unlimited, 0 = unavailable.
 */
export function useFeatureLimit(key: FeatureKey): number {
  return usePlan().getLimit(key);
}
