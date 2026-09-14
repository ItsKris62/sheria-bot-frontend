/**
 * Lead Discovery Source Registry & Persistent State Manager (P1)
 *
 * Provides authoritative server-side definitions for Kenyan regulatory lead discovery sources
 * and manages persistent source state (fingerprints, cursors, consecutive failures) in Redis.
 */
export interface DiscoverySourceDefinition {
    sourceId: string;
    name: string;
    authority: string;
    jurisdiction: 'KE';
    sourceType: 'REGULATORY_REGISTER' | 'REGULATORY_DIRECTORY' | 'GOVERNMENT_NOTICE';
    contentAdapter: 'PDF_TABULAR' | 'HTML_TABLE' | 'JSON_API' | 'CSV';
    targetSegment: string;
    landingPageUrl: string;
    resolvedDocumentUrl: string;
    trustTier: 'OFFICIAL_REGULATOR' | 'GOVERNMENT_GAZETTE' | 'OFFICIAL_COMPANY';
    maxRecords: number;
    enabled: boolean;
    concurrencyLimit: number;
    retryPolicy: {
        maxRetries: number;
        backoffMs: number;
    };
    lastReviewedDate: string;
    notes?: string;
    state?: DiscoverySourceState;
}
export interface DiscoverySourceState {
    sourceId: string;
    lastSuccessfulFingerprint?: string | null;
    lastSuccessfulAt?: string | null;
    lastProcessedCursor?: string | null;
    lastRecordIdentifier?: string | null;
    lastSourceVersion?: string | null;
    lastResult?: 'SUCCESS' | 'FAILED' | 'SKIPPED_UNCHANGED' | null;
    consecutiveFailures: number;
    updatedAt: string;
    metadata?: Record<string, unknown>;
}
export interface UpdateDiscoverySourceStateInput {
    sourceId: string;
    contentFingerprint?: string | null;
    processedCursor?: string | null;
    recordIdentifier?: string | null;
    sourceVersion?: string | null;
    result: 'SUCCESS' | 'FAILED' | 'SKIPPED_UNCHANGED';
    errorMessage?: string | null;
    metadata?: Record<string, unknown>;
}
/**
 * Authoritative Canonical Source Definitions for Kenya
 */
export declare const KENYA_DISCOVERY_SOURCES: DiscoverySourceDefinition[];
/**
 * Fetch source definitions merged with persistent execution state
 */
export declare function getDiscoverySources(jurisdiction?: string): Promise<DiscoverySourceDefinition[]>;
/**
 * Updates the persistent source execution state upon completion or failure
 */
export declare function updateDiscoverySourceState(input: UpdateDiscoverySourceStateInput): Promise<DiscoverySourceState>;
//# sourceMappingURL=lead-discovery-sources.d.ts.map