import { prisma as defaultPrisma } from '@/lib/prisma/client';
import type { EmailOptions, EmailResult } from '@/lib/email/client';
type FetchLike = typeof fetch;
type SendEmail = (options: EmailOptions) => Promise<EmailResult>;
export type ApprovalDecision = 'approved' | 'rejected';
export type ApprovalStatus = 'pending' | ApprovalDecision | 'expired';
export interface CreateApprovalInput {
    department: string;
    workflow: string;
    kind: string;
    summary: string;
    callbackUrl: string;
    metadata: Record<string, unknown>;
    idempotencyKey: string;
    reviewerEmail?: string;
}
export interface RecordApprovalDecisionInput {
    approvalId: string;
    decision: ApprovalDecision;
    by: string;
}
export interface ListApprovalsInput {
    page: number;
    limit: number;
    department?: string;
    workflow?: string;
    status?: ApprovalStatus;
}
export interface ApprovalListRow {
    id: string;
    department: string;
    workflow: string;
    kind: string;
    summary: string;
    metadata: Record<string, unknown> | null;
    status: ApprovalStatus;
    createdAt: string;
    decidedBy: string | null;
    decidedAt: string | null;
    callbackError: string | null;
    callbackDeliveredAt: string | null;
}
export interface ListApprovalsResult {
    rows: ApprovalListRow[];
    total: number;
    page: number;
    limit: number;
}
type ApprovalPrisma = Pick<typeof defaultPrisma, 'automationApproval'>;
export interface AutomationApprovalServiceDependencies {
    prisma?: ApprovalPrisma;
    fetchImpl?: FetchLike;
    now?: () => Date;
    hmacSecret?: string;
    decisionLinkSecret?: string;
    sendEmail?: SendEmail;
}
export declare class AutomationApprovalService {
    private readonly prisma;
    private readonly fetchImpl;
    private readonly now;
    private readonly hmacSecret;
    private readonly decisionLinkSecret;
    private readonly sendEmail;
    constructor(dependencies?: AutomationApprovalServiceDependencies);
    /**
     * Insert-then-catch-conflict, not find-then-create: a find-then-create
     * check has a TOCTOU race under concurrent duplicate calls (two simultaneous
     * retries can both pass the find before either insert lands). The unique
     * index on idempotencyKey is the actual dedup guarantee; the P2002 catch
     * just turns that DB-level rejection into an idempotent replay response.
     */
    createApproval(input: CreateApprovalInput): Promise<{
        approvalId: string;
    }>;
    /**
     * Composes and sends the reviewer's approval-decision-link email. Mirrors
     * SecurityOpsAlertService.sendAlert's shape (injectable sendEmail, try/catch
     * that only logs - never throws, so a Resend outage can't fail the approval
     * that gates it).
     */
    private sendReviewerNotification;
    /**
     * Zero-side-effect read backing the public approval-decision GET/POST
     * routes - no admin session exists there, so those routes can't reuse
     * listApprovals/getApproval's implicit "caller is authenticated" framing.
     * Returns null (not a thrown NOT_FOUND) for an unknown id so callers can
     * render a generic "not found" page without a try/catch.
     */
    getApprovalPublicView(approvalId: string): Promise<{
        status: ApprovalStatus;
        department: string;
        workflow: string;
        summary: string;
        reviewerEmail: string | null;
    } | null>;
    /**
     * Backs the admin approvals page. Most-recent-first; department/workflow/
     * status are optional equality filters (not full-text search - the page
     * groups/filters by exact values, per the admin-UI request).
     */
    listApprovals(input: ListApprovalsInput): Promise<ListApprovalsResult>;
    getApproval(input: {
        approvalId: string;
    }): Promise<{
        status: ApprovalStatus;
    }>;
    /**
     * Reads one field out of an approval's metadata JSON - shared by every
     * "approval gates a pre-existing backend row" consumer (publishContent's
     * blogPostId, queueOutreach's draftId) so the same missing-field error and
     * type-narrowing logic isn't duplicated per consumer.
     */
    requireMetadataField(approvalId: string, field: string): Promise<string>;
    /**
     * `by` is the deciding admin's own user ID, derived server-side by the
     * caller (agentsRouter.automation.recordApprovalDecision runs as
     * adminProcedure, not agentProcedure - this is a human decision, not an
     * n8n-triggered one) - never accept it as raw client input.
     */
    recordApprovalDecision(input: RecordApprovalDecisionInput): Promise<{
        approvalId: string;
        status: ApprovalStatus;
    }>;
    /**
     * Best-effort: never throws. n8n's own 30-minute-timeout polling fallback
     * (getApproval) is the recovery path if this delivery fails, so the
     * decision itself must persist regardless of the callback's outcome.
     */
    private deliverCallback;
    private recordCallbackFailure;
    /**
     * Swept counterpart to recordApprovalDecision's defensive expiry check -
     * ages out PENDING rows nobody ever decided on. Legacy rows with a null
     * expiresAt are excluded by the `lt` filter itself (never matches null),
     * so they're left PENDING indefinitely, same as before this column existed.
     */
    expireStalePendingApprovals(): Promise<number>;
}
export declare const automationApprovalService: AutomationApprovalService;
export {};
//# sourceMappingURL=approval.service.d.ts.map