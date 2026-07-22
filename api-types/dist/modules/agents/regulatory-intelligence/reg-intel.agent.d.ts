import { Prisma } from '@prisma/client';
import { type AgentRunService } from '@/modules/agents/agent-run.service';
import { type CorpusGapService } from './corpus-gap.service';
import { type ImpactMatcherService } from './impact-matcher.service';
import { type SignalClassifierService } from './signal-classifier.service';
import { type SourceMonitorService } from './source-monitor.service';
export interface LatestReportRow {
    id: string;
    agentRunId: string;
    summary: string | null;
    signals: Prisma.JsonValue | null;
    recommendedActions: Prisma.JsonValue | null;
    risks: Prisma.JsonValue | null;
    humanApproved: boolean;
    createdAt: Date;
}
export interface RegulatorySignalListRow {
    id: string;
    sourceUrl: string;
    jurisdiction: string;
    regulatoryBody: string;
    documentType: string;
    title: string;
    summary: string;
    severity: string;
    corpusGapDetected: boolean;
    status: string;
    createdAt: Date;
    processedAt: Date | null;
    reviewedAt: Date | null;
}
interface RegIntelPrisma {
    $queryRaw<T>(query: TemplateStringsArray | Prisma.Sql, ...values: unknown[]): Promise<T>;
    regulatorySignal: {
        findMany(args: object): Promise<RegulatorySignalListRow[]>;
        count(args: object): Promise<number>;
        update(args: object): Promise<RegulatorySignalListRow>;
    };
    agentReport: {
        findFirst(args: object): Promise<LatestReportRow | null>;
    };
    agentRun: {
        update(args: object): Promise<unknown>;
    };
}
export interface RunRegIntelInput {
    idempotencyKey?: string;
    maxItems?: number;
}
export interface RegIntelRunResult {
    runId: string | null;
    status: 'SKIPPED_DISABLED' | 'DUPLICATE' | 'COMPLETED' | 'HALTED_BUDGET' | 'FAILED';
    reportId?: string;
    signalsCreated: number;
}
export interface ListSignalsInput {
    page: number;
    limit: number;
    jurisdiction?: string;
    severity?: string;
    corpusGap?: boolean;
    status?: string;
}
export interface RegIntelDependencies {
    prisma?: RegIntelPrisma;
    sourceMonitor?: SourceMonitorService;
    classifier?: SignalClassifierService;
    corpusGap?: CorpusGapService;
    impactMatcher?: ImpactMatcherService;
    agentRuns?: AgentRunService;
    now?: () => Date;
}
export declare class RegulatoryIntelligenceAgent {
    private readonly prisma;
    private readonly sourceMonitor;
    private readonly classifier;
    private readonly corpusGap;
    private readonly impactMatcher;
    private readonly agentRuns;
    private readonly now;
    constructor(dependencies?: RegIntelDependencies);
    runScan(input?: RunRegIntelInput): Promise<RegIntelRunResult>;
    getLatestReport(): Promise<LatestReportRow | null>;
    listSignals(input: ListSignalsInput): Promise<{
        signals: RegulatorySignalListRow[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    acknowledgeSignal(signalId: string): Promise<RegulatorySignalListRow>;
    private persistSignal;
    private createDraftReport;
    private markBudgetHalted;
}
export declare const regulatoryIntelligenceAgent: RegulatoryIntelligenceAgent;
export {};
//# sourceMappingURL=reg-intel.agent.d.ts.map