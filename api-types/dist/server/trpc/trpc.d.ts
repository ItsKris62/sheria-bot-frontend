import { router } from './init';
import { MemberRole } from '@prisma/client';
import type { AgentCapability } from '@/modules/agents/agent-credential.service';
export { router };
/**
 * Public Procedure
 * Accessible by anyone, but still tracked by the logging middleware.
 */
export declare const publicProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const MFA_ENROLLMENT_ALLOWED_PATHS: Set<string>;
export declare function isPathAllowed(path: string): boolean;
export declare const organizationMfaEnforced: import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, object, unknown>;
/**
 * Procedures permitted when an ADMIN has ZERO MFA factors enrolled.
 * Strictly limited to factor enrollment so unenrolled/seeded admins can onboard.
 */
export declare const ADMIN_ZERO_FACTOR_ALLOWED_PATHS: Set<string>;
/**
 * High-risk mutation procedures that require a verified fresh MFA challenge (within last N minutes)
 * when an ADMIN already has MFA factors enrolled.
 */
export declare const ADMIN_STEP_UP_MUTATION_PATHS: Set<string>;
export declare const ADMIN_MFA_STEP_UP_WINDOW_MS: number;
export declare function isAdminStepUpRequiredPath(path: string): boolean;
/**
 * Checks whether an admin user has verified MFA within the step-up window.
 *
 * FAIL-CLOSED AVAILABILITY BEHAVIOR:
 * If Redis throws an error or is unreachable, this check logs a warning with event type
 * `mfa_step_up_check_failed` and immediately returns `false` (denying step-up access).
 * This fail-closed posture intentionally favors system security over availability:
 * administrative mutations cannot be executed without positive verification of fresh MFA,
 * even during transient cache outages.
 */
export declare function isFreshMfaChallengeVerified(userId: string): Promise<boolean>;
export declare function recordFreshMfaVerification(userId: string): Promise<void>;
/**
 * Admin MFA Enforcement Handler
 * State-gated multi-factor authorization:
 * 1. Zero factors enrolled: allows ONLY initial factor enrollment paths (user.setupTotp, user.confirmTotpSetup, passkey registration).
 *    All other procedures are hard-blocked with PRECONDITION_FAILED (MFA_REQUIRED_FOR_ADMIN).
 * 2. Factors enrolled: allows normal adminProcedure operations, but sensitive mutations
 *    (disableTotp, regenerateBackupCodes, passkey modifications, admin.auth.* mutations)
 *    strictly require a verified fresh MFA challenge within the last 15 minutes.
 */
export interface AdminMfaMiddlewareParams {
    ctx: {
        user?: any;
        req?: any;
        [key: string]: any;
    };
    path: string;
    next: (opts?: any) => Promise<any>;
    [key: string]: any;
}
export declare function executeAdminMfaEnforced({ ctx, path, next, }: AdminMfaMiddlewareParams): Promise<any>;
export declare const adminMfaEnforced: import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, unknown, unknown>;
/**
 * Protected Procedure
 * Requires a valid JWT. Guarantees ctx.user is User (non-null) in downstream handlers.
 */
export declare const protectedProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User;
    plan: import("../../types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import(".prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import(".prisma/client").Prisma.LogLevel | import(".prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    tenantPrisma: any;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    getTenantPrisma: (() => import("../../lib/prisma/tenant-scope.extension").TenantScopedPrismaClient) | undefined;
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
    mfaEnforcement: {
        state: "grace" | "enforced";
        deadline?: Date;
    } | undefined;
    entitlements: import("../../config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("../../types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("../../modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.MemberRole;
        status: import(".prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: import("./context").OrgMembershipEntry | undefined;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const superAdminProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("../../types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import(".prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import(".prisma/client").Prisma.LogLevel | import(".prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    tenantPrisma: any;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    getTenantPrisma: (() => import("../../lib/prisma/tenant-scope.extension").TenantScopedPrismaClient) | undefined;
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
    mfaEnforcement: {
        state: "grace" | "enforced";
        deadline?: Date;
    } | undefined;
    entitlements: import("../../config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("../../types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("../../modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.MemberRole;
        status: import(".prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: import("./context").OrgMembershipEntry | undefined;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const supportAdminProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("../../types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import(".prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import(".prisma/client").Prisma.LogLevel | import(".prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    tenantPrisma: any;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    getTenantPrisma: (() => import("../../lib/prisma/tenant-scope.extension").TenantScopedPrismaClient) | undefined;
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
    mfaEnforcement: {
        state: "grace" | "enforced";
        deadline?: Date;
    } | undefined;
    entitlements: import("../../config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("../../types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("../../modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.MemberRole;
        status: import(".prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: import("./context").OrgMembershipEntry | undefined;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const billingAdminProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("../../types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import(".prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import(".prisma/client").Prisma.LogLevel | import(".prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    tenantPrisma: any;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    getTenantPrisma: (() => import("../../lib/prisma/tenant-scope.extension").TenantScopedPrismaClient) | undefined;
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
    mfaEnforcement: {
        state: "grace" | "enforced";
        deadline?: Date;
    } | undefined;
    entitlements: import("../../config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("../../types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("../../modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.MemberRole;
        status: import(".prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: import("./context").OrgMembershipEntry | undefined;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const securityAdminProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("../../types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import(".prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import(".prisma/client").Prisma.LogLevel | import(".prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    tenantPrisma: any;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    getTenantPrisma: (() => import("../../lib/prisma/tenant-scope.extension").TenantScopedPrismaClient) | undefined;
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
    mfaEnforcement: {
        state: "grace" | "enforced";
        deadline?: Date;
    } | undefined;
    entitlements: import("../../config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("../../types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("../../modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.MemberRole;
        status: import(".prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: import("./context").OrgMembershipEntry | undefined;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const adminProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("../../types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import(".prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import(".prisma/client").Prisma.LogLevel | import(".prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    tenantPrisma: any;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    getTenantPrisma: (() => import("../../lib/prisma/tenant-scope.extension").TenantScopedPrismaClient) | undefined;
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
    mfaEnforcement: {
        state: "grace" | "enforced";
        deadline?: Date;
    } | undefined;
    entitlements: import("../../config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("../../types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("../../modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.MemberRole;
        status: import(".prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: import("./context").OrgMembershipEntry | undefined;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const allAdminProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("../../types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import(".prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import(".prisma/client").Prisma.LogLevel | import(".prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    tenantPrisma: any;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    getTenantPrisma: (() => import("../../lib/prisma/tenant-scope.extension").TenantScopedPrismaClient) | undefined;
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
    mfaEnforcement: {
        state: "grace" | "enforced";
        deadline?: Date;
    } | undefined;
    entitlements: import("../../config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("../../types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("../../modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.MemberRole;
        status: import(".prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: import("./context").OrgMembershipEntry | undefined;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const regulatorProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("../../types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import(".prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import(".prisma/client").Prisma.LogLevel | import(".prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    tenantPrisma: any;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    getTenantPrisma: (() => import("../../lib/prisma/tenant-scope.extension").TenantScopedPrismaClient) | undefined;
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
    mfaEnforcement: {
        state: "grace" | "enforced";
        deadline?: Date;
    } | undefined;
    entitlements: import("../../config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("../../types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("../../modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.MemberRole;
        status: import(".prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: import("./context").OrgMembershipEntry | undefined;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const startupProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("../../types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import(".prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import(".prisma/client").Prisma.LogLevel | import(".prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    tenantPrisma: any;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    getTenantPrisma: (() => import("../../lib/prisma/tenant-scope.extension").TenantScopedPrismaClient) | undefined;
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
    mfaEnforcement: {
        state: "grace" | "enforced";
        deadline?: Date;
    } | undefined;
    entitlements: import("../../config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("../../types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("../../modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.MemberRole;
        status: import(".prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: import("./context").OrgMembershipEntry | undefined;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const enterpriseProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("../../types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import(".prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import(".prisma/client").Prisma.LogLevel | import(".prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    tenantPrisma: any;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    getTenantPrisma: (() => import("../../lib/prisma/tenant-scope.extension").TenantScopedPrismaClient) | undefined;
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
    mfaEnforcement: {
        state: "grace" | "enforced";
        deadline?: Date;
    } | undefined;
    entitlements: import("../../config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("../../types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("../../modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.MemberRole;
        status: import(".prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: import("./context").OrgMembershipEntry | undefined;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
/**
 * Requires an ACTIVE OrganizationMember row for ctx.user.organizationId.
 * Applies Redis caching (60s) and denial rate limiting.
 * Attaches ctx.orgMembership for downstream handlers.
 */
export declare const orgMemberProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("../../types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import(".prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import(".prisma/client").Prisma.LogLevel | import(".prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    tenantPrisma: any;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    getTenantPrisma: (() => import("../../lib/prisma/tenant-scope.extension").TenantScopedPrismaClient) | undefined;
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
    mfaEnforcement: {
        state: "grace" | "enforced";
        deadline?: Date;
    } | undefined;
    entitlements: import("../../config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("../../types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("../../modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.MemberRole;
        status: import(".prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: import("./context").OrgMembershipEntry;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
/**
 * Agent procedure.
 * Requires X-Agent-Credential machine authentication and an explicit capability.
 */
export declare const agentProcedure: (capability: AgentCapability) => import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("../../types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import(".prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import(".prisma/client").Prisma.LogLevel | import(".prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    tenantPrisma: any;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    getTenantPrisma: (() => import("../../lib/prisma/tenant-scope.extension").TenantScopedPrismaClient) | undefined;
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
    mfaEnforcement: {
        state: "grace" | "enforced";
        deadline?: Date;
    } | undefined;
    entitlements: import("../../config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("../../types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("../../modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.MemberRole;
        status: import(".prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: import("./context").OrgMembershipEntry | undefined;
    agent: import("@/modules/agents/agent-credential.service").AgentIdentity;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
/**
 * Factory: orgMemberProcedure + minimum role enforcement.
 * Role hierarchy (ascending): VIEWER < MEMBER < ADMIN < OWNER
 *
 * Usage: orgMemberProcedureWithRole([MemberRole.ADMIN, MemberRole.OWNER])
 */
export declare const orgMemberProcedureWithRole: (allowedRoles: MemberRole[]) => import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("../../types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import(".prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import(".prisma/client").Prisma.LogLevel | import(".prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    tenantPrisma: any;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    getTenantPrisma: (() => import("../../lib/prisma/tenant-scope.extension").TenantScopedPrismaClient) | undefined;
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
    mfaEnforcement: {
        state: "grace" | "enforced";
        deadline?: Date;
    } | undefined;
    entitlements: import("../../config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("../../types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("../../modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.MemberRole;
        status: import(".prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: import("./context").OrgMembershipEntry | undefined;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
//# sourceMappingURL=trpc.d.ts.map