import { type AgentRunService } from '@/modules/agents/agent-run.service';
import { type ProductBiMetricsComputationService } from './metrics-computation.service';
import { type ProductBiInsightSynthesisService } from './insight-synthesis.service';
import type { ProductBiRunResult } from './types';
export interface LatestReportRow {
    id: string;
    agentRunId: string;
    summary: string | null;
    signals: unknown;
    recommendedActions: unknown;
    risks: unknown;
    humanApproved: boolean;
    createdAt: Date;
}
interface ListReportsInput {
    page: number;
    limit: number;
}
interface ProductBiPrisma {
    agentReport: {
        findFirst(args: object): Promise<LatestReportRow | null>;
        findMany(args: object): Promise<LatestReportRow[]>;
        count(args: object): Promise<number>;
    };
}
export interface ProductBiAgentDependencies {
    prisma?: ProductBiPrisma;
    metricsComputation?: ProductBiMetricsComputationService;
    insightSynthesis?: ProductBiInsightSynthesisService;
    agentRuns?: AgentRunService;
    now?: () => Date;
}
export interface RunProductBiInput {
    idempotencyKey?: string;
    windowDays?: number;
}
export declare class ProductBiAgent {
    private readonly prisma;
    private readonly metricsComputation;
    private readonly insightSynthesis;
    private readonly agentRuns;
    private readonly now;
    constructor(dependencies?: ProductBiAgentDependencies);
    runReport(input?: RunProductBiInput): Promise<ProductBiRunResult>;
    getLatestReport(): Promise<LatestReportRow | null>;
    listReports(input: ListReportsInput): Promise<{
        reports: LatestReportRow[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    private captureUsage;
    private createReport;
}
export declare const productBiAgent: ProductBiAgent;
export {};
//# sourceMappingURL=product-bi.agent.d.ts.map