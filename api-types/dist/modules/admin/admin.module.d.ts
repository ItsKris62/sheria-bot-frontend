/**
 * Admin Module
 * Superadmin capabilities: user/org management, content moderation,
 * system configuration, platform monitoring, regulatory framework management.
 *
 * All destructive operations are logged to the AuditLog with before/after state.
 * Impersonation tokens are short-lived (15 min) and stored only in Redis.
 */
import { type AdminUserFilters, type AdminOrgFilters, type AdminUserDetail, type AdminOrgDetail, type PaginatedUsers, type PaginatedOrganizations, type ModerationFilters, type ImpersonationToken, type SystemConfig, type FeatureFlags, type MaintenanceStatus, type SystemHealth, type DatabaseStats, type CacheStats, type VectorDBStats, type StorageStats, type ConnectionStats, type ErrorLogFilters, type PaginatedErrorLog, type AuditLogFilters, type AuditLogEntry, type PaginatedAuditLog, type RegulatoryFramework, type FrameworkParams, type PendingInvitation, type BillingPlanCatalog, type BillingPlanCatalogUpdateInput, type SubscriptionPlan, type Subscription, type SubscriptionOverview, type CreateUserInput, type UpdateOrganizationInput, type UserGrowthData, type RevenueMetrics, type AIUsageMetrics, type SubscriptionBreakdown, type LoginHistoryFilters, type LoginHistoryEntry, type PaginatedLoginHistory, type ContentFilters, type ContentItem, type PaginatedContent, type OrganizationStats, type PaymentSummary, type OrgPaymentHistory, type SessionSummary, type AuditLogExportFilters, type AdminOperationalOverview } from './admin.types';
declare class AdminModule {
    getAllUsers(filters: AdminUserFilters): Promise<PaginatedUsers>;
    getUserDetails(userId: string): Promise<AdminUserDetail>;
    updateUserRole(adminId: string, userId: string, role: string): Promise<AdminUserDetail>;
    suspendUser(adminId: string, userId: string, reason: string): Promise<AdminUserDetail>;
    reactivateUser(adminId: string, userId: string): Promise<AdminUserDetail>;
    deleteUser(adminId: string, userId: string, reason: string): Promise<void>;
    /**
     * Create a short-lived (15 min) impersonation token stored only in Redis.
     */
    impersonateUser(adminId: string, targetUserId: string): Promise<ImpersonationToken>;
    forcePasswordReset(adminId: string, userId: string): Promise<void>;
    getUserAuditLog(userId: string): Promise<AuditLogEntry[]>;
    getAllOrganizations(filters: AdminOrgFilters): Promise<PaginatedOrganizations>;
    getOrganizationStats(): Promise<OrganizationStats>;
    getOrganizationDetails(orgId: string): Promise<AdminOrgDetail>;
    getOrgMembers(orgId: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: string;
        status: string;
        createdAt: Date;
    }[]>;
    suspendOrganization(adminId: string, orgId: string, reason: string): Promise<AdminOrgDetail>;
    reactivateOrganization(adminId: string, orgId: string): Promise<AdminOrgDetail>;
    deleteOrganization(adminId: string, orgId: string, reason: string): Promise<void>;
    updateOrganizationPlan(adminId: string, orgId: string, plan: SubscriptionPlan): Promise<AdminOrgDetail>;
    getOrganizationAuditLog(orgId: string): Promise<AuditLogEntry[]>;
    getPendingDocuments(filters: ModerationFilters): Promise<{
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
    }[]>;
    approveDocument(documentId: string, adminId: string): Promise<{
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
    }>;
    rejectDocument(documentId: string, adminId: string, reason: string): Promise<{
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
    }>;
    flagDocument(documentId: string, adminId: string, reason: string): Promise<{
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
    }>;
    getPendingPolicies(filters: ModerationFilters): Promise<{
        id: string;
        title: string | null;
        userId: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
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
    }[]>;
    approvePolicy(policyId: string, adminId: string): Promise<{
        id: string;
        title: string | null;
        userId: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
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
    }>;
    rejectPolicy(policyId: string, adminId: string, reason: string): Promise<{
        id: string;
        title: string | null;
        userId: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
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
    }>;
    getSystemConfig(): Promise<SystemConfig>;
    updateSystemConfig(adminId: string, config: Partial<SystemConfig>): Promise<SystemConfig>;
    getFeatureFlags(): Promise<FeatureFlags>;
    updateFeatureFlag(adminId: string, flag: string, enabled: boolean): Promise<FeatureFlags>;
    getMaintenanceMode(): Promise<MaintenanceStatus>;
    setMaintenanceMode(adminId: string, enabled: boolean, message?: string): Promise<MaintenanceStatus>;
    getSystemHealth(): Promise<SystemHealth>;
    getOperationalOverview(): Promise<AdminOperationalOverview>;
    getDatabaseStats(): Promise<DatabaseStats>;
    getCacheStats(): Promise<CacheStats>;
    getVectorDBStats(): Promise<VectorDBStats>;
    getStorageStats(): Promise<StorageStats>;
    getActiveConnections(): Promise<ConnectionStats>;
    getErrorLog(_filters: ErrorLogFilters): Promise<PaginatedErrorLog>;
    getAuditLog(filters: AuditLogFilters): Promise<PaginatedAuditLog>;
    getRegulatoryFrameworks(): Promise<RegulatoryFramework[]>;
    createRegulatoryFramework(adminId: string, params: FrameworkParams): Promise<RegulatoryFramework>;
    updateRegulatoryFramework(adminId: string, frameworkId: string, params: Partial<FrameworkParams>): Promise<RegulatoryFramework>;
    deleteRegulatoryFramework(adminId: string, frameworkId: string): Promise<void>;
    getPendingInvitations(): Promise<PendingInvitation[]>;
    resendInvitation(adminId: string, invitationId: string): Promise<void>;
    revokeInvitation(adminId: string, invitationId: string): Promise<void>;
    getSubscriptionOverview(): Promise<SubscriptionOverview>;
    getBillingPlanCatalog(): Promise<BillingPlanCatalog>;
    updateBillingPlanCatalog(adminId: string, input: BillingPlanCatalogUpdateInput): Promise<BillingPlanCatalog>;
    updateUserSubscription(adminId: string, userId: string, plan: SubscriptionPlan): Promise<Subscription>;
    createUser(adminId: string, input: CreateUserInput, requestId: string): Promise<AdminUserDetail>;
    updateOrganization(adminId: string, orgId: string, input: UpdateOrganizationInput): Promise<AdminOrgDetail>;
    getUserGrowth(period: 'daily' | 'weekly' | 'monthly', dateFrom: Date, dateTo: Date): Promise<UserGrowthData>;
    getRevenueMetrics(dateFrom: Date, dateTo: Date): Promise<RevenueMetrics>;
    getAIUsageMetrics(dateFrom: Date, dateTo: Date): Promise<AIUsageMetrics>;
    /**
     * Returns the most recent payments across all orgs.
     * Amounts are normalized to major units (KES) via toKES().
     */
    getRecentPayments(limit: number): Promise<PaymentSummary[]>;
    /**
     * Returns payment history for a single organization, paginated.
     * Amounts are normalized to major units (KES) via toKES().
     */
    getOrgPaymentHistory(orgId: string, page: number, limit: number): Promise<OrgPaymentHistory>;
    /**
     * Subscription plan/status breakdown across all organizations.
     * Optional dateFrom/dateTo filters to cohort by org creation date.
     */
    getSubscriptionBreakdown(filters?: {
        dateFrom?: Date;
        dateTo?: Date;
    }): Promise<SubscriptionBreakdown>;
    recordLoginHistory(entry: Omit<LoginHistoryEntry, 'id' | 'createdAt'>): Promise<void>;
    getLoginHistory(filters: LoginHistoryFilters): Promise<PaginatedLoginHistory>;
    createContent(adminId: string, input: {
        contentType: 'BLOG_POST' | 'KNOWLEDGE_BASE_ARTICLE';
        title: string;
        excerpt?: string;
        category?: string;
    }): Promise<{
        id: string;
    }>;
    listContent(filters: ContentFilters): Promise<PaginatedContent>;
    updateContentStatus(adminId: string, documentId: string, contentStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'UNDER_REVIEW'): Promise<ContentItem>;
    deleteContent(adminId: string, documentId: string): Promise<void>;
    /**
     * Returns all currently-active (non-expired) sessions for a user.
     * Read-only  -  individual session revocation is not exposed; use
     * signOutUserEverywhere to invalidate all tokens at once.
     */
    listUserActiveSessions(userId: string): Promise<SessionSummary[]>;
    /**
     * Signs a user out of ALL devices by:
     *   1. Writing a user-level token revocation sentinel in Redis  -  every
     *      in-flight JWT issued before this timestamp will be rejected on its
     *      next request (covers the full 1-hour Supabase token lifetime + margin).
     *   2. Deleting all Session rows for the user so the session list is empty.
     *   3. Writing an audit log entry.
     *
     * This does NOT revoke a single session  -  it revokes every token the user
     * currently holds.  Callers should make this semantics clear in the UI.
     */
    signOutUserEverywhere(adminId: string, userId: string): Promise<void>;
    /** Maximum rows fetched for each export format (hardcoded  -  not configurable). */
    private static readonly AUDIT_LOG_CSV_MAX_ROWS;
    private static readonly AUDIT_LOG_DOCX_MAX_ROWS;
    /** 15-minute presigned URL TTL for audit log exports (TD-005). */
    private static readonly AUDIT_LOG_EXPORT_URL_TTL;
    /**
     * Generates a server-side audit log export, uploads it to R2, and returns
     * a 60-minute presigned GET URL.
     *
     * - CSV: up to 10 000 rows; content-type text/csv
     * - DOCX: up to 2 000 rows; content-type application/vnd.openxmlformats-officedocument.wordprocessingml.document
     *
     * The export key is `exports/audit-logs/<nanoid(12)>.<ext>`.
     */
    exportAuditLogs(filters: AuditLogExportFilters, format: 'csv' | 'docx'): Promise<{
        url: string;
        expiresAt: Date;
    }>;
    exportAnalyticsCsv(dateFrom: Date, dateTo: Date): Promise<{
        url: string;
        expiresAt: Date;
    }>;
    private buildAuditLogCsv;
    private buildAuditLogDocx;
    /**
     * Deletes the user-scoped plan context cache (`sheriabot:planctx:{userId}`)
     * for every member of an org so that `withPlanContext` re-fetches from DB
     * on the next request rather than serving the stale 5-minute cached plan.
     *
     * Non-fatal: a Redis failure must never prevent the plan update from being
     * visible on the next request (the DB is the source of truth; the cache
     * simply accelerates reads).
     */
    private invalidatePlanCacheForOrg;
    private invalidateOrganizationStatsCache;
    /**
     * Public facade for the private writeAuditLog helper.
     * Use this from routers that need to record an audit entry without going
     * through a full service method (e.g., the export procedures).
     */
    writeAuditLogEntry(adminId: string, action: string, entityType: string, entityId: string, metadata: Record<string, unknown>): Promise<void>;
    private writeAuditLog;
}
export declare const adminModule: AdminModule;
export { AdminModule };
//# sourceMappingURL=admin.module.d.ts.map