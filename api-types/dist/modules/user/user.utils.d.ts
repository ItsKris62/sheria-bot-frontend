/**
 * User Module Utilities
 * Helper functions for user operations
 */
import { z } from 'zod';
import type { UserProfile, UserPreferences, UpdatePreferencesInput, ActivityLogEntry, ActivityAction, ResourceType } from './user.types';
/**
 * Profile update validation schema
 */
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    avatarUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
/**
 * Email change validation schema
 */
export declare const changeEmailSchema: z.ZodObject<{
    newEmail: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
/**
 * Preferences update validation schema
 */
export declare const updatePreferencesSchema: z.ZodObject<{
    notifications: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodBoolean>;
        inApp: z.ZodOptional<z.ZodBoolean>;
        policyReady: z.ZodOptional<z.ZodBoolean>;
        complianceAlerts: z.ZodOptional<z.ZodBoolean>;
        weeklyDigest: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    ui: z.ZodOptional<z.ZodObject<{
        theme: z.ZodOptional<z.ZodEnum<{
            system: "system";
            dark: "dark";
            light: "light";
        }>>;
        language: z.ZodOptional<z.ZodString>;
        timezone: z.ZodOptional<z.ZodString>;
        dateFormat: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    privacy: z.ZodOptional<z.ZodObject<{
        showActivityStatus: z.ZodOptional<z.ZodBoolean>;
        allowAnalytics: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Activity log filters validation schema
 */
export declare const activityLogFiltersSchema: z.ZodObject<{
    action: z.ZodOptional<z.ZodEnum<{
        POLICY_UPDATE: "POLICY_UPDATE";
        LOGIN: "LOGIN";
        POLICY_EXPORT: "POLICY_EXPORT";
        LOGOUT: "LOGOUT";
        PASSWORD_CHANGE: "PASSWORD_CHANGE";
        PROFILE_UPDATE: "PROFILE_UPDATE";
        POLICY_CREATE: "POLICY_CREATE";
        POLICY_DELETE: "POLICY_DELETE";
        QUERY_SUBMIT: "QUERY_SUBMIT";
        DOCUMENT_UPLOAD: "DOCUMENT_UPLOAD";
        DOCUMENT_DELETE: "DOCUMENT_DELETE";
        ORG_JOIN: "ORG_JOIN";
        ORG_LEAVE: "ORG_LEAVE";
        SETTINGS_CHANGE: "SETTINGS_CHANGE";
    }>>;
    resourceType: z.ZodOptional<z.ZodEnum<{
        POLICY: "POLICY";
        USER: "USER";
        DOCUMENT: "DOCUMENT";
        QUERY: "QUERY";
        ORGANIZATION: "ORGANIZATION";
        SETTINGS: "SETTINGS";
    }>>;
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Account deletion validation schema
 */
export declare const deleteAccountSchema: z.ZodObject<{
    password: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    feedback: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Convert database user to profile (safe for client)
 */
export declare function toUserProfile(user: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone: string | null;
    avatarUrl?: string | null;
    organizationId: string | null;
    organization?: {
        name: string;
    } | null;
    emailVerified: boolean;
    preferences?: any;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date | null;
}): UserProfile;
/**
 * Default preferences for new users
 */
export declare const defaultPreferences: UserPreferences;
/**
 * Parse preferences from database (handles null/undefined/JSON)
 */
export declare function parsePreferences(raw: any): UserPreferences;
/**
 * Merge partial preferences with existing preferences
 */
export declare function mergePreferences(existing: UserPreferences, updates: UpdatePreferencesInput): UserPreferences;
/**
 * Validate timezone string
 */
export declare function isValidTimezone(timezone: string): boolean;
/**
 * Create activity log entry data
 */
export declare function createActivityEntry(params: {
    userId: string;
    action: ActivityAction;
    resourceType: ResourceType;
    resourceId?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}): Omit<ActivityLogEntry, 'id' | 'createdAt'>;
/**
 * Format activity action for display
 */
export declare function formatActivityAction(action: ActivityAction): string;
/**
 * Get activity icon based on action
 */
export declare function getActivityIcon(action: ActivityAction): string;
/**
 * Calculate days since a date
 */
export declare function daysSince(date: Date): number;
/**
 * Format bytes to human-readable string
 */
export declare function formatBytes(bytes: number): string;
/**
 * Calculate remaining quota
 */
export declare function calculateRemainingQuota(used: number, limit: number): {
    remaining: number;
    percentage: number;
};
/**
 * Generate data export filename
 */
export declare function generateExportFilename(userId: string): string;
/**
 * Anonymize user data for soft delete
 */
export declare function anonymizeUserData(userId: string): {
    email: string;
    name: string;
    phone: null;
};
/**
 * Generate account deletion confirmation email
 */
export declare function generateDeletionEmail(name: string, scheduledDate: Date, downloadUrl?: string): {
    subject: string;
    text: string;
    html: string;
};
/**
 * Generate email change verification email
 */
export declare function generateEmailChangeEmail(name: string, newEmail: string, verificationUrl: string): {
    subject: string;
    text: string;
    html: string;
};
//# sourceMappingURL=user.utils.d.ts.map