/**
 * Central MFA compliance helper.
 * Evaluates whether a user satisfies MFA requirements (TOTP enrolled or Passkey registered).
 */
export declare function userSatisfiesMfa(user?: {
    totpEnabled?: boolean;
    hasPasskey?: boolean;
} | null): boolean;
//# sourceMappingURL=mfa-compliance.d.ts.map