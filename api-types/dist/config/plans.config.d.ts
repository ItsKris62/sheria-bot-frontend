/**
 * Shared Plan Configuration - Single Source of Truth
 *
 * Defines canonical 5-tier subscription plans (FREE, STARTER, GROWTH, BUSINESS, ENTERPRISE),
 * pricing, seat limits, max enabled jurisdictions, feature metadata, and Stripe configuration.
 *
 * Version: 2026-09-01 (Batch 1 Canonical Catalog)
 * Annual Discount: Strict 15% upfront discount (monthly * 12 * 0.85).
 * Prices belong to organizations.
 */
import { PLAN_ENTITLEMENTS, SubscriptionPlan } from './entitlements.config';
import type { MemberRole } from '@prisma/client';
export declare const CATALOG_VERSION: "2026-09-01";
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
    seats: number;
    maxEnabledCountries: number;
    features: PlanFeatureRow[];
    entitlements: (typeof PLAN_ENTITLEMENTS)[SubscriptionPlan];
    stripe: PlanStripeConfig | null;
}
export interface ComparisonRow {
    feature: string;
    free: string;
    starter: string;
    growth: string;
    business: string;
    enterprise: string;
}
export type ImplementationStatus = 'COMPLETE' | 'PARTIAL' | 'CONFIGURED_ONLY' | 'ADVERTISED_ONLY';
export type CountryBehavior = 'HOME_ONLY' | 'MULTI_UP_TO_2' | 'MULTI_UP_TO_4' | 'NOT_APPLICABLE';
export type AllowanceResetSemantics = 'MONTHLY' | 'LIFETIME' | 'NONE';
export interface FeatureCatalogItem {
    id: string;
    displayName: string;
    description: string;
    eligiblePlans: SubscriptionPlan[];
    availability: ImplementationStatus;
    roleRequirements: MemberRole[];
    countryBehavior: CountryBehavior;
    allowanceResetSemantics: AllowanceResetSemantics;
    provisionalQuota?: {
        free?: number | string;
        starter?: number | string;
        growth?: number | string;
        business?: number | string;
        enterprise?: number | string;
    };
}
export declare const FEATURE_CATALOG: FeatureCatalogItem[];
export declare const PLANS: Record<SubscriptionPlan, PlanConfig>;
export declare const PLAN_COMPARISON_ROWS: ComparisonRow[];
export declare const PLAN_ORDER: SubscriptionPlan[];
export { SubscriptionPlan };
export type PlanId = SubscriptionPlan;
//# sourceMappingURL=plans.config.d.ts.map