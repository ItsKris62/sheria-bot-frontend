import { Prisma, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import type { Redis } from '@upstash/redis';
import type { prisma as prismaSingleton } from '@/lib/prisma/client';
import type { EffectivePlan, EffectivePlanSource, PilotEntitlementProfile, PilotPlanState } from '@/types/plan.types';
import type { TrialContextState } from '@/modules/trial/trial.types';
import type { PlanEntitlementConfig } from '@/config/entitlements.config';
import { type AppliedEnterpriseOverride } from './enterprise-contract-overrides';
export interface PilotContextState {
    isPilot: boolean;
    expiresAt: string | null;
    status?: PilotPlanState['status'];
    entitlementProfile?: PilotEntitlementProfile;
    extensionCount?: number;
}
export interface ResolvedEffectivePlan {
    plan: EffectivePlan;
    orgPlan: SubscriptionPlan;
    entitlements: PlanEntitlementConfig;
    appliedOverrides: AppliedEnterpriseOverride[];
    customLimits: Prisma.JsonValue | null;
    subscriptionStatus: SubscriptionStatus | null;
    gracePeriodEndsAt: string | null;
    trialState: TrialContextState | undefined;
    pilotState: PilotContextState | null;
    source: EffectivePlanSource;
    entitlementProfile: PilotEntitlementProfile | null;
    fromCache: boolean;
}
export declare function resolveEffectivePlan(input: {
    userId: string;
    organizationId: string | null;
    userEmail?: string;
    prisma: typeof prismaSingleton;
    redis: Redis;
    now?: Date;
}): Promise<ResolvedEffectivePlan>;
//# sourceMappingURL=resolve-effective-plan.d.ts.map