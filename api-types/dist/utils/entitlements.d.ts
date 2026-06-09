import { SubscriptionPlan } from '@prisma/client';
import type { EffectivePlan } from '@/types/plan.types';
import { type FeatureKey, type PlanEntitlementConfig } from '@/config/entitlements.config';
import type { PilotEntitlementProfile } from '@/types/plan.types';
/**
 * Returns true if the given plan grants access to a feature.
 *
 * Rules per value type:
 *  - boolean           -> the boolean itself
 *  - QuotaEntitlement  -> limit !== 0  (-1 = unlimited = true, 0 = unavailable = false)
 *  - StorageEntitlement-> limitMB !== 0
 *  - ApiAccessEntitlement -> false means no access; object means access
 *  - number (maxSeats) -> > 0 or unlimited (-1)
 *  - AnalyticsTier     -> 'none' means no access
 *  - other strings     -> always true (different tiers of the same feature)
 *  - undefined         -> false (optional Enterprise-only flags on lower plans)
 */
export declare function hasFeature(plan: EffectivePlan, feature: FeatureKey): boolean;
/**
 * Returns the numeric limit for a metered feature.
 *
 * -1  = unlimited
 *  0  = feature not available on this plan
 *  n  = cap per period
 *
 * For non-metered boolean features returns 1 (available) or 0 (unavailable).
 * For maxSeats returns the seat count directly.
 */
export declare function getLimit(plan: EffectivePlan, feature: FeatureKey): number;
export declare function getLimitFromEntitlements(entitlements: PlanEntitlementConfig, feature: FeatureKey): number;
/**
 * Returns both the numeric limit and billing period for a metered feature.
 * Used by checkUsageLimit middleware to construct the correct Redis key
 * (monthly vs. lifetime) and surface the right error message.
 *
 * Falls back to { limit: 0, period: 'month' } for non-quota features.
 */
export declare function getQuota(plan: EffectivePlan, feature: FeatureKey): {
    limit: number;
    period: 'month' | 'lifetime';
};
export declare function getQuotaFromEntitlements(entitlements: PlanEntitlementConfig, feature: FeatureKey): {
    limit: number;
    period: 'month' | 'lifetime';
};
/**
 * Throws a FORBIDDEN TRPCError if the plan does not grant access to the feature.
 * Use inside tRPC middleware -- do NOT use directly in handler logic.
 *
 * @throws TRPCError { code: 'FORBIDDEN' }
 */
export declare function requireFeature(plan: EffectivePlan, feature: FeatureKey): void;
export declare function requireEntitlementFeature(entitlements: PlanEntitlementConfig, feature: FeatureKey): void;
export declare function getPilotEntitlements(profile: PilotEntitlementProfile): PlanEntitlementConfig;
/**
 * Returns the lowest SubscriptionPlan that grants access to a feature.
 * Only considers purchasable DB plans (not FREE_TRIAL).
 * Returns null if no plan provides the feature (should not happen in practice).
 */
export declare function getMinimumPlan(feature: FeatureKey): SubscriptionPlan | null;
export declare function getPlanDisplayName(plan: EffectivePlan): string;
/**
 * Returns the full entitlements config for an org based on its subscription plan.
 *
 * Accepts SubscriptionPlan (not EffectivePlan) because orgs always have a
 * DB-persisted plan. Use PLAN_ENTITLEMENTS[effectivePlan] directly when working
 * with an already-resolved EffectivePlan from middleware context.
 */
export declare function getOrgEntitlements(org: {
    plan: SubscriptionPlan;
}): PlanEntitlementConfig;
//# sourceMappingURL=entitlements.d.ts.map