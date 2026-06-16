/**
 * Notification Module Types
 */
export type ExtendedNotificationType = 'COMPLIANCE_ALERT' | 'POLICY_UPDATE' | 'DOCUMENT_PROCESSED' | 'ORGANIZATION_INVITE' | 'SYSTEM_ANNOUNCEMENT' | 'REQUIREMENT_DUE' | 'SUBSCRIPTION_ALERT' | 'REPORT_READY' | 'MEMBER_JOINED' | 'POLICY_READY' | 'COMMENT_ADDED' | 'REVIEW_REQUESTED' | 'SYSTEM_UPDATE' | 'TICKET_CREATED' | 'TICKET_STATUS_UPDATE' | 'TICKET_RESPONSE' | 'PASSWORD_CHANGED' | 'PASSWORD_CHANGE_FAILED' | 'LOGIN_NEW_DEVICE' | 'CHECKLIST_GENERATED' | 'CHECKLIST_COMPLETED' | 'GAP_ANALYSIS_STARTED' | 'GAP_ANALYSIS_COMPLETED' | 'CORPUS_GAP_REPORT_INGESTED' | 'DOCUMENT_UPLOADED' | 'DOCUMENT_DELETED' | 'PROFILE_UPDATED' | 'ORGANIZATION_UPDATED' | 'SUBSCRIPTION_CHANGED' | 'SUBSCRIPTION_EXPIRING' | 'SUPPORT_TICKET_CREATED' | 'SUPPORT_TICKET_UPDATED' | 'EVENT_CREATED' | 'EVENT_REMINDER';
export type NotificationCategoryName = 'SECURITY' | 'COMPLIANCE' | 'DOCUMENTS' | 'ACCOUNT' | 'SUPPORT' | 'SYSTEM';
export type AlertSeverity = 'info' | 'warning' | 'critical';
export type EmailTemplate = 'welcome' | 'password_reset' | 'compliance_alert' | 'policy_ready' | 'org_invite' | 'requirement_due' | 'subscription_alert' | 'report_ready';
export declare const NOTIFICATION_CONSTANTS: {
    readonly REDIS_KEYS: {
        readonly UNREAD_COUNT: "notif:unread:";
        readonly USER_PREFS: "notif:prefs:";
        readonly NOTIFICATION: "notif:";
        readonly CATEGORY_CLEANUP: "notification:cleanup:";
    };
    readonly CACHE_TTL: {
        readonly UNREAD_COUNT: 300;
        readonly PREFERENCES: 3600;
        readonly NOTIFICATION: 3600;
        readonly CLEANUP_THROTTLE: 86400;
    };
    readonly LIMITS: {
        readonly MAX_BULK: 500;
        readonly PAGE_SIZE: 20;
        readonly BATCH_EMAIL_SIZE: 50;
    };
    readonly CLEANUP_AGE_DAYS: 90;
};
export interface NotificationPreferences {
    userId: string;
    emailEnabled: boolean;
    inAppEnabled: boolean;
    channels: {
        compliance_alert: {
            email: boolean;
            inApp: boolean;
        };
        policy_update: {
            email: boolean;
            inApp: boolean;
        };
        document_processed: {
            email: boolean;
            inApp: boolean;
        };
        organization_invite: {
            email: boolean;
            inApp: boolean;
        };
        system_announcement: {
            email: boolean;
            inApp: boolean;
        };
        requirement_due: {
            email: boolean;
            inApp: boolean;
        };
        corpus_gap_report_ingested: {
            email: boolean;
            inApp: boolean;
        };
        subscription_alert: {
            email: boolean;
            inApp: boolean;
        };
        report_ready: {
            email: boolean;
            inApp: boolean;
        };
        member_joined: {
            email: boolean;
            inApp: boolean;
        };
    };
}
export declare const DEFAULT_NOTIFICATION_PREFERENCES: Omit<NotificationPreferences, 'userId'>;
export interface CreateNotificationParams {
    userId: string;
    type: ExtendedNotificationType;
    category?: NotificationCategoryName;
    title: string;
    message: string;
    link?: string;
    eventId?: string;
    metadata?: Record<string, unknown>;
}
export interface NotificationCategoryPreferenceDTO {
    id: string;
    userId: string;
    category: NotificationCategoryName;
    inAppEnabled: boolean;
    emailEnabled: boolean;
}
export interface BulkNotificationParams {
    userIds: string[];
    type: ExtendedNotificationType;
    title: string;
    message: string;
    link?: string;
    metadata?: Record<string, unknown>;
}
export interface AnnouncementParams {
    title: string;
    message: string;
    severity: AlertSeverity;
    link?: string;
    targetRoles?: string[];
}
export interface NotificationFilters {
    read?: boolean;
    type?: ExtendedNotificationType;
    category?: NotificationCategoryName;
    page?: number;
    limit?: number;
    dateFrom?: Date;
    dateTo?: Date;
}
export interface SystemNotificationFilters extends NotificationFilters {
    userId?: string;
    types?: ExtendedNotificationType[];
}
export interface NotificationDTO {
    id: string;
    userId: string;
    type: string;
    category: NotificationCategoryName;
    title: string;
    message: string;
    link: string | null;
    read: boolean;
    readAt: Date | null;
    metadata: Record<string, unknown> | null;
    createdAt: Date;
}
export interface PaginatedNotifications {
    items: NotificationDTO[];
    nextCursor: string | null;
    total: number;
    page: number;
    limit: number;
    unreadCount: number;
}
export interface BulkResult {
    created: number;
    failed: number;
    total: number;
}
export interface NotificationTemplate {
    id: string;
    name: string;
    type: ExtendedNotificationType;
    titleTemplate: string;
    messageTemplate: string;
    emailTemplate: EmailTemplate | null;
    createdAt: Date;
}
export interface TemplateParams {
    name: string;
    type: ExtendedNotificationType;
    titleTemplate: string;
    messageTemplate: string;
    emailTemplate?: EmailTemplate;
}
export interface ComplianceAlertData {
    orgName: string;
    area: string;
    score: number;
    message: string;
    actionUrl: string;
}
export interface PolicyUpdateData {
    policyTitle: string;
    updatedBy: string;
    changesSummary: string;
    policyUrl: string;
}
export interface InviteEmailData {
    inviterName: string;
    orgName: string;
    role: string;
    acceptUrl: string;
    expiresAt: Date;
}
//# sourceMappingURL=notification.types.d.ts.map