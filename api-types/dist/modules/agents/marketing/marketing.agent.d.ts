import { Prisma } from '@prisma/client';
import { type AgentRunService } from '@/modules/agents/agent-run.service';
import { type MarketingContentDrafterService } from './content-drafter.service';
import { type MarketingSignalSelectorService } from './signal-selector.service';
import type { MarketingContentType, MarketingDraftStatus, MarketingRunResult, PersistedMarketingDraft } from './types';
interface MarketingDraftCreateInput {
    contentType: MarketingContentType;
    sourceSignalIds: Prisma.InputJsonValue;
    sourceFingerprint: string;
    title: string;
    body: string;
    brief: string;
    agentRunId: string;
    metadata: Prisma.InputJsonValue;
}
interface MarketingDraftListInput {
    page: number;
    limit: number;
    status?: MarketingDraftStatus;
    contentType?: MarketingContentType;
}
interface ReviewDraftInput {
    draftId: string;
    status: Extract<MarketingDraftStatus, 'REVIEWED' | 'DISMISSED'>;
    reviewedBy: string;
    editedBody?: string;
}
interface MarketingPrisma {
    marketingDraft: {
        create(args: {
            data: MarketingDraftCreateInput;
        }): Promise<PersistedMarketingDraft>;
        findMany(args: object): Promise<PersistedMarketingDraft[]>;
        count(args: object): Promise<number>;
        findUnique(args: object): Promise<PersistedMarketingDraft | null>;
        update(args: object): Promise<PersistedMarketingDraft>;
    };
}
export interface MarketingAgentDependencies {
    prisma?: MarketingPrisma;
    selector?: MarketingSignalSelectorService;
    drafter?: MarketingContentDrafterService;
    agentRuns?: AgentRunService;
    now?: () => Date;
}
export interface RunMarketingInput {
    idempotencyKey?: string;
    maxSignals?: number;
}
export declare class MarketingAgent {
    private readonly prisma;
    private readonly selector;
    private readonly drafter;
    private readonly agentRuns;
    private readonly now;
    constructor(dependencies?: MarketingAgentDependencies);
    runDrafting(input?: RunMarketingInput): Promise<MarketingRunResult>;
    listDrafts(input: MarketingDraftListInput): Promise<{
        drafts: PersistedMarketingDraft[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getDraft(draftId: string): Promise<PersistedMarketingDraft | null>;
    reviewDraft(input: ReviewDraftInput): Promise<PersistedMarketingDraft>;
    private persistDraft;
    private captureUsage;
    private createReport;
}
export declare const marketingAgent: MarketingAgent;
export {};
//# sourceMappingURL=marketing.agent.d.ts.map