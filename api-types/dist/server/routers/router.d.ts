/**
 * Root Application Router
 *
 * Combines all sub-routers into a single router.
 * This is the main entry point for all tRPC procedures.
 *
 * Routes:
 * - /trpc/auth.*         - Authentication (register, login, password reset, etc.)
 * - /trpc/user.*         - User management (profile, preferences, password, account)
 * - /trpc/organization.* - Organization CRUD and member management
 * - /trpc/policy.*       - Policy CRUD + AI generation + export
 * - /trpc/compliance.*   - Compliance queries with RAG + document search
 * - /trpc/document.*     - Document upload/download with R2 storage
 * - /trpc/content.*      - Blog posts, KB articles, and content management
 * - /trpc/admin.*        - Admin operations (stats, users, health, logs)
 * - /trpc/notification.* - Notifications (list, mark read, preferences)
 * - /trpc/analytics.*    - Analytics (dashboard, trends, reports, export)
 */
export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc/context").Context;
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
        ctx: import("../trpc/context").Context;
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
                    emailVerified: true;
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
        ctx: import("../trpc/context").Context;
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
                    fullName: string;
                    phone: string | null;
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
                emailDigestEnabled: boolean;
                digestFrequency: string;
            };
            meta: object;
        }>;
        getAvatarUploadUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contentType: "image/jpeg" | "image/png" | "image/webp";
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
                emailDigestEnabled?: boolean | undefined;
                digestFrequency?: "daily" | "weekly" | "monthly" | undefined;
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
                emailDigestEnabled: boolean;
                digestFrequency: string;
            };
            meta: object;
        }>;
    }>>;
    organization: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc/context").Context;
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
                    mpesaPhoneNumber: string | null;
                    mpesaNextPaymentDueDate: Date | null;
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
                mpesaPhoneNumber: string | null;
                mpesaNextPaymentDueDate: Date | null;
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
                mpesaPhoneNumber: string | null;
                mpesaNextPaymentDueDate: Date | null;
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
                mpesaPhoneNumber: string | null;
                mpesaNextPaymentDueDate: Date | null;
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
                    fullName: string;
                    phone: string | null;
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
                role: "REGULATOR" | "STARTUP" | "ENTERPRISE" | "ADMIN";
            };
            output: {
                success: boolean;
                user: {
                    id: string;
                    email: string;
                    fullName: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    organizationId: string | null;
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
        ctx: import("../trpc/context").Context;
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
                    user: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                    id: string;
                    status: import("@prisma/client").$Enums.PolicyStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    scenario: string;
                    regulatoryAreas: string[];
                    title: string | null;
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
                    status: import("@prisma/client").$Enums.PolicyStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
                    isLatestVersion: boolean;
                    version: number;
                }[];
            };
            meta: object;
        }>;
    }>>;
    compliance: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc/context").Context;
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
                    documentId: any;
                    documentTitle: any;
                    section: any;
                    textSnippet: any;
                    score: any;
                    citation: any;
                }[];
                confidence: null;
                suggestedFollowUps: never[];
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
                    documentId: any;
                    documentTitle: any;
                    section: any;
                    textSnippet: any;
                    score: any;
                    citation: any;
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
                    query: string;
                    user: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                    id: string;
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
                userId: string;
                query: string;
                id: string;
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
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                productCategory: string | null;
                regulations: import("@prisma/client/runtime/client").JsonValue | null;
                requirements: import("@prisma/client/runtime/client").JsonValue | null;
                gaps: import("@prisma/client/runtime/client").JsonValue | null;
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
            output: import("../../modules/compliance").ComplianceScore | {
                score: number;
                grade: string;
                areas: never[];
                calculatedAt: string;
            };
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
            output: import("../../modules/compliance").ComplianceRoadmap | {
                phases: never[];
                estimatedDays: number;
                priority: never[];
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
                        query: string;
                        id: string;
                        createdAt: Date;
                        response: string | null;
                    };
                } & {
                    userId: string;
                    id: string;
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
    }>>;
    checklist: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc/context").Context;
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
                organizationId?: string | undefined;
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
    gapAnalysis: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc/context").Context;
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
                fileType: "pdf" | "doc" | "docx" | "txt";
                fileContent: string;
                regulatoryFrameworks: string[];
                analysisDepth?: "quick" | "standard" | "deep" | undefined;
                focusAreas?: string[] | undefined;
                organizationId?: string | undefined;
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
    complianceDashboard: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc/context").Context;
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
    document: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc/context").Context;
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
                    createdAt: Date;
                    title: string | null;
                    documentType: string;
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
                userId: string | null;
                id: string;
                status: import("@prisma/client").$Enums.DocumentStatus;
                organizationId: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                title: string | null;
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
        ctx: import("../trpc/context").Context;
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
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
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
                userId: string | null;
                id: string;
                status: import("@prisma/client").$Enums.DocumentStatus;
                organizationId: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                title: string | null;
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
        ctx: import("../trpc/context").Context;
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
                    policies: {
                        user: {
                            email: string;
                            fullName: string;
                        };
                        id: string;
                        status: import("@prisma/client").$Enums.PolicyStatus;
                        createdAt: Date;
                        title: string | null;
                    }[];
                    queries: {
                        query: string;
                        user: {
                            email: string;
                            fullName: string;
                        };
                        id: string;
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
                    organization: {
                        id: string;
                        name: string;
                    } | null;
                    id: string;
                    email: string;
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
                cache: import("../../modules/admin").CacheStats;
                storage: import("../../modules/admin").StorageStats;
                connections: import("../../modules/admin").ConnectionStats;
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
                    organization: {
                        id: string;
                        name: string;
                    } | null;
                    id: string;
                    email: string;
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
                period?: "daily" | "weekly" | "monthly" | undefined;
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
                status: "ACTIVE" | "SUSPENDED";
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
        ctx: import("../trpc/context").Context;
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
                digestFrequency?: "daily" | "weekly" | "monthly" | undefined;
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
        ctx: import("../trpc/context").Context;
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
            output: import("../../modules/analytics").ComplianceScoreReport | {
                currentScore: number;
                previousScore: number;
                change: number;
                grade: string;
                areaBreakdown: never[];
                generatedAt: Date;
            };
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
            output: import("../../modules/analytics").GapAnalysis | {
                gaps: never[];
                criticalGaps: number;
                highGaps: number;
                mediumGaps: number;
            };
            meta: object;
        }>;
        getDeadlineAlerts: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/analytics").DeadlineAlert[];
            meta: object;
        }>;
        getDocumentStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/analytics").DocumentStats | {
                total: number;
                byType: {};
                byStatus: {};
                totalSizeMB: number;
                recentUploads: number;
            };
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
                format?: "json" | "csv" | undefined;
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
 * import type { AppRouter } from '../../server/trpc/router';
 *
 * const client = createTRPCProxyClient<AppRouter>({
 *   links: [httpBatchLink({ url: 'http://localhost:3001/trpc' })],
 * });
 */
export type AppRouter = typeof appRouter;
//# sourceMappingURL=router.d.ts.map