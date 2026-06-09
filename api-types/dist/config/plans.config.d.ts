/**
 * Shared Plan Configuration  -  Single Source of Truth
 *
 * This file defines EVERYTHING about subscription plans: display metadata,
 * feature entitlements, pricing, and Stripe configuration. Both the billing
 * settings page (via tRPC) and any internal logic should derive from this.
 *
 * Convention: -1 = unlimited, 0 = disabled/unavailable, null = not applicable.
 */
import { PLAN_ENTITLEMENTS, SubscriptionPlan } from './entitlements.config';
export interface PlanFeatureRow {
    text: string;
    included: boolean;
}
export type PlanCta = {
    type: 'none';
} | {
    type: 'subscribe';
    label: string;
} | {
    type: 'contact-sales';
    label: string;
};
export interface PlanStripeConfig {
    monthlyPriceId: string;
    yearlyPriceId: string | null;
}
export interface PlanConfig {
    id: SubscriptionPlan;
    name: string;
    tagline: string;
    price: {
        monthly: number | null;
        yearly: number | null;
        currency: 'KES';
    };
    badge: 'Free' | 'Most Popular' | null;
    cta: PlanCta;
    popular: boolean;
    trialDays: number;
    features: PlanFeatureRow[];
    entitlements: typeof PLAN_ENTITLEMENTS[SubscriptionPlan];
    stripe: PlanStripeConfig | null;
}
export interface ComparisonRow {
    feature: string;
    regulator: string;
    startup: string;
    business: string;
    enterprise: string;
}
export declare const PLANS: Record<SubscriptionPlan, PlanConfig>;
export declare const PLAN_COMPARISON_ROWS: ComparisonRow[];
export declare const PLAN_ORDER: SubscriptionPlan[];
export type PlanId = SubscriptionPlan;
//# sourceMappingURL=plans.config.d.ts.map