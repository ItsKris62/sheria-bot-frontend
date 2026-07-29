import type { AutomationIncidentSeverity, ContentOpsAlert, ContentOpsAlertNotificationStatus, Prisma } from '@prisma/client';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
import type { EmailOptions, EmailResult } from '@/lib/email/client';
export type SendEmail = (options: EmailOptions) => Promise<EmailResult>;
type ContentOpsAlertPrisma = {
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: unknown[]): Promise<T>;
    contentOpsAlert: Pick<typeof defaultPrisma.contentOpsAlert, 'findUnique' | 'findMany' | 'update' | 'count'>;
};
export interface ContentOpsAlertDependencies {
    prisma?: ContentOpsAlertPrisma;
    sendEmail?: SendEmail;
    now?: () => Date;
}
/** Preserved for backward compatibility with any existing caller shape. */
export interface ContentOpsAlertInput {
    subject: string;
    summary: string;
    details?: string[];
    link?: string;
}
export interface CreateOrIncrementAlertInput {
    type: string;
    severity: AutomationIncidentSeverity;
    entityType: string;
    entityId: string;
    title: string;
    summary: string;
    workflowKey?: string;
    executionId?: string;
    metadata?: Record<string, unknown>;
}
export interface AcknowledgeAlertInput {
    alertId: string;
    by: string;
}
export interface ResolveAlertInput {
    alertId: string;
    by: string;
    resolutionNote?: string;
}
export interface ListOpenAlertsInput {
    page?: number;
    limit?: number;
    severity?: AutomationIncidentSeverity;
    type?: string;
    entityType?: string;
}
export interface ListOpenAlertsResult {
    rows: ContentOpsAlert[];
    total: number;
}
export interface MarkNotificationResultInput {
    alertId: string;
    status: Extract<ContentOpsAlertNotificationStatus, 'SENT' | 'FAILED'>;
}
/**
 * Persist-first, notify-second content operations alerting (Pack 1 Stage C4,
 * corrected from the original fire-and-forget email-only design). See
 * docs/editorial-intelligence/phase-b-foundations.md Foundation C.
 *
 * Dedupe/reopen identity is (type, entityType, entityId, COALESCE(workflowKey, ''))
 * - a raw SQL expression unique index (prisma/migrations/20260727020000_content_ops_alert)
 * that Prisma's typed client cannot target directly, so createOrIncrementAlert
 * uses an atomic `$queryRaw` INSERT ... ON CONFLICT ... DO UPDATE, never a
 * vulnerable find-then-create.
 *
 * status (AutomationIncidentStatus.OPEN/ACKNOWLEDGED/RESOLVED/IGNORED) is a
 * human content-review decision. notificationStatus
 * (NOT_REQUIRED/PENDING/SENT/FAILED/SUPPRESSED) is an independent
 * delivery-mechanics decision - never conflate or derive one from the other.
 */
export declare class ContentOpsAlertService {
    private readonly prisma;
    private readonly sendEmail;
    private readonly now;
    constructor(dependencies?: ContentOpsAlertDependencies);
    /**
     * Best-effort email delivery - the one thing this service does that can
     * fail without affecting the persisted alert, since the alert row is always
     * written first, in its own statement, before this is ever attempted.
     */
    private deliverEmail;
    /**
     * Retained for existing/future callers that only need "send this one-off
     * email, no persistence" - e.g. a caller with no natural (type, entityType,
     * entityId) identity to dedupe against. New editorial call sites should use
     * createOrIncrementAlert instead; this is now a thin wrapper, not the
     * primary public API.
     */
    sendAlert(input: ContentOpsAlertInput): Promise<void>;
    /**
     * Atomically persists (or increments/reopens) an alert, then decides
     * whether a notification is due and sends it best-effort. Always returns
     * the final persisted row, regardless of the notification outcome.
     */
    createOrIncrementAlert(input: CreateOrIncrementAlertInput): Promise<ContentOpsAlert>;
    acknowledgeAlert(input: AcknowledgeAlertInput): Promise<ContentOpsAlert>;
    /**
     * Sets status=RESOLVED. resolutionNote, if provided, is sanitized and
     * persisted - but a resolutionNote from a PRIOR resolution is never cleared
     * by this service on its own (only an explicit new note overwrites it),
     * and createOrIncrementAlert's reopen logic never touches this column at
     * all, so history is preserved across a resolve -> reopen -> resolve cycle
     * unless an operator explicitly writes a new note each time.
     */
    resolveAlert(input: ResolveAlertInput): Promise<ContentOpsAlert>;
    listOpenAlerts(input?: ListOpenAlertsInput): Promise<ListOpenAlertsResult>;
    getAlert(alertId: string): Promise<ContentOpsAlert | null>;
    markNotificationResult(input: MarkNotificationResultInput): Promise<ContentOpsAlert>;
}
export declare const contentOpsAlertService: ContentOpsAlertService;
export {};
//# sourceMappingURL=content-ops-alert.service.d.ts.map