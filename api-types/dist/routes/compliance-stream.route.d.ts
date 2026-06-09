import type { FastifyInstance } from 'fastify';
import type { TrialContextState } from '@/modules/trial/trial.types';
import type { EffectivePlan } from '@/types/plan.types';
import type { EffectivePlanSource, PilotEntitlementProfile } from '@/types/plan.types';
import type { PlanEntitlementConfig } from '@/config/entitlements.config';
import type { OrgMembershipEntry } from '@/server/trpc/context';
interface AuthContext {
    userId: string;
    organizationId: string;
    plan: EffectivePlan;
    effectivePlanSource: EffectivePlanSource;
    entitlementProfile: PilotEntitlementProfile | null;
    entitlements: PlanEntitlementConfig;
    trialState: TrialContextState | undefined;
    orgMembership: OrgMembershipEntry;
}
export declare function resolveAuth(authHeader: string | undefined): Promise<AuthContext | null>;
interface UsageCheck {
    allowed: boolean;
    statusCode: 403 | 429;
    message: string;
    increment: (tokensUsed?: number) => Promise<void>;
}
export declare function checkAndPrepareUsage(auth: AuthContext): Promise<UsageCheck>;
export declare function registerComplianceStreamRoute(app: FastifyInstance, allowedOrigins: string[]): Promise<void>;
export {};
//# sourceMappingURL=compliance-stream.route.d.ts.map