import type { SearchResult } from '@/lib/rag/rag.service';
import type { AnswerClaimVerification } from '@/lib/source-grounding/claim-verification';
import type { JurisdictionContext, JurisdictionCode } from '@/types/jurisdiction';
export type CitationVerificationStatus = 'verified' | 'unverified' | 'not_checked';
export type SourceCitation = {
    vectorId: string | null;
    chunkId: string | null;
    documentId: string | null;
    documentTitle: string;
    jurisdictionCode: JurisdictionCode | null;
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
    contentHash?: string;
    matchingStrategy?: 'vectorId' | 'chunkId' | 'document_section_rank' | 'document_section';
};
export declare function buildCitationFromSearchResult(source: SearchResult, verificationStatus?: CitationVerificationStatus): SourceCitation;
export declare function buildCitationsFromChunks(chunks: SearchResult[], verificationStatus?: CitationVerificationStatus): SourceCitation[];
export declare function buildCitationsFromSupportedClaims(claims: AnswerClaimVerification[], verificationStatus?: CitationVerificationStatus): SourceCitation[];
export declare function hasUsableCitations(citations: SourceCitation[]): boolean;
export declare function findAcceptedChunks(acceptedChunkIds: unknown, ragResults: SearchResult[]): SearchResult[];
export declare function validateCitationsForJurisdiction(citations: SourceCitation[], jurisdictionContext: JurisdictionContext): {
    valid: boolean;
    invalidCitations: SourceCitation[];
};
export declare function buildCitationsFromAcceptedRefs(acceptedChunkIds: unknown, ragResults: SearchResult[], verificationStatus?: CitationVerificationStatus): SourceCitation[];
//# sourceMappingURL=citations.d.ts.map