/**
 * Machine Lead Ingestion Service (P0)
 *
 * Implements idempotent batch ingestion for AI-discovered leads from n8n / automation runs.
 * Strictly separates AI observations (untrusted hints) from authoritative Company data.
 * Zero autonomous outbound: ends at leadStatus = PENDING_REVIEW or NURTURE.
 */
import { LeadStatus, IcpTier, EvidenceVerificationState, DiscoveryRunStatus } from '@prisma/client';
import { CandidateLeadInput } from './lead-qualification.service';
import { type DiscoverySourceDefinition, type DiscoverySourceState, type UpdateDiscoverySourceStateInput } from './lead-discovery-sources';
export interface IngestEvidenceItemInput {
    field: string;
    extractedValue: string;
    normalizedValue?: string | null;
    confidence?: number;
    sourceUrl: string;
    sourceAuthority?: string | null;
    sourceRecordId?: string | null;
    evidenceSnippet?: string | null;
    verificationState?: EvidenceVerificationState;
    extractionMethod?: string | null;
    modelProvider?: string | null;
    modelName?: string | null;
    extractorVersion?: string | null;
}
export interface IngestCandidateLeadInput extends CandidateLeadInput {
    primarySourceUrl: string;
    primarySourceAuthority?: string | null;
    evidence?: IngestEvidenceItemInput[];
}
export interface InitDiscoveryRunParams {
    runIdempotencyKey: string;
    workflowName?: string;
    sourceAuthority?: string | null;
    sourceUrl?: string | null;
    jurisdiction?: string;
    sourceSetId?: string;
    metadata?: Record<string, unknown>;
}
export interface IngestBatchParams {
    discoveryRunId: string;
    batchId: string;
    candidates: IngestCandidateLeadInput[];
    systemUserId?: string;
}
export interface CompleteDiscoveryRunParams {
    discoveryRunId: string;
    status?: DiscoveryRunStatus;
    errorMessage?: string | null;
    metadata?: Record<string, unknown>;
}
export interface IngestBatchResult {
    discoveryRunId: string;
    batchId: string;
    totalProcessed: number;
    created: number;
    updated: number;
    matched: number;
    rejected: number;
    deduplicated: number;
    results: Array<{
        candidateName: string;
        companyId: string;
        action: 'CREATED' | 'UPDATED' | 'MATCHED' | 'REJECTED' | 'DUPLICATE';
        leadStatus: LeadStatus;
        leadScore: number | null;
        icpTier: IcpTier;
        reason?: string;
    }>;
}
export declare const leadIngestionService: {
    /**
     * Initializes or recovers an existing DiscoveryRun by idempotency key.
     */
    initDiscoveryRun(params: InitDiscoveryRunParams): Promise<{
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        id: string;
        status: import(".prisma/client").$Enums.DiscoveryRunStatus;
        errorMessage: string | null;
        completedAt: Date | null;
        startedAt: Date;
        sourceUrl: string;
        sourceAuthority: string;
        runIdempotencyKey: string;
        workflowName: string;
        totalDiscovered: number;
        totalQualified: number;
        totalDeduplicated: number;
        totalRejected: number;
        totalCreated: number;
        totalUpdated: number;
    }>;
    /**
     * Processes a batch of candidate leads idempotently.
     */
    ingestBatch(params: IngestBatchParams): Promise<IngestBatchResult>;
    /**
     * Finalizes a DiscoveryRun.
     */
    completeDiscoveryRun(params: CompleteDiscoveryRunParams): Promise<{
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        id: string;
        status: import(".prisma/client").$Enums.DiscoveryRunStatus;
        errorMessage: string | null;
        completedAt: Date | null;
        startedAt: Date;
        sourceUrl: string;
        sourceAuthority: string;
        runIdempotencyKey: string;
        workflowName: string;
        totalDiscovered: number;
        totalQualified: number;
        totalDeduplicated: number;
        totalRejected: number;
        totalCreated: number;
        totalUpdated: number;
    }>;
    /**
     * Returns discovery sources merged with their persistent execution state.
     */
    getDiscoverySources(jurisdiction?: string): Promise<DiscoverySourceDefinition[]>;
    /**
     * Updates persistent source state (fingerprint, cursor, outcome, failure counters).
     */
    updateDiscoverySourceState(input: UpdateDiscoverySourceStateInput): Promise<DiscoverySourceState>;
    /**
     * Non-mutating read-only check of shared AI monthly budget and remaining spend.
     */
    getBudgetStatus(period?: string): Promise<{
        period: string;
        budgetUsd: number;
        spentUsd: number;
        reservedUsd: number;
        remainingUsd: number;
        percentUsed: number;
        isHalted: boolean;
        providers: Record<import("../../lib/ai/gateway/types").LLMProviderName, number>;
    }>;
};
//# sourceMappingURL=lead-ingestion.service.d.ts.map