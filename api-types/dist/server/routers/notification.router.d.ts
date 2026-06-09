import type { NotificationCategoryName } from '@/modules/notification/notification.types';
/**
 * Notification Router
 *
 * In-app notification management: list, mark-as-read, preferences.
 * Business logic delegated to NotificationModule.
 */
export declare const notificationRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * List notifications for the current user
     *
     * @protected
     */
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
            unreadOnly?: boolean | undefined;
            type?: string | undefined;
            category?: "SECURITY" | "COMPLIANCE" | "DOCUMENTS" | "ACCOUNT" | "SUPPORT" | "SYSTEM" | undefined;
        };
        output: import("@/modules/notification").PaginatedNotifications;
        meta: object;
    }>;
    /**
     * Get unread notification count (for bell badge)
     *
     * @protected
     */
    getUnreadCount: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            count: number;
        };
        meta: object;
    }>;
    /**
     * Mark a single notification as read
     *
     * @protected
     */
    markAsRead: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            notificationId: string;
        };
        output: import("@/modules/notification").NotificationDTO;
        meta: object;
    }>;
    /**
     * Mark all notifications as read
     *
     * @protected
     */
    markAllAsRead: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            count: number;
            success: boolean;
        };
        meta: object;
    }>;
    /**
     * Delete a notification
     *
     * @protected
     */
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
    /**
     * Delete all read notifications
     *
     * @protected
     */
    deleteAllRead: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            count: number;
            success: boolean;
        };
        meta: object;
    }>;
    /**
     * Get notification preferences
     *
     * @protected
     */
    getPreferences: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@/modules/notification").NotificationPreferences;
        meta: object;
    }>;
    /**
     * Update notification preferences
     *
     * @protected
     */
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
        output: import("@/modules/notification").NotificationPreferences;
        meta: object;
    }>;
    /**
     * Get unread notification count broken down by category
     *
     * @protected
     */
    unreadCountByCategory: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: Record<NotificationCategoryName, number>;
        meta: object;
    }>;
    /**
     * Get per-category notification preferences (seeds defaults if none exist)
     *
     * @protected
     */
    getCategoryPreferences: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@/modules/notification/notification.types").NotificationCategoryPreferenceDTO[];
        meta: object;
    }>;
    /**
     * Update in-app or email toggle for a single notification category.
     * SECURITY category in-app toggle cannot be turned off.
     *
     * @protected
     */
    updateCategoryPreference: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            category: "SECURITY" | "COMPLIANCE" | "DOCUMENTS" | "ACCOUNT" | "SUPPORT" | "SYSTEM";
            inAppEnabled?: boolean | undefined;
            emailEnabled?: boolean | undefined;
        };
        output: import("@/modules/notification/notification.types").NotificationCategoryPreferenceDTO;
        meta: object;
    }>;
    /**
     * Get all system notifications (admin only)
     *
     * @admin
     */
    getSystemNotifications: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
            unreadOnly?: boolean | undefined;
            type?: string | undefined;
            category?: "SECURITY" | "COMPLIANCE" | "DOCUMENTS" | "ACCOUNT" | "SUPPORT" | "SYSTEM" | undefined;
        };
        output: import("@/modules/notification").PaginatedNotifications;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=notification.router.d.ts.map