/**
 * Root Application Router
 *
 * Combines all sub-routers into a single router.
 * This is the main entry point for all tRPC procedures.
 *
 * Routes:
 * - /trpc/auth.*         - Authentication (register, login, etc.)
 * - /trpc/user.*         - User management (profile, preferences, etc.)
 * - /trpc/organization.* - Organization CRUD
 * - /trpc/policy.*       - Policy CRUD + AI generation
 * - /trpc/compliance.*   - Compliance queries with RAG
 * - /trpc/document.*     - Document upload/download
 * - /trpc/admin.*        - Admin operations
 * - /trpc/notification.* - Notifications (list, mark-read, preferences)
 * - /trpc/analytics.*    - Analytics dashboards and reports
 * - /trpc/vault.*        - Organisation Document Vault (upload/download/manage compliance docs)
 * - /trpc/billing.*       - Plan, entitlements and usage data
 * - /trpc/usage.*         - Per-org monthly usage tracking, history and comparison
 * - /trpc/support.*       - User support ticket submission and tracking
 * - /trpc/adminSupport.*  - Admin ticket management (ADMIN role only)
 * - /trpc/pilot.*         - Pilot Programme dashboard (ADMIN role only)
 * - /trpc/checklist.*     - AI checklist generation, status polling, retry and progress tracking
 * - /trpc/complianceDashboard.* - Startup dashboard compliance score and category checklist data
 * - /trpc/gapAnalysis.*   - Policy gap analysis upload, polling and result retrieval
 * - /trpc/framework.*     - Regulatory framework library metadata
 * - /trpc/enterprisePolicy.* - Enterprise AI Policy Generator (ENTERPRISE tier only)
 * - /trpc/customFramework.*  - Org-scoped Enterprise custom frameworks
 * - /trpc/enterpriseContract.* - Admin Enterprise contract overrides
 */
export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("./context").Context;
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
    auth: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        register: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                password: string;
                name: string;
                role: "REGULATOR" | "STARTUP" | "ENTERPRISE";
                companyName?: string | undefined;
                organizationId?: string | undefined;
                phone?: string | undefined;
            };
            output: {
                success: boolean;
                userId: any;
                email: any;
                message: string;
            };
            meta: object;
        }>;
        login: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                password: string;
            };
            output: {
                accessToken: string;
                refreshToken: string;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    emailVerified: boolean;
                    mustChangePassword: boolean;
                    organization: {
                        type: string;
                        id: string;
                        name: string;
                    } | null;
                    createdAt: Date;
                };
            };
            meta: object;
        }>;
        logout: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        me: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                email: string;
                name: string;
                role: import("@prisma/client").$Enums.UserRole;
                phone: string | null;
                emailVerified: boolean;
                organization: {
                    type: string;
                    id: string;
                    name: string;
                    registrationNumber: string | null;
                } | null;
                preferences: any;
                createdAt: Date;
                lastLoginAt: Date | null;
                mustChangePassword: boolean;
            };
            meta: object;
        }>;
        changeTemporaryPassword: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                currentPassword: string;
                newPassword: string;
                confirmPassword: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        requestPasswordReset: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        resetPassword: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                token: string;
                newPassword: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        verifyEmail: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                token: string;
            };
            output: {
                success: boolean;
                message: string;
                requiresApproval: boolean;
            };
            meta: object;
        }>;
        resendVerification: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        confirmEmailCallback: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                accessToken: string;
            };
            output: {
                success: boolean;
                requiresApproval: boolean;
                alreadyVerified: boolean;
            };
            meta: object;
        }>;
        refreshToken: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                refreshToken: string;
            };
            output: never;
            meta: object;
        }>;
    }>>;
    user: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getProfile: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {};
            meta: object;
        }>;
        updateProfile: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name?: string | undefined;
                phone?: string | undefined;
            };
            output: {
                success: boolean;
                user: {
                    id: string;
                    email: string;
                    phone: string | null;
                    fullName: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    updatedAt: Date;
                };
            };
            meta: object;
        }>;
        changePassword: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                currentPassword: string;
                newPassword: string;
                confirmPassword: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        updatePreferences: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                preferences: Record<string, any>;
            };
            output: {
                success: boolean;
                preferences: Record<string, any>;
            };
            meta: object;
        }>;
        getSessions: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: any;
                device: any;
                ipAddress: any;
                createdAt: any;
                expiresAt: any;
                isCurrent: boolean;
            }[];
            meta: object;
        }>;
        revokeSession: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                sessionId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        revokeOtherSessions: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                success: boolean;
                sessionsRevoked: number;
            };
            meta: object;
        }>;
        revokeAllSessions: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                success: boolean;
                sessionsRevoked: number;
            };
            meta: object;
        }>;
        getTotpStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                enabled: boolean;
            };
            meta: object;
        }>;
        setupTotp: import("@trpc/server").TRPCMutationProcedure<{
            input: Record<string, never> | undefined;
            output: {
                secret: string;
                otpauth: string;
            };
            meta: object;
        }>;
        confirmTotpSetup: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                code: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        disableTotp: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                password: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        deleteAccount: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                confirmEmail: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        getNotificationPreferences: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                regulatoryUpdates: boolean;
                deadlineReminders: boolean;
                reportReady: boolean;
                supportResponses: boolean;
                paymentDueReminder: boolean;
                complianceQueryReady: boolean;
                policyDocumentReady: boolean;
                documentIngestionComplete: boolean;
                realTimeAlerts: boolean;
                inAppSoundsEnabled: any;
                emailDigestEnabled: boolean;
                digestFrequency: string;
            };
            meta: object;
        }>;
        getAvatarUploadUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contentType: "image/png" | "image/jpeg" | "image/webp";
                fileSize: number;
            };
            output: import("../../modules/user/avatar.service").AvatarUploadUrlResult;
            meta: object;
        }>;
        confirmAvatarUpload: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                publicUrl: string;
            };
            output: import("../../modules/user/avatar.service").AvatarUpdateResult;
            meta: object;
        }>;
        deleteAvatar: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: import("../../modules/user/avatar.service").AvatarUpdateResult;
            meta: object;
        }>;
        updateNotificationPreferences: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                regulatoryUpdates?: boolean | undefined;
                deadlineReminders?: boolean | undefined;
                reportReady?: boolean | undefined;
                supportResponses?: boolean | undefined;
                paymentDueReminder?: boolean | undefined;
                complianceQueryReady?: boolean | undefined;
                policyDocumentReady?: boolean | undefined;
                documentIngestionComplete?: boolean | undefined;
                realTimeAlerts?: boolean | undefined;
                inAppSoundsEnabled?: boolean | undefined;
                emailDigestEnabled?: boolean | undefined;
                digestFrequency?: "monthly" | "daily" | "weekly" | undefined;
            };
            output: {
                regulatoryUpdates: boolean;
                deadlineReminders: boolean;
                reportReady: boolean;
                supportResponses: boolean;
                paymentDueReminder: boolean;
                complianceQueryReady: boolean;
                policyDocumentReady: boolean;
                documentIngestionComplete: boolean;
                realTimeAlerts: boolean;
                inAppSoundsEnabled: any;
                emailDigestEnabled: boolean;
                digestFrequency: string;
            };
            meta: object;
        }>;
    }>>;
    organization: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
    policy: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                status?: "DRAFT" | "GENERATING" | "COMPLETED" | "FAILED" | undefined;
                regulatoryArea?: string | undefined;
                search?: string | undefined;
            };
            output: {
                policies: {
                    id: string;
                    title: string | null;
                    user: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                    status: import("@prisma/client").$Enums.PolicyStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    scenario: string;
                    regulatoryAreas: string[];
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
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {};
            meta: object;
        }>;
        generate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                scenario: string;
                organizationType: "OTHER" | "FINTECH" | "BANK" | "TELECOM" | "INSURANCE";
                regulatoryAreas: string[];
                title?: string | undefined;
                specificRequirements?: string | undefined;
                targetAudience?: string | undefined;
            };
            output: {
                policyId: any;
                jobId: string;
                status: string;
                message: string;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                title?: string | undefined;
                content?: string | undefined;
                status?: "DRAFT" | "GENERATING" | "COMPLETED" | "FAILED" | undefined;
                metadata?: Record<string, any> | undefined;
            };
            output: any;
            meta: object;
        }>;
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
        export: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                format?: "PDF" | "DOCX" | "MD" | undefined;
            };
            output: {
                downloadUrl: string;
                filename: string;
                fileSize: number;
                expiresAt: string;
            };
            meta: object;
        }>;
        refine: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                refinementInstructions: string;
            };
            output: {
                success: boolean;
                policyId: any;
                version: any;
                message: string;
            };
            meta: object;
        }>;
        verifyCitations: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: import("../../lib/ai/client").AICompletionResult;
            meta: object;
        }>;
        getStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                policyId: string;
            };
            output: {
                policyId: string;
                title: string | null;
                status: import("@prisma/client").$Enums.PolicyStatus;
                progress: number;
                isComplete: boolean;
                isFailed: boolean;
                errorMessage: any;
                generatedAt: any;
                tokensUsed: any;
                updatedAt: Date;
            };
            meta: object;
        }>;
        getVersionHistory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                policyId: string;
            };
            output: {
                policyId: string;
                rootId: string;
                versions: {
                    id: string;
                    title: string | null;
                    status: import("@prisma/client").$Enums.PolicyStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    isLatestVersion: boolean;
                    version: number;
                }[];
            };
            meta: object;
        }>;
    }>>;
    compliance: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        query: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                question: string;
                organizationType?: "OTHER" | "FINTECH" | "BANK" | "TELECOM" | "INSURANCE" | undefined;
                industry?: string | undefined;
                context?: string | undefined;
            };
            output: {
                queryId: any;
                answer: string;
                citations: {
                    documentId: string | null;
                    documentTitle: string;
                    section: string;
                    textSnippet: string;
                    score: number;
                    citation: string | null;
                    authorityStatus: string;
                    isBinding: boolean;
                    source: string | null;
                    version: string | null;
                    verified: boolean;
                    verificationStatus: "verified" | "unverified" | "not_checked";
                }[];
                confidence: number | null;
                suggestedFollowUps: never[];
                route: string;
                grounded: boolean;
                abstained: boolean;
                runId: string | null;
            } | {
                queryId: any;
                answer: string;
                citations: {
                    documentId: string | null;
                    documentTitle: string;
                    section: string;
                    textSnippet: string;
                    score: number;
                    citation: string | null;
                    authorityStatus: string;
                    isBinding: boolean;
                    source: string | null;
                    version: string | null;
                    verified: boolean;
                    verificationStatus: "verified" | "unverified" | "not_checked";
                }[];
                confidence: null;
                suggestedFollowUps: never[];
                route: string | null;
                grounded: boolean;
                abstained: boolean;
                runId: string | null;
            };
            meta: object;
        }>;
        followUp: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                originalQueryId: string;
                question: string;
            };
            output: {
                queryId: any;
                answer: string;
                citations: {
                    documentId: string | null;
                    documentTitle: string;
                    section: string;
                    textSnippet: string;
                    score: number;
                    citation: string | null;
                    authorityStatus: string;
                    isBinding: boolean;
                    source: string | null;
                    version: string | null;
                    verified: boolean;
                    verificationStatus: "verified" | "unverified" | "not_checked";
                }[];
            };
            meta: object;
        }>;
        search: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                query: string;
                limit?: number | undefined;
                filter?: {
                    documentType?: string | undefined;
                    regulatoryArea?: string | undefined;
                    dateFrom?: Date | undefined;
                    dateTo?: Date | undefined;
                } | undefined;
            };
            output: {
                results: {
                    text: any;
                    source: any;
                    section: any;
                    score: any;
                    documentId: any;
                    authorityStatus: any;
                    isBinding: any;
                    sourceAuthority: any;
                    version: any;
                }[];
                summary: {
                    query: string;
                    totalResults: number;
                    documentsFound: string[];
                    topSections: string[];
                    citations: string[];
                    avgScore: number;
                };
                totalResults: number;
            };
            meta: object;
        }>;
        history: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                queries: {
                    id: string;
                    query: string;
                    user: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
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
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                user: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                userId: string;
                query: string;
                status: string;
                organizationId: string | null;
                createdAt: Date;
                updatedAt: Date;
                regulatoryAreas: import("@prisma/client/runtime/client").JsonValue | null;
                recommendations: import("@prisma/client/runtime/client").JsonValue | null;
                confidence: number | null;
                summary: string | null;
                response: string | null;
                citations: import("@prisma/client/runtime/client").JsonValue | null;
                processingTimeMs: number | null;
                productCategory: string | null;
                regulations: import("@prisma/client/runtime/client").JsonValue | null;
                requirements: import("@prisma/client/runtime/client").JsonValue | null;
                gaps: import("@prisma/client/runtime/client").JsonValue | null;
            };
            meta: object;
        }>;
        getFollowUps: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                originalQueryId: string;
            };
            output: {
                followUps: any;
            };
            meta: object;
        }>;
        quickCheck: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                scenario: string;
                organizationType: "OTHER" | "FINTECH" | "BANK" | "TELECOM" | "INSURANCE";
            };
            output: import("../../lib/ai/client").AICompletionResult;
            meta: object;
        }>;
        getScore: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/compliance").ComplianceScore;
            meta: object;
        }>;
        getScoreHistory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                days?: number | undefined;
            };
            output: import("../../modules/compliance").ScoreHistory[];
            meta: object;
        }>;
        getRecommendations: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: string[];
            meta: object;
        }>;
        getRequirements: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                status?: string | undefined;
                area?: string | undefined;
            };
            output: {
                requirements: import("../../modules/compliance").Requirement[];
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
            meta: object;
        }>;
        updateRequirement: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                requirementId: string;
                status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "OVERDUE" | "WAIVED";
                notes?: string | undefined;
            };
            output: import("../../modules/compliance").Requirement;
            meta: object;
        }>;
        getDeadlines: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                daysAhead?: number | undefined;
            };
            output: import("../../modules/compliance").UpcomingDeadline[];
            meta: object;
        }>;
        getRoadmap: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/compliance").ComplianceRoadmap;
            meta: object;
        }>;
        getSuggestedQueries: import("@trpc/server").TRPCQueryProcedure<{
            input: Record<string, never>;
            output: {
                suggestions: {
                    id: string;
                    text: string;
                    reason: "industry" | "history" | "alert" | "cohort" | "curated";
                    relatedArea?: string;
                }[];
            };
            meta: object;
        }>;
        recordSuggestionClick: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                suggestionId: string;
                suggestionText?: string | undefined;
                surface?: "other" | "empty_state" | "sidebar" | "dashboard" | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        submitFeedback: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                queryId: string;
                rating: "down" | "up";
            };
            output: {
                rating: "down" | "up" | null;
                action: "created" | "updated" | "cleared";
                tracked: boolean;
            };
            meta: object;
        }>;
        getFeedbackStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                queryId: string;
            };
            output: {
                rating: "up" | "down" | null;
            };
            meta: object;
        }>;
        toggleSave: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                queryId: string;
                notes?: string | undefined;
            };
            output: {
                saved: boolean;
                savedAt: Date | null;
            };
            meta: object;
        }>;
        getSavedStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                queryId: string;
            };
            output: {
                saved: boolean;
                savedAt: Date | null;
                notes: string | null;
            };
            meta: object;
        }>;
        listSavedResponses: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                items: ({
                    query: {
                        id: string;
                        query: string;
                        createdAt: Date;
                        response: string | null;
                    };
                } & {
                    id: string;
                    userId: string;
                    createdAt: Date;
                    notes: string | null;
                    queryId: string;
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
        logExport: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                analysisId: string;
                format: "pdf" | "docx";
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        exportDocx: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                analysisId: string;
            };
            output: {
                downloadUrl: string;
                expiresAt: string;
                fileName: string;
            };
            meta: object;
        }>;
        exportChecklistDocx: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                checklistId: string;
            };
            output: {
                downloadUrl: string;
                expiresAt: string;
                fileName: string;
            };
            meta: object;
        }>;
        exportQueryDocx: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                queryId: string;
            };
            output: {
                downloadUrl: string;
                expiresAt: string;
                fileName: string;
            };
            meta: object;
        }>;
        reportGap: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                queryId: string;
                runId: string | null;
                suggestedDocument?: string | undefined;
                notes?: string | undefined;
            };
            output: {
                feedbackId: string;
            };
            meta: object;
        }>;
    }>>;
    document: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getUploadUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                filename: string;
                fileType: string;
                fileSize: number;
                documentType?: string | undefined;
            };
            output: {
                uploadUrl: string;
                key: string;
                documentId: `${string}-${string}-${string}-${string}-${string}`;
                expiresAt: string;
            };
            meta: object;
        }>;
        confirmUpload: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                key: string;
                filename: string;
                fileType: string;
                fileSize: number;
                documentType?: string | undefined;
                documentId?: string | undefined;
                description?: string | undefined;
                metadata?: Record<string, unknown> | undefined;
            };
            output: {
                documentId: string;
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                documentType?: string | undefined;
                search?: string | undefined;
            };
            output: {
                documents: {
                    id: string;
                    title: string | null;
                    createdAt: Date;
                    actName: string;
                    documentType: string;
                    regulatoryBody: string | null;
                    fileSize: number;
                    author: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
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
        listBenchmarkDocuments: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                search?: string | undefined;
            } | undefined;
            output: {
                documents: import("../services/benchmark-document.service").AuthorizedBenchmarkDocument[];
            };
            meta: object;
        }>;
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                author: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
            } & {
                id: string;
                title: string | null;
                userId: string | null;
                status: import("@prisma/client").$Enums.DocumentStatus;
                organizationId: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                content: string | null;
                isLatestVersion: boolean;
                parentId: string | null;
                version: number;
                actName: string;
                documentType: string;
                enactmentDate: Date | null;
                effectiveDate: Date | null;
                amendedBy: string[];
                regulatoryBody: string | null;
                originalFilename: string;
                fileUrl: string;
                fileSize: number;
                mimeType: string;
                totalChunks: number | null;
                processedAt: Date | null;
                fullText: string | null;
                summary: string | null;
                keywords: string[];
                authorId: string | null;
                category: string | null;
                contentStatus: import("@prisma/client").$Enums.ContentStatus;
                contentType: import("@prisma/client").$Enums.ContentType;
                excerpt: string | null;
                helpfulCount: number;
                htmlContent: string | null;
                notHelpfulCount: number;
                publishedAt: Date | null;
                publishedBy: string | null;
                seoDescription: string | null;
                seoKeywords: string[];
                seoTitle: string | null;
                slug: string | null;
                subcategory: string | null;
                tags: string[];
                viewCount: number;
            };
            meta: object;
        }>;
        getDownloadUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                downloadUrl: string;
                filename: string;
                expiresAt: string;
            };
            meta: object;
        }>;
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
        restore: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        getProcessingStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                documentId: string;
            };
            output: {
                documentId: string;
                status: import("@prisma/client").$Enums.DocumentStatus;
                totalChunks: number;
                processedChunks: number;
                processedAt: Date | null;
                isComplete: boolean;
                isFailed: boolean;
            };
            meta: object;
        }>;
        reingest: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                documentId: string;
            };
            output: {
                success: boolean;
                message: string;
                documentId: string;
            };
            meta: object;
        }>;
    }>>;
    content: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contentType: "BLOG_POST" | "KNOWLEDGE_BASE_ARTICLE" | "POLICY_TEMPLATE";
                title: string;
                content: string;
                slug?: string | undefined;
                excerpt?: string | undefined;
                category?: string | undefined;
                subcategory?: string | undefined;
                tags?: string[] | undefined;
                seoTitle?: string | undefined;
                seoDescription?: string | undefined;
                seoKeywords?: string[] | undefined;
                status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "UNDER_REVIEW" | undefined;
            };
            output: {
                id: string;
                slug: string | null;
                contentType: import("@prisma/client").$Enums.ContentType;
                contentStatus: import("@prisma/client").$Enums.ContentStatus;
                title: string | null;
                createdAt: Date;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                title?: string | undefined;
                slug?: string | undefined;
                excerpt?: string | undefined;
                content?: string | undefined;
                category?: string | undefined;
                subcategory?: string | undefined;
                tags?: string[] | undefined;
                seoTitle?: string | undefined;
                seoDescription?: string | undefined;
                seoKeywords?: string[] | undefined;
                status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "UNDER_REVIEW" | undefined;
            };
            output: {
                id: string;
                slug: string | null;
                contentStatus: import("@prisma/client").$Enums.ContentStatus;
                title: string | null;
                updatedAt: Date;
            };
            meta: object;
        }>;
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                contentType?: "REGULATORY_DOCUMENT" | "BLOG_POST" | "KNOWLEDGE_BASE_ARTICLE" | "POLICY_TEMPLATE" | undefined;
                status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "UNDER_REVIEW" | undefined;
                category?: string | undefined;
                tag?: string | undefined;
                search?: string | undefined;
                authorId?: string | undefined;
            };
            output: {
                items: {
                    id: string;
                    title: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    version: number;
                    authorId: string | null;
                    category: string | null;
                    contentStatus: import("@prisma/client").$Enums.ContentStatus;
                    contentType: import("@prisma/client").$Enums.ContentType;
                    excerpt: string | null;
                    helpfulCount: number;
                    publishedAt: Date | null;
                    slug: string | null;
                    subcategory: string | null;
                    tags: string[];
                    viewCount: number;
                    author: {
                        id: string;
                        fullName: string;
                        avatar: string | null;
                    } | null;
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
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                author: {
                    id: string;
                    fullName: string;
                    avatar: string | null;
                } | null;
                publisher: {
                    id: string;
                    fullName: string;
                } | null;
            } & {
                id: string;
                title: string | null;
                userId: string | null;
                status: import("@prisma/client").$Enums.DocumentStatus;
                organizationId: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                content: string | null;
                isLatestVersion: boolean;
                parentId: string | null;
                version: number;
                actName: string;
                documentType: string;
                enactmentDate: Date | null;
                effectiveDate: Date | null;
                amendedBy: string[];
                regulatoryBody: string | null;
                originalFilename: string;
                fileUrl: string;
                fileSize: number;
                mimeType: string;
                totalChunks: number | null;
                processedAt: Date | null;
                fullText: string | null;
                summary: string | null;
                keywords: string[];
                authorId: string | null;
                category: string | null;
                contentStatus: import("@prisma/client").$Enums.ContentStatus;
                contentType: import("@prisma/client").$Enums.ContentType;
                excerpt: string | null;
                helpfulCount: number;
                htmlContent: string | null;
                notHelpfulCount: number;
                publishedAt: Date | null;
                publishedBy: string | null;
                seoDescription: string | null;
                seoKeywords: string[];
                seoTitle: string | null;
                slug: string | null;
                subcategory: string | null;
                tags: string[];
                viewCount: number;
            };
            meta: object;
        }>;
        getBySlug: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                slug: string;
            };
            output: {
                id: string;
                contentType: import("@prisma/client").$Enums.ContentType;
                title: string | null;
                slug: string | null;
                excerpt: string | null;
                htmlContent: string | null;
                content: string | null;
                category: string | null;
                subcategory: string | null;
                tags: string[];
                seoTitle: string | null;
                seoDescription: string | null;
                seoKeywords: string[];
                publishedAt: Date | null;
                viewCount: number;
                helpfulCount: number;
                notHelpfulCount: number;
                author: {
                    id: string;
                    fullName: string;
                    avatar: string | null;
                } | null;
            };
            meta: object;
        }>;
        publish: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
                slug: string | null;
                contentStatus: import("@prisma/client").$Enums.ContentStatus;
                publishedAt: Date | null;
            };
            meta: object;
        }>;
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
        rate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                helpful: boolean;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
    }>>;
    admin: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                users: {
                    total: number;
                    active: number;
                };
                organizations: {
                    total: number;
                };
                policies: {
                    total: number;
                    completed: number;
                    generating: number;
                };
                queries: {
                    total: number;
                };
                documents: {
                    total: number;
                    storageUsed: number;
                };
                recentActivity: {
                    policies: any[];
                    queries: {
                        id: string;
                        query: string;
                        user: {
                            email: string;
                            fullName: string;
                        };
                        createdAt: Date;
                    }[];
                };
            };
            meta: object;
        }>;
        listUsers: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                role?: "REGULATOR" | "STARTUP" | "ENTERPRISE" | "ADMIN" | undefined;
                status?: "active" | "inactive" | undefined;
                search?: string | undefined;
            };
            output: {
                users: {
                    id: string;
                    email: string;
                    organization: {
                        id: string;
                        name: string;
                    } | null;
                    fullName: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    status: import("@prisma/client").$Enums.UserStatus;
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
        updateUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                role?: "REGULATOR" | "STARTUP" | "ENTERPRISE" | "ADMIN" | undefined;
                emailVerified?: boolean | undefined;
            };
            output: {
                id: string;
                email: string;
                fullName: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
            meta: object;
        }>;
        getSystemHealth: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: any;
            meta: object;
        }>;
        getLogs: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                userId?: string | undefined;
                action?: string | undefined;
                entityType?: string | undefined;
                dateFrom?: string | undefined;
                dateTo?: string | undefined;
            };
            output: import("../../modules/admin").PaginatedAuditLog;
            meta: object;
        }>;
        deleteUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        suspendUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                reason?: string | undefined;
            };
            output: import("../../modules/admin").AdminUserDetail;
            meta: object;
        }>;
        reactivateUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: import("../../modules/admin").AdminUserDetail;
            meta: object;
        }>;
        getAllOrganizations: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                search?: string | undefined;
                status?: string | undefined;
                tier?: string | undefined;
                sortBy?: "createdAt" | "name" | "organizationType" | "subscriptionTier" | "subscriptionStatus" | "memberCount" | undefined;
                sortOrder?: "asc" | "desc" | undefined;
            };
            output: import("../../modules/admin").PaginatedOrganizations;
            meta: object;
        }>;
        listOrganizations: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                name: string;
                plan: string;
                subscriptionTier: string;
            }[];
            meta: object;
        }>;
        listAIJobs: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "COMPLETED" | "QUEUED" | "RUNNING" | "DEAD_LETTERED" | "RETRYING" | undefined;
                type?: string | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                jobs: {
                    type: string;
                    id: string;
                    userId: string | null;
                    status: string;
                    organizationId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    progress: number;
                    completedAt: Date | null;
                    targetEntityType: string;
                    targetEntityId: string;
                    attempts: number;
                    maxAttempts: number;
                    runAfter: Date;
                    lockedAt: Date | null;
                    lockedBy: string | null;
                    startedAt: Date | null;
                    failedAt: Date | null;
                    lastError: string | null;
                    deadLetteredAt: Date | null;
                    events: {
                        type: string;
                        message: string | null;
                        createdAt: Date;
                        progress: number | null;
                    }[];
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
        getOrganizationStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/admin/admin.types").OrganizationStats;
            meta: object;
        }>;
        getOrgMembers: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                orgId: string;
            };
            output: {
                id: string;
                fullName: string;
                email: string;
                role: string;
                status: string;
                createdAt: Date;
            }[];
            meta: object;
        }>;
        getOrgDetails: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                orgId: string;
            };
            output: import("../../modules/admin").AdminOrgDetail;
            meta: object;
        }>;
        getOrgAuditLog: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                orgId: string;
            };
            output: import("../../modules/admin").AuditLogEntry[];
            meta: object;
        }>;
        suspendOrganization: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orgId: string;
                reason?: string | undefined;
            };
            output: import("../../modules/admin").AdminOrgDetail;
            meta: object;
        }>;
        reactivateOrganization: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orgId: string;
            };
            output: import("../../modules/admin").AdminOrgDetail;
            meta: object;
        }>;
        getSystemConfig: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/admin").SystemConfig;
            meta: object;
        }>;
        updateSystemConfig: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                config: Record<string, unknown>;
            };
            output: import("../../modules/admin").SystemConfig;
            meta: object;
        }>;
        getFeatureFlags: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/admin").FeatureFlags;
            meta: object;
        }>;
        updateFeatureFlag: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                flag: string;
                enabled: boolean;
            };
            output: import("../../modules/admin").FeatureFlags;
            meta: object;
        }>;
        setMaintenanceMode: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                enabled: boolean;
                message?: string | undefined;
            };
            output: import("../../modules/admin").MaintenanceStatus;
            meta: object;
        }>;
        getUser: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId: string;
            };
            output: import("../../modules/admin").AdminUserDetail;
            meta: object;
        }>;
        getUserActivityLog: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId: string;
            };
            output: import("../../modules/admin").AuditLogEntry[];
            meta: object;
        }>;
        getDetailedHealth: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                cache: import("../../modules/admin").CacheStats | null;
                storage: import("../../modules/admin").StorageStats | null;
                connections: import("../../modules/admin").ConnectionStats | null;
                status: "healthy" | "degraded" | "down";
                services: {
                    database: import("../../modules/admin").ServiceHealth;
                    redis: import("../../modules/admin").ServiceHealth;
                    pinecone: import("../../modules/admin").ServiceHealth;
                    storage: import("../../modules/admin").ServiceHealth;
                };
                uptime: number;
                version: string;
                checkedAt: Date;
            };
            meta: object;
        }>;
        createInvitation: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                role: "REGULATOR" | "STARTUP" | "ENTERPRISE";
                organizationId?: string | undefined;
                expiresInDays?: number | undefined;
            };
            output: {
                success: boolean;
                invitationId: string;
                email: string;
                role: string;
                expiresAt: Date;
            };
            meta: object;
        }>;
        listInvitations: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                used?: boolean | undefined;
                role?: "REGULATOR" | "STARTUP" | "ENTERPRISE" | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                items: {
                    id: string;
                    email: string;
                    role: string;
                    organizationId: string | null;
                    createdAt: Date;
                    expiresAt: Date;
                    used: boolean;
                    usedAt: Date | null;
                    invitedBy: string;
                }[];
                total: number;
                page: number;
                limit: number;
            };
            meta: object;
        }>;
        listPendingUsers: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                users: {
                    id: string;
                    email: string;
                    organization: {
                        id: string;
                        name: string;
                    } | null;
                    fullName: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    accountStatus: string;
                    emailVerified: boolean;
                    createdAt: Date;
                }[];
                total: number;
                page: number;
                limit: number;
            };
            meta: object;
        }>;
        approveUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        rejectUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                reason?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        listPendingOrganizations: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                orgs: {
                    type: string;
                    id: string;
                    createdAt: Date;
                    name: string;
                    organizationType: string;
                    registrationNumber: string | null;
                    cbkLicenseNumber: string | null;
                    verificationStatus: string;
                    users: {
                        id: string;
                        email: string;
                        fullName: string;
                        role: import("@prisma/client").$Enums.UserRole;
                    }[];
                }[];
                total: number;
                page: number;
                limit: number;
            };
            meta: object;
        }>;
        verifyOrganization: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orgId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        rejectOrganization: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orgId: string;
                reason?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getChecklistMetrics: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                window?: "alltime" | "today" | undefined;
            } | undefined;
            output: {
                alltime: import("../../lib/metrics/checklist-metrics").ChecklistMetricsStats;
                today: import("../../lib/metrics/checklist-metrics").ChecklistMetricsStats;
            };
            meta: object;
        }>;
        createUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                fullName: string;
                password: string;
                organizationId: unknown;
                organizationName: unknown;
                role?: "REGULATOR" | "STARTUP" | "ENTERPRISE" | "ADMIN" | undefined;
                subscriptionTier?: "REGULATOR" | "STARTUP" | "BUSINESS" | "ENTERPRISE" | undefined;
                isPilot?: boolean | undefined;
                sendWelcomeEmail?: boolean | undefined;
            };
            output: {
                id: string;
                email: string;
                fullName: string;
                phone: string | null;
                role: string;
                status: string;
                emailVerified: boolean;
                organizationId: string | null;
                organizationName: string | null;
                organizationPlan: string | null;
                lastLoginAt: Date | null;
                lastLoginIp: string | null;
                createdAt: Date;
                updatedAt: Date;
                sessionCount: number;
                policyCount: number;
                queryCount: number;
            };
            meta: object;
        }>;
        forcePasswordReset: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        updateUserRole: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                role: "REGULATOR" | "STARTUP" | "ENTERPRISE" | "ADMIN";
            };
            output: import("../../modules/admin").AdminUserDetail;
            meta: object;
        }>;
        impersonateUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: import("../../modules/admin").ImpersonationToken;
            meta: object;
        }>;
        updateOrganization: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orgId: string;
                name?: string | undefined;
                type?: string | undefined;
                registrationNumber?: string | undefined;
                website?: string | undefined;
                address?: string | undefined;
                contactPerson?: string | undefined;
                contactEmail?: string | undefined;
                contactPhone?: string | undefined;
                contactPosition?: string | undefined;
            };
            output: import("../../modules/admin").AdminOrgDetail;
            meta: object;
        }>;
        updateOrganizationPlan: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orgId: string;
                plan: "REGULATOR" | "STARTUP" | "BUSINESS" | "ENTERPRISE";
            };
            output: import("../../modules/admin").AdminOrgDetail;
            meta: object;
        }>;
        getUserGrowth: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                period?: "monthly" | "daily" | "weekly" | undefined;
                dateFrom?: string | undefined;
                dateTo?: string | undefined;
            };
            output: import("../../modules/admin/admin.types").UserGrowthData;
            meta: object;
        }>;
        getRevenueMetrics: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                dateFrom?: string | undefined;
                dateTo?: string | undefined;
            };
            output: import("../../modules/admin/admin.types").RevenueMetrics;
            meta: object;
        }>;
        getAIUsageMetrics: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                dateFrom?: string | undefined;
                dateTo?: string | undefined;
            };
            output: import("../../modules/admin/admin.types").AIUsageMetrics;
            meta: object;
        }>;
        getSubscriptionBreakdown: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                dateFrom?: string | undefined;
                dateTo?: string | undefined;
            };
            output: import("../../modules/admin/admin.types").SubscriptionBreakdown;
            meta: object;
        }>;
        getLoginHistory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId?: string | undefined;
                email?: string | undefined;
                success?: boolean | undefined;
                dateFrom?: string | undefined;
                dateTo?: string | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: import("../../modules/admin/admin.types").PaginatedLoginHistory;
            meta: object;
        }>;
        listContent: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                contentType: "BLOG_POST" | "KNOWLEDGE_BASE_ARTICLE";
                contentStatus?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "UNDER_REVIEW" | undefined;
                search?: string | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: import("../../modules/admin/admin.types").PaginatedContent;
            meta: object;
        }>;
        updateContentStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                documentId: string;
                contentStatus: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "UNDER_REVIEW";
            };
            output: import("../../modules/admin/admin.types").ContentItem;
            meta: object;
        }>;
        deleteContent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                documentId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        createContent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contentType: "BLOG_POST" | "KNOWLEDGE_BASE_ARTICLE";
                title: string;
                excerpt?: string | undefined;
                category?: string | undefined;
            };
            output: {
                id: string;
            };
            meta: object;
        }>;
        getSubscriptionOverview: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/admin").SubscriptionOverview;
            meta: object;
        }>;
        getBillingPlanCatalog: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/admin").BillingPlanCatalog;
            meta: object;
        }>;
        updateBillingPlanCatalog: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                plans: {
                    id: "STARTUP" | "BUSINESS";
                    price: {
                        monthly: number;
                        yearly: number | null;
                    };
                    trialDays: number;
                    stripe: {
                        monthlyPriceId: string;
                        yearlyPriceId: string | null;
                    };
                }[];
            };
            output: import("../../modules/admin").BillingPlanCatalog;
            meta: object;
        }>;
        getRecentPayments: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                limit?: number | undefined;
            };
            output: import("../../modules/admin/admin.types").PaymentSummary[];
            meta: object;
        }>;
        getOrgPaymentHistory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                orgId: string;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: import("../../modules/admin/admin.types").OrgPaymentHistory;
            meta: object;
        }>;
        listUserActiveSessions: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId: string;
            };
            output: import("../../modules/admin/admin.types").SessionSummary[];
            meta: object;
        }>;
        signOutUserEverywhere: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        bulkUpdateUserStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userIds: string[];
                status: "SUSPENDED" | "ACTIVE";
            };
            output: {
                success: boolean;
                count: number;
            };
            meta: object;
        }>;
        bulkUpdateUserTier: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userIds: string[];
                tier: "REGULATOR" | "STARTUP" | "BUSINESS" | "ENTERPRISE";
            };
            output: {
                success: boolean;
                count: number;
            };
            meta: object;
        }>;
        getFailedPayments: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                limit?: number | undefined;
                cursor?: string | undefined;
            };
            output: {
                items: {
                    id: string;
                    orgId: string;
                    orgName: string;
                    provider: string;
                    amount: number;
                    currency: string;
                    status: string;
                    invoiceNumber: string | null;
                    subscriptionPlan: string | null;
                    description: string | null;
                    metadata: Record<string, unknown> | null;
                    paidAt: Date | null;
                    createdAt: Date;
                }[];
                total: number;
                nextCursor: string | null;
            };
            meta: object;
        }>;
        exportAnalyticsCsv: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                dateFrom?: string | undefined;
            };
            output: {
                url: string;
                expiresAt: Date;
            };
            meta: object;
        }>;
        exportAuditLogs: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                format: "docx" | "csv";
                userId?: string | undefined;
                action?: string | undefined;
                entityType?: string | undefined;
                dateFrom?: string | undefined;
                dateTo?: string | undefined;
            };
            output: {
                url: string;
                expiresAt: Date;
            };
            meta: object;
        }>;
    }>>;
    notification: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                unreadOnly?: boolean | undefined;
                type?: string | undefined;
                category?: "SECURITY" | "COMPLIANCE" | "DOCUMENTS" | "ACCOUNT" | "SUPPORT" | "SYSTEM" | undefined;
            };
            output: import("../../modules/notification").PaginatedNotifications;
            meta: object;
        }>;
        getUnreadCount: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                count: number;
            };
            meta: object;
        }>;
        markAsRead: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                notificationId: string;
            };
            output: import("../../modules/notification").NotificationDTO;
            meta: object;
        }>;
        markAllAsRead: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                count: number;
                success: boolean;
            };
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                notificationId: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        deleteAllRead: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                count: number;
                success: boolean;
            };
            meta: object;
        }>;
        getPreferences: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/notification").NotificationPreferences;
            meta: object;
        }>;
        updatePreferences: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                emailEnabled?: boolean | undefined;
                inAppEnabled?: boolean | undefined;
                digestEnabled?: boolean | undefined;
                digestFrequency?: "monthly" | "daily" | "weekly" | undefined;
                channels?: Record<string, {
                    email?: boolean | undefined;
                    inApp?: boolean | undefined;
                }> | undefined;
            };
            output: import("../../modules/notification").NotificationPreferences;
            meta: object;
        }>;
        unreadCountByCategory: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: Record<import("../../modules/notification/notification.types").NotificationCategoryName, number>;
            meta: object;
        }>;
        getCategoryPreferences: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/notification/notification.types").NotificationCategoryPreferenceDTO[];
            meta: object;
        }>;
        updateCategoryPreference: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                category: "SECURITY" | "COMPLIANCE" | "DOCUMENTS" | "ACCOUNT" | "SUPPORT" | "SYSTEM";
                inAppEnabled?: boolean | undefined;
                emailEnabled?: boolean | undefined;
            };
            output: import("../../modules/notification/notification.types").NotificationCategoryPreferenceDTO;
            meta: object;
        }>;
        getSystemNotifications: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                unreadOnly?: boolean | undefined;
                type?: string | undefined;
                category?: "SECURITY" | "COMPLIANCE" | "DOCUMENTS" | "ACCOUNT" | "SUPPORT" | "SYSTEM" | undefined;
            };
            output: import("../../modules/notification").PaginatedNotifications;
            meta: object;
        }>;
    }>>;
    analytics: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getUserSummary: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                dateRange?: {
                    from?: string | undefined;
                    to?: string | undefined;
                    days?: number | undefined;
                } | undefined;
            };
            output: import("../../modules/analytics").UserActivitySummary;
            meta: object;
        }>;
        getOrgDashboard: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                orgId?: string | undefined;
                dateRange?: {
                    from?: string | undefined;
                    to?: string | undefined;
                    days?: number | undefined;
                } | undefined;
            };
            output: import("../../modules/analytics").OrgDashboard;
            meta: object;
        }>;
        getOrgComplianceScore: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/analytics").ComplianceScoreReport;
            meta: object;
        }>;
        getComplianceTrends: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                orgId?: string | undefined;
                periods?: number | undefined;
            };
            output: import("../../modules/analytics").ComplianceTrend[];
            meta: object;
        }>;
        getGapAnalysis: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/analytics").GapAnalysis;
            meta: object;
        }>;
        getDeadlineAlerts: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/analytics").DeadlineAlert[];
            meta: object;
        }>;
        getDocumentStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/analytics").DocumentStats;
            meta: object;
        }>;
        generateReport: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orgId?: string | undefined;
                reportType?: "compliance" | "audit" | "executive" | undefined;
                dateRange?: {
                    from?: string | undefined;
                    to?: string | undefined;
                    days?: number | undefined;
                } | undefined;
                includeDetails?: boolean | undefined;
            };
            output: import("../../modules/analytics").GeneratedReport;
            meta: object;
        }>;
        exportData: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                format?: "csv" | "json" | undefined;
                type?: "policies" | "users" | "documents" | "audit" | "queries" | undefined;
                dateRange?: {
                    from?: string | undefined;
                    to?: string | undefined;
                    days?: number | undefined;
                } | undefined;
                orgId?: string | undefined;
            };
            output: import("../../modules/analytics").ExportResult;
            meta: object;
        }>;
        getPlatformOverview: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                dateRange?: {
                    from?: string | undefined;
                    to?: string | undefined;
                    days?: number | undefined;
                } | undefined;
            };
            output: import("../../modules/analytics").PlatformOverview;
            meta: object;
        }>;
        getUserGrowth: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                dateRange?: {
                    from?: string | undefined;
                    to?: string | undefined;
                    days?: number | undefined;
                } | undefined;
            };
            output: import("../../modules/analytics").GrowthMetrics;
            meta: object;
        }>;
        getOrgGrowth: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                dateRange?: {
                    from?: string | undefined;
                    to?: string | undefined;
                    days?: number | undefined;
                } | undefined;
            };
            output: import("../../modules/analytics").GrowthMetrics;
            meta: object;
        }>;
        getDailyActiveUsers: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                range?: "last7d" | "last30d" | "last90d" | undefined;
            };
            output: {
                today: number;
                series: Array<{
                    date: string;
                    dau: number;
                }>;
            };
            meta: object;
        }>;
        getQueriesPerUser: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId: string;
                range?: "alltime" | "last7d" | "last30d" | undefined;
            };
            output: {
                total: number;
                last30d: number;
                last7d: number;
                byStatus: {
                    completed: number;
                    processing: number;
                    failed: number;
                };
                lastQueryAt: string | null;
            };
            meta: object;
        }>;
        getFeedbackSummary: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                range?: "last7d" | "last30d" | "last90d" | undefined;
                page?: number | undefined;
                pageSize?: number | undefined;
            };
            output: {
                aggregate: {
                    totalVotes: number;
                    upVotes: number;
                    downVotes: number;
                    upPct: number;
                };
                rows: Array<{
                    queryId: string;
                    userId: string;
                    userEmail: string;
                    orgName: string | null;
                    rating: "up" | "down";
                    createdAt: string;
                }>;
                pagination: {
                    page: number;
                    pageSize: number;
                    totalRows: number;
                    totalPages: number;
                };
            };
            meta: object;
        }>;
        getWorkflowEventSummary: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                days?: number | undefined;
                page?: number | undefined;
                pageSize?: number | undefined;
            };
            output: {
                aggregate: {
                    [k: string]: number;
                };
                rows: {
                    id: string;
                    action: string;
                    entityType: string | null;
                    entityId: string | null;
                    metadata: import("@prisma/client/runtime/client").JsonValue;
                    createdAt: Date;
                    userEmail: string | null;
                    userName: string | null;
                }[];
                pagination: {
                    page: number;
                    pageSize: number;
                    totalRows: number;
                    totalPages: number;
                };
            };
            meta: object;
        }>;
    }>>;
    vault: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getUploadLimits: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                maxFileSizeMB: number;
                maxTotalStorageMB: number;
                allowedMimeTypes: readonly string[];
                storageUsedMB: number;
            };
            meta: object;
        }>;
        getUploadUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                declaredFilename: string;
                declaredMimeType: "application/pdf" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "application/vnd.openxmlformats-officedocument.presentationml.presentation" | "application/msword" | "application/vnd.ms-excel" | "application/vnd.ms-powerpoint" | "text/plain" | "text/csv" | "image/png" | "image/jpeg" | "image/webp";
                declaredSize: number;
                category: "COMPLIANCE" | "OTHER" | "CORPORATE" | "FINANCIAL" | "LICENSE" | "OPERATIONS" | "TAX";
                description?: string | undefined;
                expiryDate?: string | undefined;
                tags?: string[] | undefined;
            };
            output: import("../../modules/vault/vault.types").GenerateUploadUrlResult;
            meta: object;
        }>;
        confirmUpload: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                documentId: string;
            };
            output: import("../../modules/vault").VaultDocumentListItem;
            meta: object;
        }>;
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                category?: "COMPLIANCE" | "OTHER" | "CORPORATE" | "FINANCIAL" | "LICENSE" | "OPERATIONS" | "TAX" | undefined;
                status?: "EXPIRED" | "PENDING" | "VERIFIED" | undefined;
                search?: string | undefined;
                sortBy?: "createdAt" | "name" | "fileSize" | "expiryDate" | undefined;
                sortOrder?: "asc" | "desc" | undefined;
            };
            output: import("../../modules/vault").VaultDocumentListResult;
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: import("../../modules/vault").VaultDocumentListItem;
            meta: object;
        }>;
        getDownloadUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                downloadUrl: string;
                filename: string;
                expiresAt: string;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                name?: string | undefined;
                description?: string | null | undefined;
                category?: "COMPLIANCE" | "OTHER" | "CORPORATE" | "FINANCIAL" | "LICENSE" | "OPERATIONS" | "TAX" | undefined;
                expiryDate?: string | null | undefined;
                tags?: string[] | undefined;
                notes?: string | null | undefined;
            };
            output: import("../../modules/vault").VaultDocumentListItem;
            meta: object;
        }>;
        updateStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                status: "EXPIRED" | "PENDING" | "VERIFIED";
            };
            output: import("../../modules/vault").VaultDocumentListItem;
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/vault").VaultDocumentStats;
            meta: object;
        }>;
        getReplaceUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                filename: string;
                fileType: "application/pdf" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "application/vnd.openxmlformats-officedocument.presentationml.presentation" | "application/msword" | "application/vnd.ms-excel" | "application/vnd.ms-powerpoint" | "text/plain" | "text/csv" | "image/png" | "image/jpeg" | "image/webp";
                fileSize: number;
            };
            output: import("../../modules/vault/vault.types").GenerateUploadUrlResult & {
                currentVersion: number;
                storageKey: string;
            };
            meta: object;
        }>;
        confirmReplace: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                documentId: string;
                storageKey: string;
                fileName: string;
                fileType: string;
                fileExtension: string;
                fileSize: number;
            };
            output: import("../../modules/vault").VaultDocumentListItem;
            meta: object;
        }>;
    }>>;
    billing: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getPlanAndUsage: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                plan: import("../../types/plan.types").EffectivePlan;
                entitlements: import("../../config").PlanEntitlementConfig;
                usage: {
                    complianceQueries: {
                        current: number;
                        limit: number;
                    };
                    checklistGenerations: {
                        current: number;
                        limit: number;
                    };
                    apiCalls: {
                        current: number;
                        limit: number;
                    };
                    documentStorageMB: {
                        current: number;
                        limit: number;
                    };
                };
                billing: {
                    planStartDate: string | null;
                    planEndDate: string | null;
                    stripeCustomerId: string | null;
                    subscriptionStatus: import("@prisma/client").$Enums.SubscriptionStatus | null;
                    trialEndsAt: string | null;
                    gracePeriodEndsAt: string | null;
                    cancelledAt: string | null;
                    subscriptionEndsAt: string | null;
                    preferredPaymentMethod: import("@prisma/client").$Enums.PaymentProvider | null;
                    mpesaNextPaymentDueDate: string | null;
                    subscriptionCycleEnd: string | null;
                    catalogPrice: Record<"STARTUP" | "BUSINESS", {
                        monthly: number;
                        yearly: number;
                        currency: "KES";
                    }>;
                };
                trial: import("../../modules/trial").TrialStatus | null;
                effectivePlanSource: import("../../types/plan.types").EffectivePlanSource;
                appliedOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[];
                pilot: {
                    isPilot: boolean;
                    pilotStatus: "ACTIVE" | "EXPIRED" | "REVOKED" | "CONVERTED";
                    pilotExpiresAt: string | null;
                    pilotExtensionCount: number;
                    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile;
                } | {
                    isPilot: boolean;
                    pilotStatus: null;
                    pilotExpiresAt: null;
                    pilotExtensionCount: number;
                    entitlementProfile: null;
                };
            };
            meta: object;
        }>;
        getPlanCatalog: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/admin").BillingPlanCatalog;
            meta: object;
        }>;
        createCheckoutSession: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                plan: "STARTUP" | "BUSINESS";
                interval?: "monthly" | "yearly" | undefined;
            };
            output: {
                url: string | null;
            };
            meta: object;
        }>;
        createPortalSession: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                url: string;
            };
            meta: object;
        }>;
        requestEnterprise: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                email: string;
                message?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        updatePaymentMethod: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                provider: "STRIPE" | "MPESA";
                mpesaPhoneNumber?: string | undefined;
            };
            output: {
                preferredPaymentMethod: import("@prisma/client").$Enums.PaymentProvider | null;
                mpesaPhoneNumber: string | null;
            };
            meta: object;
        }>;
        initiateMpesaPayment: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                plan: "REGULATOR" | "STARTUP" | "BUSINESS" | "ENTERPRISE";
                phoneNumber?: string | undefined;
            };
            output: {
                paymentId: string;
                trackingId?: undefined;
                message?: undefined;
            } | {
                paymentId: string;
                trackingId: string;
                message: string;
            };
            meta: object;
        }>;
        getMpesaPaymentStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                paymentId: string;
            };
            output: {
                paymentId: string;
                status: import("@prisma/client").$Enums.PaymentStatus;
                updatedAt: string;
            };
            meta: object;
        }>;
    }>>;
    payment: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                payments: {
                    id: string;
                    provider: import("@prisma/client").$Enums.PaymentProvider;
                    providerTransactionId: string | null;
                    amount: number;
                    currency: string;
                    status: import("@prisma/client").$Enums.PaymentStatus;
                    description: string | null;
                    paidAt: string | null;
                    createdAt: string;
                    metadata: Record<string, unknown> | null;
                }[];
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
                provider: import("@prisma/client").$Enums.PaymentProvider;
                providerTransactionId: string | null;
                amount: number;
                currency: string;
                status: import("@prisma/client").$Enums.PaymentStatus;
                description: string | null;
                paidAt: string | null;
                createdAt: string;
                metadata: Record<string, unknown> | null;
            };
            meta: object;
        }>;
        getDetail: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                paymentId: string;
            };
            output: {
                id: string;
                invoiceNumber: string | null;
                amount: number;
                currency: string;
                status: import("@prisma/client").$Enums.PaymentStatus;
                provider: import("@prisma/client").$Enums.PaymentProvider;
                subscriptionPlan: string | null;
                billingPeriodStart: string | null;
                billingPeriodEnd: string | null;
                providerTransactionId: string | null;
                description: string | null;
                paidAt: string | null;
                createdAt: string;
                metadata: Record<string, unknown> | null;
                paymentMethodDisplay: string;
                organization: {
                    name: string;
                    address: string | null;
                    contactEmail: string | null;
                };
                user: {
                    email: string;
                    fullName: string | null;
                };
            };
            meta: object;
        }>;
    }>>;
    support: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                subject: string;
                description: string;
                category: "ACCOUNT" | "BILLING" | "TECHNICAL" | "COMPLIANCE_QUERY" | "FEATURE_REQUEST" | "OTHER";
                priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
            };
            output: any;
            meta: object;
        }>;
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED" | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                tickets: any;
                total: any;
                page: number;
                limit: number;
                totalPages: number;
            };
            meta: object;
        }>;
        getByTicketNumber: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                ticketNumber: string;
            };
            output: any;
            meta: object;
        }>;
        addComment: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                ticketId: string;
                message: string;
            };
            output: any;
            meta: object;
        }>;
    }>>;
    adminSupport: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED" | undefined;
                priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
                category?: "ACCOUNT" | "BILLING" | "TECHNICAL" | "COMPLIANCE_QUERY" | "FEATURE_REQUEST" | "OTHER" | undefined;
                search?: string | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                tickets: any;
                total: any;
                page: number;
                limit: number;
                totalPages: number;
            };
            meta: object;
        }>;
        getByTicketNumber: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                ticketNumber: string;
            };
            output: any;
            meta: object;
        }>;
        updateStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                ticketId: string;
                status: "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED";
            };
            output: any;
            meta: object;
        }>;
        addResponse: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                ticketId: string;
                message: string;
                updateStatusTo?: "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED" | undefined;
            };
            output: any;
            meta: object;
        }>;
        stats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                open: any;
                inProgress: any;
                awaitingUser: any;
                resolved: any;
                closed: any;
                urgent: any;
            };
            meta: object;
        }>;
    }>>;
    calendar: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                title: string;
                dueDate: string;
                description?: string | undefined;
                priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                category?: "CUSTOM" | "FILING" | "AUDIT" | "RENEWAL" | "REVIEW" | "REGULATORY_DEADLINE" | "DOCUMENT_EXPIRY" | "COMPLIANCE_TASK" | undefined;
                regulation?: string | undefined;
                recurrence?: "NONE" | "MONTHLY" | "QUARTERLY" | "ANNUALLY" | undefined;
                assigneeId?: string | undefined;
            };
            output: import("../../modules/calendar").CalendarEventRecord;
            meta: object;
        }>;
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                month?: number | undefined;
                year?: number | undefined;
                status?: "COMPLETED" | "IN_PROGRESS" | "OVERDUE" | "UPCOMING" | undefined;
                priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
            };
            output: import("../../modules/calendar").CalendarEventRecord[];
            meta: object;
        }>;
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: import("../../modules/calendar").CalendarEventRecord;
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                title?: string | undefined;
                description?: string | undefined;
                dueDate?: string | undefined;
                priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                status?: "COMPLETED" | "IN_PROGRESS" | "OVERDUE" | "UPCOMING" | undefined;
                category?: "CUSTOM" | "FILING" | "AUDIT" | "RENEWAL" | "REVIEW" | "REGULATORY_DEADLINE" | "DOCUMENT_EXPIRY" | "COMPLIANCE_TASK" | undefined;
                regulation?: string | undefined;
                recurrence?: "NONE" | "MONTHLY" | "QUARTERLY" | "ANNUALLY" | undefined;
                assigneeId?: string | undefined;
            };
            output: import("../../modules/calendar").CalendarEventRecord;
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
            };
            meta: object;
        }>;
        upcoming: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                daysAhead?: number | undefined;
            };
            output: import("../../modules/calendar").CalendarEventRecord[];
            meta: object;
        }>;
    }>>;
    usage: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        current: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                period: {
                    start: Date;
                    end: Date;
                    daysRemaining: number;
                    daysTotal: number;
                };
                planTier: string;
                categories: {
                    key: string;
                    label: string;
                    current: number;
                    limit: number;
                    available: boolean;
                    percentUsed: number;
                }[];
            };
            meta: object;
        }>;
        history: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                months?: number | undefined;
            };
            output: {
                periodId: string;
                periodStart: Date;
                periodEnd: Date;
                planTier: string;
                categories: {
                    key: string;
                    label: string;
                    current: number;
                    limit: number;
                    available: boolean;
                    percentUsed: number;
                }[];
            }[];
            meta: object;
        }>;
        compare: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                comparePeriodStart: string;
            };
            output: {
                current: {
                    periodId: string;
                    periodStart: Date;
                    periodEnd: Date;
                    planTier: string;
                    categories: {
                        key: string;
                        label: string;
                        current: number;
                        limit: number;
                        available: boolean;
                        percentUsed: number;
                    }[];
                };
                previous: {
                    periodId: string;
                    periodStart: Date;
                    periodEnd: Date;
                    planTier: string;
                    categories: {
                        key: string;
                        label: string;
                        current: number;
                        limit: number;
                        available: boolean;
                        percentUsed: number;
                    }[];
                };
                changes: {
                    key: string;
                    label: string;
                    currentCount: number;
                    previousCount: number;
                    changePercent: number;
                    direction: "down" | "up" | "same";
                }[];
            };
            meta: object;
        }>;
        periodDetail: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                periodId: string;
            };
            output: {
                periodId: string;
                periodStart: Date;
                periodEnd: Date;
                planTier: string;
                categories: {
                    key: string;
                    label: string;
                    current: number;
                    limit: number;
                    available: boolean;
                    percentUsed: number;
                }[];
            };
            meta: object;
        }>;
    }>>;
    trial: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        activate: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: import("../../modules/trial").TrialStatus;
            meta: object;
        }>;
        status: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/trial").TrialStatus;
            meta: object;
        }>;
    }>>;
    session: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        heartbeat: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                ok: true;
            };
            meta: object;
        }>;
    }>>;
    pilot: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        createPilotTester: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                fullName: string;
                email: string;
                organizationId: unknown;
                organizationName: unknown;
                role?: "STARTUP" | "ENTERPRISE" | undefined;
                phone?: string | undefined;
                temporaryPassword?: string | undefined;
                pilotDurationDays?: number | undefined;
            };
            output: {
                success: boolean;
                userId: string;
                organizationId: string | null;
                temporaryPasswordExpiresAt: string;
                pilotAccessExpiresAt: string;
                emailDeliveryStatus: "FAILED" | "SENT";
            };
            meta: object;
        }>;
        reissueTemporaryPassword: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: {
                success: boolean;
                temporaryPasswordExpiresAt: string;
                emailDeliveryStatus: "FAILED" | "SENT";
            };
            meta: object;
        }>;
        extendPilotAccess: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                extensionDays: number;
                reason?: string | undefined;
            };
            output: {
                success: boolean;
                pilotAccessExpiresAt: string;
                pilotExtensionCount: any;
            };
            meta: object;
        }>;
        revokePilotAccess: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                reason?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                total: number;
                active: number;
                expired: number;
                converted: number;
                totalEvents: number;
                cohorts: string[];
            };
            meta: object;
        }>;
        listTesters: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                email: string;
                fullName: string;
                organization: string | null;
                cohort: string | null;
                pilotStartedAt: string | null;
                pilotExpiresAt: string | null;
                pilotConvertedAt: string | null;
                pilotAccessStatus: any;
                pilotExtensionCount: any;
                pilotFirstExtensionGrantedAt: any;
                pilotSecondExtensionGrantedAt: any;
                status: string;
                daysRemaining: number;
                daysSinceStart: number;
                engagementScore: number;
                engagementPercent: number;
                totalEvents: number;
                lastEventAt: string;
                eventsByAction: Record<string, number>;
            }[];
            meta: object;
        }>;
    }>>;
    checklist: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        generateChecklist: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                productType: string;
                businessStage: string;
                targetSegments: string[];
                servicesOffered: string[];
                additionalConcerns?: string | undefined;
            };
            output: {
                id: string;
                title: string;
                status: string;
                checklistData: import("../../lib/ai/prompts/checklist-generation").GeneratedChecklist;
                itemProgress: Record<string, string>;
                progress: number;
                createdAt: Date;
            };
            meta: object;
        }>;
        getUserChecklists: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                title: string;
                productType: string | null;
                businessStage: string | null;
                targetSegments: unknown;
                servicesOffered: unknown;
                additionalConcerns: string | null;
                progress: number;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                totalItems: number;
                criticalItems: number;
            }[];
            meta: object;
        }>;
        getChecklist: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
                title: string;
                productType: string | null;
                businessStage: string | null;
                targetSegments: unknown;
                servicesOffered: unknown;
                additionalConcerns: string | null;
                checklistData: import("../../lib/ai/prompts/checklist-generation").GeneratedChecklist | null;
                itemProgress: Record<string, string>;
                progress: number;
                status: string;
                createdAt: Date;
                updatedAt: Date;
            };
            meta: object;
        }>;
        updateChecklistProgress: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                checklistId: string;
                itemProgress: Record<string, "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED">;
            };
            output: {
                progress: number;
                itemProgress: Record<string, string>;
            };
            meta: object;
        }>;
        deleteChecklist: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        generateChecklistAsync: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                productType: string;
                businessStage: string;
                targetSegments: string[];
                servicesOffered: string[];
                additionalConcerns?: string | undefined;
            };
            output: import("../../modules/compliance/checklist.types").ChecklistGenerateResult;
            meta: object;
        }>;
        getChecklistStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                checklistId: string;
            };
            output: import("../../modules/compliance/checklist.types").ChecklistStatusResult;
            meta: object;
        }>;
        listChecklists: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/compliance/checklist.types").ChecklistSummary[];
            meta: object;
        }>;
        getChecklistDetail: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                checklistId: string;
            };
            output: import("../../modules/compliance/checklist.types").ChecklistDetail;
            meta: object;
        }>;
        updateChecklistItem: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                checklistId: string;
                itemId: string;
                status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "NOT_APPLICABLE";
                notes?: string | undefined;
            };
            output: import("../../modules/compliance/checklist.types").UpdateItemResult;
            meta: object;
        }>;
        getChecklistUsage: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                used: number;
                limit: number;
                period: "month" | "lifetime";
                planName: import("../../types/plan.types").EffectivePlan;
            };
            meta: object;
        }>;
        retryChecklist: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                checklistId: string;
            };
            output: {
                checklistId: string;
                status: "GENERATING";
                retryCount: number;
            };
            meta: object;
        }>;
    }>>;
    complianceDashboard: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getComplianceDashboard: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                overallScore: number;
                trend: {
                    points: number | null;
                    label: "increase" | "decrease" | "no_change" | "insufficient_history";
                    comparedAt: string | null;
                    windowDays: 30;
                };
                categories: Array<{
                    key: string;
                    label: string;
                    score: number;
                    completedItems: number;
                    totalItems: number;
                }>;
                lastUpdated: string;
            };
            meta: object;
        }>;
        updateDashboardItem: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                itemId: string;
                isCompleted: boolean;
            };
            output: {
                id: string;
                isCompleted: boolean;
                completedAt: Date | null;
            };
            meta: object;
        }>;
        getChecklistByCategory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                category: "DATA_PROTECTION" | "CYBERSECURITY" | "AML_KYC" | "CONSUMER_PROTECTION" | "CBK_LICENSING";
            };
            output: {
                id: string;
                category: string;
                title: string;
                description: string;
                isCompleted: boolean;
                completedAt: Date | null;
                updatedAt: Date;
            }[];
            meta: object;
        }>;
    }>>;
    gapAnalysis: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getFrameworks: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                slug: string;
                name: string;
                category: string;
                description: string | null;
                tier: string;
                locked: boolean;
            }[];
            meta: object;
        }>;
        runGapAnalysis: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                fileName: string;
                fileType: "pdf" | "docx" | "doc" | "txt";
                fileContent: string;
                regulatoryFrameworks: string[];
                benchmarkDocumentIds?: string[] | undefined;
                analysisDepth?: "quick" | "standard" | "deep" | undefined;
                focusAreas?: string[] | undefined;
            };
            output: {
                id: string;
                status: string;
                progress: number;
            };
            meta: object;
        }>;
        getGapAnalyses: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                documentName: string;
                documentType: string;
                regulatoryFrameworks: import("@prisma/client/runtime/client").JsonValue;
                analysisDepth: string;
                overallScore: number | null;
                status: string;
                progress: number;
                errorMessage: string | null;
                createdAt: Date;
                updatedAt: Date;
            }[];
            meta: object;
        }>;
        getGapAnalysisResult: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
                documentName: string;
                documentType: string;
                documentUrl: string;
                regulatoryFrameworks: import("@prisma/client/runtime/client").JsonValue;
                analysisDepth: string;
                focusAreas: import("@prisma/client/runtime/client").JsonValue | null;
                results: import("../../lib/ai/prompts/gap-analysis").GapAnalysisResult | null;
                overallScore: number | null;
                status: string;
                progress: number;
                errorMessage: string | null;
                ragGrounded: boolean;
                chunksProcessed: number;
                completedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                userName: string | null;
                organizationName: string | null;
            };
            meta: object;
        }>;
        getGapAnalysisLimits: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                maxFileSizeMB: number;
            };
            meta: object;
        }>;
        deleteGapAnalysis: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
    }>>;
    framework: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                includeInactive?: boolean | undefined;
            } | undefined;
            output: any[];
            meta: object;
        }>;
        getBySlug: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                slug: string;
            };
            output: {
                id: string;
                slug: string;
                name: string;
                description: string | null;
                category: string;
                tier: string;
                isActive: boolean;
                version: string | null;
                documentCount: number;
                isCustom: boolean;
                organizationId: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            meta: object;
        }>;
    }>>;
    alert: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        createStreamToken: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                token: string;
                expiresInSeconds: number;
            };
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                title: string;
                summary: string;
                body: string;
                regulatoryBody: "CBK" | "CMA" | "ODPC" | "CA" | "GAZETTE";
                category: "DATA_PROTECTION" | "AML_CFT" | "PRUDENTIAL" | "LICENSING" | "CAPITAL_MARKETS" | "GENERAL";
                sourceUrl?: string | undefined;
                severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                effectiveDate?: string | undefined;
                expiresAt?: string | undefined;
            };
            output: {
                id: string;
                title: string;
                severity: string;
                createdAt: Date;
                updatedAt: Date;
                expiresAt: Date | null;
                effectiveDate: Date | null;
                regulatoryBody: string;
                summary: string;
                category: string;
                publishedAt: Date;
                isActive: boolean;
                body: string;
                sourceUrl: string | null;
                publishedById: string;
            };
            meta: object;
        }>;
        publish: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                alertId: string;
            };
            output: void;
            meta: object;
        }>;
        getAlerts: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                regulatoryBody?: "CBK" | "CMA" | "ODPC" | "CA" | "GAZETTE" | undefined;
                severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                unreadOnly?: boolean | undefined;
            };
            output: import("../../modules/alert").GetAlertsResult;
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                alertId: string;
            };
            output: import("../../modules/alert").AlertWithReadStatus;
            meta: object;
        }>;
        getUnreadCount: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                count: number;
            };
            meta: object;
        }>;
        markAsRead: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                notificationId: string;
            };
            output: void;
            meta: object;
        }>;
        markAllAsRead: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: void;
            meta: object;
        }>;
        upsertSubscription: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                regulatoryBodies: ("CBK" | "CMA" | "ODPC" | "CA" | "GAZETTE")[];
                categories: ("DATA_PROTECTION" | "AML_CFT" | "PRUDENTIAL" | "LICENSING" | "CAPITAL_MARKETS" | "GENERAL")[];
                severityThreshold: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
                emailEnabled: boolean;
                inAppEnabled: boolean;
                emailFrequency: "REALTIME" | "DAILY" | "WEEKLY";
            };
            output: {
                emailFrequency: string;
                id: string;
                organizationId: string;
                createdAt: Date;
                updatedAt: Date;
                inAppEnabled: boolean;
                emailEnabled: boolean;
                regulatoryBodies: string[];
                categories: string[];
                severityThreshold: string;
            };
            meta: object;
        }>;
        getSubscription: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                emailFrequency: string;
                id: string;
                organizationId: string;
                createdAt: Date;
                updatedAt: Date;
                inAppEnabled: boolean;
                emailEnabled: boolean;
                regulatoryBodies: string[];
                categories: string[];
                severityThreshold: string;
            } | null;
            meta: object;
        }>;
        getAdminAlerts: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                alerts: import("@prisma/client").RegulatoryAlert[];
                total: number;
            };
            meta: object;
        }>;
    }>>;
    adminMarketing: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        campaigns: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    status?: "CANCELLED" | "DRAFT" | "FAILED" | "SCHEDULED" | "SENDING" | "SENT" | "PARTIALLY_SENT" | undefined;
                    createdById?: string | undefined;
                    search?: string | undefined;
                    take?: number | undefined;
                    skip?: number | undefined;
                };
                output: {
                    items: import("@prisma/client").MarketingCampaign[];
                    total: number;
                };
                meta: object;
            }>;
            getById: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    id: string;
                };
                output: {
                    id: string;
                    status: import("@prisma/client").$Enums.MarketingCampaignStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    errorMessage: string | null;
                    subject: string;
                    createdById: string;
                    sentAt: Date | null;
                    listId: string | null;
                    templateKey: import("@prisma/client").$Enums.MarketingTemplateKey;
                    templateVariables: import("@prisma/client/runtime/client").JsonValue;
                    scheduledFor: Date | null;
                    segmentFilter: import("@prisma/client/runtime/client").JsonValue | null;
                    totalRecipients: number;
                    totalSent: number;
                    totalDelivered: number;
                    totalOpened: number;
                    totalClicked: number;
                    totalBounced: number;
                    totalUnsubscribed: number;
                    totalComplained: number;
                    totalSuppressedSkip: number;
                    totalNoConsentSkip: number;
                    totalFailed: number;
                };
                meta: object;
            }>;
            create: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    name: string;
                    subject: string;
                    templateKey: "PILOT_INVITATION" | "REGULATOR_ACCESS_PROGRAM" | "PRODUCT_LAUNCH" | "COMPLIANCE_UPDATE" | "WEBINAR_INVITE" | "RESOURCE_DOWNLOAD" | "GENERIC_MARKETING";
                    templateVariables: Record<string, unknown>;
                    listId: string;
                };
                output: {
                    id: string;
                    status: import("@prisma/client").$Enums.MarketingCampaignStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    errorMessage: string | null;
                    subject: string;
                    createdById: string;
                    sentAt: Date | null;
                    listId: string | null;
                    templateKey: import("@prisma/client").$Enums.MarketingTemplateKey;
                    templateVariables: import("@prisma/client/runtime/client").JsonValue;
                    scheduledFor: Date | null;
                    segmentFilter: import("@prisma/client/runtime/client").JsonValue | null;
                    totalRecipients: number;
                    totalSent: number;
                    totalDelivered: number;
                    totalOpened: number;
                    totalClicked: number;
                    totalBounced: number;
                    totalUnsubscribed: number;
                    totalComplained: number;
                    totalSuppressedSkip: number;
                    totalNoConsentSkip: number;
                    totalFailed: number;
                };
                meta: object;
            }>;
            update: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                    name?: string | undefined;
                    subject?: string | undefined;
                    templateVariables?: Record<string, unknown> | undefined;
                    listId?: string | undefined;
                    scheduledFor?: string | null | undefined;
                };
                output: {
                    id: string;
                    status: import("@prisma/client").$Enums.MarketingCampaignStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    errorMessage: string | null;
                    subject: string;
                    createdById: string;
                    sentAt: Date | null;
                    listId: string | null;
                    templateKey: import("@prisma/client").$Enums.MarketingTemplateKey;
                    templateVariables: import("@prisma/client/runtime/client").JsonValue;
                    scheduledFor: Date | null;
                    segmentFilter: import("@prisma/client/runtime/client").JsonValue | null;
                    totalRecipients: number;
                    totalSent: number;
                    totalDelivered: number;
                    totalOpened: number;
                    totalClicked: number;
                    totalBounced: number;
                    totalUnsubscribed: number;
                    totalComplained: number;
                    totalSuppressedSkip: number;
                    totalNoConsentSkip: number;
                    totalFailed: number;
                };
                meta: object;
            }>;
            delete: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            requestSendConfirmation: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    campaignId: string;
                };
                output: {
                    confirmationToken: string;
                    recipientCount: number;
                    estimatedDurationSeconds: number;
                    expiresAt: Date;
                    isAsync: boolean;
                };
                meta: object;
            }>;
            executeSend: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    campaignId: string;
                    confirmationToken: string;
                    confirmedRecipientCount: number;
                };
                output: {
                    campaignId: string;
                    finalStatus: import("@prisma/client").MarketingCampaignStatus;
                    sent: number;
                    skipped: number;
                    failed: number;
                };
                meta: object;
            }>;
            cancel: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    campaignId: string;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            getStats: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    campaignId: string;
                };
                output: import("../../modules/marketing/campaign.service").CampaignStats;
                meta: object;
            }>;
            getRecentSends: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    campaignId: string;
                    take?: number | undefined;
                };
                output: {
                    id: string;
                    contact: {
                        email: string;
                        firstName: string | null;
                        lastName: string | null;
                    };
                    status: import("@prisma/client").$Enums.CampaignSendStatus;
                    errorMessage: string | null;
                    sentAt: Date | null;
                    contactId: string;
                    messageId: string | null;
                    suppressionReason: import("@prisma/client").$Enums.SuppressionReason | null;
                }[];
                meta: object;
            }>;
            getJobStatus: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    campaignId: string;
                };
                output: {
                    remaining: number;
                    id: string;
                    failed: number;
                    status: import("@prisma/client").$Enums.CampaignSendJobStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    errorMessage: string | null;
                    completedAt: Date | null;
                    startedAt: Date | null;
                    campaignId: string;
                    totalContacts: number;
                    processed: number;
                    succeeded: number;
                    skipped: number;
                } | null;
                meta: object;
            }>;
            duplicate: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    campaignId: string;
                };
                output: {
                    id: string;
                    status: import("@prisma/client").$Enums.MarketingCampaignStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    errorMessage: string | null;
                    subject: string;
                    createdById: string;
                    sentAt: Date | null;
                    listId: string | null;
                    templateKey: import("@prisma/client").$Enums.MarketingTemplateKey;
                    templateVariables: import("@prisma/client/runtime/client").JsonValue;
                    scheduledFor: Date | null;
                    segmentFilter: import("@prisma/client/runtime/client").JsonValue | null;
                    totalRecipients: number;
                    totalSent: number;
                    totalDelivered: number;
                    totalOpened: number;
                    totalClicked: number;
                    totalBounced: number;
                    totalUnsubscribed: number;
                    totalComplained: number;
                    totalSuppressedSkip: number;
                    totalNoConsentSkip: number;
                    totalFailed: number;
                };
                meta: object;
            }>;
        }>>;
        contacts: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    search?: string | undefined;
                    consentStatus?: "REVOKED" | "PENDING" | "GRANTED" | undefined;
                    suppressed?: boolean | undefined;
                    companyId?: string | undefined;
                    take?: number | undefined;
                    skip?: number | undefined;
                };
                output: {
                    items: ({
                        company: {
                            id: string;
                            name: string;
                        } | null;
                    } & {
                        id: string;
                        email: string;
                        phone: string | null;
                        role: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        tags: string[];
                        notes: string | null;
                        createdById: string;
                        companyId: string | null;
                        firstName: string | null;
                        lastName: string | null;
                        primaryRegulator: string | null;
                        consentStatus: import("@prisma/client").$Enums.ContactConsentStatus;
                        consentSource: string | null;
                        consentTimestamp: Date | null;
                        suppressedAt: Date | null;
                        suppressedReason: import("@prisma/client").$Enums.SuppressionReason | null;
                        lastEmailedAt: Date | null;
                        lastEmailOpenedAt: Date | null;
                    })[];
                    total: number;
                };
                meta: object;
            }>;
            getById: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    id: string;
                };
                output: {
                    company: {
                        id: string;
                        name: string;
                    } | null;
                    consentRecords: {
                        metadata: import("@prisma/client/runtime/client").JsonValue | null;
                        id: string;
                        ipAddress: string | null;
                        userAgent: string | null;
                        action: import("@prisma/client").$Enums.ConsentAction;
                        source: string;
                        contactId: string;
                        occurredAt: Date;
                    }[];
                } & {
                    id: string;
                    email: string;
                    phone: string | null;
                    role: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    tags: string[];
                    notes: string | null;
                    createdById: string;
                    companyId: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    primaryRegulator: string | null;
                    consentStatus: import("@prisma/client").$Enums.ContactConsentStatus;
                    consentSource: string | null;
                    consentTimestamp: Date | null;
                    suppressedAt: Date | null;
                    suppressedReason: import("@prisma/client").$Enums.SuppressionReason | null;
                    lastEmailedAt: Date | null;
                    lastEmailOpenedAt: Date | null;
                };
                meta: object;
            }>;
            create: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    email: string;
                    firstName?: string | undefined;
                    lastName?: string | undefined;
                    phone?: string | undefined;
                    role?: string | undefined;
                    companyId?: string | undefined;
                    grantConsent?: boolean | undefined;
                };
                output: {
                    id: string;
                    email: string;
                    phone: string | null;
                    role: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    tags: string[];
                    notes: string | null;
                    createdById: string;
                    companyId: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    primaryRegulator: string | null;
                    consentStatus: import("@prisma/client").$Enums.ContactConsentStatus;
                    consentSource: string | null;
                    consentTimestamp: Date | null;
                    suppressedAt: Date | null;
                    suppressedReason: import("@prisma/client").$Enums.SuppressionReason | null;
                    lastEmailedAt: Date | null;
                    lastEmailOpenedAt: Date | null;
                };
                meta: object;
            }>;
            update: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                    firstName?: string | null | undefined;
                    lastName?: string | null | undefined;
                    phone?: string | null | undefined;
                    role?: string | null | undefined;
                    companyId?: string | null | undefined;
                };
                output: {
                    id: string;
                    email: string;
                    phone: string | null;
                    role: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    tags: string[];
                    notes: string | null;
                    createdById: string;
                    companyId: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    primaryRegulator: string | null;
                    consentStatus: import("@prisma/client").$Enums.ContactConsentStatus;
                    consentSource: string | null;
                    consentTimestamp: Date | null;
                    suppressedAt: Date | null;
                    suppressedReason: import("@prisma/client").$Enums.SuppressionReason | null;
                    lastEmailedAt: Date | null;
                    lastEmailOpenedAt: Date | null;
                };
                meta: object;
            }>;
            delete: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            bulkImport: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    contacts: {
                        email: string;
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                        phone?: string | undefined;
                        role?: string | undefined;
                        companyName?: string | undefined;
                    }[];
                    grantConsent?: boolean | undefined;
                };
                output: {
                    created: number;
                    updated: number;
                    skipped: number;
                    errors: {
                        email: string;
                        error: string;
                    }[];
                };
                meta: object;
            }>;
            recordConsent: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    contactId: string;
                    action: "REVOKED" | "GRANTED" | "UPDATED" | "IMPORTED_LEGITIMATE_INTEREST";
                    source: string;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            getEmailHistory: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    contactId: string;
                    take?: number | undefined;
                    skip?: number | undefined;
                };
                output: {
                    items: ({
                        send: {
                            status: import("@prisma/client").$Enums.CampaignSendStatus;
                            sentAt: Date | null;
                            campaignId: string;
                        } | null;
                    } & {
                        id: string;
                        eventType: import("@prisma/client").$Enums.EmailEventType;
                        messageId: string | null;
                        sendId: string | null;
                        eventData: import("@prisma/client/runtime/client").JsonValue;
                        occurredAt: Date;
                    })[];
                    total: number;
                };
                meta: object;
            }>;
        }>>;
        lists: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    take?: number | undefined;
                    skip?: number | undefined;
                };
                output: {
                    items: ({
                        _count: {
                            memberships: number;
                        };
                    } & {
                        id: string;
                        description: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        name: string;
                        createdById: string;
                        isDynamic: boolean;
                        filterCriteria: import("@prisma/client/runtime/client").JsonValue | null;
                    })[];
                    total: number;
                };
                meta: object;
            }>;
            getById: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    id: string;
                };
                output: {
                    _count: {
                        memberships: number;
                    };
                    memberships: ({
                        contact: {
                            id: string;
                            email: string;
                            firstName: string | null;
                            lastName: string | null;
                        };
                    } & {
                        listId: string;
                        contactId: string;
                        addedAt: Date;
                        addedById: string;
                    })[];
                } & {
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    createdById: string;
                    isDynamic: boolean;
                    filterCriteria: import("@prisma/client/runtime/client").JsonValue | null;
                };
                meta: object;
            }>;
            create: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    name: string;
                    description?: string | undefined;
                    isDynamic?: boolean | undefined;
                    filterCriteria?: Record<string, unknown> | undefined;
                };
                output: {
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    createdById: string;
                    isDynamic: boolean;
                    filterCriteria: import("@prisma/client/runtime/client").JsonValue | null;
                };
                meta: object;
            }>;
            update: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                    name?: string | undefined;
                    description?: string | null | undefined;
                    filterCriteria?: Record<string, unknown> | undefined;
                };
                output: {
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    createdById: string;
                    isDynamic: boolean;
                    filterCriteria: import("@prisma/client/runtime/client").JsonValue | null;
                };
                meta: object;
            }>;
            delete: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            addMembers: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    listId: string;
                    contactIds: string[];
                };
                output: {
                    added: number;
                    skipped: number;
                };
                meta: object;
            }>;
            removeMembers: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    listId: string;
                    contactIds: string[];
                };
                output: {
                    removed: number;
                };
                meta: object;
            }>;
            previewDynamic: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    filterCriteria: Record<string, unknown>;
                };
                output: {
                    count: number;
                    sample: {
                        id: string;
                        email: string;
                        firstName: string | null;
                        lastName: string | null;
                    }[];
                };
                meta: object;
            }>;
            getMembers: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    listId: string;
                    take?: number | undefined;
                    skip?: number | undefined;
                };
                output: {
                    items: ({
                        contact: {
                            id: string;
                            email: string;
                            firstName: string | null;
                            lastName: string | null;
                            consentStatus: import("@prisma/client").$Enums.ContactConsentStatus;
                            suppressedAt: Date | null;
                        };
                    } & {
                        listId: string;
                        contactId: string;
                        addedAt: Date;
                        addedById: string;
                    })[];
                    total: number;
                };
                meta: object;
            }>;
        }>>;
        suppression: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    reason?: "UNSUBSCRIBED" | "BOUNCED" | "COMPLAINED" | "MANUAL" | undefined;
                    take?: number | undefined;
                    skip?: number | undefined;
                };
                output: {
                    items: {
                        metadata: import("@prisma/client/runtime/client").JsonValue | null;
                        id: string;
                        email: string;
                        reason: import("@prisma/client").$Enums.SuppressionReason;
                        addedAt: Date;
                        addedById: string | null;
                    }[];
                    total: number;
                };
                meta: object;
            }>;
            add: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    email: string;
                    reason: "UNSUBSCRIBED" | "BOUNCED" | "COMPLAINED" | "MANUAL";
                    note?: string | undefined;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            remove: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    email: string;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            check: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    email: string;
                };
                output: {
                    isSuppressed: boolean;
                    reason: import("@prisma/client").$Enums.SuppressionReason | null;
                    addedAt: Date | null;
                };
                meta: object;
            }>;
        }>>;
    }>>;
    publicMarketing: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        validateUnsubscribeToken: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                token: string;
            };
            output: {
                valid: false;
                email: null;
            } | {
                valid: true;
                email: string;
            };
            meta: object;
        }>;
        unsubscribe: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                token: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        applyForPilot: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                firstName: string;
                lastName: string;
                email: string;
                companyName: string;
                jobTitle: string;
                phone?: string | undefined;
                message?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
    }>>;
    enterprisePolicy: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        createDraft: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                policyType: "DATA_PROTECTION" | "CYBERSECURITY" | "AML_CFT" | "CONSUMER_PROTECTION" | "CUSTOM" | "IT_SECURITY";
                title: string;
                regulatoryFrameworks: string[];
                description?: string | undefined;
                targetAudience?: string | undefined;
                organizationType?: string | undefined;
                jurisdiction?: string | undefined;
                sourceGapAnalysisId?: string | undefined;
                sourceGapId?: string | undefined;
            };
            output: {
                policyId: string;
                status: import("@prisma/client").$Enums.GeneratedPolicyStatus;
                title: string;
                policyType: string;
                jobId: string;
                createdAt: Date;
            };
            meta: object;
        }>;
        getStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                policyId: string;
            };
            output: {
                policyId: string;
                job: {
                    id: string;
                    status: string;
                    updatedAt: Date;
                    attempts: number;
                    maxAttempts: number;
                    lastError: string | null;
                    events: {
                        type: string;
                        message: string | null;
                        createdAt: Date;
                        progress: number | null;
                    }[];
                } | null;
                jobId: {} | null;
                status: import("@prisma/client").$Enums.GeneratedPolicyStatus;
                progress: number;
                title: string;
                currentStage: string;
                isComplete: boolean;
                isFailed: boolean;
                errorMessage: string | null;
                updatedAt: Date;
            };
            meta: object;
        }>;
        getPolicy: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                policyId: string;
            };
            output: {
                citations: {
                    id: string;
                    createdAt: Date;
                    actName: string;
                    section: string;
                    subsection: string | null;
                    textSnippet: string;
                    confidence: string;
                    verified: boolean;
                    rawSource: import("@prisma/client/runtime/client").JsonValue | null;
                    sectionId: string;
                    generatedPolicyId: string;
                    citationVerified: boolean | null;
                    sourceSnapshotId: string | null;
                }[];
                sourceGapAnalysis: {
                    id: string;
                    documentName: string;
                    regulatoryFrameworks: import("@prisma/client/runtime/client").JsonValue;
                    overallScore: number | null;
                } | null;
            } & {
                id: string;
                title: string;
                description: string | null;
                userId: string;
                status: import("@prisma/client").$Enums.GeneratedPolicyStatus;
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
            };
            meta: object;
        }>;
        listPolicies: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "COMPLETED" | "FAILED" | "ARCHIVED" | "INITIALIZING" | "OUTLINING" | "DRAFTING" | "REVIEWING" | undefined;
                policyType?: "DATA_PROTECTION" | "CYBERSECURITY" | "AML_CFT" | "CONSUMER_PROTECTION" | "CUSTOM" | "IT_SECURITY" | undefined;
                cursor?: string | undefined;
                limit?: number | undefined;
            };
            output: {
                items: {
                    id: string;
                    title: string;
                    description: string | null;
                    status: import("@prisma/client").$Enums.GeneratedPolicyStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    version: number;
                    progress: number;
                    completedAt: Date | null;
                    regulatoryFrameworks: string[];
                    jurisdiction: string;
                    policyType: string;
                    sourceGapAnalysisId: string | null;
                    lastExportedAt: Date | null;
                    lastExportFormat: string | null;
                }[];
                nextCursor: string | undefined;
                totalEstimate: number;
            };
            meta: object;
        }>;
        updateSectionContent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                policyId: string;
                sectionId: string;
                content: any;
                contentMarkdown?: string | undefined;
            };
            output: {
                success: boolean;
                section: {
                    id: string;
                    title?: string;
                    content?: unknown;
                    contentMarkdown?: string;
                    status?: string;
                    wordCount?: number;
                    editedAt?: string;
                    editedByUserId?: string;
                } | undefined;
                version: number;
                updatedAt: Date;
            };
            meta: object;
        }>;
        updateSectionStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                policyId: string;
                sectionId: string;
                status: "DRAFT" | "APPROVED" | "REVIEWED" | "NEEDS_REVISION";
            };
            output: {
                success: boolean;
                section: {
                    id: string;
                    title?: string;
                    content?: unknown;
                    contentMarkdown?: string;
                    status?: string;
                    wordCount?: number;
                    editedAt?: string;
                    editedByUserId?: string;
                } | undefined;
                version: number;
                updatedAt: Date;
            };
            meta: object;
        }>;
        getVersionHistory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                policyId: string;
            };
            output: {
                sectionTitle: string;
                editedByName: string;
                id: string;
                createdAt: Date;
                version: number;
                sectionId: string;
                previousStatus: string | null;
                newStatus: string | null;
                editedByUserId: string;
            }[];
            meta: object;
        }>;
        deletePolicy: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                policyId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        exportPolicy: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                policyId: string;
                format: "PDF" | "DOCX";
            };
            output: {
                downloadUrl: string;
                filename: string;
                expiresAt: string;
            };
            meta: object;
        }>;
    }>>;
    application: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                status?: "DRAFT" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "REJECTED" | "AWAITING_FEEDBACK" | "WITHDRAWN" | undefined;
                search?: string | undefined;
            };
            output: {
                applications: ({
                    _count: {
                        timelineEvents: number;
                        documents: number;
                        fees: number;
                        regulatorFeedback: number;
                    };
                } & {
                    id: string;
                    title: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    regulator: string;
                    licenseType: string;
                    progress: number;
                    referenceNumber: string | null;
                    nextAction: string | null;
                    dueDate: Date | null;
                    submittedAt: Date | null;
                    decidedAt: Date | null;
                })[];
                stats: {
                    total: number;
                    inProgress: number;
                    submitted: number;
                    approved: number;
                };
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: ({
                user: {
                    id: string;
                    email: string;
                    fullName: string;
                };
                timelineEvents: {
                    id: string;
                    title: string;
                    description: string | null;
                    userId: string;
                    createdAt: Date;
                    applicationId: string;
                    eventDate: Date;
                    completed: boolean;
                }[];
                documents: {
                    id: string;
                    userId: string;
                    status: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    applicationId: string;
                    vaultDocumentId: string | null;
                    notes: string | null;
                    uploadedAt: Date | null;
                }[];
                fees: {
                    id: string;
                    description: string;
                    userId: string;
                    status: string;
                    createdAt: Date;
                    updatedAt: Date;
                    applicationId: string;
                    amount: number;
                    paidAt: Date | null;
                }[];
                regulatorFeedback: {
                    message: string;
                    id: string;
                    userId: string;
                    createdAt: Date;
                    dueDate: Date | null;
                    applicationId: string;
                    fromName: string | null;
                    actionRequired: boolean;
                    receivedAt: Date;
                }[];
            } & {
                id: string;
                title: string;
                userId: string;
                status: string;
                organizationId: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                regulator: string;
                licenseType: string;
                progress: number;
                referenceNumber: string | null;
                nextAction: string | null;
                dueDate: Date | null;
                submittedAt: Date | null;
                decidedAt: Date | null;
            }) | null;
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                title: string;
                regulator: string;
                licenseType: string;
                status?: "DRAFT" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "REJECTED" | "AWAITING_FEEDBACK" | "WITHDRAWN" | undefined;
                progress?: number | undefined;
                referenceNumber?: string | undefined;
                nextAction?: string | undefined;
                dueDate?: Date | undefined;
            };
            output: {
                id: string;
                title: string;
                userId: string;
                status: string;
                organizationId: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                regulator: string;
                licenseType: string;
                progress: number;
                referenceNumber: string | null;
                nextAction: string | null;
                dueDate: Date | null;
                submittedAt: Date | null;
                decidedAt: Date | null;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                title?: string | undefined;
                regulator?: string | undefined;
                licenseType?: string | undefined;
                status?: "DRAFT" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "REJECTED" | "AWAITING_FEEDBACK" | "WITHDRAWN" | undefined;
                progress?: number | undefined;
                referenceNumber?: string | undefined;
                nextAction?: string | undefined;
                dueDate?: Date | undefined;
                submittedAt?: Date | null | undefined;
                decidedAt?: Date | null | undefined;
            };
            output: {
                id: string;
                title: string;
                userId: string;
                status: string;
                organizationId: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                regulator: string;
                licenseType: string;
                progress: number;
                referenceNumber: string | null;
                nextAction: string | null;
                dueDate: Date | null;
                submittedAt: Date | null;
                decidedAt: Date | null;
            };
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        addTimelineEvent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                applicationId: string;
                title: string;
                description?: string | undefined;
                eventDate?: Date | undefined;
                completed?: boolean | undefined;
            };
            output: {
                id: string;
                title: string;
                description: string | null;
                userId: string;
                createdAt: Date;
                applicationId: string;
                eventDate: Date;
                completed: boolean;
            };
            meta: object;
        }>;
        addDocument: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                applicationId: string;
                name: string;
                status?: "APPROVED" | "UPLOADED" | "REJECTED" | "REQUIRED" | undefined;
                vaultDocumentId?: string | undefined;
                notes?: string | undefined;
                uploadedAt?: Date | null | undefined;
            };
            output: {
                id: string;
                userId: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                applicationId: string;
                vaultDocumentId: string | null;
                notes: string | null;
                uploadedAt: Date | null;
            };
            meta: object;
        }>;
        addFee: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                applicationId: string;
                description: string;
                amount: number;
                status?: "PENDING" | "WAIVED" | "PAID" | undefined;
                paidAt?: Date | null | undefined;
            };
            output: {
                id: string;
                description: string;
                userId: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                applicationId: string;
                amount: number;
                paidAt: Date | null;
            };
            meta: object;
        }>;
        addRegulatorFeedback: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                applicationId: string;
                message: string;
                fromName?: string | undefined;
                actionRequired?: boolean | undefined;
                dueDate?: Date | null | undefined;
                receivedAt?: Date | undefined;
            };
            output: {
                message: string;
                id: string;
                userId: string;
                createdAt: Date;
                dueDate: Date | null;
                applicationId: string;
                fromName: string | null;
                actionRequired: boolean;
                receivedAt: Date;
            };
            meta: object;
        }>;
    }>>;
    license: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "SUSPENDED" | "ACTIVE" | "EXPIRED" | "REVOKED" | "DRAFT" | "ARCHIVED" | "PENDING_RENEWAL" | "SUBMITTED" | "APPROVED" | undefined;
                search?: string | undefined;
                includeArchived?: boolean | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                licenses: ({
                    id: string;
                    status: import("@prisma/client").$Enums.LicenseStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    _count: {
                        timelineEvents: number;
                        documents: number;
                        fees: number;
                    };
                    regulator: string;
                    licenseType: string;
                    submittedAt: Date | null;
                    notes: string | null;
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseNumber: string | null;
                    issueDate: Date | null;
                    expiryDate: Date | null;
                    renewalDueDate: Date | null;
                    approvedAt: Date | null;
                    assignedOwnerId: string | null;
                    assignedOwner: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    derived: {
                        daysUntilExpiry: number | null;
                        daysUntilRenewal: number | null;
                        isExpired: boolean;
                        isRenewalDueSoon: boolean;
                        isRenewalOverdue: boolean;
                    };
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
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
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
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import("@prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client/runtime/client").Decimal | null;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    currency: string;
                    licenseId: string;
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.LicenseStatus;
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                licenseType: string;
                regulator: string;
                licenseNumber?: string | undefined;
                status?: "SUSPENDED" | "ACTIVE" | "EXPIRED" | "REVOKED" | "DRAFT" | "ARCHIVED" | "PENDING_RENEWAL" | "SUBMITTED" | "APPROVED" | undefined;
                issueDate?: string | null | undefined;
                expiryDate?: string | null | undefined;
                renewalDueDate?: string | null | undefined;
                submittedAt?: string | null | undefined;
                approvedAt?: string | null | undefined;
                assignedOwnerId?: string | null | undefined;
                notes?: string | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
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
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import("@prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client/runtime/client").Decimal | null;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    currency: string;
                    licenseId: string;
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.LicenseStatus;
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                licenseType?: string | undefined;
                regulator?: string | undefined;
                licenseNumber?: string | undefined;
                status?: "SUSPENDED" | "ACTIVE" | "EXPIRED" | "REVOKED" | "DRAFT" | "ARCHIVED" | "PENDING_RENEWAL" | "SUBMITTED" | "APPROVED" | undefined;
                issueDate?: string | null | undefined;
                expiryDate?: string | null | undefined;
                renewalDueDate?: string | null | undefined;
                submittedAt?: string | null | undefined;
                approvedAt?: string | null | undefined;
                assignedOwnerId?: string | null | undefined;
                notes?: string | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
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
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import("@prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client/runtime/client").Decimal | null;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    currency: string;
                    licenseId: string;
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.LicenseStatus;
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        archive: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        addTimelineEvent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                licenseId: string;
                eventType: string;
                title: string;
                description?: string | undefined;
                dueDate?: string | null | undefined;
                status?: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "BLOCKED" | undefined;
                assignedToUserId?: string | null | undefined;
                evidenceDocumentId?: string | null | undefined;
                createCalendarEvent?: boolean | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
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
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import("@prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client/runtime/client").Decimal | null;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    currency: string;
                    licenseId: string;
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.LicenseStatus;
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        updateTimelineEvent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                licenseId?: string | undefined;
                eventType?: string | undefined;
                title?: string | undefined;
                description?: string | undefined;
                dueDate?: string | null | undefined;
                status?: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "BLOCKED" | undefined;
                assignedToUserId?: string | null | undefined;
                evidenceDocumentId?: string | null | undefined;
                createCalendarEvent?: boolean | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
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
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import("@prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client/runtime/client").Decimal | null;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    currency: string;
                    licenseId: string;
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.LicenseStatus;
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        completeTimelineEvent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
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
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import("@prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client/runtime/client").Decimal | null;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    currency: string;
                    licenseId: string;
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.LicenseStatus;
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        addDocument: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                licenseId: string;
                vaultDocumentId: string;
                documentType?: string | undefined;
                notes?: string | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
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
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import("@prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client/runtime/client").Decimal | null;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    currency: string;
                    licenseId: string;
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.LicenseStatus;
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        removeDocument: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
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
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import("@prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client/runtime/client").Decimal | null;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    currency: string;
                    licenseId: string;
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.LicenseStatus;
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        addFee: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                licenseId: string;
                amount?: number | null | undefined;
                currency?: string | undefined;
                description?: string | undefined;
                dueDate?: string | null | undefined;
                paidAt?: string | null | undefined;
                status?: "PENDING" | "OVERDUE" | "WAIVED" | "PAID" | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
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
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import("@prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client/runtime/client").Decimal | null;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    currency: string;
                    licenseId: string;
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.LicenseStatus;
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        updateFee: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                licenseId?: string | undefined;
                amount?: number | null | undefined;
                currency?: string | undefined;
                description?: string | undefined;
                dueDate?: string | null | undefined;
                paidAt?: string | null | undefined;
                status?: "PENDING" | "OVERDUE" | "WAIVED" | "PAID" | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
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
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import("@prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client/runtime/client").Decimal | null;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    currency: string;
                    licenseId: string;
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.LicenseStatus;
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        getUpcomingRenewals: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                daysAhead?: number | undefined;
            };
            output: ({
                id: string;
                status: import("@prisma/client").$Enums.LicenseStatus;
                organizationId: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                _count: {
                    timelineEvents: number;
                    documents: number;
                    fees: number;
                };
                regulator: string;
                licenseType: string;
                submittedAt: Date | null;
                notes: string | null;
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdByUserId: string;
                updatedByUserId: string | null;
                licenseNumber: string | null;
                issueDate: Date | null;
                expiryDate: Date | null;
                renewalDueDate: Date | null;
                approvedAt: Date | null;
                assignedOwnerId: string | null;
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            })[];
            meta: object;
        }>;
        getDashboardSummary: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                total: number;
                active: number;
                renewalDueSoon: number;
                expired: number;
            };
            meta: object;
        }>;
        adminList: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "SUSPENDED" | "ACTIVE" | "EXPIRED" | "REVOKED" | "DRAFT" | "ARCHIVED" | "PENDING_RENEWAL" | "SUBMITTED" | "APPROVED" | undefined;
                search?: string | undefined;
                includeArchived?: boolean | undefined;
                page?: number | undefined;
                limit?: number | undefined;
                organizationId?: string | undefined;
            };
            output: {
                licenses: ({
                    organization: {
                        id: string;
                        name: string;
                        plan: import("@prisma/client").$Enums.SubscriptionPlan;
                    };
                    _count: {
                        timelineEvents: number;
                        documents: number;
                        fees: number;
                    };
                    assignedOwner: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                } & {
                    id: string;
                    status: import("@prisma/client").$Enums.LicenseStatus;
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
                } & {
                    derived: {
                        daysUntilExpiry: number | null;
                        daysUntilRenewal: number | null;
                        isExpired: boolean;
                        isRenewalDueSoon: boolean;
                        isRenewalOverdue: boolean;
                    };
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
        adminGet: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
                reason?: string | undefined;
            };
            output: {
                organization: {
                    id: string;
                    name: string;
                    plan: import("@prisma/client").$Enums.SubscriptionPlan;
                };
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
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
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import("@prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client/runtime/client").Decimal | null;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    currency: string;
                    licenseId: string;
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.LicenseStatus;
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        adminOverrideUpdate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
                licenseType?: string | undefined;
                regulator?: string | undefined;
                licenseNumber?: string | undefined;
                status?: "SUSPENDED" | "ACTIVE" | "EXPIRED" | "REVOKED" | "DRAFT" | "ARCHIVED" | "PENDING_RENEWAL" | "SUBMITTED" | "APPROVED" | undefined;
                issueDate?: string | null | undefined;
                expiryDate?: string | null | undefined;
                renewalDueDate?: string | null | undefined;
                submittedAt?: string | null | undefined;
                approvedAt?: string | null | undefined;
                assignedOwnerId?: string | null | undefined;
                notes?: string | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
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
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import("@prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import("@prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client/runtime/client").Decimal | null;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    currency: string;
                    licenseId: string;
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.LicenseStatus;
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
    }>>;
    customFramework: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | undefined;
            } | undefined;
            output: any;
            meta: object;
        }>;
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                description?: string | null | undefined;
                jurisdiction?: string | null | undefined;
                regulator?: string | null | undefined;
                category?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        updateMetadata: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                name?: string | undefined;
                description?: string | null | undefined;
                jurisdiction?: string | null | undefined;
                regulator?: string | null | undefined;
                category?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        createSection: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                frameworkId: string;
                title: string;
                description?: string | null | undefined;
                order?: number | undefined;
            };
            output: any;
            meta: object;
        }>;
        updateSection: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                title?: string | undefined;
                description?: string | null | undefined;
                order?: number | undefined;
            };
            output: any;
            meta: object;
        }>;
        deleteSection: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        createControl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                frameworkId: string;
                title: string;
                requirement: string;
                sectionId?: string | null | undefined;
                code?: string | null | undefined;
                guidance?: string | null | undefined;
                evidenceRequired?: unknown;
                severity?: string | null | undefined;
                frequency?: string | null | undefined;
                regulatorReference?: string | null | undefined;
                order?: number | undefined;
            };
            output: any;
            meta: object;
        }>;
        updateControl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                code?: string | null | undefined;
                title?: string | undefined;
                severity?: string | null | undefined;
                guidance?: string | null | undefined;
                order?: number | undefined;
                sectionId?: string | null | undefined;
                requirement?: string | undefined;
                evidenceRequired?: unknown;
                frequency?: string | null | undefined;
                regulatorReference?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        deleteControl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        publish: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        archive: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        getVersionHistory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
    }>>;
    enterpriseContract: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        adminList: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                organizationId?: string | undefined;
                status?: string | undefined;
            } | undefined;
            output: any;
            meta: object;
        }>;
        adminGet: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        adminCreate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                organizationId: string;
                reason: string;
                contractName?: string | null | undefined;
                contractNumber?: string | null | undefined;
                startsAt?: unknown;
                endsAt?: unknown;
                renewalDate?: unknown;
                billingCycle?: string | null | undefined;
                currency?: string | null | undefined;
                monthlyAmount?: number | null | undefined;
                annualAmount?: number | null | undefined;
                notes?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminUpdate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
                organizationId?: string | undefined;
                contractName?: string | null | undefined;
                contractNumber?: string | null | undefined;
                startsAt?: unknown;
                endsAt?: unknown;
                renewalDate?: unknown;
                billingCycle?: string | null | undefined;
                currency?: string | null | undefined;
                monthlyAmount?: number | null | undefined;
                annualAmount?: number | null | undefined;
                notes?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminActivate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
            };
            output: any;
            meta: object;
        }>;
        adminSuspend: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
            };
            output: any;
            meta: object;
        }>;
        adminArchive: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
            };
            output: any;
            meta: object;
        }>;
        adminAddOverride: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contractId: string;
                key: "seats.limit" | "features.customFrameworks" | "features.policyGeneration" | "features.licenseManagement" | "features.complianceCalendar" | "features.gapAnalysis" | "features.benchmarkDocuments" | "limits.complianceQueries.month" | "limits.gapAnalysis.month" | "limits.policyGeneration.month" | "limits.documentUploads.month" | "limits.storageGb" | "limits.customFrameworks.count" | "limits.benchmarkDocuments.count" | "support.tier";
                value: unknown;
                reason: string;
                startsAt?: unknown;
                endsAt?: unknown;
            };
            output: any;
            meta: object;
        }>;
        adminUpdateOverride: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
                contractId?: string | undefined;
                key?: "seats.limit" | "features.customFrameworks" | "features.policyGeneration" | "features.licenseManagement" | "features.complianceCalendar" | "features.gapAnalysis" | "features.benchmarkDocuments" | "limits.complianceQueries.month" | "limits.gapAnalysis.month" | "limits.policyGeneration.month" | "limits.documentUploads.month" | "limits.storageGb" | "limits.customFrameworks.count" | "limits.benchmarkDocuments.count" | "support.tier" | undefined;
                value?: unknown;
                startsAt?: unknown;
                endsAt?: unknown;
            };
            output: any;
            meta: object;
        }>;
        adminDisableOverride: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
            };
            output: any;
            meta: object;
        }>;
        adminPreviewEffectiveEntitlements: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                organizationId: string;
            };
            output: {
                organization: any;
                planDefault: import("../../config").PlanEntitlementConfig;
                effectiveEntitlements: import("../../config").PlanEntitlementConfig;
                appliedOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[];
            };
            meta: object;
        }>;
    }>>;
}>>;
/**
 * Export type definition of API
 *
 * This type is used on the frontend for end-to-end type safety.
 * The frontend can import this type to get full autocomplete and
 * type checking for all API calls.
 *
 * @example
 * // On frontend:
 * import type { AppRouter } from '@/server/trpc/router';
 *
 * const client = createTRPCProxyClient<AppRouter>({
 *   links: [httpBatchLink({ url: 'http://localhost:3001/trpc' })],
 * });
 */
export type AppRouter = typeof appRouter;
//# sourceMappingURL=router.d.ts.map