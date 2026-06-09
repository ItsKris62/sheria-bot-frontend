/**
 * User Module
 * Handles all user profile and account management business logic
 *
 * Operations:
 * - Profile management (get, update)
 * - Preferences management
 * - Activity logging and retrieval
 * - User statistics
 * - Account deletion (GDPR compliant)
 * - Data export (GDPR compliant)
 */
import { type UserProfile, type UpdateProfileInput, type UserPreferences, type UpdatePreferencesInput, type ActivityLogFilters, type PaginatedActivityLog, type ActivityAction, type ResourceType, type UserStats, type DeleteAccountInput, type DeleteAccountResult, type ExportDataResult } from './user.types';
/**
 * User Module Class
 * Encapsulates all user-related business logic
 */
declare class UserModule {
    private readonly appUrl;
    constructor();
    /**
     * Get user profile by ID
     * Uses caching for performance
     */
    getProfile(userId: string): Promise<UserProfile>;
    /**
     * Update user profile
     */
    updateProfile(userId: string, updates: UpdateProfileInput): Promise<UserProfile>;
    /**
     * Request email change (requires verification)
     */
    requestEmailChange(userId: string, newEmail: string, password: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Confirm email change with verification token
     */
    confirmEmailChange(token: string): Promise<UserProfile>;
    /**
     * Get user preferences
     */
    getPreferences(userId: string): Promise<UserPreferences>;
    /**
     * Update user preferences
     */
    updatePreferences(userId: string, updates: UpdatePreferencesInput): Promise<UserPreferences>;
    /**
     * Track user activity
     */
    trackActivity(userId: string, action: ActivityAction, resourceType: ResourceType, resourceId: string | null, metadata?: Record<string, any>, options?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<void>;
    /**
     * Get user activity log with pagination and filters
     */
    getActivityLog(userId: string, filters?: ActivityLogFilters): Promise<PaginatedActivityLog>;
    /**
     * Get user statistics
     */
    getUserStats(userId: string): Promise<UserStats>;
    /**
     * Delete user account (GDPR compliant)
     * - Exports user data
     * - Schedules permanent deletion (30 days)
     * - Anonymizes immediately
     */
    deleteAccount(userId: string, input: DeleteAccountInput): Promise<DeleteAccountResult>;
    /**
     * Cancel account deletion (if within 30-day window)
     */
    cancelAccountDeletion(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Export all user data (GDPR compliance)
     */
    exportUserData(userId: string): Promise<ExportDataResult>;
    /**
     * Invalidate all user-related caches
     */
    private invalidateUserCache;
}
export declare const userModule: UserModule;
export { UserModule };
//# sourceMappingURL=user.module.d.ts.map