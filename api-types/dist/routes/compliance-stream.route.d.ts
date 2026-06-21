import type { FastifyInstance } from 'fastify';
import type { TrialContextState } from '@/modules/trial/trial.types';
import type { EffectivePlan } from '@/types/plan.types';
import type { EffectivePlanSource, PilotEntitlementProfile } from '@/types/plan.types';
import type { PlanEntitlementConfig } from '@/config/entitlements.config';
import type { OrgMembershipEntry } from '@/server/trpc/context';
import { type ComplianceFallbackReason } from '@/lib/source-grounding/source-insufficiency';
export declare function extractNamedRegulations(question: string): string[];
export declare function buildComplianceRagQuery(question: string, detectedRegulations?: string[]): string;
export declare function getFallbackReasonForRetrieval(resultsCount: number, context: string | null | undefined): ComplianceFallbackReason;
export declare function hasUsableRetrievedChunks(results: Array<{
    documentTitle?: string | null;
    chunkText?: string | null;
}>): boolean;
export declare function selectGenerationSources<T>(retrievedResults: T[], acceptedResults: T[], gradeFailed: boolean): {
    sources: T[];
    usedVerifierFallback: boolean;
    allChunksFailedVerification: boolean;
};
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
export declare function checkAndPrepareUsage(auth: AuthContext, requiredCredits?: number): Promise<UsageCheck>;
export declare function registerComplianceStreamRoute(app: FastifyInstance, allowedOrigins: string[]): Promise<void>;
export {};
//# sourceMappingURL=compliance-stream.route.d.ts.map