import { MemberStatus, SubscriptionPlan, UserRole } from '@prisma/client';
export declare const BUSINESS_ORG_LIMIT_MESSAGE = "Your Business plan supports one organization. To manage multiple organizations, contact SheriaBot for Enterprise access.";
type PrismaLike = {
    user: {
        findUnique(args: unknown): Promise<{
            id: string;
            role?: UserRole | string | null;
            organizationId?: string | null;
        } | null>;
    };
    organization: {
        findUnique(args: unknown): Promise<{
            id: string;
            plan?: SubscriptionPlan | null;
            deletedAt?: Date | null;
        } | null>;
    };
    organizationMember: {
        findMany(args: unknown): Promise<Array<{
            organizationId: string;
            role?: string | null;
            status: MemberStatus | string;
            organization?: {
                id: string;
                plan?: SubscriptionPlan | null;
                deletedAt?: Date | null;
            } | null;
        }>>;
    };
};
type ActorContext = {
    actorUserId: string;
    actorRole: UserRole | string;
    sourceProcedure: string;
    platformAdminOverride?: boolean;
};
export type AssertCanCreateOrJoinOrganizationInput = {
    prisma: PrismaLike;
    userId: string;
    targetOrganizationId?: string | null;
    requestedPlan?: SubscriptionPlan | null;
    actorContext: ActorContext;
};
/**
 * Central guard for one-organization plan semantics.
 *
 * Startup and Business are single-organization commercial contexts. Enterprise
 * is intentionally left flexible because contract-aware multi-org governance
 * is not modeled yet.
 */
export declare function assertCanCreateOrJoinOrganization(input: AssertCanCreateOrJoinOrganizationInput): Promise<void>;
export {};
//# sourceMappingURL=organization-plan-limit.service.d.ts.map