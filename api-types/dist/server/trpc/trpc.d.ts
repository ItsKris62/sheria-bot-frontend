import { router } from './init';
import { MemberRole } from '@prisma/client';
export { router };
/**
 * Public Procedure
 * Accessible by anyone, but still tracked by the logging middleware.
 */
export declare const publicProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
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
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
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
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
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
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
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
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
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
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
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
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
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
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
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
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
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
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
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
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
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
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
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
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
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
    effectivePlanSource: import("../../types/plan.types").EffectivePlanSource | undefined;
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
        role: import("@prisma/client").$Enums.MemberRole;
        status: import("@prisma/client").$Enums.MemberStatus;
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