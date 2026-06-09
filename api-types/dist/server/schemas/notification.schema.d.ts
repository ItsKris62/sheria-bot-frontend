import { z } from 'zod';
export declare const notificationCategorySchema: z.ZodEnum<{
    SECURITY: "SECURITY";
    COMPLIANCE: "COMPLIANCE";
    DOCUMENTS: "DOCUMENTS";
    ACCOUNT: "ACCOUNT";
    SUPPORT: "SUPPORT";
    SYSTEM: "SYSTEM";
}>;
export declare const listNotificationsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    unreadOnly: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<{
        SECURITY: "SECURITY";
        COMPLIANCE: "COMPLIANCE";
        DOCUMENTS: "DOCUMENTS";
        ACCOUNT: "ACCOUNT";
        SUPPORT: "SUPPORT";
        SYSTEM: "SYSTEM";
    }>>;
}, z.core.$strip>;
export declare const markAsReadSchema: z.ZodObject<{
    notificationId: z.ZodString;
}, z.core.$strip>;
export declare const deleteNotificationSchema: z.ZodObject<{
    notificationId: z.ZodString;
}, z.core.$strip>;
export declare const updateCategoryPreferenceSchema: z.ZodObject<{
    category: z.ZodEnum<{
        SECURITY: "SECURITY";
        COMPLIANCE: "COMPLIANCE";
        DOCUMENTS: "DOCUMENTS";
        ACCOUNT: "ACCOUNT";
        SUPPORT: "SUPPORT";
        SYSTEM: "SYSTEM";
    }>;
    inAppEnabled: z.ZodOptional<z.ZodBoolean>;
    emailEnabled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateNotificationPreferencesSchema: z.ZodObject<{
    emailEnabled: z.ZodOptional<z.ZodBoolean>;
    inAppEnabled: z.ZodOptional<z.ZodBoolean>;
    digestEnabled: z.ZodOptional<z.ZodBoolean>;
    digestFrequency: z.ZodOptional<z.ZodEnum<{
        monthly: "monthly";
        daily: "daily";
        weekly: "weekly";
    }>>;
    channels: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        email: z.ZodOptional<z.ZodBoolean>;
        inApp: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
//# sourceMappingURL=notification.schema.d.ts.map