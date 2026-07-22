import type { Prisma } from '@prisma/client';
export declare const CHIEF_OF_STAFF_AGENT_TYPE: "chief-of-staff";
export declare const SOURCE_AGENT_TYPES: readonly ["regulatory-intelligence", "marketing", "sales-growth", "product-bi", "security-ops"];
export type SourceAgentType = (typeof SOURCE_AGENT_TYPES)[number];
/**
 * Safe, uniform extract of one source agent's latest AgentReport - summary
 * plus only the parts of risks/recommendedActions that are already plain
 * string arrays or array lengths, never the full heterogeneous nested JSON
 * (see Stage 1 audit Section 1). reportId is null when that source agent has
 * not produced a report yet (a fresh environment, or before its first run).
 */
export interface SourceReportExtract {
    agentType: SourceAgentType;
    reportId: string | null;
    createdAt: string | null;
    summary: string | null;
    riskNotes: string[];
    actionNotes: string[];
    itemCounts: Record<string, number>;
}
export interface RankedAction {
    action: string;
    sourceAgentType: SourceAgentType;
    sourceReportId: string;
}
export interface DecisionNeeded {
    decision: string;
    sourceAgentType: SourceAgentType;
    sourceReportId: string;
}
export interface WeeklyBrief {
    summary: string;
    wins: string[];
    rankedActions: RankedAction[];
    decisionsNeeded: DecisionNeeded[];
    usage: {
        inputTokens: number;
        outputTokens: number;
        costUsd: number;
        provider: string;
        model: string;
    };
}
export interface ChiefOfStaffRunResult {
    runId: string | null;
    status: 'SKIPPED_DISABLED' | 'DUPLICATE' | 'COMPLETED' | 'HALTED_BUDGET' | 'FAILED';
    reportId?: string;
}
export declare function toJsonValue(value: unknown): Prisma.InputJsonValue;
export declare function isoWeekIdentifier(date: Date): string;
/**
 * Generic runtime walk over a risks/recommendedActions JSON blob: any
 * top-level array of strings is collected as plain notes; any top-level array
 * of non-strings (structured objects) contributes only its length, keyed by
 * field name. Works uniformly across B3-B7's differently-shaped payloads
 * without a bespoke parser per batch, so it does not drift when any of them
 * change their own internal shape independently.
 */
export declare function extractStringsAndCounts(value: Prisma.JsonValue | null | undefined): {
    strings: string[];
    counts: Record<string, number>;
};
//# sourceMappingURL=types.d.ts.map