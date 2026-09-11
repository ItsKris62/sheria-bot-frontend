import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { RegulatorySnapshotService } from './regulatory-snapshot.service';
import type { FetchRegulatorySourceInput, RegulatoryFetchResult } from './types';
export declare class RegulatoryFetchService {
    private readonly prisma;
    private readonly snapshotService;
    constructor(prisma?: typeof defaultPrisma, snapshotService?: RegulatorySnapshotService);
    /**
     * Safely fetches a configured RegulatorySource from authoritative DB configuration,
     * performs SSRF/security checks, conditional HTTP headers (ETag / 304),
     * content normalization, SHA-256 hash comparison, and atomic snapshot persistence.
     *
     * Updates source health metadata (lastCheckedAt, lastSuccessfulFetchAt, failureCount).
     */
    fetchAndIngestSource(input: FetchRegulatorySourceInput): Promise<RegulatoryFetchResult>;
    /**
     * Admin test connection action: tests URL reachability and latency without persisting snapshots.
     */
    testConnection(sourceId: string): Promise<{
        ok: boolean;
        httpStatus: number;
        latencyMs: number;
        contentType?: string;
        previewText?: string;
        error?: string;
    }>;
}
export declare const regulatoryFetchService: RegulatoryFetchService;
//# sourceMappingURL=regulatory-fetch.service.d.ts.map