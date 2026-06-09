/**
 * User Module Types
 * Type definitions for user profile and account operations
 */
import type { UserRole } from '@prisma/client';
/**
 * User profile data (public-safe fields)
 */
export interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    phone: string | null;
    avatarUrl: string | null;
    organizationId: string | null;
    organizationName: string | null;
    emailVerified: boolean;
    preferences: UserPreferences;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
}
/**
 * Input for updating user profile
 */
export interface UpdateProfileInput {
    name?: string;
    phone?: string;
    avatarUrl?: string;
}
/**
 * Input for changing email (requires verification)
 */
export interface ChangeEmailInput {
    newEmail: string;
    password: string;
}
/**
 * User preferences stored as JSON
 */
export interface UserPreferences {
    notifications: {
        email: boolean;
        inApp: boolean;
        policyReady: boolean;
        complianceAlerts: boolean;
        weeklyDigest: boolean;
    };
    ui: {
        theme: 'light' | 'dark' | 'system';
        language: string;
        timezone: string;
        dateFormat: string;
    };
    privacy: {
        showActivityStatus: boolean;
        allowAnalytics: boolean;
    };
}
/**
 * Default preferences for new users
 */
export declare const DEFAULT_PREFERENCES: UserPreferences;
/**
 * Partial preferences update
 */
export type UpdatePreferencesInput = Partial<{
    notifications: Partial<UserPreferences['notifications']>;
    ui: Partial<UserPreferences['ui']>;
    privacy: Partial<UserPreferences['privacy']>;
}>;
/**
 * Activity log entry
 */
export interface ActivityLogEntry {
    id: string;
    userId: string;
    action: ActivityAction;
    resourceType: ResourceType;
    resourceId: string | null;
    metadata: Record<string, any>;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
}
/**
 * Supported activity actions
 */
export type ActivityAction = 'LOGIN' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'PROFILE_UPDATE' | 'POLICY_CREATE' | 'POLICY_UPDATE' | 'POLICY_DELETE' | 'POLICY_EXPORT' | 'QUERY_SUBMIT' | 'DOCUMENT_UPLOAD' | 'DOCUMENT_DELETE' | 'ORG_JOIN' | 'ORG_LEAVE' | 'SETTINGS_CHANGE';
/**
 * Resource types for activity logging
 */
export type ResourceType = 'USER' | 'POLICY' | 'QUERY' | 'DOCUMENT' | 'ORGANIZATION' | 'SETTINGS';
/**
 * Filters for activity log queries
 */
export interface ActivityLogFilters {
    action?: ActivityAction;
    resourceType?: ResourceType;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}
/**
 * Paginated activity log response
 */
export interface PaginatedActivityLog {
    items: ActivityLogEntry[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
/**
 * User statistics
 */
export interface UserStats {
    policiesCreated: number;
    policiesPublished: number;
    queriesSubmitted: number;
    documentsUploaded: number;
    totalAITokensUsed: number;
    aiTokensThisMonth: number;
    storageUsedBytes: number;
    lastActiveAt: Date | null;
    loginCount: number;
    daysActive: number;
    quotas: {
        policiesRemaining: number;
        queriesRemaining: number;
        storageRemaining: number;
    };
}
/**
 * Account deletion request
 */
export interface DeleteAccountInput {
    password: string;
    reason?: string;
    feedback?: string;
}
/**
 * Account deletion result
 */
export interface DeleteAccountResult {
    success: boolean;
    message: string;
    scheduledDeletionDate: Date;
    dataExportUrl?: string;
}
/**
 * User data export (GDPR compliance)
 */
export interface UserDataExport {
    user: {
        profile: UserProfile;
        preferences: UserPreferences;
    };
    policies: Array<{
        id: string;
        title: string;
        content: string;
        createdAt: Date;
    }>;
    queries: Array<{
        id: string;
        query: string;
        response: string;
        createdAt: Date;
    }>;
    documents: Array<{
        id: string;
        name: string;
        uploadedAt: Date;
    }>;
    activityLog: ActivityLogEntry[];
    exportedAt: Date;
}
/**
 * Data export result
 */
export interface ExportDataResult {
    success: boolean;
    downloadUrl: string;
    expiresAt: Date;
    fileSizeBytes: number;
}
export declare const USER_CACHE_KEYS: {
    readonly PROFILE: (userId: string) => string;
    readonly PREFERENCES: (userId: string) => string;
    readonly STATS: (userId: string) => string;
    readonly ACTIVITY: (userId: string) => string;
};
export declare const USER_CACHE_TTL: {
    readonly PROFILE: 300;
    readonly PREFERENCES: 600;
    readonly STATS: 60;
    readonly ACTIVITY: 120;
};
export declare class UserError extends Error {
    code: UserErrorCode;
    statusCode: number;
    constructor(message: string, code: UserErrorCode, statusCode?: number);
}
export type UserErrorCode = 'USER_NOT_FOUND' | 'INVALID_PASSWORD' | 'EMAIL_ALREADY_EXISTS' | 'INVALID_UPDATE' | 'EXPORT_FAILED' | 'DELETION_FAILED' | 'RATE_LIMIT_EXCEEDED';
//# sourceMappingURL=user.types.d.ts.map