import { Pinecone } from '@pinecone-database/pinecone';
/**
 * Vector metadata structure
 */
export interface VectorMetadata {
    documentId: string;
    documentTitle: string;
    documentType: string;
    chunkIndex: number;
    chunk_text?: string;
    section?: string;
    subsection?: string;
    actName?: string;
    year?: number;
    regulatoryArea?: string;
    citation?: string;
    /** ISO jurisdiction label used by RAG filter auto-detection (e.g. "Kenya", "International", "EU") */
    jurisdiction?: string;
    /** Prisma RegulatoryDocumentCategory value used by RAG filter auto-detection */
    category?: string;
    /** Legal authority status for the source instrument (DRAFT, IN_FORCE, SUPERSEDED, CONSULTATION) */
    authorityStatus?: string;
    /** Whether the source instrument is currently binding law */
    isBinding?: boolean;
    /** Publisher/source label, e.g. Central Bank of Kenya */
    source?: string;
    /** Human version label from the corpus registry */
    version?: string;
    /** Corpus lifecycle status, e.g. ACTIVE or SUPERSEDED */
    corpusStatus?: string;
    /** Human framework label captured during indexing. */
    framework?: string;
    /** Regulatory framework slug attached by ingestion or gap-analysis retrieval filters. */
    frameworkSlug?: string;
    /** Original LegalDocument ID when this vector came from the legal corpus. */
    legalDocumentId?: string;
}
/**
 * Record used for integrated embedding upsert.
 * Flat structure  -  all fields at top level (Pinecone SDK v7 upsertRecords requirement).
 */
export interface IntegratedVectorRecord extends VectorMetadata {
    id: string;
    chunk_text: string;
}
/**
 * Query result
 */
export interface QueryResult {
    id: string;
    score: number;
    metadata: VectorMetadata;
}
/**
 * Initialize Pinecone client
 */
declare const pinecone: Pinecone;
/**
 * Get Pinecone index
 */
export declare function getIndex(): Promise<import("@pinecone-database/pinecone").Index<import("@pinecone-database/pinecone").RecordMetadata>>;
/**
 * Upsert using integrated embeddings (Pinecone SDK v7).
 * Records are flat objects; Pinecone generates embeddings from `chunk_text`.
 */
export declare function upsertVectors(records: IntegratedVectorRecord[], namespace?: string): Promise<void>;
/**
 * Query using integrated embeddings (Pinecone SDK v7).
 * Pinecone embeds query text internally via searchRecords.
 */
export declare function queryVectors(queryText: string, topK?: number, namespace?: string, filter?: Record<string, any>): Promise<QueryResult[]>;
/**
 * Delete vectors by IDs
 */
export declare function deleteVectors(ids: string[], namespace?: string): Promise<void>;
/**
 * Delete by metadata filter
 */
export declare function deleteByFilter(filter: Record<string, any>, namespace?: string): Promise<void>;
/**
 * Clear entire namespace (dev only)
 */
export declare function deleteAllInNamespace(namespace: string): Promise<void>;
/**
 * Get index stats
 */
export declare function getIndexStats(): Promise<import("@pinecone-database/pinecone").IndexStatsDescription>;
/**
 * Health check
 */
export declare function checkPineconeHealth(): Promise<boolean>;
export { pinecone };
//# sourceMappingURL=client.d.ts.map