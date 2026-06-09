import type { SearchResult } from '@/lib/rag/rag.service';
export interface PackagedCitations {
    inline: string[];
    full: string[];
}
/** Pure transform — no AI call. Deduplicates and formats citations from search results. */
export declare function packCitations(results: SearchResult[]): PackagedCitations;
//# sourceMappingURL=citation.agent.d.ts.map