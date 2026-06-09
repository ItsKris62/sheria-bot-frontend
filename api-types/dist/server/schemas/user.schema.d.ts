import { z } from 'zod';
/**
 * User Schemas
 *
 * Zod validation schemas for user management operations.
 */
/**
 * Update user profile
 *
 * @example
 * {
 *   name: "John Doe Updated",
 *   phone: "+254700123456"
 * }
 */
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
}, z.core.$strip>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
/**
 * Update user preferences
 *
 * @example
 * {
 *   theme: "dark",
 *   notifications: {
 *     email: true,
 *     push: false
 *   },
 *   language: "en"
 * }
 */
export declare const updatePreferencesSchema: z.ZodObject<{
    preferences: z.ZodRecord<z.ZodString, z.ZodAny>;
}, z.core.$strip>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
/**
 * Delete account confirmation
 *
 * @example
 * {
 *   confirmEmail: "user@example.com"
 * }
 */
export declare const deleteAccountSchema: z.ZodObject<{
    confirmEmail: z.ZodString;
}, z.core.$strip>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
/**
 * Revoke a specific session
 */
export declare const revokeSessionSchema: z.ZodObject<{
    sessionId: z.ZodString;
}, z.core.$strip>;
export type RevokeSessionInput = z.infer<typeof revokeSessionSchema>;
/**
 * TOTP setup initiation (no input needed  -  kept for procedure consistency)
 */
export declare const setupTotpSchema: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
export type SetupTotpInput = z.infer<typeof setupTotpSchema>;
/**
 * Confirm TOTP setup with a 6-digit code from the authenticator app
 */
export declare const confirmTotpSchema: z.ZodObject<{
    code: z.ZodString;
}, z.core.$strip>;
export type ConfirmTotpInput = z.infer<typeof confirmTotpSchema>;
/**
 * Disable TOTP  -  requires current password for security
 */
export declare const disableTotpSchema: z.ZodObject<{
    password: z.ZodString;
}, z.core.$strip>;
export type DisableTotpInput = z.infer<typeof disableTotpSchema>;
/**
 * Update all notification preferences (covers all 11 fields across all sections)
 *
 * All fields optional  -  supports partial updates (only send changed fields).
 * Backward-compatible with the existing 4-field "Specific Email Alerts" section.
 */
/**
 * Request a presigned upload URL for the user's avatar
 */
export declare const getAvatarUploadUrlSchema: z.ZodObject<{
    contentType: z.ZodEnum<{
        "image/png": "image/png";
        "image/jpeg": "image/jpeg";
        "image/webp": "image/webp";
    }>;
    fileSize: z.ZodNumber;
}, z.core.$strip>;
export type GetAvatarUploadUrlInput = z.infer<typeof getAvatarUploadUrlSchema>;
/**
 * Confirm avatar upload  -  persists the public URL after a successful R2 PUT
 */
export declare const confirmAvatarUploadSchema: z.ZodObject<{
    publicUrl: z.ZodString;
}, z.core.$strip>;
export type ConfirmAvatarUploadInput = z.infer<typeof confirmAvatarUploadSchema>;
/**
 * Update all notification preferences (covers all 11 fields across all sections)
 *
 * All fields optional  -  supports partial updates (only send changed fields).
 * Backward-compatible with the existing 4-field "Specific Email Alerts" section.
 */
export declare const updateAllNotificationPreferencesSchema: z.ZodObject<{
    regulatoryUpdates: z.ZodOptional<z.ZodBoolean>;
    deadlineReminders: z.ZodOptional<z.ZodBoolean>;
    reportReady: z.ZodOptional<z.ZodBoolean>;
    supportResponses: z.ZodOptional<z.ZodBoolean>;
    paymentDueReminder: z.ZodOptional<z.ZodBoolean>;
    complianceQueryReady: z.ZodOptional<z.ZodBoolean>;
    policyDocumentReady: z.ZodOptional<z.ZodBoolean>;
    documentIngestionComplete: z.ZodOptional<z.ZodBoolean>;
    realTimeAlerts: z.ZodOptional<z.ZodBoolean>;
    inAppSoundsEnabled: z.ZodOptional<z.ZodBoolean>;
    emailDigestEnabled: z.ZodOptional<z.ZodBoolean>;
    digestFrequency: z.ZodOptional<z.ZodEnum<{
        monthly: "monthly";
        daily: "daily";
        weekly: "weekly";
    }>>;
}, z.core.$strip>;
export type UpdateAllNotificationPreferencesInput = z.infer<typeof updateAllNotificationPreferencesSchema>;
//# sourceMappingURL=user.schema.d.ts.map