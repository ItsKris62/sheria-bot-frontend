import { type AgentRunService } from '@/modules/agents/agent-run.service';
import { type OpsHealthSnapshotService } from './ops-health-snapshot.service';
import { type SecurityOpsAlertSynthesisService } from './alert-synthesis.service';
import { type SecurityOpsAlertService } from './ops-alert.service';
import type { SecurityOpsRunResult } from './types';
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
interface SecurityOpsPrisma {
    agentReport: {
        findFirst(args: object): Promise<LatestReportRow | null>;
        findMany(args: object): Promise<LatestReportRow[]>;
        count(args: object): Promise<number>;
    };
}
export interface SecurityOpsAgentDependencies {
    prisma?: SecurityOpsPrisma;
    healthSnapshot?: OpsHealthSnapshotService;
    alertSynthesis?: SecurityOpsAlertSynthesisService;
    opsAlert?: SecurityOpsAlertService;
    agentRuns?: AgentRunService;
    now?: () => Date;
}
export interface RunSecurityOpsInput {
    idempotencyKey?: string;
    windowDays?: number;
}
export declare class SecurityOpsAgent {
    private readonly prisma;
    private readonly healthSnapshot;
    private readonly alertSynthesis;
    private readonly opsAlert;
    private readonly agentRuns;
    private readonly now;
    constructor(dependencies?: SecurityOpsAgentDependencies);
    runReport(input?: RunSecurityOpsInput): Promise<SecurityOpsRunResult>;
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
export declare const securityOpsAgent: SecurityOpsAgent;
export {};
//# sourceMappingURL=security-ops.agent.d.ts.map