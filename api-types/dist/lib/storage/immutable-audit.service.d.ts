export interface ImmutableAuditRecord {
    id?: string;
    timestamp?: string | Date;
    action: string;
    userId?: string | null;
    organizationId?: string | null;
    entityType?: string | null;
    entityId?: string | null;
    details?: Record<string, unknown> | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    [key: string]: unknown;
}
/**
 * Builds the immutable S3/R2 storage key for an audit event:
 * `audit/{yyyy}/{mm}/{dd}/{eventId}.jsonl`
 */
export declare function buildAuditStorageKey(date?: Date, eventId?: string): string;
/**
 * Persists an audit event or batch of audit records to the immutable audit bucket:
 * `sheria-bot-audit-immutable/audit/{yyyy}/{mm}/{dd}/{eventId}.jsonl`
 */
export declare function writeImmutableAuditRecord(records: ImmutableAuditRecord | ImmutableAuditRecord[], options?: {
    eventId?: string;
    date?: Date;
}): Promise<{
    key: string;
    bucket: string;
}>;
//# sourceMappingURL=immutable-audit.service.d.ts.map