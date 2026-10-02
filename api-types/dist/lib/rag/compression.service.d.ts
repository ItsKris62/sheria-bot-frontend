import type { SearchResult } from './rag.service';
export interface CompressionOptions {
    enabled?: boolean;
    strategy?: 'rule-based' | 'extractive';
    maxOutputTokensPerChunk?: number;
    currentPipelineLatencyMs?: number;
}
export interface CompressionOutcome {
    compressedResults: SearchResult[];
    enabled: boolean;
    strategy: 'rule-based' | 'extractive' | 'none';
    originalTokens: number;
    compressedTokens: number;
    compressionRatio: number;
    latencyMs: number;
    skippedDueToLatencyBudget?: boolean;
}
/**
 * Estimate token count from text using 4 characters per token heuristic.
 */
export declare function estimateTokens(text: string): number;
/**
 * Verify if key citation anchors present in original text remain in compressed text.
 * Checks documentTitle, section, clauseNumber, provisionId, etc.
 */
export declare function containsCitationAnchors(original: SearchResult, compressedText: string): boolean;
/**
 * Rule-based operative clause compression for legal and regulatory chunks.
 * Extracts sentences with query overlap, section titles, definitions, and mandatory terms.
 */
export declare function compressChunkRuleBased(chunk: SearchResult, query: string, maxTokens: number): string;
/**
 * Compress context chunks to reduce prompt token footprint.
 */
export declare function compressContextChunks(query: string, chunks: SearchResult[], options?: CompressionOptions): Promise<CompressionOutcome>;
//# sourceMappingURL=compression.service.d.ts.map