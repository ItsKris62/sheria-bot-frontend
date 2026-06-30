/**
 * Utility for safely redacting sensitive metadata in audit logs.
 */
/**
 * Safely and recursively redacts sensitive information from an unknown payload.
 * Does not mutate the original object.
 */
export declare function redactAuditMetadata(metadata: unknown): unknown;
/**
 * Deterministically derives the severity of an audit event based on its action name.
 */
export declare function deriveSeverity(action: string): "HIGH" | "MEDIUM" | "LOW" | "INFO";
//# sourceMappingURL=audit-redaction.d.ts.map