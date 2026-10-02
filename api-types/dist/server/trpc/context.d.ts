import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import type { MemberRole, MemberStatus, OrganizationMember } from '@prisma/client';
import type { EffectivePlan } from '@/types/plan.types';
import type { EffectivePlanSource, PilotEntitlementProfile, PilotPlanState } from '@/types/plan.types';
import type { TrialContextState } from '@/modules/trial/trial.types';
import type { PlanEntitlementConfig } from '@/config/entitlements.config';
import type { AppliedEnterpriseOverride } from '@/modules/billing/enterprise-contract-overrides';
import { prisma } from '@/lib/prisma/client';
import { type TenantScopedPrismaClient } from '@/lib/prisma/tenant-scope.extension';
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
    totpEnabled?: boolean;
    hasPasskey?: boolean;
    /** Unix ms timestamp of Session.expiresAt  -  enforced on every request (B6). */
    sessionExpiresAt?: number;
}
export interface Context {
    user: User | null;
    prisma: typeof prisma;
    tenantPrisma: TenantScopedPrismaClient;
    getTenantPrisma?: () => TenantScopedPrismaClient;
    aiService: typeof aiService;
    ragService: typeof ragService;
    storageService: typeof storageService;
    mailer: typeof mailer;
    req: FastifyRequest;
    res: FastifyReply;
    plan?: EffectivePlan;
    effectivePlanSource?: EffectivePlanSource;
    mfaEnforcement?: {
        state: 'grace' | 'enforced';
        deadline?: Date;
    };
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
/** Feature flags for context optimization and session LRU */
export declare const FEATURE_FLAG_CONTEXT_FAST_PATH: boolean;
export declare const FEATURE_FLAG_SESSION_LRU: boolean;
/** Production observability metrics counters */
export declare const contextMetrics: {
    memoryHits: number;
    redisHits: number;
    dbMisses: number;
    expiredTokens: number;
    signatureMismatches: number;
    hardRejections: number;
    fallbackToGetUser: number;
    totalRequests: number;
    reset(): void;
};
export declare function getInMemoryUserSession(supabaseUserId: string): User | null;
export declare function setInMemoryUserSession(supabaseUserId: string, user: User): void;
export declare function evictInMemoryUserSession(supabaseUserId: string): void;
import { type JWTVerifyGetKey } from 'jose';
export declare function getSupabaseJwks(): JWTVerifyGetKey | null;
export declare function resetJwksCacheForTest(): void;
export interface SupabaseJwtPayload extends jwt.JwtPayload {
    sub: string;
    email?: string;
    role?: string;
}
export type LocalJwtVerificationResult = {
    status: 'VALID';
    payload: SupabaseJwtPayload;
} | {
    status: 'HARD_REJECT';
    reason: string;
    rejectionType: 'EXPIRED' | 'SIGNATURE_MISMATCH' | 'MALFORMED';
} | {
    status: 'FALLBACK_REQUIRED';
    reason: string;
};
/**
 * Fast-path local cryptographic verification of Supabase access tokens:
 * - Asymmetric ES256 / RS256 via cached remote JWKS
 * - Symmetric HS256 via SUPABASE_JWT_SECRET
 *
 * Security & Compliance Invariants:
 * 1. Hard-rejects immediately on signature failure, token expiration, or malformed claims.
 *    Fallback to supabaseAdmin.auth.getUser() is STRICTLY FORBIDDEN to prevent forged tokens.
 * 2. Fallback to Supabase Auth API is permitted ONLY on unknown key IDs during rotation
 *    (JWKSNoMatchingKey) or network fetch degradation.
 */
export declare function verifySupabaseTokenLocally(token: string): Promise<LocalJwtVerificationResult>;
/**
 * Create tRPC context for each request.
 *
 * High-Performance Auth Flow:
 * 1. Extract Bearer token from Authorization header.
 * 2. If feature flag enabled: verify locally via HS256 JWT verification (<2ms).
 *    Hard-rejects on invalid signature/expiry.
 *    Fallback to supabaseAdmin.auth.getUser() ONLY when secret is absent or alg !== HS256.
 * 3. Check in-process LRU memory cache first.
 * 4. Run token revocation, Redis session cache, and idle checks concurrently via Promise.all.
 * 5. On cache hit, bypass redundant Prisma session queries.
 */
export declare function createContext({ req, res, }: {
    req: FastifyRequest;
    res: FastifyReply;
}): Promise<Context>;
//# sourceMappingURL=context.d.ts.map