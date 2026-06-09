/**
 * Notification Module
 * In-app notifications, email alerts, preferences, and system announcements.
 *
 * Integrations:
 * - Prisma         -  notification persistence
 * - Redis          -  unread count cache & preferences cache
 * - MailerService  -  email delivery via Resend
 */
import { type CreateNotificationParams, type BulkNotificationParams, type AnnouncementParams, type NotificationFilters, type SystemNotificationFilters, type PaginatedNotifications, type NotificationDTO, type BulkResult, type NotificationPreferences, type NotificationTemplate, type TemplateParams, type EmailTemplate, type ComplianceAlertData, type PolicyUpdateData, type InviteEmailData, type AlertSeverity, type NotificationCategoryName, type NotificationCategoryPreferenceDTO } from './notification.types';
declare class NotificationModule {
    /**
     * Create a single notification and optionally deliver via email.
     */
    createNotification(params: CreateNotificationParams): Promise<NotificationDTO>;
    /**
     * Create notifications for multiple users.
     */
    createBulkNotifications(params: BulkNotificationParams): Promise<BulkResult>;
    /**
     * Create a system-wide announcement for all (or role-filtered) users.
     */
    createSystemAnnouncement(params: AnnouncementParams): Promise<NotificationDTO>;
    getNotifications(userId: string, filters: NotificationFilters): Promise<PaginatedNotifications>;
    getUnreadCount(userId: string): Promise<number>;
    getNotificationById(notificationId: string, userId: string): Promise<NotificationDTO>;
    markAsRead(notificationId: string, userId: string): Promise<NotificationDTO>;
    markAllAsRead(userId: string): Promise<number>;
    markAsUnread(notificationId: string, userId: string): Promise<NotificationDTO>;
    deleteNotification(notificationId: string, userId: string): Promise<void>;
    deleteAllRead(userId: string): Promise<number>;
    getNotificationPreferences(userId: string): Promise<NotificationPreferences>;
    updateNotificationPreferences(userId: string, prefs: Partial<NotificationPreferences>): Promise<NotificationPreferences>;
    sendEmailNotification(userId: string, _template: EmailTemplate, data: Record<string, unknown>): Promise<void>;
    sendComplianceAlert(userId: string, alertData: ComplianceAlertData): Promise<void>;
    sendPolicyUpdateAlert(orgId: string, policyData: PolicyUpdateData): Promise<void>;
    sendWelcomeEmail(userId: string): Promise<void>;
    sendPasswordResetEmail(userId: string, resetToken: string): Promise<void>;
    sendOrganizationInviteEmail(email: string, inviteData: InviteEmailData): Promise<void>;
    getNotificationTemplates(): Promise<NotificationTemplate[]>;
    createNotificationTemplate(params: TemplateParams): Promise<NotificationTemplate>;
    updateNotificationTemplate(templateId: string, params: Partial<TemplateParams>): Promise<NotificationTemplate>;
    getSystemNotifications(filters: SystemNotificationFilters): Promise<PaginatedNotifications>;
    sendSystemWideAlert(message: string, severity: AlertSeverity): Promise<void>;
    /**
     * Create a notification, respecting per-category in-app preferences.
     * SECURITY category always bypasses preference checks (cannot be disabled).
     */
    createCategorizedNotification(params: CreateNotificationParams): Promise<NotificationDTO | null>;
    getUnreadCountByCategory(userId: string): Promise<Record<NotificationCategoryName, number>>;
    getCategoryPreferences(userId: string): Promise<NotificationCategoryPreferenceDTO[]>;
    updateCategoryPreference(userId: string, category: NotificationCategoryName, inAppEnabled?: boolean, emailEnabled?: boolean): Promise<NotificationCategoryPreferenceDTO>;
    /**
     * Infer the NotificationCategory from the notification type.
     */
    private inferCategory;
    /**
     * Map extended notification type to the Prisma NotificationType enum.
     * All new types are native enum values  -  pass through directly.
     */
    private mapToPrismaType;
    /**
     * Lazy cleanup of notifications older than 90 days.
     * Throttled to once per 24 hours per user via Redis.
     */
    private lazyCleanupOldNotifications;
    private sendEmailForNotification;
    /**
     * Interpolate notification message template with context data.
     */
    interpolateMessage(template: string, data: Record<string, unknown>): string;
}
export declare const notificationModule: NotificationModule;
export { NotificationModule };
//# sourceMappingURL=notification.module.d.ts.map