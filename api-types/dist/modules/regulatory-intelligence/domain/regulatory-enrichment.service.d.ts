import { RegulatoryInformationType, RegulatoryMateriality } from '@prisma/client';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { type AgentRunService } from '@/modules/agents/agent-run.service';
import { completeStructured as defaultCompleteStructured } from '@/lib/ai/structured/completeStructured';
import { type ProcessRegulatorySnapshotMachineInput, type ProcessRegulatorySnapshotResult } from './types';
import { type RegulatorySnapshotService } from './regulatory-snapshot.service';
import { type RegulatoryItemService } from './regulatory-item.service';
import { type RegulatoryAlertDraftService } from './regulatory-alert-draft.service';
export declare const REGULATORY_ENRICHMENT_SCHEMA_VERSION = "v1";
export declare const REGULATORY_ENRICHMENT_PROMPT_VERSION = "2026-09-10";
export declare const REGULATORY_ENRICHMENT_AGENT_TYPE = "regulatory_intelligence_enrichment";
export declare function deriveEnrichmentIdempotencyKey(snapshotId: string): string;
/**
 * Deterministic policy deciding whether a regulatory intelligence item warrants a customer alert draft.
 */
export declare function evaluateShouldCreateAlert(enrichment: {
    materiality: RegulatoryMateriality;
    informationType: RegulatoryInformationType;
}): boolean;
export interface RegulatoryEnrichmentServiceDependencies {
    prisma?: typeof defaultPrisma;
    agentRuns?: Pick<AgentRunService, 'beginRun' | 'completeRun' | 'failRun'>;
    completeStructuredFn?: typeof defaultCompleteStructured;
    snapshotService?: RegulatorySnapshotService;
    itemService?: RegulatoryItemService;
    draftService?: RegulatoryAlertDraftService;
}
export declare class RegulatoryEnrichmentService {
    private readonly prisma;
    private readonly agentRuns;
    private readonly completeStructuredFn;
    readonly snapshotService: RegulatorySnapshotService;
    readonly itemService: RegulatoryItemService;
    private readonly draftService;
    constructor(deps?: RegulatoryEnrichmentServiceDependencies);
    /**
     * Builds prompt with strict prompt-injection boundary.
     */
    private buildEnrichmentPrompt;
    /**
     * Processes an immutable RegulatorySourceSnapshot, runs LLM enrichment, creates/updates
     * RegulatorySourceItem and primary/update evidence, and creates an inactive draft RegulatoryAlert.
     */
    processSnapshot(params: ProcessRegulatorySnapshotMachineInput): Promise<ProcessRegulatorySnapshotResult>;
    /**
     * Reconciliation query to find eligible un-enriched snapshots.
     * A snapshot is pending if no COMPLETED AgentRun exists for "W-REG-03:<snapshotId>:v1".
     */
    listPendingSnapshots(input?: number | {
        limit?: number;
    }): Promise<{
        snapshots: Array<{
            id: string;
            sourceId: string;
            sourceKey: string;
            jurisdictionCode: string;
            regulatoryBody: string;
            canonicalUrl: string;
            retrievedAt: Date;
        }>;
        total: number;
    }>;
}
export declare const regulatoryEnrichmentService: RegulatoryEnrichmentService;
//# sourceMappingURL=regulatory-enrichment.service.d.ts.map