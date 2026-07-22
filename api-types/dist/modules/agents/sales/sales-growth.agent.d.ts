import { Prisma } from '@prisma/client';
import { type AgentRunService } from '@/modules/agents/agent-run.service';
import { type SalesEngagementLookupService } from './engagement-lookup.service';
import { type SalesOutreachDrafterService } from './outreach-drafter.service';
import { type SalesSignalSelectorService } from './signal-selector.service';
import type { PersistedSalesOutreachDraft, SalesDraftStatus, SalesRunResult } from './types';
interface SalesOutreachDraftCreateInput {
    sourceSignalId: string;
    organizationId: string;
    triggerReason: string;
    engagementContext: Prisma.InputJsonValue;
    subject: string;
    body: string;
    priority: string;
    agentRunId: string;
    sourceFingerprint: string;
    metadata: Prisma.InputJsonValue;
}
interface SalesOutreachDraftListInput {
    page: number;
    limit: number;
    status?: SalesDraftStatus;
}
interface ReviewDraftInput {
    draftId: string;
    status: Extract<SalesDraftStatus, 'REVIEWED' | 'DISMISSED'>;
    reviewedBy: string;
    editedBody?: string;
}
interface SalesPrisma {
    salesOutreachDraft: {
        create(args: {
            data: SalesOutreachDraftCreateInput;
        }): Promise<PersistedSalesOutreachDraft>;
        findMany(args: object): Promise<PersistedSalesOutreachDraft[]>;
        count(args: object): Promise<number>;
        findUnique(args: object): Promise<PersistedSalesOutreachDraft | null>;
        update(args: object): Promise<PersistedSalesOutreachDraft>;
    };
}
export interface SalesGrowthAgentDependencies {
    prisma?: SalesPrisma;
    selector?: SalesSignalSelectorService;
    engagementLookup?: SalesEngagementLookupService;
    drafter?: SalesOutreachDrafterService;
    agentRuns?: AgentRunService;
    now?: () => Date;
}
export interface RunSalesDraftingInput {
    idempotencyKey?: string;
    maxProspects?: number;
}
export declare class SalesGrowthAgent {
    private readonly prisma;
    private readonly selector;
    private readonly engagementLookup;
    private readonly drafter;
    private readonly agentRuns;
    private readonly now;
    constructor(dependencies?: SalesGrowthAgentDependencies);
    runDrafting(input?: RunSalesDraftingInput): Promise<SalesRunResult>;
    listDrafts(input: SalesOutreachDraftListInput): Promise<{
        drafts: PersistedSalesOutreachDraft[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getDraft(draftId: string): Promise<PersistedSalesOutreachDraft | null>;
    reviewDraft(input: ReviewDraftInput): Promise<PersistedSalesOutreachDraft>;
    private persistDraft;
    private captureUsage;
    private createReport;
}
export declare const salesGrowthAgent: SalesGrowthAgent;
export {};
//# sourceMappingURL=sales-growth.agent.d.ts.map