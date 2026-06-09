import { ChunkConfig } from './chunking';
/**
 * Document to index
 */
export interface DocumentToIndex {
    id: string;
    title: string;
    content: string;
    documentType: string;
    actName?: string;
    year?: number;
    regulatoryArea?: string;
    authorityStatus?: string;
    isBinding?: boolean;
    source?: string;
    version?: string;
    metadata?: Record<string, any>;
    framework?: string;
}
/**
 * Search result with context
 */
export interface SearchResult {
    documentId: string;
    documentTitle: string;
    chunkText: string;
    section?: string;
    citation?: string;
    score: number;
    rank: number;
    authorityStatus?: string;
    isBinding?: boolean;
    source?: string;
    version?: string;
    corpusStatus?: string;
    framework?: string;
    frameworkSlug?: string;
    legalDocumentId?: string;
}
/**
 * Search options
 */
export interface SearchOptions {
    topK?: number;
    minScore?: number;
    filter?: Record<string, any>;
    namespace?: string;
    includeMetadata?: boolean;
    fallbackIfTooFew?: {
        minResults: number;
        relaxedFilter?: Record<string, any>;
    };
}
/**
 * RAG Service
 * Handles document indexing and semantic search
 */
export declare class RAGService {
    /**
     * Index a document into the vector database
     * @param document Document to index
     * @param chunkConfig Optional chunk configuration
     */
    indexDocument(document: DocumentToIndex, chunkConfig?: Partial<ChunkConfig>): Promise<number>;
    /**
     * Index multiple documents in batch
     * @param documents Documents to index
     */
    indexDocuments(documents: DocumentToIndex[]): Promise<void>;
    /**
     * Search for relevant documents
     * @param query Search query
     * @param options Search options
     */
    search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
    /**
     * Search with reranking for better relevance
     * @param query Search query
     * @param options Search options
     */
    searchWithReranking(query: string, options?: SearchOptions): Promise<SearchResult[]>;
    /**
     * Find similar chunks to a given document chunk
     * @param documentId Document ID
     * @param chunkIndex Chunk index
     * @param topK Number of similar chunks to return
     */
    findSimilarChunks(documentId: string, chunkIndex: number, _topK?: number): Promise<SearchResult[]>;
    /**
     * Delete document from index
     * @param documentId Document ID
     */
    deleteDocument(documentId: string): Promise<void>;
    /**
     * Get context for AI prompt from search results
     * @param results Search results
     * @param maxChunks Maximum chunks to include
     * @param maxChars Maximum characters total
     */
    getContextForPrompt(results: SearchResult[], maxChunks?: number, maxChars?: number): string;
    /**
     * Extract relevant citations from search results
     * @param results Search results
     */
    extractCitations(results: SearchResult[]): string[];
    /**
     * Generate search summary
     * @param query Original query
     * @param results Search results
     */
    generateSearchSummary(query: string, results: SearchResult[]): {
        query: string;
        totalResults: number;
        documentsFound: string[];
        topSections: string[];
        citations: string[];
        avgScore: number;
    };
}
/**
 * Export singleton RAG service instance
 */
export declare const ragService: RAGService;
/**
 * Helper: Search and get context for AI
 *
 * Retrieval results are cached in Redis for RAG_CTX_CACHE_TTL seconds to
 * avoid hitting Pinecone on every grounded query for the same question.
 * Only the Pinecone result is cached — the AI answer is never cached when
 * ragContext is present, keeping answers fresh as the corpus evolves.
 */
export declare function searchAndGetContext(query: string, options?: SearchOptions): Promise<{
    context: string;
    results: SearchResult[];
    citations: string[];
}>;
/**
 * Helper: Index Kenyan legal act
 */
export declare function indexKenyanLegalAct(actName: string, year: number, content: string, regulatoryArea: string): Promise<number>;
//# sourceMappingURL=rag.service.d.ts.map