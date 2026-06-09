/**
 * Notification Module Utilities
 */
import { z } from 'zod';
import type { NotificationDTO } from './notification.types';
export declare const createNotificationSchema: z.ZodObject<{
    userId: z.ZodString;
    type: z.ZodString;
    title: z.ZodString;
    message: z.ZodString;
    link: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const bulkNotificationSchema: z.ZodObject<{
    userIds: z.ZodArray<z.ZodString>;
    type: z.ZodString;
    title: z.ZodString;
    message: z.ZodString;
    link: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const notificationFiltersSchema: z.ZodObject<{
    read: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    dateFrom: z.ZodOptional<z.ZodString>;
    dateTo: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const preferencesUpdateSchema: z.ZodObject<{
    emailEnabled: z.ZodOptional<z.ZodBoolean>;
    inAppEnabled: z.ZodOptional<z.ZodBoolean>;
    channels: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        email: z.ZodBoolean;
        inApp: z.ZodBoolean;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare function toNotificationDTO(n: Record<string, unknown>): NotificationDTO;
/**
 * Interpolate a template string with data values.
 * e.g. "Hello {{name}}" + { name: "Alice" } => "Hello Alice"
 */
export declare function interpolateTemplate(template: string, data: Record<string, unknown>): string;
export declare function unreadCountKey(userId: string): string;
export declare function prefsKey(userId: string): string;
//# sourceMappingURL=notification.utils.d.ts.map