export declare const SECURITY_EVENT_TYPES: {
    readonly MFA_CHALLENGE_ISSUED: "MFA_CHALLENGE_ISSUED";
    readonly MFA_VERIFY_SUCCESS: "MFA_VERIFY_SUCCESS";
    readonly MFA_VERIFY_FAILED: "MFA_VERIFY_FAILED";
    readonly MFA_BACKUP_CODE_USED: "MFA_BACKUP_CODE_USED";
    readonly MFA_RATE_LIMITED: "MFA_RATE_LIMITED";
    readonly MFA_ENROLLED: "MFA_ENROLLED";
    readonly MFA_DISABLED: "MFA_DISABLED";
    readonly MFA_ENFORCEMENT_BLOCKED: "MFA_ENFORCEMENT_BLOCKED";
    readonly MFA_ENFORCEMENT_GRACE: "MFA_ENFORCEMENT_GRACE";
    readonly MFA_CHALLENGE_DECRYPTION_FAILED: "MFA_CHALLENGE_DECRYPTION_FAILED";
    readonly PASSKEY_REGISTRATION_STARTED: "PASSKEY_REGISTRATION_STARTED";
    readonly PASSKEY_REGISTRATION_SUCCESS: "PASSKEY_REGISTRATION_SUCCESS";
    readonly PASSKEY_REGISTRATION_FAILED: "PASSKEY_REGISTRATION_FAILED";
    readonly PASSKEY_AUTH_STARTED: "PASSKEY_AUTH_STARTED";
    readonly PASSKEY_AUTH_SUCCESS: "PASSKEY_AUTH_SUCCESS";
    readonly PASSKEY_AUTH_FAILED: "PASSKEY_AUTH_FAILED";
    readonly PASSKEY_REVOKED: "PASSKEY_REVOKED";
    readonly PASSKEY_RENAMED: "PASSKEY_RENAMED";
    readonly PASSKEY_RATE_LIMITED: "PASSKEY_RATE_LIMITED";
    readonly PASSKEY_COUNTER_REGRESSION: "PASSKEY_COUNTER_REGRESSION";
};
export type SecurityEventType = (typeof SECURITY_EVENT_TYPES)[keyof typeof SECURITY_EVENT_TYPES] | string;
export interface LogSecurityEventParams {
    eventType: SecurityEventType;
    userId?: string | null;
    organizationId?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    metadata?: Record<string, unknown> | null;
}
/**
 * Sanitizes metadata to guarantee that no secret keys or sensitive tokens are written to audit logs.
 * Recursively filters nested objects and arrays, guards against circular structures,
 * and caps recursion depth at 10.
 */
export declare function sanitizeMetadata(metadata?: Record<string, unknown> | null): Record<string, unknown> | null;
/**
 * Append-only security audit event logger.
 * Safe, fire-and-forget: Catches any database or write errors and logs to Pino at error level
 * so that audit logging never interrupts core authentication workflows.
 */
export declare function logSecurityEvent(params: LogSecurityEventParams): Promise<void>;
//# sourceMappingURL=audit.service.d.ts.map