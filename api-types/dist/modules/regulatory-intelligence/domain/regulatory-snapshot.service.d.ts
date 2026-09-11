import type { RegulatorySourceSnapshot } from '@prisma/client';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
import type { IngestRegulatorySnapshotInput, SnapshotIngestResult } from './types';
export declare const HASH_VERSION = 1;
export declare const NORMALIZATION_VERSION = 1;
export declare class RegulatorySnapshotService {
    private readonly prisma;
    constructor(prisma?: typeof defaultPrisma);
    /**
     * Computes normalized text and versioned SHA-256 hash.
     */
    normalizeAndHash(rawPayload: string): {
        normalizedText: string;
        contentHash: string;
    };
    /**
     * Ingests an immutable regulatory source snapshot with DB-level deduplication.
     * Concurrency-safe against race conditions via DB unique constraint [sourceId, canonicalUrl, contentHash].
     */
    ingestSnapshot(input: IngestRegulatorySnapshotInput): Promise<SnapshotIngestResult>;
    getSnapshot(id: string): Promise<RegulatorySourceSnapshot>;
    listSnapshotsForSource(sourceId: string, limit?: number): Promise<RegulatorySourceSnapshot[]>;
}
export declare const regulatorySnapshotService: RegulatorySnapshotService;
//# sourceMappingURL=regulatory-snapshot.service.d.ts.map