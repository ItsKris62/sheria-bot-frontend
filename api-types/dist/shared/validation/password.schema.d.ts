import { z } from 'zod';
export declare const PASSWORD_MIN_LENGTH = 10;
export declare const PASSWORD_MAX_LENGTH = 128;
export interface PasswordValidationResult {
    isValid: boolean;
    /** Human-readable error messages for failed rules. */
    errors: string[];
    /** 0-5 strength score. */
    score: number;
    /** Per-rule pass/fail map  -  used by the frontend strength indicator. */
    rules: {
        minLength: boolean;
        maxLength: boolean;
        hasUppercase: boolean;
        hasLowercase: boolean;
        hasDigit: boolean;
        hasSpecial: boolean;
        notCommon: boolean;
        notEmail: boolean;
        noRepeated: boolean;
        noSequential: boolean;
    };
}
export interface PasswordValidationOptions {
    minLength?: number;
}
/**
 * Validate a password against all policy rules.
 * Returns granular per-rule results so the caller can decide what to surface.
 *
 * @param password  The candidate password.
 * @param email     Optional  -  used for the "email-in-password" check.
 */
export declare function validatePassword(password: string, email?: string, options?: PasswordValidationOptions): PasswordValidationResult;
export declare const passwordSchema: z.ZodString;
/** Single password policy rule entry. */
export interface PasswordRule {
    id: string;
    label: string;
    test: (password: string) => boolean;
}
/** All password policy rules in display order. */
export declare const PASSWORD_RULES: PasswordRule[];
/**
 * Generate a cryptographically random password that satisfies passwordSchema.
 *
 * @param length Target length (default 16; minimum 10).
 * @returns A password string that passes passwordSchema.safeParse().
 * @throws If generation fails after 5 attempts (extremely unlikely).
 */
export declare function generateStrongPassword(length?: number): string;
//# sourceMappingURL=password.schema.d.ts.map