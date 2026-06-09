/**
 * Document Module
 * Manages the full lifecycle of documents: upload, processing, versioning,
 * sharing, and knowledge base content (blog posts / KB articles).
 *
 * Integrations:
 * - Cloudflare R2 (storageService)  -  file storage
 * - Pinecone (ragService)           -  vector embeddings & semantic search
 * - Prisma                          -  metadata persistence
 * - Redis                           -  caching & processing status
 */
import { type UploadDocumentParams, type DocumentMetadata, type DocumentFilters, type SearchFilters, type PaginatedDocuments, type DocumentSearchResult, type ProcessingResult, type DocumentVersion, type ShareParams, type ShareLink, type BulkUploadParams, type BulkUploadResult, type BulkDeleteResult, type DocumentExportFormat, type ExportResult, type BlogPostParams, type BlogPost, type BlogFilters, type PaginatedBlogPosts, type KBArticleParams, type KBArticle, type KBFilters, type PaginatedKBArticles, type KBSearchResult, type DocumentSummary } from './document.types';
declare class DocumentModule {
    private readonly appUrl;
    constructor();
    /**
     * Upload a document to R2 and create metadata record in DB.
     * Optionally triggers async processing (text extraction + Pinecone indexing).
     */
    uploadDocument(params: UploadDocumentParams): Promise<DocumentSummary>;
    /**
     * Process a document: extract text, chunk it, embed in Pinecone.
     */
    processDocument(documentId: string): Promise<ProcessingResult>;
    /**
     * Re-process an already-indexed document (e.g., after metadata updates).
     */
    reprocessDocument(documentId: string): Promise<ProcessingResult>;
    getDocument(documentId: string, userId: string): Promise<DocumentSummary>;
    getDocumentsByOrganization(orgId: string, filters: DocumentFilters): Promise<PaginatedDocuments>;
    getDocumentsByUser(userId: string, filters: DocumentFilters): Promise<PaginatedDocuments>;
    /**
     * Semantic search across documents via Pinecone.
     */
    searchDocuments(query: string, orgId: string, filters?: SearchFilters): Promise<DocumentSearchResult[]>;
    updateDocumentMetadata(documentId: string, metadata: DocumentMetadata): Promise<DocumentSummary>;
    deleteDocument(documentId: string, userId: string): Promise<void>;
    archiveDocument(documentId: string): Promise<DocumentSummary>;
    restoreDocument(documentId: string): Promise<DocumentSummary>;
    createDocumentVersion(documentId: string, file: Buffer): Promise<DocumentVersion>;
    getDocumentVersions(documentId: string): Promise<DocumentVersion[]>;
    restoreDocumentVersion(documentId: string, versionId: string): Promise<DocumentSummary>;
    shareDocument(documentId: string, shareParams: ShareParams): Promise<ShareLink>;
    revokeDocumentShare(_documentId: string, shareId: string): Promise<void>;
    getSharedDocument(shareToken: string): Promise<DocumentSummary>;
    bulkUpload(files: BulkUploadParams[], userId: string, organizationId?: string): Promise<BulkUploadResult>;
    bulkDelete(documentIds: string[], userId: string): Promise<BulkDeleteResult>;
    exportDocuments(documentIds: string[], format: DocumentExportFormat): Promise<ExportResult>;
    createBlogPost(params: BlogPostParams): Promise<BlogPost>;
    updateBlogPost(postId: string, params: Partial<BlogPostParams>): Promise<BlogPost>;
    publishBlogPost(postId: string): Promise<BlogPost>;
    getBlogPosts(filters: BlogFilters): Promise<PaginatedBlogPosts>;
    createKnowledgeBaseArticle(params: KBArticleParams): Promise<KBArticle>;
    updateKnowledgeBaseArticle(articleId: string, params: Partial<KBArticleParams>): Promise<KBArticle>;
    getKnowledgeBaseArticles(filters: KBFilters): Promise<PaginatedKBArticles>;
    searchKnowledgeBase(query: string): Promise<KBSearchResult[]>;
    private extractStorageKey;
    private generateUniqueSlug;
    private incrementViewCount;
    private invalidateOrgCache;
}
export declare const documentModule: DocumentModule;
export { DocumentModule };
//# sourceMappingURL=document.module.d.ts.map