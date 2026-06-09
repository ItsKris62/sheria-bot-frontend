import { BillingMetric, MemberRole } from '@prisma/client';
import type { OrgMembershipEntry } from './context';
import type { FeatureKey } from '@/config/entitlements.config';
/**
 * Logging Middleware (Fixed Error Handling)
 * tRPC intercepts procedure errors, so we must check `result.ok`
 * instead of relying on a try/catch block.
 */
export declare const loggedMiddlewareHandler: ({ ctx, path, type, next }: any) => Promise<any>;
export declare const logged: import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, unknown, unknown>;
/**
 * Authentication Middleware
 */
export declare const isAuthenticated: import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    user: import("./context").User;
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    plan: import("@/types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("@/types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import("@prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import("@prisma/client").Prisma.LogLevel | import("@prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    effectivePlanSource: import("@/types/plan.types").EffectivePlanSource | undefined;
    entitlements: import("@/config/entitlements.config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("@/types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("@/modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: OrgMembershipEntry | undefined;
}, unknown>;
/**
 * Role-based Middlewares
 */
export declare const isAdmin: import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("@/types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("@/types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import("@prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import("@prisma/client").Prisma.LogLevel | import("@prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    effectivePlanSource: import("@/types/plan.types").EffectivePlanSource | undefined;
    entitlements: import("@/config/entitlements.config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("@/types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("@/modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: OrgMembershipEntry | undefined;
}, unknown>;
export declare const isRegulator: import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("@/types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("@/types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import("@prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import("@prisma/client").Prisma.LogLevel | import("@prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    effectivePlanSource: import("@/types/plan.types").EffectivePlanSource | undefined;
    entitlements: import("@/config/entitlements.config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("@/types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("@/modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: OrgMembershipEntry | undefined;
}, unknown>;
export declare const isStartup: import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("@/types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("@/types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import("@prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import("@prisma/client").Prisma.LogLevel | import("@prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    effectivePlanSource: import("@/types/plan.types").EffectivePlanSource | undefined;
    entitlements: import("@/config/entitlements.config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("@/types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("@/modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: OrgMembershipEntry | undefined;
}, unknown>;
export declare const isEnterprise: import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("@/types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("@/types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import("@prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import("@prisma/client").Prisma.LogLevel | import("@prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    effectivePlanSource: import("@/types/plan.types").EffectivePlanSource | undefined;
    entitlements: import("@/config/entitlements.config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("@/types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("@/modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: OrgMembershipEntry | undefined;
}, unknown>;
/**
 * Rate Limiting Middleware
 */
export declare const rateLimited: (action: string, maxRequests?: number, opts?: {
    window?: number;
    identifier?: (ctx: {
        req: {
            ip: string;
        };
    }) => string;
}) => import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("@/types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("@/types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import("@prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import("@prisma/client").Prisma.LogLevel | import("@prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    effectivePlanSource: import("@/types/plan.types").EffectivePlanSource | undefined;
    entitlements: import("@/config/entitlements.config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("@/types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("@/modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: OrgMembershipEntry | undefined;
}, unknown>;
/**
 * Verifies the authenticated user holds an active OrganizationMember row for
 * their own organization (ctx.user.organizationId). Attaches the membership
 * record to ctx.orgMember for downstream role checks.
 *
 * Use as: protectedProcedure.use(requireOrgMember)
 * Must run AFTER isAuthenticated.
 */
export declare const requireOrgMember: import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    orgMember: {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    };
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("@/types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("@/types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import("@prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import("@prisma/client").Prisma.LogLevel | import("@prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    effectivePlanSource: import("@/types/plan.types").EffectivePlanSource | undefined;
    entitlements: import("@/config/entitlements.config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("@/types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("@/modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMembership: OrgMembershipEntry | undefined;
}, unknown>;
export declare const requireMemberRole: (allowedRoles: MemberRole[]) => import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("@/types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("@/types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import("@prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import("@prisma/client").Prisma.LogLevel | import("@prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    effectivePlanSource: import("@/types/plan.types").EffectivePlanSource | undefined;
    entitlements: import("@/config/entitlements.config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("@/types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("@/modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: OrgMembershipEntry | undefined;
}, unknown>;
/**
 * Verifies the authenticated user holds an ACTIVE OrganizationMember row for
 * their session-scoped organization (ctx.user.organizationId). Attaches the
 * membership record to ctx.orgMembership for downstream handlers and role checks.
 *
 * Distinct from requireOrgMember in that it:
 *   - Caches the DB check in Redis with a 60-second TTL
 *   - Rate-limits repeated authorization denials (10 per 60s, fail-closed)
 *   - Uses structured authorization event logging
 *   - Writes every denial and grant to AuditLog (100%)
 *   - Attaches ctx.orgMembership typed as OrgMembershipEntry
 *
 * Security: failures always throw FORBIDDEN, never NOT_FOUND, so callers
 * cannot determine whether an org exists via error code differences.
 *
 * Must run AFTER isAuthenticated.
 */
export declare const requireOrgMembership: import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    orgMembership: OrgMembershipEntry;
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("@/types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("@/types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import("@prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import("@prisma/client").Prisma.LogLevel | import("@prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    effectivePlanSource: import("@/types/plan.types").EffectivePlanSource | undefined;
    entitlements: import("@/config/entitlements.config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("@/types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("@/modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
}, unknown>;
/**
 * Factory that enforces a minimum MemberRole level on the org membership
 * resolved by requireOrgMembership. Must run AFTER requireOrgMembership.
 *
 * Role hierarchy (ascending access): VIEWER < MEMBER < ADMIN < OWNER
 *
 * Usage: orgMemberProcedure.use(requireOrgMembershipRole([MemberRole.ADMIN, MemberRole.OWNER]))
 */
export declare const requireOrgMembershipRole: (allowedRoles: MemberRole[]) => import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    user: import("./context").User | null;
    plan: import("@/types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("@/types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import("@prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import("@prisma/client").Prisma.LogLevel | import("@prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    effectivePlanSource: import("@/types/plan.types").EffectivePlanSource | undefined;
    entitlements: import("@/config/entitlements.config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("@/types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("@/modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: OrgMembershipEntry | undefined;
}, unknown>;
/**
 * Resolves the effective plan for a request, with this priority:
 *
 *  1. Pilot active                              -> ENTERPRISE
 *  2. Active paid subscription                  -> orgPlan (STARTUP/BUSINESS/ENTERPRISE)
 *  3. Grace period active                       -> orgPlan (retain access until window closes)
 *  4. Free trial active (expiresAt > now)       -> 'FREE_TRIAL'
 *  5. Fallback                                  -> REGULATOR
 *
 * Notes:
 *  - The trial check (step 3) runs BEFORE the org-less fast-return so that
 *    users without an organization can still use their trial.
 *  - Grace-period expiry is lazily enforced (no cron). Same pattern as before.
 *  - Cache key is now user-scoped (sheriabot:planctx:{userId}) so trial fields
 *    are co-located with subscription state.
 *  - The legacy org-scoped key (sheriabot:plan:{orgId}) is left untouched for
 *    any other consumers that may read it directly.
 *
 * Must run AFTER isAuthenticated.
 */
export declare const withPlanContext: import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    user: import("./context").User;
    plan: import("@/types/plan.types").EffectivePlan;
    effectivePlanSource: import("@/types/plan.types").EffectivePlanSource;
    entitlementProfile: import("@/types/plan.types").PilotEntitlementProfile | null;
    entitlements: import("@/config/entitlements.config").PlanEntitlementConfig;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[];
    pilotState: {
        status: "ACTIVE" | "EXPIRED" | "REVOKED" | "CONVERTED";
        entitlementProfile: import("@/types/plan.types").PilotEntitlementProfile;
        expiresAt: string | null;
        extensionCount: number;
    } | null;
    customLimits: Record<string, unknown> | null;
    trialState: import("@/modules/trial").TrialContextState | undefined;
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import("@prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import("@prisma/client").Prisma.LogLevel | import("@prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: OrgMembershipEntry | undefined;
}, unknown>;
/**
 * Factory that returns a middleware blocking access when the org's plan does
 * not include the requested feature.
 *
 * Throws FORBIDDEN with the minimum required plan name.
 * Must run after withPlanContext.
 */
export declare const requirePlanFeature: (feature: FeatureKey) => import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    user: import("./context").User;
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    plan: import("@/types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("@/types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import("@prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import("@prisma/client").Prisma.LogLevel | import("@prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    effectivePlanSource: import("@/types/plan.types").EffectivePlanSource | undefined;
    entitlements: import("@/config/entitlements.config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("@/types/plan.types").PilotPlanState | null | undefined;
    usageInfo: {
        metric: string;
        current: number;
        limit: number;
    } | undefined;
    trialState: import("@/modules/trial").TrialContextState | undefined;
    incrementUsage: (() => Promise<void>) | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: OrgMembershipEntry | undefined;
}, unknown>;
/**
 * Factory that returns a middleware enforcing a usage quota (monthly or lifetime).
 *
 * - Reads plan limit + period from PLAN_ENTITLEMENTS via getQuota().
 * - limit === -1 (unlimited): passes through without touching Redis.
 * - limit === 0 (FORBIDDEN): feature unavailable on this plan.
 * - Otherwise: reads the Redis counter and blocks if at or over limit.
 *
 * Redis keys:
 *   Monthly:  sheriabot:usage:{scopeId}:{metric}:{YYYY-MM}  (TTL: 35 days)
 *   Lifetime: sheriabot:usage:{scopeId}:{metric}:lifetime    (no TTL)
 *
 * Error code semantics:
 *   FORBIDDEN          -  feature is not included in the plan at all (limit === 0)
 *   TOO_MANY_REQUESTS  -  feature is included but the quota is exhausted
 *
 * Options:
 *   deferIncrement?: boolean
 *     When true, the middleware does NOT increment the counter immediately.
 *     Instead, it attaches ctx.incrementUsage() which the router handler
 *     must call after a successful DB write.  This prevents lost credits
 *     when the service call fails after the middleware runs.
 *     Default: false (increment immediately, backward-compatible).
 *
 * Must run after withPlanContext.
 */
export declare const checkUsageLimit: (metric: BillingMetric, opts?: {
    deferIncrement?: boolean;
}) => import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    user: import("./context").User;
    usageInfo: {
        metric: import("@prisma/client").$Enums.BillingMetric;
        current: number;
        limit: number;
    };
    incrementUsage: () => Promise<void>;
    req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    plan: import("@/types/plan.types").EffectivePlan | undefined;
    customLimits: Record<string, unknown> | null | undefined;
    entitlementProfile: import("@/types/plan.types").PilotEntitlementProfile | null | undefined;
    prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }, {}>, import("@prisma/client").Prisma.TypeMapCb<{
        adapter: import("@prisma/adapter-pg").PrismaPg;
        log: (import("@prisma/client").Prisma.LogLevel | import("@prisma/client").Prisma.LogDefinition)[];
        errorFormat: "pretty";
    }>, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    aiService: import("../../lib/ai/ai.service").AIService;
    ragService: import("../../lib/rag/rag.service").RAGService;
    storageService: import("../../lib/storage/storage.service").StorageService;
    mailer: import("../../lib/email/mailer.service").MailerService;
    effectivePlanSource: import("@/types/plan.types").EffectivePlanSource | undefined;
    entitlements: import("@/config/entitlements.config").PlanEntitlementConfig | undefined;
    appliedPlanOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[] | undefined;
    pilotState: import("@/types/plan.types").PilotPlanState | null | undefined;
    trialState: import("@/modules/trial").TrialContextState | undefined;
    orgMember: {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
        joinedAt: Date;
    } | undefined;
    orgMembership: OrgMembershipEntry | undefined;
}, unknown>;
//# sourceMappingURL=middleware.d.ts.map