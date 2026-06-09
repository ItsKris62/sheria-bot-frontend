/**
 * Admin Module Utilities
 */
import { z } from 'zod';
import type { AdminUserDetail, AdminOrgDetail, AuditLogEntry } from './admin.types';
export declare const adminUserFiltersSchema: z.ZodObject<{
    role: z.ZodOptional<z.ZodEnum<{
        REGULATOR: "REGULATOR";
        STARTUP: "STARTUP";
        ENTERPRISE: "ENTERPRISE";
        ADMIN: "ADMIN";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        SUSPENDED: "SUSPENDED";
        ACTIVE: "ACTIVE";
        PENDING_VERIFICATION: "PENDING_VERIFICATION";
    }>>;
    organizationId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        email: "email";
        lastLoginAt: "lastLoginAt";
        createdAt: "createdAt";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export declare const adminOrgFiltersSchema: z.ZodObject<{
    subscriptionTier: z.ZodOptional<z.ZodString>;
    subscriptionStatus: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const suspendUserSchema: z.ZodObject<{
    reason: z.ZodString;
}, z.core.$strip>;
export declare const deleteUserSchema: z.ZodObject<{
    reason: z.ZodString;
}, z.core.$strip>;
export declare const frameworkSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    area: z.ZodString;
    country: z.ZodDefault<z.ZodString>;
    effectiveDate: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<{
        deprecated: "deprecated";
        active: "active";
        draft: "draft";
    }>>;
    documentIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const auditLogFiltersSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
    action: z.ZodOptional<z.ZodString>;
    entityType: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodString>;
    dateTo: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const systemConfigUpdateSchema: z.ZodObject<{
    maintenanceMode: z.ZodOptional<z.ZodBoolean>;
    maintenanceMessage: z.ZodOptional<z.ZodString>;
    maxFileUploadMB: z.ZodOptional<z.ZodNumber>;
    maxQueriesPerHour: z.ZodOptional<z.ZodNumber>;
    maxPoliciesPerHour: z.ZodOptional<z.ZodNumber>;
    aiApiKey: z.ZodOptional<z.ZodString>;
    aiDailyCostLimit: z.ZodOptional<z.ZodNumber>;
    aiPolicyModel: z.ZodOptional<z.ZodString>;
    aiQueryModel: z.ZodOptional<z.ZodString>;
    aiVerificationModel: z.ZodOptional<z.ZodString>;
    aiComplexAnalysisModel: z.ZodOptional<z.ZodString>;
    aiPolicyTemperature: z.ZodOptional<z.ZodNumber>;
    aiQueryTemperature: z.ZodOptional<z.ZodNumber>;
    availableAIModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    allowNewRegistrations: z.ZodOptional<z.ZodBoolean>;
    requireEmailVerification: z.ZodOptional<z.ZodBoolean>;
    defaultSubscriptionTier: z.ZodOptional<z.ZodString>;
    supportEmail: z.ZodOptional<z.ZodString>;
    sessionTimeoutHours: z.ZodOptional<z.ZodNumber>;
    passwordMinLength: z.ZodOptional<z.ZodNumber>;
    automatedBackupsEnabled: z.ZodOptional<z.ZodBoolean>;
    resourceUsageAlertThreshold: z.ZodOptional<z.ZodNumber>;
    webhookFailureAlertThreshold: z.ZodOptional<z.ZodNumber>;
    securityAlertEmail: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare function toAdminUserDetail(user: Record<string, unknown>, counts: {
    sessions: number;
    policies: number;
    queries: number;
}): AdminUserDetail;
export declare function toAdminOrgDetail(org: Record<string, unknown>, counts: {
    members: number;
    documents: number;
    policies: number;
}): AdminOrgDetail;
export declare function toAuditLogEntry(log: Record<string, unknown>): AuditLogEntry;
export declare function featureFlagsKey(): string;
export declare function systemConfigKey(): string;
export declare function maintenanceKey(): string;
export declare function impersonationKey(token: string): string;
export declare function frameworksKey(): string;
export declare function orgStatsKey(): string;
//# sourceMappingURL=admin.utils.d.ts.map