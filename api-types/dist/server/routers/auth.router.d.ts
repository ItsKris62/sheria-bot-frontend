export declare const authRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Register  -  creates a Supabase auth user AND a Prisma user profile.
     * If Prisma creation fails, the Supabase user is deleted as a compensating
     * transaction so no orphaned auth records are left behind.
     */
    register: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
            password: string;
            name: string;
            role: "REGULATOR" | "STARTUP" | "ENTERPRISE";
            companyName?: string | undefined;
            organizationId?: string | undefined;
            phone?: string | undefined;
        };
        output: {
            success: boolean;
            userId: any;
            email: any;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Login  -  proxies credentials to Supabase and returns Supabase session tokens.
     * Enforces email verification and account status before granting access.
     * The frontend must store and send the access_token as Bearer on all requests.
     */
    login: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
            password: string;
        };
        output: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string;
                name: string;
                role: import("@prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                mustChangePassword: boolean;
                organization: {
                    type: string;
                    id: string;
                    name: string;
                } | null;
                createdAt: Date;
            };
        };
        meta: object;
    }>;
    /**
     * Logout  -  deletes DB session and invalidates the Upstash Redis user cache.
     */
    logout: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /** Get current authenticated user */
    me: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            phone: string | null;
            emailVerified: boolean;
            organization: {
                type: string;
                id: string;
                name: string;
                registrationNumber: string | null;
            } | null;
            preferences: any;
            createdAt: Date;
            lastLoginAt: Date | null;
            mustChangePassword: boolean;
        };
        meta: object;
    }>;
    changeTemporaryPassword: import("@trpc/server").TRPCMutationProcedure<{
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
     * Request password reset  -  F4.2 (complete rewrite).
     *
     * Uses a fully custom Prisma token flow instead of the Supabase-native
     * resetPasswordForEmail(), which sends tokens in a format incompatible with
     * the /reset-password?token= frontend pattern.
     *
     * Flow: generate token -> store in Prisma -> send via React Email template.
     * Always returns success to prevent email enumeration.
     */
    requestPasswordReset: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Reset password with Prisma DB token.
     * F4.5a  -  error-checks supabaseAdmin.auth.admin.updateUserById().
     * F4.5b  -  revokes all Supabase sessions for the user after reset.
     * F4.6   -  sends a post-reset confirmation email.
     */
    resetPassword: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            token: string;
            newPassword: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /** Verify email with DB token (Phase 7 compatible). */
    verifyEmail: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            token: string;
        };
        output: {
            success: boolean;
            message: string;
            requiresApproval: boolean;
        };
        meta: object;
    }>;
    /**
     * Resend email verification  -  F3.6 (converted from protectedProcedure to publicProcedure).
     *
     * Previously required an authenticated session, which created a UX deadlock
     * once login enforces emailVerified. Now takes an email address and looks up
     * the user directly, rate-limited at 3/hour by email address.
     */
    resendVerification: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Confirm email via Supabase callback.
     *
     * Called by the /auth/callback frontend page after the user clicks the
     * Supabase OTP verification link in their email.  Supabase has already set
     * email_confirmed_at by the time this is reached; we use the issued
     * access_token to identify the user and sync Prisma emailVerified.
     *
     * Flow:
     *  1. User clicks Supabase link in email -> Supabase verifies -> redirects to
     *     https://sheriabot.com/auth/callback#access_token=xxx&...
     *  2. Frontend /auth/callback page reads the session via supabase.auth.getSession()
     *  3. Frontend calls this procedure with the access_token
     *  4. We verify the token with Supabase admin, find the Prisma user, and mark
     *     emailVerified = true.
     */
    confirmEmailCallback: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            accessToken: string;
        };
        output: {
            success: boolean;
            requiresApproval: boolean;
            alreadyVerified: boolean;
        };
        meta: object;
    }>;
    /**
     * refreshToken  -  deprecated endpoint.
     * Supabase handles token refresh on the frontend automatically.
     * Call supabase.auth.refreshSession() from your Supabase client instead.
     */
    refreshToken: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            refreshToken: string;
        };
        output: never;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=auth.router.d.ts.map