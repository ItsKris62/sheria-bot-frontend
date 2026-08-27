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
                subscriptionStatus: import(".prisma/client").$Enums.SubscriptionStatus;
                trialEndsAt: Date | null;
                gracePeriodEndsAt: Date | null;
                cancelledAt: Date | null;
                subscriptionEndsAt: Date | null;
                verificationStatus: string;
                verifiedAt: Date | null;
                verifiedBy: string | null;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                planStartDate: Date | null;
                planEndDate: Date | null;
                maxSeats: number;
                homeJurisdictionCode: string | null;
                stripeCustomerId: string | null;
                stripeSubId: string | null;
                customLimits: import("@prisma/client/runtime/client").JsonValue | null;
                preferredPaymentMethod: import(".prisma/client").$Enums.PaymentProvider | null;
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
                requireMfa: boolean;
                mfaPolicyEnabledAt: Date | null;
                mfaPolicyUpdatedBy: string | null;
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
                role: import(".prisma/client").$Enums.UserRole;
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
            subscriptionStatus: import(".prisma/client").$Enums.SubscriptionStatus;
            trialEndsAt: Date | null;
            gracePeriodEndsAt: Date | null;
            cancelledAt: Date | null;
            subscriptionEndsAt: Date | null;
            verificationStatus: string;
            verifiedAt: Date | null;
            verifiedBy: string | null;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
            planStartDate: Date | null;
            planEndDate: Date | null;
            maxSeats: number;
            homeJurisdictionCode: string | null;
            stripeCustomerId: string | null;
            stripeSubId: string | null;
            customLimits: import("@prisma/client/runtime/client").JsonValue | null;
            preferredPaymentMethod: import(".prisma/client").$Enums.PaymentProvider | null;
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
            requireMfa: boolean;
            mfaPolicyEnabledAt: Date | null;
            mfaPolicyUpdatedBy: string | null;
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
            subscriptionStatus: import(".prisma/client").$Enums.SubscriptionStatus;
            trialEndsAt: Date | null;
            gracePeriodEndsAt: Date | null;
            cancelledAt: Date | null;
            subscriptionEndsAt: Date | null;
            verificationStatus: string;
            verifiedAt: Date | null;
            verifiedBy: string | null;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
            planStartDate: Date | null;
            planEndDate: Date | null;
            maxSeats: number;
            homeJurisdictionCode: string | null;
            stripeCustomerId: string | null;
            stripeSubId: string | null;
            customLimits: import("@prisma/client/runtime/client").JsonValue | null;
            preferredPaymentMethod: import(".prisma/client").$Enums.PaymentProvider | null;
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
            requireMfa: boolean;
            mfaPolicyEnabledAt: Date | null;
            mfaPolicyUpdatedBy: string | null;
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
            homeJurisdictionCode?: "KE" | "MW" | "RW" | undefined;
            homeJurisdictionReason?: string | undefined;
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
            subscriptionStatus: import(".prisma/client").$Enums.SubscriptionStatus;
            trialEndsAt: Date | null;
            gracePeriodEndsAt: Date | null;
            cancelledAt: Date | null;
            subscriptionEndsAt: Date | null;
            verificationStatus: string;
            verifiedAt: Date | null;
            verifiedBy: string | null;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
            planStartDate: Date | null;
            planEndDate: Date | null;
            maxSeats: number;
            homeJurisdictionCode: string | null;
            stripeCustomerId: string | null;
            stripeSubId: string | null;
            customLimits: import("@prisma/client/runtime/client").JsonValue | null;
            preferredPaymentMethod: import(".prisma/client").$Enums.PaymentProvider | null;
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
            requireMfa: boolean;
            mfaPolicyEnabledAt: Date | null;
            mfaPolicyUpdatedBy: string | null;
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
                role: import(".prisma/client").$Enums.MemberRole;
                platformRole: import(".prisma/client").$Enums.UserRole;
                orgRole: import(".prisma/client").$Enums.MemberRole;
                membershipId: string;
                status: import(".prisma/client").$Enums.MemberStatus;
                joinedAt: Date;
                invitedAt: Date | null;
                totpEnabled: boolean;
                id: string;
                email: string;
                phone: string | null;
                fullName: string;
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
                role: import(".prisma/client").$Enums.MemberRole;
                status: import(".prisma/client").$Enums.MemberStatus;
                organizationId: string;
            };
            message: string;
        };
        meta: object;
    }>;
    suspendMember: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            organizationId?: string | undefined;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    reactivateMember: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
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
                role: import(".prisma/client").$Enums.MemberRole;
                status: import(".prisma/client").$Enums.MemberStatus;
                organizationId: string;
                joinedAt: Date;
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
            currentMemberRole: import(".prisma/client").$Enums.MemberRole | null;
            canManageOrganizationSettings: boolean;
            id: string;
            name: string;
            registrationNumber: string | null;
            website: string | null;
            industry: string | null;
            homeJurisdictionCode: string | null;
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
    getTeamOverview: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            organization: {
                id: string;
                name: string;
                registrationNumber: string | null;
                website: string | null;
                industry: string | null;
                subscriptionStatus: import(".prisma/client").$Enums.SubscriptionStatus;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                maxSeats: number;
                address: string | null;
                contactPerson: string | null;
                contactEmail: string | null;
                contactPhone: string | null;
            };
            callerOrgRole: import(".prisma/client").$Enums.MemberRole;
            canManageMembers: boolean;
            seatUsage: import("../services/organization-seat.service").OrganizationSeatUsage;
            memberCounts: {
                active: number;
                suspended: number;
                pendingInvitations: number;
                capacity: number;
            };
            owner: {
                id: string;
                email: string;
                fullName: string;
            } | null;
            members: {
                id: string;
                membershipId: string;
                name: string;
                email: string;
                role: import(".prisma/client").$Enums.MemberRole;
                orgRole: import(".prisma/client").$Enums.MemberRole;
                platformRole: import(".prisma/client").$Enums.UserRole;
                status: import(".prisma/client").$Enums.MemberStatus;
                joinedAt: Date;
                invitedAt: Date | null;
                createdAt: Date;
                lastActive: Date | null;
                lastLoginAt: Date | null;
                totpEnabled: boolean;
            }[];
            pendingInvitations: {
                id: string;
                email: string;
                createdAt: Date;
                expiresAt: Date;
                organizationRole: import(".prisma/client").$Enums.MemberRole | null;
                invitedBy: string;
            }[];
        };
        meta: object;
    }>;
    getSecurityCenter: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            policy: {
                requireMfa: boolean;
                mfaPolicyEnabledAt: any;
                mfaPolicyUpdatedBy: any;
            };
            posture: {
                totalMembers: number;
                mfaEnabled: number;
                mfaMissing: number;
                percentage: number;
            };
            canManageSecurity: boolean;
            currentUserMfaEnabled: boolean;
            members: {
                id: string;
                name: string;
                email: string;
                role: import(".prisma/client").$Enums.MemberRole;
                status: import(".prisma/client").$Enums.MemberStatus;
                totpEnabled: boolean;
                lastActive: Date | null;
            }[];
        };
        meta: object;
    }>;
    updateSecurityPolicy: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            requireMfa: boolean;
        };
        output: {
            success: boolean;
            policy: {
                [x: string]: ({
                    id: string;
                    email: string;
                    password: string | null;
                    phone: string | null;
                    supabaseAuthId: string | null;
                    fullName: string;
                    avatar: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    status: import(".prisma/client").$Enums.UserStatus;
                    accountStatus: string;
                    emailVerified: boolean;
                    emailVerifiedAt: Date | null;
                    emailVerificationToken: string | null;
                    emailVerificationExpiry: Date | null;
                    passwordResetToken: string | null;
                    passwordResetExpiry: Date | null;
                    mustChangePassword: boolean;
                    temporaryPasswordExpiresAt: Date | null;
                    temporaryPasswordIssuedAt: Date | null;
                    temporaryPasswordUsedAt: Date | null;
                    temporaryPasswordCreatedByAdminId: string | null;
                    temporaryPasswordDeliveryStatus: string | null;
                    temporaryPasswordVersion: number;
                    organizationId: string | null;
                    lastLoginAt: Date | null;
                    lastLoginIp: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    preferences: import("@prisma/client/runtime/client").JsonValue | null;
                    totpEnabled: boolean;
                    totpSecret: string | null;
                    freeTrialActivatedAt: Date | null;
                    freeTrialExpiresAt: Date | null;
                    freeTrialUsage: import("@prisma/client/runtime/client").JsonValue | null;
                    isPilot: boolean;
                    pilotCohort: string | null;
                    pilotStartedAt: Date | null;
                    pilotExpiresAt: Date | null;
                    pilotAccessStatus: string;
                    pilotFirstExtensionGrantedAt: Date | null;
                    pilotSecondExtensionGrantedAt: Date | null;
                    pilotExtensionCount: number;
                    pilotCreatedByAdminId: string | null;
                    pilotLastExtendedByAdminId: string | null;
                    postPilotTier: string;
                    pilotConvertedAt: Date | null;
                    deletionScheduledAt: Date | null;
                    deletionReason: string | null;
                    deletionFeedback: string | null;
                } | {
                    id: string;
                    email: string;
                    password: string | null;
                    phone: string | null;
                    supabaseAuthId: string | null;
                    fullName: string;
                    avatar: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    status: import(".prisma/client").$Enums.UserStatus;
                    accountStatus: string;
                    emailVerified: boolean;
                    emailVerifiedAt: Date | null;
                    emailVerificationToken: string | null;
                    emailVerificationExpiry: Date | null;
                    passwordResetToken: string | null;
                    passwordResetExpiry: Date | null;
                    mustChangePassword: boolean;
                    temporaryPasswordExpiresAt: Date | null;
                    temporaryPasswordIssuedAt: Date | null;
                    temporaryPasswordUsedAt: Date | null;
                    temporaryPasswordCreatedByAdminId: string | null;
                    temporaryPasswordDeliveryStatus: string | null;
                    temporaryPasswordVersion: number;
                    organizationId: string | null;
                    lastLoginAt: Date | null;
                    lastLoginIp: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    preferences: import("@prisma/client/runtime/client").JsonValue | null;
                    totpEnabled: boolean;
                    totpSecret: string | null;
                    freeTrialActivatedAt: Date | null;
                    freeTrialExpiresAt: Date | null;
                    freeTrialUsage: import("@prisma/client/runtime/client").JsonValue | null;
                    isPilot: boolean;
                    pilotCohort: string | null;
                    pilotStartedAt: Date | null;
                    pilotExpiresAt: Date | null;
                    pilotAccessStatus: string;
                    pilotFirstExtensionGrantedAt: Date | null;
                    pilotSecondExtensionGrantedAt: Date | null;
                    pilotExtensionCount: number;
                    pilotCreatedByAdminId: string | null;
                    pilotLastExtendedByAdminId: string | null;
                    postPilotTier: string;
                    pilotConvertedAt: Date | null;
                    deletionScheduledAt: Date | null;
                    deletionReason: string | null;
                    deletionFeedback: string | null;
                })[] | ({
                    id: string;
                    title: string | null;
                    userId: string;
                    status: import(".prisma/client").$Enums.PolicyStatus;
                    organizationId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    organizationType: string | null;
                    scenario: string;
                    regulatoryAreas: string[];
                    urgency: string;
                    stakeholders: string[];
                    executiveSummary: string | null;
                    analysis: string | null;
                    recommendations: import("@prisma/client/runtime/client").JsonValue | null;
                    complianceChecklist: import("@prisma/client/runtime/client").JsonValue | null;
                    implementationTimeline: import("@prisma/client/runtime/client").JsonValue | null;
                    appendices: import("@prisma/client/runtime/client").JsonValue | null;
                    content: string | null;
                    specificRequirements: string | null;
                    targetAudience: string | null;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    isLatestVersion: boolean;
                    parentId: string | null;
                    generationTime: number | null;
                    version: number;
                    assignedTo: string | null;
                    reviewers: string[];
                } | {
                    id: string;
                    title: string | null;
                    userId: string;
                    status: import(".prisma/client").$Enums.PolicyStatus;
                    organizationId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    organizationType: string | null;
                    scenario: string;
                    regulatoryAreas: string[];
                    urgency: string;
                    stakeholders: string[];
                    executiveSummary: string | null;
                    analysis: string | null;
                    recommendations: import("@prisma/client/runtime/client").JsonValue | null;
                    complianceChecklist: import("@prisma/client/runtime/client").JsonValue | null;
                    implementationTimeline: import("@prisma/client/runtime/client").JsonValue | null;
                    appendices: import("@prisma/client/runtime/client").JsonValue | null;
                    content: string | null;
                    specificRequirements: string | null;
                    targetAudience: string | null;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    isLatestVersion: boolean;
                    parentId: string | null;
                    generationTime: number | null;
                    version: number;
                    assignedTo: string | null;
                    reviewers: string[];
                })[] | ({
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    title: string;
                    description: string | null;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    summary: import("@prisma/client/runtime/client").JsonValue | null;
                    progress: number;
                    dueDate: Date | null;
                    productType: string | null;
                    businessStage: string | null;
                    targetSegments: import("@prisma/client/runtime/client").JsonValue | null;
                    servicesOffered: import("@prisma/client/runtime/client").JsonValue | null;
                    additionalConcerns: string | null;
                    items: import("@prisma/client/runtime/client").JsonValue;
                    checklistData: import("@prisma/client/runtime/client").JsonValue | null;
                    itemProgress: import("@prisma/client/runtime/client").JsonValue | null;
                    completedItems: number;
                    totalItems: number;
                    generatedAt: Date | null;
                    completedAt: Date | null;
                } | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    title: string;
                    description: string | null;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    summary: import("@prisma/client/runtime/client").JsonValue | null;
                    progress: number;
                    dueDate: Date | null;
                    productType: string | null;
                    businessStage: string | null;
                    targetSegments: import("@prisma/client/runtime/client").JsonValue | null;
                    servicesOffered: import("@prisma/client/runtime/client").JsonValue | null;
                    additionalConcerns: string | null;
                    items: import("@prisma/client/runtime/client").JsonValue;
                    checklistData: import("@prisma/client/runtime/client").JsonValue | null;
                    itemProgress: import("@prisma/client/runtime/client").JsonValue | null;
                    completedItems: number;
                    totalItems: number;
                    generatedAt: Date | null;
                    completedAt: Date | null;
                })[] | ({
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.VaultDocumentStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    verifiedAt: Date | null;
                    verifiedBy: string | null;
                    version: number;
                    fileSize: number;
                    category: import(".prisma/client").$Enums.DocumentCategory;
                    tags: string[];
                    notes: string | null;
                    fileName: string;
                    fileType: string;
                    storageKey: string;
                    contentHash: string | null;
                    expiryDate: Date | null;
                    fileExtension: string;
                    uploadedById: string;
                    isArchived: boolean;
                    r2Bucket: string | null;
                    encryptionKeyId: string | null;
                    uploadStatus: import(".prisma/client").$Enums.VaultDocumentUploadStatus | null;
                    retentionExpiresAt: Date | null;
                } | {
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.VaultDocumentStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    verifiedAt: Date | null;
                    verifiedBy: string | null;
                    version: number;
                    fileSize: number;
                    category: import(".prisma/client").$Enums.DocumentCategory;
                    tags: string[];
                    notes: string | null;
                    fileName: string;
                    fileType: string;
                    storageKey: string;
                    contentHash: string | null;
                    expiryDate: Date | null;
                    fileExtension: string;
                    uploadedById: string;
                    isArchived: boolean;
                    r2Bucket: string | null;
                    encryptionKeyId: string | null;
                    uploadStatus: import(".prisma/client").$Enums.VaultDocumentUploadStatus | null;
                    retentionExpiresAt: Date | null;
                })[] | ({
                    id: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    complianceQueryId: string;
                    notes: string | null;
                    runId: string;
                    question: string;
                    suggestedDocument: string | null;
                    statusChangedAt: Date | null;
                } | {
                    id: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    complianceQueryId: string;
                    notes: string | null;
                    runId: string;
                    question: string;
                    suggestedDocument: string | null;
                    statusChangedAt: Date | null;
                })[] | ({
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.CorpusGapReportStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    documentType: import(".prisma/client").$Enums.CorpusGapDocumentType;
                    documentName: string;
                    jurisdiction: import(".prisma/client").$Enums.CorpusGapJurisdiction;
                    sourceUrl: string | null;
                    reportedByUserId: string;
                    issuingAuthority: string;
                    adminNotes: string | null;
                    resolvedAt: Date | null;
                } | {
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.CorpusGapReportStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    documentType: import(".prisma/client").$Enums.CorpusGapDocumentType;
                    documentName: string;
                    jurisdiction: import(".prisma/client").$Enums.CorpusGapJurisdiction;
                    sourceUrl: string | null;
                    reportedByUserId: string;
                    issuingAuthority: string;
                    adminNotes: string | null;
                    resolvedAt: Date | null;
                })[] | ({
                    id: string;
                    title: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    jurisdictionCode: string;
                    regulator: string;
                    licenseType: string;
                    progress: number;
                    referenceNumber: string | null;
                    nextAction: string | null;
                    dueDate: Date | null;
                    submittedAt: Date | null;
                    decidedAt: Date | null;
                } | {
                    id: string;
                    title: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    jurisdictionCode: string;
                    regulator: string;
                    licenseType: string;
                    progress: number;
                    referenceNumber: string | null;
                    nextAction: string | null;
                    dueDate: Date | null;
                    submittedAt: Date | null;
                    decidedAt: Date | null;
                })[] | ({
                    id: string;
                    status: import(".prisma/client").$Enums.LicenseStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    regulator: string;
                    licenseType: string;
                    submittedAt: Date | null;
                    notes: string | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseNumber: string | null;
                    issueDate: Date | null;
                    expiryDate: Date | null;
                    renewalDueDate: Date | null;
                    approvedAt: Date | null;
                    assignedOwnerId: string | null;
                } | {
                    id: string;
                    status: import(".prisma/client").$Enums.LicenseStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    regulator: string;
                    licenseType: string;
                    submittedAt: Date | null;
                    notes: string | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseNumber: string | null;
                    issueDate: Date | null;
                    expiryDate: Date | null;
                    renewalDueDate: Date | null;
                    approvedAt: Date | null;
                    assignedOwnerId: string | null;
                })[] | ({
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    eventType: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                } | {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    eventType: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                })[] | ({
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                } | {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[] | ({
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client-runtime-utils").Decimal | null;
                    currency: string;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                } | {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client-runtime-utils").Decimal | null;
                    currency: string;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                })[] | ({
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    userId: string;
                    status: import(".prisma/client").$Enums.PilotAccessStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    expiresAt: Date;
                    revokedAt: Date | null;
                    entitlementProfile: string;
                    startsAt: Date;
                    extensionCount: number;
                    createdByAdminId: string | null;
                    lastExtendedByAdminId: string | null;
                    revokedByAdminId: string | null;
                    convertedAt: Date | null;
                    convertedPlan: string | null;
                } | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    userId: string;
                    status: import(".prisma/client").$Enums.PilotAccessStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    expiresAt: Date;
                    revokedAt: Date | null;
                    entitlementProfile: string;
                    startsAt: Date;
                    extensionCount: number;
                    createdByAdminId: string | null;
                    lastExtendedByAdminId: string | null;
                    revokedByAdminId: string | null;
                    convertedAt: Date | null;
                    convertedPlan: string | null;
                })[] | ({
                    id: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    readAt: Date | null;
                    alertId: string;
                    channel: string;
                    sentAt: Date | null;
                } | {
                    id: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    readAt: Date | null;
                    alertId: string;
                    channel: string;
                    sentAt: Date | null;
                })[] | ({
                    id: string;
                    title: string;
                    description: string | null;
                    userId: string;
                    status: import(".prisma/client").$Enums.GeneratedPolicyStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    organizationType: string | null;
                    executiveSummary: string | null;
                    targetAudience: string | null;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    isLatestVersion: boolean;
                    parentId: string | null;
                    version: number;
                    errorMessage: string | null;
                    progress: number;
                    completedAt: Date | null;
                    regulatoryFrameworks: string[];
                    ragGrounded: boolean;
                    jurisdiction: string;
                    reviewNotes: string | null;
                    policyType: string;
                    sourceGapAnalysisId: string | null;
                    sourceGapId: string | null;
                    tableOfContents: import("@prisma/client/runtime/client").JsonValue | null;
                    sections: import("@prisma/client/runtime/client").JsonValue | null;
                    lastExportedAt: Date | null;
                    lastExportFormat: string | null;
                } | {
                    id: string;
                    title: string;
                    description: string | null;
                    userId: string;
                    status: import(".prisma/client").$Enums.GeneratedPolicyStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    organizationType: string | null;
                    executiveSummary: string | null;
                    targetAudience: string | null;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    isLatestVersion: boolean;
                    parentId: string | null;
                    version: number;
                    errorMessage: string | null;
                    progress: number;
                    completedAt: Date | null;
                    regulatoryFrameworks: string[];
                    ragGrounded: boolean;
                    jurisdiction: string;
                    reviewNotes: string | null;
                    policyType: string;
                    sourceGapAnalysisId: string | null;
                    sourceGapId: string | null;
                    tableOfContents: import("@prisma/client/runtime/client").JsonValue | null;
                    sections: import("@prisma/client/runtime/client").JsonValue | null;
                    lastExportedAt: Date | null;
                    lastExportFormat: string | null;
                })[] | ({
                    type: string;
                    id: string;
                    userId: string | null;
                    status: string;
                    organizationId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    progress: number;
                    completedAt: Date | null;
                    priority: number;
                    idempotencyKey: string;
                    targetEntityType: string;
                    targetEntityId: string;
                    payload: import("@prisma/client/runtime/client").JsonValue;
                    attempts: number;
                    maxAttempts: number;
                    runAfter: Date;
                    lockedAt: Date | null;
                    lockedBy: string | null;
                    startedAt: Date | null;
                    failedAt: Date | null;
                    lastError: string | null;
                    deadLetteredAt: Date | null;
                } | {
                    type: string;
                    id: string;
                    userId: string | null;
                    status: string;
                    organizationId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    progress: number;
                    completedAt: Date | null;
                    priority: number;
                    idempotencyKey: string;
                    targetEntityType: string;
                    targetEntityId: string;
                    payload: import("@prisma/client/runtime/client").JsonValue;
                    attempts: number;
                    maxAttempts: number;
                    runAfter: Date;
                    lockedAt: Date | null;
                    lockedBy: string | null;
                    startedAt: Date | null;
                    failedAt: Date | null;
                    lastError: string | null;
                    deadLetteredAt: Date | null;
                })[] | ({
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
                } | {
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
                })[] | ({
                    id: string;
                    title: string;
                    description: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    category: import(".prisma/client").$Enums.ComplianceCategory;
                    completedAt: Date | null;
                    isCompleted: boolean;
                } | {
                    id: string;
                    title: string;
                    description: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    category: import(".prisma/client").$Enums.ComplianceCategory;
                    completedAt: Date | null;
                    isCompleted: boolean;
                })[] | ({
                    id: string;
                    organizationId: string;
                    overallScore: number;
                    dataProtectionScore: number;
                    amlKycScore: number;
                    consumerProtectionScore: number;
                    cbkLicensingScore: number;
                    cybersecurityScore: number;
                    calculatedAt: Date;
                } | {
                    id: string;
                    organizationId: string;
                    overallScore: number;
                    dataProtectionScore: number;
                    amlKycScore: number;
                    consumerProtectionScore: number;
                    cbkLicensingScore: number;
                    cybersecurityScore: number;
                    calculatedAt: Date;
                })[] | ({
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    category: string;
                    dueDate: Date;
                    completedAt: Date | null;
                    priority: string;
                    regulation: string | null;
                    recurrence: string | null;
                    assigneeId: string | null;
                    createdById: string;
                    sourceType: string | null;
                    sourceId: string | null;
                } | {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    category: string;
                    dueDate: Date;
                    completedAt: Date | null;
                    priority: string;
                    regulation: string | null;
                    recurrence: string | null;
                    assigneeId: string | null;
                    createdById: string;
                    sourceType: string | null;
                    sourceId: string | null;
                })[] | ({
                    id: string;
                    count: number;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    metric: import(".prisma/client").$Enums.BillingMetric;
                    periodStart: Date;
                    periodEnd: Date;
                } | {
                    id: string;
                    count: number;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    metric: import(".prisma/client").$Enums.BillingMetric;
                    periodStart: Date;
                    periodEnd: Date;
                })[] | ({
                    complianceQueries: number;
                    gapAnalyses: number;
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    periodStart: Date;
                    periodEnd: Date;
                    checklistGenerations: number;
                    apiCalls: number;
                    documentStorageMb: number;
                    policyGenerations: number;
                    planTier: string;
                    complianceQueryLimit: number;
                    checklistGenerationLimit: number;
                    apiCallLimit: number;
                    documentStorageMbLimit: number;
                    gapAnalysisLimit: number;
                    policyGenerationLimit: number;
                    syncedFromRedisAt: Date | null;
                } | {
                    complianceQueries: number;
                    gapAnalyses: number;
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    periodStart: Date;
                    periodEnd: Date;
                    checklistGenerations: number;
                    apiCalls: number;
                    documentStorageMb: number;
                    policyGenerations: number;
                    planTier: string;
                    complianceQueryLimit: number;
                    checklistGenerationLimit: number;
                    apiCallLimit: number;
                    documentStorageMbLimit: number;
                    gapAnalysisLimit: number;
                    policyGenerationLimit: number;
                    syncedFromRedisAt: Date | null;
                })[] | ({
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.PaymentStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    amount: number;
                    currency: string;
                    paidAt: Date | null;
                    orgId: string;
                    subscriptionId: string | null;
                    provider: import(".prisma/client").$Enums.PaymentProvider;
                    providerTransactionId: string | null;
                    paymentPurpose: import(".prisma/client").$Enums.PaymentPurpose | null;
                    invoiceNumber: string | null;
                    subscriptionPlan: string | null;
                    billingPeriodStart: Date | null;
                    billingPeriodEnd: Date | null;
                } | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.PaymentStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    amount: number;
                    currency: string;
                    paidAt: Date | null;
                    orgId: string;
                    subscriptionId: string | null;
                    provider: import(".prisma/client").$Enums.PaymentProvider;
                    providerTransactionId: string | null;
                    paymentPurpose: import(".prisma/client").$Enums.PaymentPurpose | null;
                    invoiceNumber: string | null;
                    subscriptionPlan: string | null;
                    billingPeriodStart: Date | null;
                    billingPeriodEnd: Date | null;
                })[] | ({
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.CustomFrameworkStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    version: number;
                    category: string | null;
                    publishedAt: Date | null;
                    slug: string;
                    regulator: string | null;
                    jurisdiction: string | null;
                    archivedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                } | {
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.CustomFrameworkStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    version: number;
                    category: string | null;
                    publishedAt: Date | null;
                    slug: string;
                    regulator: string | null;
                    jurisdiction: string | null;
                    archivedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                })[] | ({
                    id: string;
                    status: import(".prisma/client").$Enums.EnterpriseContractStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    notes: string | null;
                    currency: string | null;
                    startsAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    contractName: string | null;
                    contractNumber: string | null;
                    endsAt: Date | null;
                    renewalDate: Date | null;
                    billingCycle: string | null;
                    monthlyAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    annualAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    approvedByUserId: string | null;
                } | {
                    id: string;
                    status: import(".prisma/client").$Enums.EnterpriseContractStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    notes: string | null;
                    currency: string | null;
                    startsAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    contractName: string | null;
                    contractNumber: string | null;
                    endsAt: Date | null;
                    renewalDate: Date | null;
                    billingCycle: string | null;
                    monthlyAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    annualAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    approvedByUserId: string | null;
                })[] | ({
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    status: string;
                    organizationId: string;
                    generatedAt: Date;
                    priority: string;
                    subject: string;
                    reviewedBy: string | null;
                    reviewedAt: Date | null;
                    body: string;
                    agentRunId: string;
                    sourceFingerprint: string;
                    editedBody: string | null;
                    sourceSignalId: string;
                    triggerReason: string;
                    engagementContext: import("@prisma/client/runtime/client").JsonValue | null;
                } | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    status: string;
                    organizationId: string;
                    generatedAt: Date;
                    priority: string;
                    subject: string;
                    reviewedBy: string | null;
                    reviewedAt: Date | null;
                    body: string;
                    agentRunId: string;
                    sourceFingerprint: string;
                    editedBody: string | null;
                    sourceSignalId: string;
                    triggerReason: string;
                    engagementContext: import("@prisma/client/runtime/client").JsonValue | null;
                })[] | {
                    id: string;
                    email: string;
                    password: string | null;
                    phone: string | null;
                    supabaseAuthId: string | null;
                    fullName: string;
                    avatar: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    status: import(".prisma/client").$Enums.UserStatus;
                    accountStatus: string;
                    emailVerified: boolean;
                    emailVerifiedAt: Date | null;
                    emailVerificationToken: string | null;
                    emailVerificationExpiry: Date | null;
                    passwordResetToken: string | null;
                    passwordResetExpiry: Date | null;
                    mustChangePassword: boolean;
                    temporaryPasswordExpiresAt: Date | null;
                    temporaryPasswordIssuedAt: Date | null;
                    temporaryPasswordUsedAt: Date | null;
                    temporaryPasswordCreatedByAdminId: string | null;
                    temporaryPasswordDeliveryStatus: string | null;
                    temporaryPasswordVersion: number;
                    organizationId: string | null;
                    lastLoginAt: Date | null;
                    lastLoginIp: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    preferences: import("@prisma/client/runtime/client").JsonValue | null;
                    totpEnabled: boolean;
                    totpSecret: string | null;
                    freeTrialActivatedAt: Date | null;
                    freeTrialExpiresAt: Date | null;
                    freeTrialUsage: import("@prisma/client/runtime/client").JsonValue | null;
                    isPilot: boolean;
                    pilotCohort: string | null;
                    pilotStartedAt: Date | null;
                    pilotExpiresAt: Date | null;
                    pilotAccessStatus: string;
                    pilotFirstExtensionGrantedAt: Date | null;
                    pilotSecondExtensionGrantedAt: Date | null;
                    pilotExtensionCount: number;
                    pilotCreatedByAdminId: string | null;
                    pilotLastExtendedByAdminId: string | null;
                    postPilotTier: string;
                    pilotConvertedAt: Date | null;
                    deletionScheduledAt: Date | null;
                    deletionReason: string | null;
                    deletionFeedback: string | null;
                }[] | {
                    id: string;
                    title: string | null;
                    userId: string;
                    status: import(".prisma/client").$Enums.PolicyStatus;
                    organizationId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    organizationType: string | null;
                    scenario: string;
                    regulatoryAreas: string[];
                    urgency: string;
                    stakeholders: string[];
                    executiveSummary: string | null;
                    analysis: string | null;
                    recommendations: import("@prisma/client/runtime/client").JsonValue | null;
                    complianceChecklist: import("@prisma/client/runtime/client").JsonValue | null;
                    implementationTimeline: import("@prisma/client/runtime/client").JsonValue | null;
                    appendices: import("@prisma/client/runtime/client").JsonValue | null;
                    content: string | null;
                    specificRequirements: string | null;
                    targetAudience: string | null;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    isLatestVersion: boolean;
                    parentId: string | null;
                    generationTime: number | null;
                    version: number;
                    assignedTo: string | null;
                    reviewers: string[];
                }[] | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    title: string;
                    description: string | null;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    summary: import("@prisma/client/runtime/client").JsonValue | null;
                    progress: number;
                    dueDate: Date | null;
                    productType: string | null;
                    businessStage: string | null;
                    targetSegments: import("@prisma/client/runtime/client").JsonValue | null;
                    servicesOffered: import("@prisma/client/runtime/client").JsonValue | null;
                    additionalConcerns: string | null;
                    items: import("@prisma/client/runtime/client").JsonValue;
                    checklistData: import("@prisma/client/runtime/client").JsonValue | null;
                    itemProgress: import("@prisma/client/runtime/client").JsonValue | null;
                    completedItems: number;
                    totalItems: number;
                    generatedAt: Date | null;
                    completedAt: Date | null;
                }[] | {
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.VaultDocumentStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    verifiedAt: Date | null;
                    verifiedBy: string | null;
                    version: number;
                    fileSize: number;
                    category: import(".prisma/client").$Enums.DocumentCategory;
                    tags: string[];
                    notes: string | null;
                    fileName: string;
                    fileType: string;
                    storageKey: string;
                    contentHash: string | null;
                    expiryDate: Date | null;
                    fileExtension: string;
                    uploadedById: string;
                    isArchived: boolean;
                    r2Bucket: string | null;
                    encryptionKeyId: string | null;
                    uploadStatus: import(".prisma/client").$Enums.VaultDocumentUploadStatus | null;
                    retentionExpiresAt: Date | null;
                }[] | {
                    id: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    complianceQueryId: string;
                    notes: string | null;
                    runId: string;
                    question: string;
                    suggestedDocument: string | null;
                    statusChangedAt: Date | null;
                }[] | {
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.CorpusGapReportStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    documentType: import(".prisma/client").$Enums.CorpusGapDocumentType;
                    documentName: string;
                    jurisdiction: import(".prisma/client").$Enums.CorpusGapJurisdiction;
                    sourceUrl: string | null;
                    reportedByUserId: string;
                    issuingAuthority: string;
                    adminNotes: string | null;
                    resolvedAt: Date | null;
                }[] | {
                    id: string;
                    title: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    jurisdictionCode: string;
                    regulator: string;
                    licenseType: string;
                    progress: number;
                    referenceNumber: string | null;
                    nextAction: string | null;
                    dueDate: Date | null;
                    submittedAt: Date | null;
                    decidedAt: Date | null;
                }[] | {
                    id: string;
                    status: import(".prisma/client").$Enums.LicenseStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    regulator: string;
                    licenseType: string;
                    submittedAt: Date | null;
                    notes: string | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseNumber: string | null;
                    issueDate: Date | null;
                    expiryDate: Date | null;
                    renewalDueDate: Date | null;
                    approvedAt: Date | null;
                    assignedOwnerId: string | null;
                }[] | {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    eventType: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                }[] | {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                }[] | {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client-runtime-utils").Decimal | null;
                    currency: string;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                }[] | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    userId: string;
                    status: import(".prisma/client").$Enums.PilotAccessStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    expiresAt: Date;
                    revokedAt: Date | null;
                    entitlementProfile: string;
                    startsAt: Date;
                    extensionCount: number;
                    createdByAdminId: string | null;
                    lastExtendedByAdminId: string | null;
                    revokedByAdminId: string | null;
                    convertedAt: Date | null;
                    convertedPlan: string | null;
                }[] | {
                    id: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    readAt: Date | null;
                    alertId: string;
                    channel: string;
                    sentAt: Date | null;
                }[] | {
                    id: string;
                    title: string;
                    description: string | null;
                    userId: string;
                    status: import(".prisma/client").$Enums.GeneratedPolicyStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    organizationType: string | null;
                    executiveSummary: string | null;
                    targetAudience: string | null;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    isLatestVersion: boolean;
                    parentId: string | null;
                    version: number;
                    errorMessage: string | null;
                    progress: number;
                    completedAt: Date | null;
                    regulatoryFrameworks: string[];
                    ragGrounded: boolean;
                    jurisdiction: string;
                    reviewNotes: string | null;
                    policyType: string;
                    sourceGapAnalysisId: string | null;
                    sourceGapId: string | null;
                    tableOfContents: import("@prisma/client/runtime/client").JsonValue | null;
                    sections: import("@prisma/client/runtime/client").JsonValue | null;
                    lastExportedAt: Date | null;
                    lastExportFormat: string | null;
                }[] | {
                    type: string;
                    id: string;
                    userId: string | null;
                    status: string;
                    organizationId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    progress: number;
                    completedAt: Date | null;
                    priority: number;
                    idempotencyKey: string;
                    targetEntityType: string;
                    targetEntityId: string;
                    payload: import("@prisma/client/runtime/client").JsonValue;
                    attempts: number;
                    maxAttempts: number;
                    runAfter: Date;
                    lockedAt: Date | null;
                    lockedBy: string | null;
                    startedAt: Date | null;
                    failedAt: Date | null;
                    lastError: string | null;
                    deadLetteredAt: Date | null;
                }[] | {
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
                }[] | {
                    id: string;
                    title: string;
                    description: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    category: import(".prisma/client").$Enums.ComplianceCategory;
                    completedAt: Date | null;
                    isCompleted: boolean;
                }[] | {
                    id: string;
                    organizationId: string;
                    overallScore: number;
                    dataProtectionScore: number;
                    amlKycScore: number;
                    consumerProtectionScore: number;
                    cbkLicensingScore: number;
                    cybersecurityScore: number;
                    calculatedAt: Date;
                }[] | {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    category: string;
                    dueDate: Date;
                    completedAt: Date | null;
                    priority: string;
                    regulation: string | null;
                    recurrence: string | null;
                    assigneeId: string | null;
                    createdById: string;
                    sourceType: string | null;
                    sourceId: string | null;
                }[] | {
                    id: string;
                    count: number;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    metric: import(".prisma/client").$Enums.BillingMetric;
                    periodStart: Date;
                    periodEnd: Date;
                }[] | {
                    complianceQueries: number;
                    gapAnalyses: number;
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    periodStart: Date;
                    periodEnd: Date;
                    checklistGenerations: number;
                    apiCalls: number;
                    documentStorageMb: number;
                    policyGenerations: number;
                    planTier: string;
                    complianceQueryLimit: number;
                    checklistGenerationLimit: number;
                    apiCallLimit: number;
                    documentStorageMbLimit: number;
                    gapAnalysisLimit: number;
                    policyGenerationLimit: number;
                    syncedFromRedisAt: Date | null;
                }[] | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.PaymentStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    amount: number;
                    currency: string;
                    paidAt: Date | null;
                    orgId: string;
                    subscriptionId: string | null;
                    provider: import(".prisma/client").$Enums.PaymentProvider;
                    providerTransactionId: string | null;
                    paymentPurpose: import(".prisma/client").$Enums.PaymentPurpose | null;
                    invoiceNumber: string | null;
                    subscriptionPlan: string | null;
                    billingPeriodStart: Date | null;
                    billingPeriodEnd: Date | null;
                }[] | {
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.CustomFrameworkStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    version: number;
                    category: string | null;
                    publishedAt: Date | null;
                    slug: string;
                    regulator: string | null;
                    jurisdiction: string | null;
                    archivedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                }[] | {
                    id: string;
                    status: import(".prisma/client").$Enums.EnterpriseContractStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    notes: string | null;
                    currency: string | null;
                    startsAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    contractName: string | null;
                    contractNumber: string | null;
                    endsAt: Date | null;
                    renewalDate: Date | null;
                    billingCycle: string | null;
                    monthlyAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    annualAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    approvedByUserId: string | null;
                }[] | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    status: string;
                    organizationId: string;
                    generatedAt: Date;
                    priority: string;
                    subject: string;
                    reviewedBy: string | null;
                    reviewedAt: Date | null;
                    body: string;
                    agentRunId: string;
                    sourceFingerprint: string;
                    editedBody: string | null;
                    sourceSignalId: string;
                    triggerReason: string;
                    engagementContext: import("@prisma/client/runtime/client").JsonValue | null;
                }[];
                [x: number]: never;
                [x: symbol]: never;
            };
        };
        meta: object;
    }>;
    getActivityLog: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            limit?: number | undefined;
        } | undefined;
        output: {
            logs: {
                id: string;
                timestamp: Date;
                actor: {
                    id: string;
                    email: string;
                    name: string;
                } | null;
                action: string;
                target: string | null;
                targetId: string | null;
                result: string;
                metadata: import("@prisma/client/runtime/client").JsonValue;
            }[];
        };
        meta: object;
    }>;
    createInvitation: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
            role?: "ADMIN" | "MEMBER" | "VIEWER" | undefined;
            expiresInDays?: number | undefined;
        };
        output: {
            success: boolean;
            invitation: {
                id: any;
                email: any;
                organizationRole: any;
                expiresAt: any;
                createdAt: any;
            };
        };
        meta: object;
    }>;
    listPendingInvitations: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            invitations: {
                id: string;
                email: string;
                createdAt: Date;
                expiresAt: Date;
                organizationRole: import(".prisma/client").$Enums.MemberRole | null;
                invitedBy: string;
            }[];
        };
        meta: object;
    }>;
    revokeInvitation: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            invitationId: string;
        };
        output: {
            success: boolean;
            invitation: {
                id: string;
                email: string;
                revokedAt: Date | null;
            };
        };
        meta: object;
    }>;
    resendInvitation: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            invitationId: string;
            expiresInDays?: number | undefined;
        };
        output: {
            success: boolean;
            invitation: {
                id: string;
                email: string;
                expiresAt: Date;
                organizationRole: import(".prisma/client").$Enums.MemberRole | null;
            };
        };
        meta: object;
    }>;
    /**
     * Update the current user's organization settings
     *
     * @protected  -  organization OWNER/ADMIN only
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
            homeJurisdictionCode?: "KE" | "MW" | "RW" | undefined;
            homeJurisdictionReason?: string | undefined;
        };
        output: {
            id: string;
            name: string;
            registrationNumber: string | null;
            website: string | null;
            industry: string | null;
            homeJurisdictionCode: string | null;
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