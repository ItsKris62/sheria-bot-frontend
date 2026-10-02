import type { SearchResult } from './rag.service';
export interface RerankerOptions {
    provider?: 'heuristic' | 'cohere' | 'local';
    topN?: number;
    timeoutMs?: number;
    apiKey?: string;
    model?: string;
}
export interface ScoreDistribution {
    min: number;
    max: number;
    avg: number;
}
export interface RerankOutcome {
    results: SearchResult[];
    provider: 'heuristic' | 'cohere' | 'local';
    latencyMs: number;
    scoreDistribution: ScoreDistribution;
    fallbackTriggered: boolean;
    fallbackReason?: string;
}
/**
 * Execute heuristic multi-factor reranking based on query term frequency,
 * citation presence, and section title matching.
 */
export declare function heuristicRerank(query: string, chunks: SearchResult[], topN?: number): SearchResult[];
/**
 * Rerank chunks using configured provider with circuit breaker, timeout, and heuristic fallback.
 */
export declare function rerankChunks(query: string, chunks: SearchResult[], options?: RerankerOptions): Promise<RerankOutcome>;
//# sourceMappingURL=reranker.service.d.ts.map