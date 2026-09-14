import { SubscriptionPlan as PrismaSubscriptionPlan } from '@prisma/client';
export declare const SubscriptionPlan: {
    readonly FREE: "FREE";
    readonly STARTER: "STARTER";
    readonly GROWTH: "GROWTH";
    readonly BUSINESS: "BUSINESS";
    readonly ENTERPRISE: "ENTERPRISE";
    readonly REGULATOR: "REGULATOR";
    readonly STARTUP: "STARTUP";
};
export type SubscriptionPlan = (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan] | PrismaSubscriptionPlan;
export type CanonicalPlan = 'FREE' | 'STARTER' | 'GROWTH' | 'BUSINESS' | 'ENTERPRISE';
export type EffectivePlan = SubscriptionPlan | CanonicalPlan | 'FREE_TRIAL';
export type EffectivePlanSource = 'SUBSCRIPTION' | 'FREE_TRIAL' | 'GRACE_PERIOD' | 'PILOT' | 'FALLBACK' | 'SUSPENDED';
export type PilotEntitlementProfile = 'PILOT_FULL' | 'PILOT_FULL_WITH_POLICY_GENERATION';
export interface PilotPlanState {
    status: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'CONVERTED';
    entitlementProfile: PilotEntitlementProfile;
    expiresAt: string | null;
    extensionCount: number;
}
export declare const FREE_TRIAL_LIMITS: {
    readonly complianceQueries: 25;
    readonly gapAnalyses: 5;
    readonly checklists: 5;
    readonly vaultUploads: 10;
    readonly totalTokensUsed: 500000;
};
export type TrialFeature = keyof typeof FREE_TRIAL_LIMITS;
//# sourceMappingURL=plan.types.d.ts.map