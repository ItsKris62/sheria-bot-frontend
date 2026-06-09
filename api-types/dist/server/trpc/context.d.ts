import { FastifyRequest, FastifyReply } from 'fastify';
import type { MemberRole, MemberStatus, OrganizationMember } from '@prisma/client';
import type { EffectivePlan } from '@/types/plan.types';
import type { EffectivePlanSource, PilotEntitlementProfile, PilotPlanState } from '@/types/plan.types';
import type { TrialContextState } from '@/modules/trial/trial.types';
import type { PlanEntitlementConfig } from '@/config/entitlements.config';
import type { AppliedEnterpriseOverride } from '@/modules/billing/enterprise-contract-overrides';
import { prisma } from '@/lib/prisma/client';
import { aiService } from '@/lib/ai/ai.service';
import { ragService } from '@/lib/rag/rag.service';
import { storageService } from '@/lib/storage/storage.service';
import { mailer } from '@/lib/email/mailer.service';
/**
 * Minimal membership record attached by requireOrgMembership middleware.
 * Uses a typed subset instead of full OrganizationMember to survive JSON
 * round-trips through the Redis cache (Date fields become strings there).
 */
export interface OrgMembershipEntry {
    userId: string;
    organizationId: string;
    role: MemberRole;
    status: MemberStatus;
}
/** User shape attached to every authenticated tRPC context. */
export interface User {
    id: string;
    email: string;
    role: string;
    organizationId?: string;
    sessionId?: string;
    supabaseAuthId: string;
    mustChangePassword?: boolean;
    /** Unix ms timestamp of Session.expiresAt  -  enforced on every request (B6). */
    sessionExpiresAt?: number;
}
export interface Context {
    user: User | null;
    prisma: typeof prisma;
    aiService: typeof aiService;
    ragService: typeof ragService;
    storageService: typeof storageService;
    mailer: typeof mailer;
    req: FastifyRequest;
    res: FastifyReply;
    plan?: EffectivePlan;
    effectivePlanSource?: EffectivePlanSource;
    entitlementProfile?: PilotEntitlementProfile | null;
    entitlements?: PlanEntitlementConfig;
    appliedPlanOverrides?: AppliedEnterpriseOverride[];
    pilotState?: PilotPlanState | null;
    customLimits?: Record<string, unknown> | null;
    usageInfo?: {
        metric: string;
        current: number;
        limit: number;
    };
    /** Present when plan === 'FREE_TRIAL'. Lightweight trial state for middleware consumers. */
    trialState?: TrialContextState;
    /**
     * Populated by checkUsageLimit when called with { deferIncrement: true }.
     * The router handler MUST call this after a successful DB write to commit
     * the usage counter. Never incremented if the service call throws.
     */
    incrementUsage?: () => Promise<void>;
    /** Populated by requireOrgMember middleware. Present only after that middleware runs. */
    orgMember?: OrganizationMember;
    /**
     * Populated by requireOrgMembership middleware (input-scoped, with caching and
     * denial rate limiting). Distinct from orgMember -- see middleware.ts for details.
     */
    orgMembership?: OrgMembershipEntry;
}
/**
 * Create tRPC context for each request.
 *
 * Auth flow:
 * 1. Extract Bearer token from Authorization header.
 * 2. Verify it via supabaseAdmin.auth.getUser()  -  works for both HS256 and RS256
 *    Supabase project configurations without requiring a local JWT secret.
 * 3. Use the returned user.id (Supabase user UUID) to look up the Prisma User.
 *    Lookup is cached in Upstash Redis for USER_CACHE_TTL_SECONDS.
 * 4. Attach the full Prisma user (role, organizationId, etc.) to context.
 */
export declare function createContext({ req, res, }: {
    req: FastifyRequest;
    res: FastifyReply;
}): Promise<Context>;
//# sourceMappingURL=context.d.ts.map