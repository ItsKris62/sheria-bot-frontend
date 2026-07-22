/**
 * User Router
 *
 * Handles user profile management, preferences, session management, and 2FA.
 * All routes require authentication.
 */
export declare const userRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Get current user profile
     */
    getProfile: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {};
        meta: object;
    }>;
    /**
     * Update user profile (name, phone)
     */
    updateProfile: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name?: string | undefined;
            phone?: string | undefined;
        };
        output: {
            success: boolean;
            user: {
                id: string;
                email: string;
                phone: string | null;
                fullName: string;
                role: import(".prisma/client").$Enums.UserRole;
                updatedAt: Date;
            };
        };
        meta: object;
    }>;
    /**
     * Change password (hardened)
     *
     * Security controls applied in order:
     * 1. Rate limiting (5 per 15 min per userId) before any DB work.
     * 2. Current password verification via bcrypt.
     * 3. New password hashed and saved to Prisma.
     * 4. Supabase Auth password updated so Supabase-native flows also reflect the change.
     * 5. All Supabase sessions revoked (old token can no longer be used).
     * 6. Redis user-session cache cleared.
     * 7. Other Prisma sessions deleted.
     * 8. Success logged.
     *
     * The caller (frontend) must call logout() after receiving success  -  all
     * Supabase sessions are invalidated so the current token is no longer valid.
     */
    changePassword: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            currentPassword: string;
            newPassword: string;
            confirmPassword: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Update user preferences (timezone, language, currency, jobTitle, etc.)
     */
    updatePreferences: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            preferences: Record<string, any>;
        };
        output: {
            success: boolean;
            preferences: Record<string, any>;
        };
        meta: object;
    }>;
    /**
     * Get all active sessions for the current user
     */
    getSessions: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: any;
            device: any;
            ipAddress: any;
            createdAt: any;
            expiresAt: any;
            isCurrent: boolean;
        }[];
        meta: object;
    }>;
    /**
     * Revoke a specific session by ID
     */
    revokeSession: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            sessionId: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    /**
     * Revoke all sessions except the current one
     */
    revokeOtherSessions: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            success: boolean;
            sessionsRevoked: number;
        };
        meta: object;
    }>;
    /**
     * Revoke ALL sessions (logout from all devices)
     */
    revokeAllSessions: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            success: boolean;
            sessionsRevoked: number;
        };
        meta: object;
    }>;
    /**
     * Get TOTP / 2FA status for current user
     */
    getTotpStatus: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            enabled: boolean;
        };
        meta: object;
    }>;
    /**
     * Initiate TOTP setup  -  returns secret + otpauth URI for QR code display
     */
    setupTotp: import("@trpc/server").TRPCMutationProcedure<{
        input: Record<string, never> | undefined;
        output: {
            secret: string;
            otpauth: string;
        };
        meta: object;
    }>;
    /**
     * Confirm TOTP setup  -  verify first code from authenticator app and enable 2FA
     */
    confirmTotpSetup: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            code: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Disable TOTP 2FA  -  requires current password for security confirmation
     */
    disableTotp: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            password: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Delete user account (soft delete)
     */
    deleteAccount: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            confirmEmail: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Get the current user's notification preferences
     */
    getNotificationPreferences: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            regulatoryUpdates: boolean;
            deadlineReminders: boolean;
            reportReady: boolean;
            supportResponses: boolean;
            paymentDueReminder: boolean;
            complianceQueryReady: boolean;
            policyDocumentReady: boolean;
            documentIngestionComplete: boolean;
            realTimeAlerts: boolean;
            inAppSoundsEnabled: any;
            emailDigestEnabled: boolean;
            digestFrequency: string;
        };
        meta: object;
    }>;
    /**
     * Get a presigned PUT URL for direct browser-to-R2 avatar upload.
     * The client must PUT the image file to `uploadUrl`, then call
     * `confirmAvatarUpload` with the returned `publicUrl`.
     */
    getAvatarUploadUrl: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            contentType: "image/png" | "image/jpeg" | "image/webp";
            fileSize: number;
        };
        output: import("@/modules/user/avatar.service").AvatarUploadUrlResult;
        meta: object;
    }>;
    /**
     * Confirm a completed avatar upload  -  persists the public URL to the user
     * profile and invalidates the profile cache.
     */
    confirmAvatarUpload: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            publicUrl: string;
        };
        output: import("@/modules/user/avatar.service").AvatarUpdateResult;
        meta: object;
    }>;
    /**
     * Delete the current user's avatar from R2 and clear the profile field.
     */
    deleteAvatar: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: import("@/modules/user/avatar.service").AvatarUpdateResult;
        meta: object;
    }>;
    /**
     * Update the current user's notification preferences
     */
    updateNotificationPreferences: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            regulatoryUpdates?: boolean | undefined;
            deadlineReminders?: boolean | undefined;
            reportReady?: boolean | undefined;
            supportResponses?: boolean | undefined;
            paymentDueReminder?: boolean | undefined;
            complianceQueryReady?: boolean | undefined;
            policyDocumentReady?: boolean | undefined;
            documentIngestionComplete?: boolean | undefined;
            realTimeAlerts?: boolean | undefined;
            inAppSoundsEnabled?: boolean | undefined;
            emailDigestEnabled?: boolean | undefined;
            digestFrequency?: "monthly" | "daily" | "weekly" | undefined;
        };
        output: {
            regulatoryUpdates: boolean;
            deadlineReminders: boolean;
            reportReady: boolean;
            supportResponses: boolean;
            paymentDueReminder: boolean;
            complianceQueryReady: boolean;
            policyDocumentReady: boolean;
            documentIngestionComplete: boolean;
            realTimeAlerts: boolean;
            inAppSoundsEnabled: any;
            emailDigestEnabled: boolean;
            digestFrequency: string;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=user.router.d.ts.map