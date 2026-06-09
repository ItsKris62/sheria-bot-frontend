import type { BillingPlanCatalog, BillingPlanCatalogEntry, BillingPlanCatalogUpdateInput, BillingPlanOverrides, SelfServeBillingPlan, SubscriptionPlan } from '@/modules/admin/admin.types';
export declare const SELF_SERVE_BILLING_PLAN_IDS: readonly ["STARTUP", "BUSINESS"];
export declare function sanitizeBillingPlanOverrides(raw: unknown): BillingPlanOverrides;
export declare function buildBillingPlanCatalog(overrides?: BillingPlanOverrides): BillingPlanCatalog;
export declare function getBillingPlanCatalog(): Promise<BillingPlanCatalog>;
export declare function getRuntimePlan(planId: SubscriptionPlan): Promise<BillingPlanCatalogEntry>;
export declare function getRuntimePriceToPlanMap(): Promise<Record<string, SelfServeBillingPlan>>;
export declare function updateBillingPlanCatalog(input: BillingPlanCatalogUpdateInput, updatedBy?: string): Promise<BillingPlanCatalog>;
export declare function resolvePlanPriceForInterval(plan: BillingPlanCatalogEntry, interval: 'monthly' | 'yearly'): number | null;
//# sourceMappingURL=runtime-billing-plans.d.ts.map