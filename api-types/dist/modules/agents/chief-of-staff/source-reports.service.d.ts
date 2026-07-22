import type { Prisma } from '@prisma/client';
import type { SourceReportExtract } from './types';
interface AgentReportRow {
    id: string;
    summary: string | null;
    risks: Prisma.JsonValue | null;
    recommendedActions: Prisma.JsonValue | null;
    createdAt: Date;
}
interface SourceReportsPrisma {
    agentReport: {
        findFirst(args: object): Promise<AgentReportRow | null>;
    };
}
export interface SourceReportsDependencies {
    prisma?: SourceReportsPrisma;
}
/**
 * Reads only via direct Prisma queries against the shared AgentReport/AgentRun
 * tables - never by importing or calling another batch's service class
 * (marketing.agent.ts, sales-growth.agent.ts, product-bi.agent.ts,
 * security-ops.agent.ts, reg-intel.agent.ts are all "consume, never modify").
 */
export declare class ChiefOfStaffSourceReportsService {
    private readonly prisma;
    constructor(dependencies?: SourceReportsDependencies);
    fetchAllSourceReports(): Promise<SourceReportExtract[]>;
}
export declare const chiefOfStaffSourceReportsService: ChiefOfStaffSourceReportsService;
export {};
//# sourceMappingURL=source-reports.service.d.ts.map