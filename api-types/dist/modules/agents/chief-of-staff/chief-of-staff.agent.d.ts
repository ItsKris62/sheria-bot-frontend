import { type AgentRunService } from '@/modules/agents/agent-run.service';
import { type ChiefOfStaffSourceReportsService } from './source-reports.service';
import { type ChiefOfStaffBriefSynthesisService } from './brief-synthesis.service';
import { type WeeklyBriefDeliveryService } from './weekly-brief-delivery.service';
import type { ChiefOfStaffRunResult } from './types';
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
interface ChiefOfStaffPrisma {
    agentReport: {
        findFirst(args: object): Promise<LatestReportRow | null>;
        findMany(args: object): Promise<LatestReportRow[]>;
        count(args: object): Promise<number>;
    };
}
export interface ChiefOfStaffAgentDependencies {
    prisma?: ChiefOfStaffPrisma;
    sourceReports?: ChiefOfStaffSourceReportsService;
    briefSynthesis?: ChiefOfStaffBriefSynthesisService;
    delivery?: WeeklyBriefDeliveryService;
    agentRuns?: AgentRunService;
    now?: () => Date;
}
export interface RunChiefOfStaffInput {
    idempotencyKey?: string;
}
export declare class ChiefOfStaffAgent {
    private readonly prisma;
    private readonly sourceReports;
    private readonly briefSynthesis;
    private readonly delivery;
    private readonly agentRuns;
    private readonly now;
    constructor(dependencies?: ChiefOfStaffAgentDependencies);
    runBrief(input?: RunChiefOfStaffInput): Promise<ChiefOfStaffRunResult>;
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
export declare const chiefOfStaffAgent: ChiefOfStaffAgent;
export {};
//# sourceMappingURL=chief-of-staff.agent.d.ts.map