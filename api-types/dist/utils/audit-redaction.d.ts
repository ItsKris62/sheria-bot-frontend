/**
 * Utility for safely redacting sensitive metadata in audit logs.
 */
export declare const AUDIT_HIGH_SEVERITY_TERMS: readonly ["delete", "role", "admin_role", "payment_override", "revoke", "security", "maintenance", "export"];
export declare const AUDIT_MEDIUM_SEVERITY_TERMS: readonly ["fail", "error", "anomaly", "suspend", "plan", "reject"];
/**
 * Safely and recursively redacts sensitive information from an unknown payload.
 * Does not mutate the original object.
 */
export declare function redactAuditMetadata(metadata: unknown): unknown;
/**
 * Deterministically derives the severity of an audit event based on its action name.
 */
export declare function deriveSeverity(action: string): "HIGH" | "MEDIUM" | "LOW" | "INFO";
/** Prisma-compatible filter that mirrors deriveSeverity without loading rows into memory. */
export declare function buildAuditSeverityWhere(severity: "HIGH" | "MEDIUM" | "LOW" | "INFO"): Record<string, unknown>;
//# sourceMappingURL=audit-redaction.d.ts.map