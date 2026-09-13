import { SubscriptionPlan } from '@prisma/client';
/**
 * Maps legacy `subscriptionTier` string values (and the current admin-written
 * SubscriptionPlan enum strings) to the canonical `SubscriptionPlan` enum.
 */
export declare function subscriptionTierToPlan(tier: string): SubscriptionPlan | null;
/**
 * Same as `subscriptionTierToPlan` but falls back to `SubscriptionPlan.FREE`
 * when the tier string is unrecognised.
 */
export declare function subscriptionTierToPlanOrFree(tier: string): SubscriptionPlan;
//# sourceMappingURL=plan-mapping.d.ts.map