import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { RegulatorySnapshotService, RegulatoryItemService, RegulatoryAlertDraftService, RegulatoryFetchService, RegulatoryEnrichmentService } from '@/modules/regulatory-intelligence/domain';
import type { IngestRegulatorySnapshotInput, CreateRegulatorySourceItemInput, ListRegulatorySourceItemsInput, CreateRegulatoryAlertDraftInput, FetchRegulatorySourceInput, RegulatoryFetchResult, SnapshotIngestResult, ProcessRegulatorySnapshotMachineInput, ProcessRegulatorySnapshotResult } from '@/modules/regulatory-intelligence/domain/types';
export interface RegulatorySourceOperationalItem {
    id: string;
    sourceKey: string;
    name: string;
    jurisdictionCode: string;
    regulatoryBody: string;
    authorityType: string;
    sourceType: string;
    baseUrl: string;
    fetchUrl?: string;
    lastCheckedAt?: string;
}
export interface RegulatoryAutomationServiceDependencies {
    prisma?: typeof defaultPrisma;
    snapshotService?: RegulatorySnapshotService;
    itemService?: RegulatoryItemService;
    alertDraftService?: RegulatoryAlertDraftService;
    fetchService?: RegulatoryFetchService;
    enrichmentService?: RegulatoryEnrichmentService;
}
export declare class RegulatoryAutomationService {
    private readonly prisma;
    private readonly snapshotService;
    private readonly itemService;
    private readonly alertDraftService;
    private readonly fetchService;
    private readonly enrichmentService;
    constructor(dependencies?: RegulatoryAutomationServiceDependencies);
    /**
     * Machine procedure for W-REG-01 to query which sources to monitor.
     * Exposes only operational fields needed by workflow orchestration.
     */
    listSources(input: {
        jurisdictions?: string;
        limit?: number;
    }): Promise<{
        sources: RegulatorySourceOperationalItem[];
    }>;
    /**
     * Machine procedure for W-REG-01 to safely fetch a regulatory source via the backend,
     * handling SSRF checks, ETag conditional caching, normalization, hashing, and snapshot persistence.
     */
    fetchSource(input: FetchRegulatorySourceInput): Promise<RegulatoryFetchResult>;
    /**
     * Machine procedure for W-REG-01 to ingest immutable evidence snapshots.
     */
    ingestSnapshot(input: IngestRegulatorySnapshotInput): Promise<SnapshotIngestResult>;
    /**
     * Machine procedure for W-REG-03 to persist normalized regulatory intelligence items.
     */
    createSourceItem(input: CreateRegulatorySourceItemInput): Promise<{
        id: string;
        dedupeKey: string;
        jurisdictionCode: string;
        regulator: string;
        title: string;
        informationType: import(".prisma/client").$Enums.RegulatoryInformationType;
        regulatoryStage: import(".prisma/client").$Enums.RegulatoryStage;
        materiality: import(".prisma/client").$Enums.RegulatoryMateriality;
        createdAt: string;
    }>;
    /**
     * Machine procedure to fetch a single normalized regulatory item with evidence provenance.
     */
    getSourceItem(input: {
        itemId: string;
    }): Promise<{
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        effectiveDate: Date | null;
        summary: string;
        jurisdictionCode: string;
        regulator: string;
        publicationDate: Date | null;
        supersededById: string | null;
        sourceId: string;
        dedupeKey: string;
        primarySnapshotId: string | null;
        officialTitle: string | null;
        informationType: import(".prisma/client").$Enums.RegulatoryInformationType;
        regulatoryStage: import(".prisma/client").$Enums.RegulatoryStage;
        verificationState: import(".prisma/client").$Enums.RegulatoryVerificationState;
        materiality: import(".prisma/client").$Enums.RegulatoryMateriality;
        relevanceScore: number | null;
        consultationDeadline: Date | null;
        complianceDeadline: Date | null;
        affectedSectors: import("@prisma/client/runtime/client").JsonValue;
        affectedEntityTypes: import("@prisma/client/runtime/client").JsonValue;
        topics: import("@prisma/client/runtime/client").JsonValue;
        firstDetectedAt: Date;
        lastObservedAt: Date;
    }>;
    /**
     * Machine procedure to query recent normalized regulatory items.
     */
    listSourceItems(input: ListRegulatorySourceItemsInput): Promise<{
        items: import(".prisma/client").RegulatorySourceItem[];
        total: number;
    }>;
    /**
     * Machine procedure to fetch a single snapshot by ID with trusted source relation.
     */
    getSnapshot(input: {
        snapshotId: string;
    }): Promise<{
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        id: string;
        title: string | null;
        createdAt: Date;
        contentType: string | null;
        retrievedAt: Date;
        contentHash: string;
        sourceId: string;
        sourceUrl: string;
        canonicalUrl: string;
        hashVersion: number;
        normalizationVersion: number;
        contentLength: number;
        httpStatus: number | null;
        etag: string | null;
        lastModified: string | null;
        rawText: string | null;
        rawPayload: string | null;
        rawStorageKey: string | null;
    }>;
    /**
     * Machine procedure for W-REG-03 to enrich a regulatory snapshot and create an inactive draft.
     */
    processSnapshot(input: ProcessRegulatorySnapshotMachineInput): Promise<ProcessRegulatorySnapshotResult>;
    /**
     * Machine procedure for W-REG-03 scheduled reconciliation to query pending snapshots.
     */
    listPendingSnapshots(input: {
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
    /**
     * Machine procedure for W-REG-03 to create an inactive draft RegulatoryAlert.
     * INVARIANT: Always creates isActive = false. Never publishes or notifies.
     */
    createAlertDraft(input: CreateRegulatoryAlertDraftInput, agentUserId: string): Promise<{
        alertId: string;
        title: string;
        summary: string;
        jurisdictionCode: string;
        regulatoryBody: string;
        category: string;
        severity: string;
        isActive: boolean;
        automationDraftKey: string | null;
        primaryRegulatorySourceItemId: string | null;
        isNew: boolean;
    }>;
}
export declare const regulatoryAutomationService: RegulatoryAutomationService;
//# sourceMappingURL=regulatory-automation.service.d.ts.map