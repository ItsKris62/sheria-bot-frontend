/**
 * Enhanced Compliance RAG Pipeline
 *
 * Wraps the existing RAG search + AI compliance query into a single function
 * that grounds Claude's answers in actual retrieved regulatory documents.
 *
 * Key features added on top of the base compliance query:
 *   - Semantic search over the Pinecone regulatory corpus before calling Claude
 *   - Auto-detection of metadata filters (category, jurisdiction) from the query
 *   - Source-attributed context chunks so Claude can cite specific documents
 *   - A `sources` array in the result: { documentTitle, section, relevanceScore }
 *   - Instructions to Claude to flag when info falls outside the retrieved corpus
 *
 * Usage:
 *   import { enhancedComplianceQuery } from '@/lib/rag/compliance-rag';
 *
 *   const result = await enhancedComplianceQuery({
 *     question: 'What personal data obligations apply to mobile lenders in Kenya?',
 *   });
 *   // result.sources -> [{ documentTitle, section, relevanceScore }, ...]
 *
 * Integration note:
 *   The compliance module's existing `aiService.answerComplianceQuery()` is
 *   called unchanged  -  the RAG context is injected via the `context` parameter
 *   that is already part of `ComplianceQueryParams`. No existing files are
 *   modified by this module.
 */
import { type ComplianceQueryResult } from '@/lib/ai/ai.service';
export interface ComplianceSource {
    documentTitle: string;
    section?: string;
    relevanceScore: number;
    authorityStatus?: string;
    isBinding?: boolean;
    source?: string;
    version?: string;
    /** Whether this source was confirmed from the RAG regulatory corpus. */
    verified: boolean;
    /** Verification status: "verified" = confirmed in corpus, "unverified" = not found, "not_checked" = verification not attempted. */
    verificationStatus: 'verified' | 'unverified' | 'not_checked';
}
export interface EnhancedComplianceQueryOptions {
    /** Maximum number of RAG chunks to retrieve (default: 8) */
    topK?: number;
    /** Minimum relevance score (0-1) to include a chunk (default: 0.65) */
    minScore?: number;
    /**
     * Override category filter (e.g. 'DATA_PROTECTION').
     * If omitted and autoDetectFilters is true, inferred from query keywords.
     */
    filterCategory?: string;
    /**
     * Override jurisdiction filter (e.g. 'Kenya', 'EU', 'International').
     * If omitted and autoDetectFilters is true, inferred from query keywords.
     */
    filterJurisdiction?: string;
    /** Automatically infer Pinecone metadata filters from query (default: true) */
    autoDetectFilters?: boolean;
    /** Organisation type forwarded to the AI compliance prompt */
    organizationType?: string;
    /** Industry/sector forwarded to the AI compliance prompt */
    industry?: string;
    /** Urgency level forwarded to the AI compliance prompt */
    urgency?: 'LOW' | 'MEDIUM' | 'HIGH';
}
export interface EnhancedComplianceQueryResult extends ComplianceQueryResult {
    /** Document sources that were retrieved and used as context */
    sources: ComplianceSource[];
    /** Summary of the RAG search that produced the context */
    ragContext: {
        documentsFound: string[];
        chunksRetrieved: number;
        avgRelevanceScore: number;
        filtersApplied: Record<string, string>;
    };
}
/**
 * Run a compliance query grounded in the regulatory document corpus.
 *
 * @param question   The compliance question to answer
 * @param options    Optional search and prompt configuration
 */
export declare function enhancedComplianceQuery(question: string, options?: EnhancedComplianceQueryOptions): Promise<EnhancedComplianceQueryResult>;
/**
 * Run a quick compliance check grounded in the regulatory corpus.
 * Uses a smaller topK and higher minScore for speed.
 */
export declare function enhancedQuickComplianceCheck(scenario: string, options?: Pick<EnhancedComplianceQueryOptions, 'filterCategory' | 'filterJurisdiction'>): Promise<{
    answer: string;
    sources: ComplianceSource[];
}>;
//# sourceMappingURL=compliance-rag.d.ts.map