import { z } from 'zod';
import { RegulatoryAuthorityType, RegulatorySourceType, RegulatoryInformationType, RegulatoryStage, RegulatoryVerificationState, RegulatoryMateriality, RegulatoryEvidenceRole } from '@prisma/client';
export { RegulatoryAuthorityType, RegulatorySourceType, RegulatoryInformationType, RegulatoryStage, RegulatoryVerificationState, RegulatoryMateriality, RegulatoryEvidenceRole, };
export declare const JURISDICTION_CODES: readonly ["KE", "RW", "MW", "NG"];
export declare const createRegulatorySourceSchema: z.ZodObject<{
    sourceKey: z.ZodString;
    name: z.ZodString;
    jurisdictionCode: z.ZodDefault<z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
        NG: "NG";
    }>>;
    regulatoryBody: z.ZodString;
    authorityType: z.ZodDefault<z.ZodEnum<{
        PRIMARY_OFFICIAL: "PRIMARY_OFFICIAL";
        AUTHORITATIVE: "AUTHORITATIVE";
        SECONDARY_VERIFIED: "SECONDARY_VERIFIED";
    }>>;
    sourceType: z.ZodDefault<z.ZodEnum<{
        WEBSITE: "WEBSITE";
        FEED_RSS: "FEED_RSS";
        GAZETTE_FEED: "GAZETTE_FEED";
        API: "API";
        PORTAL: "PORTAL";
    }>>;
    baseUrl: z.ZodString;
    fetchUrl: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const updateRegulatorySourceSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    jurisdictionCode: z.ZodOptional<z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
        NG: "NG";
    }>>;
    regulatoryBody: z.ZodOptional<z.ZodString>;
    authorityType: z.ZodOptional<z.ZodEnum<{
        PRIMARY_OFFICIAL: "PRIMARY_OFFICIAL";
        AUTHORITATIVE: "AUTHORITATIVE";
        SECONDARY_VERIFIED: "SECONDARY_VERIFIED";
    }>>;
    sourceType: z.ZodOptional<z.ZodEnum<{
        WEBSITE: "WEBSITE";
        FEED_RSS: "FEED_RSS";
        GAZETTE_FEED: "GAZETTE_FEED";
        API: "API";
        PORTAL: "PORTAL";
    }>>;
    baseUrl: z.ZodOptional<z.ZodString>;
    fetchUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const listRegulatorySourcesSchema: z.ZodObject<{
    jurisdictionCode: z.ZodOptional<z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
        NG: "NG";
    }>>;
    regulatoryBody: z.ZodOptional<z.ZodString>;
    authorityType: z.ZodOptional<z.ZodEnum<{
        PRIMARY_OFFICIAL: "PRIMARY_OFFICIAL";
        AUTHORITATIVE: "AUTHORITATIVE";
        SECONDARY_VERIFIED: "SECONDARY_VERIFIED";
    }>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const ingestRegulatorySnapshotSchema: z.ZodObject<{
    sourceId: z.ZodString;
    sourceUrl: z.ZodString;
    rawPayload: z.ZodOptional<z.ZodString>;
    rawText: z.ZodOptional<z.ZodString>;
    rawStorageKey: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    httpStatus: z.ZodOptional<z.ZodNumber>;
    contentType: z.ZodOptional<z.ZodString>;
    etag: z.ZodOptional<z.ZodString>;
    lastModified: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export interface SnapshotIngestResult {
    status: 'CREATED' | 'DUPLICATE';
    snapshotId: string;
    sourceId: string;
    canonicalUrl: string;
    contentHash: string;
    isNew: boolean;
}
export declare const createRegulatorySourceItemSchema: z.ZodObject<{
    dedupeKey: z.ZodString;
    sourceId: z.ZodString;
    primarySnapshotId: z.ZodOptional<z.ZodString>;
    jurisdictionCode: z.ZodDefault<z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
        NG: "NG";
    }>>;
    regulator: z.ZodString;
    title: z.ZodString;
    officialTitle: z.ZodOptional<z.ZodString>;
    summary: z.ZodString;
    informationType: z.ZodDefault<z.ZodEnum<{
        DRAFT_REGULATION: "DRAFT_REGULATION";
        CIRCULAR: "CIRCULAR";
        CONSULTATION: "CONSULTATION";
        NOTICE: "NOTICE";
        GAZETTE_NOTICE: "GAZETTE_NOTICE";
        GUIDANCE: "GUIDANCE";
        DIRECTIVE: "DIRECTIVE";
        LEGISLATIVE_UPDATE: "LEGISLATIVE_UPDATE";
        POLICY_UPDATE: "POLICY_UPDATE";
        ENFORCEMENT: "ENFORCEMENT";
        LICENSING_UPDATE: "LICENSING_UPDATE";
        OFFICIAL_ANNOUNCEMENT: "OFFICIAL_ANNOUNCEMENT";
        MARKET_DEVELOPMENT: "MARKET_DEVELOPMENT";
        OTHER: "OTHER";
    }>>;
    regulatoryStage: z.ZodDefault<z.ZodEnum<{
        DRAFT: "DRAFT";
        PROPOSED: "PROPOSED";
        CONSULTATION: "CONSULTATION";
        ANNOUNCED: "ANNOUNCED";
        ISSUED: "ISSUED";
        GAZETTED: "GAZETTED";
        EFFECTIVE: "EFFECTIVE";
        DEVELOPING: "DEVELOPING";
        SUPERSEDED: "SUPERSEDED";
        WITHDRAWN: "WITHDRAWN";
    }>>;
    verificationState: z.ZodDefault<z.ZodEnum<{
        UNVERIFIED: "UNVERIFIED";
        SOURCE_VERIFIED: "SOURCE_VERIFIED";
        FACT_VERIFIED: "FACT_VERIFIED";
        REQUIRES_REVIEW: "REQUIRES_REVIEW";
        DISPUTED: "DISPUTED";
    }>>;
    materiality: z.ZodDefault<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>;
    relevanceScore: z.ZodOptional<z.ZodNumber>;
    publicationDate: z.ZodOptional<z.ZodString>;
    effectiveDate: z.ZodOptional<z.ZodString>;
    consultationDeadline: z.ZodOptional<z.ZodString>;
    complianceDeadline: z.ZodOptional<z.ZodString>;
    affectedSectors: z.ZodDefault<z.ZodArray<z.ZodString>>;
    affectedEntityTypes: z.ZodDefault<z.ZodArray<z.ZodString>>;
    topics: z.ZodDefault<z.ZodArray<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const updateRegulatorySourceItemSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    officialTitle: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    informationType: z.ZodOptional<z.ZodEnum<{
        DRAFT_REGULATION: "DRAFT_REGULATION";
        CIRCULAR: "CIRCULAR";
        CONSULTATION: "CONSULTATION";
        NOTICE: "NOTICE";
        GAZETTE_NOTICE: "GAZETTE_NOTICE";
        GUIDANCE: "GUIDANCE";
        DIRECTIVE: "DIRECTIVE";
        LEGISLATIVE_UPDATE: "LEGISLATIVE_UPDATE";
        POLICY_UPDATE: "POLICY_UPDATE";
        ENFORCEMENT: "ENFORCEMENT";
        LICENSING_UPDATE: "LICENSING_UPDATE";
        OFFICIAL_ANNOUNCEMENT: "OFFICIAL_ANNOUNCEMENT";
        MARKET_DEVELOPMENT: "MARKET_DEVELOPMENT";
        OTHER: "OTHER";
    }>>;
    regulatoryStage: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        PROPOSED: "PROPOSED";
        CONSULTATION: "CONSULTATION";
        ANNOUNCED: "ANNOUNCED";
        ISSUED: "ISSUED";
        GAZETTED: "GAZETTED";
        EFFECTIVE: "EFFECTIVE";
        DEVELOPING: "DEVELOPING";
        SUPERSEDED: "SUPERSEDED";
        WITHDRAWN: "WITHDRAWN";
    }>>;
    verificationState: z.ZodOptional<z.ZodEnum<{
        UNVERIFIED: "UNVERIFIED";
        SOURCE_VERIFIED: "SOURCE_VERIFIED";
        FACT_VERIFIED: "FACT_VERIFIED";
        REQUIRES_REVIEW: "REQUIRES_REVIEW";
        DISPUTED: "DISPUTED";
    }>>;
    materiality: z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>;
    relevanceScore: z.ZodOptional<z.ZodNumber>;
    publicationDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    effectiveDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    consultationDeadline: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    complianceDeadline: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    affectedSectors: z.ZodOptional<z.ZodArray<z.ZodString>>;
    affectedEntityTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    topics: z.ZodOptional<z.ZodArray<z.ZodString>>;
    supersededById: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const linkEvidenceSchema: z.ZodObject<{
    sourceItemId: z.ZodString;
    snapshotId: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        PRIMARY: "PRIMARY";
        SUPPORTING: "SUPPORTING";
        UPDATE: "UPDATE";
        SUPERSEDING: "SUPERSEDING";
    }>>;
    isPrimary: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const listRegulatorySourceItemsSchema: z.ZodObject<{
    sourceId: z.ZodOptional<z.ZodString>;
    jurisdictionCode: z.ZodOptional<z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
        NG: "NG";
    }>>;
    regulator: z.ZodOptional<z.ZodString>;
    informationType: z.ZodOptional<z.ZodEnum<{
        DRAFT_REGULATION: "DRAFT_REGULATION";
        CIRCULAR: "CIRCULAR";
        CONSULTATION: "CONSULTATION";
        NOTICE: "NOTICE";
        GAZETTE_NOTICE: "GAZETTE_NOTICE";
        GUIDANCE: "GUIDANCE";
        DIRECTIVE: "DIRECTIVE";
        LEGISLATIVE_UPDATE: "LEGISLATIVE_UPDATE";
        POLICY_UPDATE: "POLICY_UPDATE";
        ENFORCEMENT: "ENFORCEMENT";
        LICENSING_UPDATE: "LICENSING_UPDATE";
        OFFICIAL_ANNOUNCEMENT: "OFFICIAL_ANNOUNCEMENT";
        MARKET_DEVELOPMENT: "MARKET_DEVELOPMENT";
        OTHER: "OTHER";
    }>>;
    regulatoryStage: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        PROPOSED: "PROPOSED";
        CONSULTATION: "CONSULTATION";
        ANNOUNCED: "ANNOUNCED";
        ISSUED: "ISSUED";
        GAZETTED: "GAZETTED";
        EFFECTIVE: "EFFECTIVE";
        DEVELOPING: "DEVELOPING";
        SUPERSEDED: "SUPERSEDED";
        WITHDRAWN: "WITHDRAWN";
    }>>;
    verificationState: z.ZodOptional<z.ZodEnum<{
        UNVERIFIED: "UNVERIFIED";
        SOURCE_VERIFIED: "SOURCE_VERIFIED";
        FACT_VERIFIED: "FACT_VERIFIED";
        REQUIRES_REVIEW: "REQUIRES_REVIEW";
        DISPUTED: "DISPUTED";
    }>>;
    materiality: z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const createRegulatoryAlertDraftSchema: z.ZodObject<{
    sourceItemId: z.ZodString;
    automationDraftKey: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    severity: z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>;
    effectiveDate: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodString>;
    sourceUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const fetchRegulatorySourceSchema: z.ZodObject<{
    sourceId: z.ZodOptional<z.ZodString>;
    sourceKey: z.ZodOptional<z.ZodString>;
    executionMetadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type CreateRegulatorySourceInput = z.input<typeof createRegulatorySourceSchema>;
export type UpdateRegulatorySourceInput = z.input<typeof updateRegulatorySourceSchema>;
export type ListRegulatorySourcesInput = z.input<typeof listRegulatorySourcesSchema>;
export type IngestRegulatorySnapshotInput = z.input<typeof ingestRegulatorySnapshotSchema>;
export type CreateRegulatorySourceItemInput = z.input<typeof createRegulatorySourceItemSchema>;
export type UpdateRegulatorySourceItemInput = z.input<typeof updateRegulatorySourceItemSchema>;
export type LinkEvidenceInput = z.input<typeof linkEvidenceSchema>;
export type ListRegulatorySourceItemsInput = z.input<typeof listRegulatorySourceItemsSchema>;
export type CreateRegulatoryAlertDraftInput = z.input<typeof createRegulatoryAlertDraftSchema>;
export type FetchRegulatorySourceInput = z.input<typeof fetchRegulatorySourceSchema>;
export type RegulatoryFetchResultStatus = 'SUCCESS' | 'FAILED' | 'SKIPPED';
export type RegulatoryChangeType = 'NEW' | 'CHANGED' | 'UNCHANGED';
export interface RegulatoryFetchResult {
    status: RegulatoryFetchResultStatus;
    changeType?: RegulatoryChangeType;
    sourceId: string;
    sourceKey: string;
    snapshotId?: string | null;
    contentHash?: string;
    canonicalUrl?: string;
    httpStatus?: number;
    error?: string;
    isNew?: boolean;
}
export declare const zodRegulatoryEnrichmentOutputSchema: z.ZodObject<{
    title: z.ZodString;
    officialTitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    officialReferenceNumber: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    summary: z.ZodString;
    whatChanged: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    complianceImplications: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    recommendedActions: z.ZodDefault<z.ZodArray<z.ZodString>>;
    informationType: z.ZodDefault<z.ZodEnum<{
        DRAFT_REGULATION: "DRAFT_REGULATION";
        CIRCULAR: "CIRCULAR";
        CONSULTATION: "CONSULTATION";
        NOTICE: "NOTICE";
        GAZETTE_NOTICE: "GAZETTE_NOTICE";
        GUIDANCE: "GUIDANCE";
        DIRECTIVE: "DIRECTIVE";
        LEGISLATIVE_UPDATE: "LEGISLATIVE_UPDATE";
        POLICY_UPDATE: "POLICY_UPDATE";
        ENFORCEMENT: "ENFORCEMENT";
        LICENSING_UPDATE: "LICENSING_UPDATE";
        OFFICIAL_ANNOUNCEMENT: "OFFICIAL_ANNOUNCEMENT";
        MARKET_DEVELOPMENT: "MARKET_DEVELOPMENT";
        OTHER: "OTHER";
    }>>;
    regulatoryStage: z.ZodDefault<z.ZodEnum<{
        DRAFT: "DRAFT";
        PROPOSED: "PROPOSED";
        CONSULTATION: "CONSULTATION";
        ANNOUNCED: "ANNOUNCED";
        ISSUED: "ISSUED";
        GAZETTED: "GAZETTED";
        EFFECTIVE: "EFFECTIVE";
        DEVELOPING: "DEVELOPING";
        SUPERSEDED: "SUPERSEDED";
        WITHDRAWN: "WITHDRAWN";
    }>>;
    materiality: z.ZodDefault<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>;
    publicationDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    effectiveDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    consultationDeadline: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    complianceDeadline: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    affectedSectors: z.ZodDefault<z.ZodArray<z.ZodString>>;
    affectedEntityTypes: z.ZodDefault<z.ZodArray<z.ZodString>>;
    topics: z.ZodDefault<z.ZodArray<z.ZodString>>;
    alertCategory: z.ZodDefault<z.ZodEnum<{
        DATA_PROTECTION: "DATA_PROTECTION";
        AML_CFT: "AML_CFT";
        PRUDENTIAL: "PRUDENTIAL";
        LICENSING: "LICENSING";
        CAPITAL_MARKETS: "CAPITAL_MARKETS";
        GENERAL: "GENERAL";
    }>>;
    alertSeverity: z.ZodDefault<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>;
    confidence: z.ZodDefault<z.ZodNumber>;
    uncertainties: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type RegulatoryEnrichmentOutput = z.infer<typeof zodRegulatoryEnrichmentOutputSchema>;
export declare const getRegulatorySnapshotMachineSchema: z.ZodObject<{
    snapshotId: z.ZodString;
}, z.core.$strip>;
export declare const processRegulatorySnapshotMachineSchema: z.ZodObject<{
    snapshotId: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const listPendingRegulatorySnapshotsMachineSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type GetRegulatorySnapshotMachineInput = z.input<typeof getRegulatorySnapshotMachineSchema>;
export type ProcessRegulatorySnapshotMachineInput = z.input<typeof processRegulatorySnapshotMachineSchema>;
export type ListPendingRegulatorySnapshotsMachineInput = z.input<typeof listPendingRegulatorySnapshotsMachineSchema>;
export interface ProcessRegulatorySnapshotResult {
    status: 'COMPLETED' | 'SKIPPED' | 'BUDGET_BLOCKED' | 'FAILED_REVIEW' | 'FAILED_FATAL';
    snapshotId: string;
    sourceItemId?: string | null;
    alertDraftId?: string | null;
    draftCreated: boolean;
    duplicate: boolean;
    materiality?: RegulatoryMateriality;
    verificationState?: RegulatoryVerificationState;
    costUsd?: number;
    tokensUsed?: {
        inputTokens: number;
        outputTokens: number;
    };
    error?: string;
    whatChanged?: string | null;
}
/**
 * Computes a deterministic deduplication key following the identity hierarchy:
 * 1. Official document/reference number: ref:JURISDICTION:REGULATOR:REF_NUM
 * 2. Stable canonical document URL: url:JURISDICTION:REGULATOR:CANONICAL_URL
 * 3. Source-provided GUID: guid:SOURCE_ID:GUID
 * 4. Deterministic fallback fingerprint: fp:v1:SOURCE_ID:HASH(title + date)
 */
export declare function computeRegulatoryItemDedupeKey(params: {
    jurisdictionCode: string;
    regulator: string;
    sourceId: string;
    title: string;
    officialReference?: string | null;
    canonicalUrl?: string | null;
    guid?: string | null;
    publicationDate?: string | null;
}): string;
//# sourceMappingURL=types.d.ts.map