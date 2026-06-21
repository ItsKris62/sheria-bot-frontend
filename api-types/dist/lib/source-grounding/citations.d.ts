import type { SearchResult } from '@/lib/rag/rag.service';
export type CitationVerificationStatus = 'verified' | 'unverified' | 'not_checked';
export type SourceCitation = {
    documentId: string | null;
    documentTitle: string;
    section: string;
    textSnippet: string;
    score: number;
    citation: string | null;
    authorityStatus: string;
    isBinding: boolean;
    source: string | null;
    version: string | null;
    verified: boolean;
    verificationStatus: CitationVerificationStatus;
    regulator?: string;
    sectionTitle?: string;
    sectionNumber?: string;
    pageNumber?: number;
    chunkId?: string;
};
export declare function buildCitationFromSearchResult(source: SearchResult, verificationStatus?: CitationVerificationStatus): SourceCitation;
export declare function buildCitationsFromChunks(chunks: SearchResult[], verificationStatus?: CitationVerificationStatus): SourceCitation[];
export declare function hasUsableCitations(citations: SourceCitation[]): boolean;
export declare function findAcceptedChunks(acceptedChunkIds: unknown, ragResults: SearchResult[]): SearchResult[];
export declare function buildCitationsFromAcceptedRefs(acceptedChunkIds: unknown, ragResults: SearchResult[], verificationStatus?: CitationVerificationStatus): SourceCitation[];
//# sourceMappingURL=citations.d.ts.map