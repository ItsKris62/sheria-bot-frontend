import { prisma as defaultPrisma } from '@/lib/prisma/client';
type FetchLike = typeof fetch;
export type ApprovalDecision = 'approved' | 'rejected';
export type ApprovalStatus = 'pending' | ApprovalDecision;
export interface CreateApprovalInput {
    department: string;
    workflow: string;
    kind: string;
    summary: string;
    callbackUrl: string;
    metadata: Record<string, unknown>;
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
}
export declare class AutomationApprovalService {
    private readonly prisma;
    private readonly fetchImpl;
    private readonly now;
    private readonly hmacSecret;
    constructor(dependencies?: AutomationApprovalServiceDependencies);
    createApproval(input: CreateApprovalInput): Promise<{
        approvalId: string;
    }>;
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
}
export declare const automationApprovalService: AutomationApprovalService;
export {};
//# sourceMappingURL=approval.service.d.ts.map