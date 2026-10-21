import { Prisma } from '@prisma/client';
export declare const LEGACY_GAP_ANALYSIS_DOCUMENT_FIELDS: readonly ["fileContent", "base64", "fileBuffer", "rawText"];
export declare const ACTIVE_GAP_ANALYSIS_JOB_STATUSES: readonly ["QUEUED", "RUNNING", "RETRYING"];
export declare const TERMINAL_GAP_ANALYSIS_JOB_STATUSES: readonly ["COMPLETED", "FAILED", "DEAD_LETTERED", "CANCELLED"];
type CleanupClient = {
    aiJob: {
        findMany: (args: any) => Promise<unknown[]>;
    };
    auditLog: {
        create: (args: any) => Promise<unknown>;
    };
    $transaction: (callback: (tx: {
        aiJob: {
            update: (args: any) => Promise<unknown>;
        };
    }) => Promise<void>) => Promise<unknown>;
};
export type GapAnalysisPayloadCleanupSummary = {
    dryRun: boolean;
    rowsInspected: number;
    legacyPayloadsDetected: number;
    terminalAndSafeToScrub: number;
    activeOrRetryable: number;
    activeWithSupportedFileContentFallback: number;
    activeWithUnsupportedLegacyShape: number;
    unknownStatus: number;
    alreadyClean: number;
    rowsScrubbed: number;
    documentsPrinted: 0;
    statusCounts: Record<string, number>;
    fieldCounts: Record<(typeof LEGACY_GAP_ANALYSIS_DOCUMENT_FIELDS)[number], number>;
};
export declare function legacyDocumentFields(payload: Prisma.JsonValue): string[];
export declare function scrubLegacyDocumentFields(payload: Prisma.JsonValue, scrubbedAt: string): Prisma.InputJsonValue;
/**
 * Inspects only durable Gap Analysis pipeline jobs. Active/retryable legacy
 * payloads are deliberately retained until they reach a terminal state because
 * they may still depend on the legacy in-payload compatibility path.
 */
export declare function cleanupLegacyGapAnalysisPayloads(client: CleanupClient, options?: {
    execute?: boolean;
    batchSize?: number;
    now?: () => Date;
}): Promise<GapAnalysisPayloadCleanupSummary>;
export {};
//# sourceMappingURL=gap-analysis-payload-cleanup.d.ts.map