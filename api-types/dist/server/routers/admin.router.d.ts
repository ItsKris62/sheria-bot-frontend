/**
 * Admin Router
 *
 * Administrative operations for system management.
 * All routes require ADMIN role.
 */
export declare const adminRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    /**
     * Get system dashboard statistics
     *
     * @admin
     */
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
    /**
     * List all users with pagination
     *
     * @admin
     */
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
    /**
     * Update user details (admin only)
     *
     * @admin
     */
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
    /**
     * Get system health status
     *
     * @admin
     */
    getSystemHealth: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: any;
        meta: object;
    }>;
    /**
     * Get audit logs with filtering and pagination
     *
     * @admin
     */
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
        output: import("@/modules/admin").PaginatedAuditLog;
        meta: object;
    }>;
    /**
     * Delete user account (admin only)
     *
     * @admin
     */
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
    /**
     * Suspend a user account (admin only)
     *
     * @admin
     */
    suspendUser: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            reason?: string | undefined;
        };
        output: import("@/modules/admin").AdminUserDetail;
        meta: object;
    }>;
    /**
     * Reactivate a suspended user account (admin only)
     *
     * @admin
     */
    reactivateUser: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
        };
        output: import("@/modules/admin").AdminUserDetail;
        meta: object;
    }>;
    /**
     * Get all organizations (admin only)
     *
     * @admin
     */
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
        output: import("@/modules/admin").PaginatedOrganizations;
        meta: object;
    }>;
    /**
     * Lightweight organization options for admin user provisioning.
     *
     * @admin
     */
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
    /**
     * Admin-visible durable AI job status.
     *
     * Shows queued/running/retrying/completed/dead-lettered work across the
     * generated policy pipeline and future AI/compliance jobs using AiJob.
     */
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
    /**
     * Get organization stats summary (admin only)
     *
     * @admin
     */
    getOrganizationStats: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("../../modules/admin/admin.types").OrganizationStats;
        meta: object;
    }>;
    /**
     * Get organization members (admin only)
     *
     * @admin
     */
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
    /**
     * Get organization details (admin only)
     *
     * @admin
     */
    getOrgDetails: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            orgId: string;
        };
        output: import("@/modules/admin").AdminOrgDetail;
        meta: object;
    }>;
    /**
     * Return the audit log entries for a specific organization (actions taken
     * by any user who belongs to that org), up to 500 most-recent rows.
     *
     * @admin
     */
    getOrgAuditLog: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            orgId: string;
        };
        output: import("@/modules/admin").AuditLogEntry[];
        meta: object;
    }>;
    /**
     * Suspend an organization (admin only)
     *
     * @admin
     */
    suspendOrganization: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            orgId: string;
            reason?: string | undefined;
        };
        output: import("@/modules/admin").AdminOrgDetail;
        meta: object;
    }>;
    /**
     * Reactivate a suspended organization (admin only)
     *
     * @admin
     */
    reactivateOrganization: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            orgId: string;
        };
        output: import("@/modules/admin").AdminOrgDetail;
        meta: object;
    }>;
    /**
     * Get system configuration (admin only)
     *
     * @admin
     */
    getSystemConfig: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@/modules/admin").SystemConfig;
        meta: object;
    }>;
    /**
     * Update system configuration (admin only)
     *
     * @admin
     */
    updateSystemConfig: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            config: Record<string, unknown>;
        };
        output: import("@/modules/admin").SystemConfig;
        meta: object;
    }>;
    /**
     * Get all feature flags (admin only)
     *
     * @admin
     */
    getFeatureFlags: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@/modules/admin").FeatureFlags;
        meta: object;
    }>;
    /**
     * Update a feature flag (admin only)
     *
     * @admin
     */
    updateFeatureFlag: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            flag: string;
            enabled: boolean;
        };
        output: import("@/modules/admin").FeatureFlags;
        meta: object;
    }>;
    /**
     * Set maintenance mode (admin only)
     *
     * @admin
     */
    setMaintenanceMode: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            enabled: boolean;
            message?: string | undefined;
        };
        output: import("@/modules/admin").MaintenanceStatus;
        meta: object;
    }>;
    /**
     * Get full system health details (admin only)
     * More detailed than the existing getSystemHealth
     *
     * @admin
     */
    /**
     * Get a single user's details (admin only)
     *
     * @admin
     */
    getUser: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
        };
        output: import("@/modules/admin").AdminUserDetail;
        meta: object;
    }>;
    /**
     * Get a user's audit log (admin only)
     *
     * @admin
     */
    getUserActivityLog: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
        };
        output: import("@/modules/admin").AuditLogEntry[];
        meta: object;
    }>;
    getDetailedHealth: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            cache: import("@/modules/admin").CacheStats | null;
            storage: import("@/modules/admin").StorageStats | null;
            connections: import("@/modules/admin").ConnectionStats | null;
            status: "healthy" | "degraded" | "down";
            services: {
                database: import("@/modules/admin").ServiceHealth;
                redis: import("@/modules/admin").ServiceHealth;
                pinecone: import("@/modules/admin").ServiceHealth;
                storage: import("@/modules/admin").ServiceHealth;
            };
            uptime: number;
            version: string;
            checkedAt: Date;
        };
        meta: object;
    }>;
    /**
     * Create an invitation for a user
     *
     * @admin
     */
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
    /**
     * List all invitations (with optional filters)
     *
     * @admin
     */
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
    /**
     * List users pending admin approval
     *
     * @admin
     */
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
    /**
     * Approve a user account (e.g., regulators after email verification)
     *
     * @admin
     */
    approveUser: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    /**
     * Reject a user account application
     *
     * @admin
     */
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
    /**
     * List organizations pending verification
     *
     * @admin
     */
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
    /**
     * Verify an organization (grant full access)
     *
     * @admin
     */
    verifyOrganization: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            orgId: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    /**
     * Reject an organization's verification request
     *
     * @admin
     */
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
    /**
     * Checklist generation success-rate metrics (Sprint 3B).
     * Returns all-time and today's counters from Redis.
     *
     * @admin
     */
    getChecklistMetrics: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            window?: "alltime" | "today" | undefined;
        } | undefined;
        output: {
            alltime: import("@/lib/metrics/checklist-metrics").ChecklistMetricsStats;
            today: import("@/lib/metrics/checklist-metrics").ChecklistMetricsStats;
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
        output: import("@/modules/admin").AdminUserDetail;
        meta: object;
    }>;
    impersonateUser: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
        };
        output: import("@/modules/admin").ImpersonationToken;
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
        output: import("@/modules/admin").AdminOrgDetail;
        meta: object;
    }>;
    updateOrganizationPlan: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            orgId: string;
            plan: "REGULATOR" | "STARTUP" | "BUSINESS" | "ENTERPRISE";
        };
        output: import("@/modules/admin").AdminOrgDetail;
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
        output: import("@/modules/admin").SubscriptionOverview;
        meta: object;
    }>;
    getBillingPlanCatalog: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@/modules/admin").BillingPlanCatalog;
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
        output: import("@/modules/admin").BillingPlanCatalog;
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
    /**
     * List all currently-active (non-expired) sessions for a given user.
     * Read-only  -  individual session revocation is not supported.
     * Use signOutUserEverywhere to invalidate all tokens at once.
     *
     * @admin
     */
    listUserActiveSessions: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
        };
        output: import("../../modules/admin/admin.types").SessionSummary[];
        meta: object;
    }>;
    /**
     * Sign a user out of ALL devices simultaneously.
     *
     * This writes a user-level JWT revocation sentinel in Redis so that every
     * in-flight token the user currently holds is rejected on its next request
     * (covers the full 1-hour Supabase access-token lifetime plus a 1-hour
     * safety margin).  All Session DB rows for the user are also deleted.
     *
     * This is NOT a per-session revoke  -  it revokes every token the user holds.
     *
     * @admin
     */
    signOutUserEverywhere: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    /**
     * Suspend or activate multiple users in a single call.
     * Wrapped in a Prisma transaction; each user's plan cache is NOT invalidated
     * here (status change does not affect plan context).
     *
     * @admin
     */
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
    /**
     * Change the subscription tier for multiple users' organizations.
     * Invalidates the Redis plan context cache for each affected user.
     *
     * @admin
     */
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
    /**
     * Returns payments with status FAILED, paginated.
     * Used by the admin billing page Failed Payments panel.
     *
     * @admin
     */
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
    /**
     * Generate a server-side analytics summary export and return a 5-minute
     * presigned download URL.
     *
     * Mirrors the same Section/Label/Value CSV the admin analytics page used to
     * build client-side. The file is stored at
     * `exports/analytics/<id>.csv` in the private R2 bucket.
     *
     * @admin
     */
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
    /**
     * Generate a server-side audit log export and return a 60-minute presigned
     * download URL.
     *
     * Format caps (hardcoded):
     *   - csv:  up to 10 000 rows
     *   - docx: up to  2 000 rows
     *
     * The file is stored at `exports/audit-logs/<id>.<ext>` in the private R2
     * bucket.  The presigned URL expires after 60 minutes.
     *
     * @admin
     */
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
//# sourceMappingURL=admin.router.d.ts.map