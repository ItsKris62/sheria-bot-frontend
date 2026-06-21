import type { SearchResult } from '@/lib/rag/rag.service';
export type ClaimVerificationStatus = 'supported' | 'unsupported' | 'not_required';
export type ClaimVerificationVerdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type AnswerClaimVerification = {
    claimText: string;
    claimType: 'legal_obligation' | 'deadline' | 'penalty' | 'definition' | 'authority' | 'general';
    requiresCitation: boolean;
    status: ClaimVerificationStatus;
    confidence: number;
    supportingChunk?: SearchResult;
    quoteStart?: number;
    quoteEnd?: number;
    supportExcerpt?: string;
};
export type AnswerVerificationResult = {
    verdict: ClaimVerificationVerdict;
    claims: AnswerClaimVerification[];
    unsupportedClaims: AnswerClaimVerification[];
    supportedClaims: AnswerClaimVerification[];
};
export declare function extractAnswerClaims(answer: string): AnswerClaimVerification[];
export declare function verifyAnswerClaims(answer: string, acceptedChunks: SearchResult[]): AnswerVerificationResult;
export declare function persistClaimVerification(prisma: unknown, complianceQueryId: string, result: AnswerVerificationResult): Promise<void>;
//# sourceMappingURL=claim-verification.d.ts.map