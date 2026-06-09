import type { Context } from '../trpc/context';
/**
 * Organization Router
 *
 * Handles organization CRUD operations and member management.
 */
export declare const organizationRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: Context;
    meta: object;
    errorShape: {
        message: string;
        data: {
            stack: string | undefined;
            fieldErrors: Record<string, string> | null;
            code: import("@trpc/server").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
        };
        code: import("@trpc/server").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    /**
     * List organizations with pagination
     *
     * @protected
     */
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
            type?: "REGULATOR" | "STARTUP" | "ENTERPRISE" | "OTHER" | "BANK" | "TELECOM" | "INSURANCE" | undefined;
            search?: string | undefined;
        };
        output: {
            organizations: ({
                _count: {
                    users: number;
                };
            } & {
                type: string;
                id: string;
                mpesaPhoneNumber: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                organizationType: string;
                registrationNumber: string | null;
                cbkLicenseNumber: string | null;
                website: string | null;
                industry: string | null;
                size: string | null;
                subscriptionTier: string;
                subscriptionStatus: import("@prisma/client").$Enums.SubscriptionStatus;
                trialEndsAt: Date | null;
                gracePeriodEndsAt: Date | null;
                cancelledAt: Date | null;
                subscriptionEndsAt: Date | null;
                verificationStatus: string;
                verifiedAt: Date | null;
                verifiedBy: string | null;
                plan: import("@prisma/client").$Enums.SubscriptionPlan;
                planStartDate: Date | null;
                planEndDate: Date | null;
                maxSeats: number;
                stripeCustomerId: string | null;
                stripeSubId: string | null;
                customLimits: import("@prisma/client/runtime/client").JsonValue | null;
                preferredPaymentMethod: import("@prisma/client").$Enums.PaymentProvider | null;
                mpesaNextPaymentDueDate: Date | null;
                subscriptionCycleEnd: Date | null;
                mpesaFailedRenewalAttempts: number;
                mpesaLastRenewalAttemptAt: Date | null;
                mpesaNextRenewalRetryAt: Date | null;
                mpesaCancelledByUserAt: Date | null;
                address: string | null;
                contactPerson: string | null;
                contactPosition: string | null;
                contactEmail: string | null;
                contactPhone: string | null;
            })[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
        meta: object;
    }>;
    /**
     * Get organization by ID
     *
     * Security: non-admin callers must hold an ACTIVE OrganizationMember row
     * for the requested org. Failures always return FORBIDDEN (never NOT_FOUND)
     * to prevent callers from using the error code as an org-existence oracle.
     *
     * @protected
     */
    get: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            users: {
                id: string;
                email: string;
                fullName: string;
                role: import("@prisma/client").$Enums.UserRole;
            }[];
        } & {
            type: string;
            id: string;
            mpesaPhoneNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            organizationType: string;
            registrationNumber: string | null;
            cbkLicenseNumber: string | null;
            website: string | null;
            industry: string | null;
            size: string | null;
            subscriptionTier: string;
            subscriptionStatus: import("@prisma/client").$Enums.SubscriptionStatus;
            trialEndsAt: Date | null;
            gracePeriodEndsAt: Date | null;
            cancelledAt: Date | null;
            subscriptionEndsAt: Date | null;
            verificationStatus: string;
            verifiedAt: Date | null;
            verifiedBy: string | null;
            plan: import("@prisma/client").$Enums.SubscriptionPlan;
            planStartDate: Date | null;
            planEndDate: Date | null;
            maxSeats: number;
            stripeCustomerId: string | null;
            stripeSubId: string | null;
            customLimits: import("@prisma/client/runtime/client").JsonValue | null;
            preferredPaymentMethod: import("@prisma/client").$Enums.PaymentProvider | null;
            mpesaNextPaymentDueDate: Date | null;
            subscriptionCycleEnd: Date | null;
            mpesaFailedRenewalAttempts: number;
            mpesaLastRenewalAttemptAt: Date | null;
            mpesaNextRenewalRetryAt: Date | null;
            mpesaCancelledByUserAt: Date | null;
            address: string | null;
            contactPerson: string | null;
            contactPosition: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
        };
        meta: object;
    }>;
    /**
     * Create organization
     *
     * @protected
     */
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            type: "REGULATOR" | "STARTUP" | "ENTERPRISE" | "OTHER" | "BANK" | "TELECOM" | "INSURANCE";
            contactEmail: string;
            registrationNumber?: string | undefined;
            industry?: string | undefined;
            contactPhone?: string | undefined;
            address?: string | undefined;
            website?: string | undefined;
            description?: string | undefined;
        };
        output: {
            type: string;
            id: string;
            mpesaPhoneNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            organizationType: string;
            registrationNumber: string | null;
            cbkLicenseNumber: string | null;
            website: string | null;
            industry: string | null;
            size: string | null;
            subscriptionTier: string;
            subscriptionStatus: import("@prisma/client").$Enums.SubscriptionStatus;
            trialEndsAt: Date | null;
            gracePeriodEndsAt: Date | null;
            cancelledAt: Date | null;
            subscriptionEndsAt: Date | null;
            verificationStatus: string;
            verifiedAt: Date | null;
            verifiedBy: string | null;
            plan: import("@prisma/client").$Enums.SubscriptionPlan;
            planStartDate: Date | null;
            planEndDate: Date | null;
            maxSeats: number;
            stripeCustomerId: string | null;
            stripeSubId: string | null;
            customLimits: import("@prisma/client/runtime/client").JsonValue | null;
            preferredPaymentMethod: import("@prisma/client").$Enums.PaymentProvider | null;
            mpesaNextPaymentDueDate: Date | null;
            subscriptionCycleEnd: Date | null;
            mpesaFailedRenewalAttempts: number;
            mpesaLastRenewalAttemptAt: Date | null;
            mpesaNextRenewalRetryAt: Date | null;
            mpesaCancelledByUserAt: Date | null;
            address: string | null;
            contactPerson: string | null;
            contactPosition: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
        };
        meta: object;
    }>;
    /**
     * Update organization
     *
     * @protected
     */
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            name?: string | undefined;
            type?: "REGULATOR" | "STARTUP" | "ENTERPRISE" | "OTHER" | "BANK" | "TELECOM" | "INSURANCE" | undefined;
            registrationNumber?: string | undefined;
            industry?: string | undefined;
            contactEmail?: string | undefined;
            contactPhone?: string | undefined;
            address?: string | undefined;
            website?: string | undefined;
            description?: string | undefined;
        };
        output: {
            type: string;
            id: string;
            mpesaPhoneNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            organizationType: string;
            registrationNumber: string | null;
            cbkLicenseNumber: string | null;
            website: string | null;
            industry: string | null;
            size: string | null;
            subscriptionTier: string;
            subscriptionStatus: import("@prisma/client").$Enums.SubscriptionStatus;
            trialEndsAt: Date | null;
            gracePeriodEndsAt: Date | null;
            cancelledAt: Date | null;
            subscriptionEndsAt: Date | null;
            verificationStatus: string;
            verifiedAt: Date | null;
            verifiedBy: string | null;
            plan: import("@prisma/client").$Enums.SubscriptionPlan;
            planStartDate: Date | null;
            planEndDate: Date | null;
            maxSeats: number;
            stripeCustomerId: string | null;
            stripeSubId: string | null;
            customLimits: import("@prisma/client/runtime/client").JsonValue | null;
            preferredPaymentMethod: import("@prisma/client").$Enums.PaymentProvider | null;
            mpesaNextPaymentDueDate: Date | null;
            subscriptionCycleEnd: Date | null;
            mpesaFailedRenewalAttempts: number;
            mpesaLastRenewalAttemptAt: Date | null;
            mpesaNextRenewalRetryAt: Date | null;
            mpesaCancelledByUserAt: Date | null;
            address: string | null;
            contactPerson: string | null;
            contactPosition: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
        };
        meta: object;
    }>;
    /**
     * Delete organization (soft delete)
     *
     * @admin Only admins can delete organizations
     */
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Add member to organization
     *
     * Writes OrganizationMember as the authoritative source of truth for
     * membership checks (requireOrgMembership reads from this table).
     * Invalidates the Redis membership cache so the change is visible immediately.
     *
     * @protected
     */
    addMember: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            organizationId: string;
            userId: string;
            role?: "ADMIN" | "MEMBER" | "VIEWER" | undefined;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Remove member from organization
     *
     * Updates OrganizationMember.status to REMOVED (source of truth for
     * membership checks) and invalidates the Redis membership cache so the
     * change is visible to requireOrgMembership on the next request.
     *
     * @protected
     */
    removeMember: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            organizationId: string;
            userId: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Get organization members
     *
     * @protected
     */
    getMembers: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            organizationId: string;
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
            members: {
                id: string;
                email: string;
                phone: string | null;
                fullName: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                lastLoginAt: Date | null;
                createdAt: Date;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
        meta: object;
    }>;
    /**
     * Update a member's role within the organization
     *
     * Platform admins or org OWNER/ADMIN can change a user's organization role.
     * Updates OrganizationMember.role, not the platform-level User.role.
     *
     * @protected  -  must be ADMIN, or a member of the same organization
     */
    updateMemberRole: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            role: "ADMIN" | "MEMBER" | "VIEWER";
            organizationId?: string | undefined;
        };
        output: {
            success: boolean;
            member: {
                id: string;
                userId: string;
                user: {
                    email: string;
                    fullName: string;
                };
                role: import("@prisma/client").$Enums.MemberRole;
                status: import("@prisma/client").$Enums.MemberStatus;
                organizationId: string;
            };
            message: string;
        };
        meta: object;
    }>;
    /**
     * Get the current user's organization settings fields
     *
     * @protected  -  resolves org from active OrganizationMember
     */
    getSettings: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            name: string;
            registrationNumber: string | null;
            website: string | null;
            industry: string | null;
            address: string | null;
            contactPerson: string | null;
            contactPosition: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
        };
        meta: object;
    }>;
    getSeatUsage: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            canManageMembers: boolean;
            seatLimit: number;
            activeMembers: number;
            pendingInvites: number;
            usedSeats: number;
            availableSeats: number;
        };
        meta: object;
    }>;
    /**
     * Update the current user's organization settings
     *
     * @protected  -  REGULATOR role is blocked (read-only)
     */
    updateSettings: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name?: string | undefined;
            registrationNumber?: string | undefined;
            industry?: string | undefined;
            website?: string | undefined;
            address?: string | undefined;
            contactPerson?: string | undefined;
            contactPosition?: string | undefined;
            contactEmail?: string | undefined;
            contactPhone?: string | undefined;
        };
        output: {
            id: string;
            name: string;
            registrationNumber: string | null;
            website: string | null;
            industry: string | null;
            address: string | null;
            contactPerson: string | null;
            contactPosition: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=organization.router.d.ts.map