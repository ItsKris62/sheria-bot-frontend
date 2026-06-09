/**
 * Document Module Types
 * Type definitions for document management, versioning, sharing, and knowledge base
 */
export type DocumentExportFormat = 'pdf' | 'docx' | 'json' | 'markdown' | 'html';
export type DocumentAction = 'view' | 'download' | 'share' | 'edit' | 'delete';
export type ProcessingStatus = 'queued' | 'processing' | 'completed' | 'failed';
export declare const DOCUMENT_CONSTANTS: {
    readonly REDIS_KEYS: {
        readonly DOCUMENT: "doc:";
        readonly ORG_DOCS: "doc:org:";
        readonly USER_DOCS: "doc:user:";
        readonly SHARE: "doc:share:";
        readonly PROCESSING: "doc:processing:";
        readonly SEARCH_CACHE: "doc:search:";
    };
    readonly CACHE_TTL: {
        readonly DOCUMENT: 3600;
        readonly ORG_LIST: 900;
        readonly SEARCH: 300;
        readonly SHARE_LINK: 86400;
    };
    readonly LIMITS: {
        readonly MAX_FILE_SIZE_MB: 50;
        readonly MAX_BULK_UPLOAD: 20;
        readonly SHARE_TOKEN_TTL_DAYS: 30;
        readonly CHUNK_SIZE: 1000;
        readonly CHUNK_OVERLAP: 200;
        readonly MAX_SEARCH_RESULTS: 20;
    };
    readonly ALLOWED_MIME_TYPES: readonly ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "text/markdown", "text/html"];
};
export interface UploadDocumentParams {
    file: Buffer;
    filename: string;
    mimeType: string;
    userId: string;
    organizationId?: string;
    metadata?: DocumentMetadata;
    autoProcess?: boolean;
}
export interface DocumentMetadata {
    actName?: string;
    documentType?: string;
    enactmentDate?: Date;
    effectiveDate?: Date;
    regulatoryBody?: string;
    tags?: string[];
    category?: string;
    subcategory?: string;
    keywords?: string[];
    title?: string;
    summary?: string;
}
export interface DocumentFilters {
    contentType?: string;
    contentStatus?: string;
    category?: string;
    tags?: string[];
    searchQuery?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'viewCount' | 'actName';
    sortOrder?: 'asc' | 'desc';
}
export interface SearchFilters {
    contentType?: string;
    category?: string;
    organizationId?: string;
    tags?: string[];
    topK?: number;
    minScore?: number;
}
export interface DocumentSummary {
    id: string;
    actName: string;
    title: string | null;
    documentType: string;
    contentType: string;
    contentStatus: string;
    status: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    category: string | null;
    tags: string[];
    viewCount: number;
    version: number;
    isLatestVersion: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface PaginatedDocuments {
    items: DocumentSummary[];
    nextCursor: string | null;
    total: number;
    page: number;
    limit: number;
}
export interface DocumentSearchResult {
    documentId: string;
    documentTitle: string;
    chunkText: string;
    section?: string;
    citation?: string;
    score: number;
    rank: number;
    metadata?: {
        category?: string;
        contentType?: string;
        tags?: string[];
    };
}
export interface ProcessingResult {
    documentId: string;
    status: ProcessingStatus;
    chunksIndexed: number;
    processingTimeMs: number;
    error?: string;
}
export interface DocumentVersion {
    id: string;
    parentId: string;
    version: number;
    fileUrl: string;
    fileSize: number;
    createdAt: Date;
    isLatestVersion: boolean;
}
export interface ShareParams {
    documentId: string;
    sharedBy: string;
    expiresAt?: Date;
    maxDownloads?: number;
    message?: string;
}
export interface ShareLink {
    id: string;
    documentId: string;
    token: string;
    shareUrl: string;
    expiresAt: Date | null;
    maxDownloads: number | null;
    downloads: number;
    createdAt: Date;
}
export interface BulkUploadParams {
    file: Buffer;
    filename: string;
    mimeType: string;
    metadata?: DocumentMetadata;
}
export interface BulkUploadResult {
    succeeded: Array<{
        filename: string;
        documentId: string;
    }>;
    failed: Array<{
        filename: string;
        error: string;
    }>;
    total: number;
    successCount: number;
    failureCount: number;
}
export interface BulkDeleteResult {
    deleted: string[];
    failed: Array<{
        id: string;
        error: string;
    }>;
    total: number;
    successCount: number;
    failureCount: number;
}
export interface ExportResult {
    exportId: string;
    downloadUrl: string;
    format: DocumentExportFormat;
    fileSize: number;
    expiresAt: Date;
}
export interface BlogPostParams {
    title: string;
    content: string;
    htmlContent?: string;
    excerpt?: string;
    tags?: string[];
    category?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    authorId: string;
    slug?: string;
}
export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    htmlContent: string | null;
    excerpt: string | null;
    tags: string[];
    category: string | null;
    contentStatus: string;
    viewCount: number;
    authorId: string | null;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface BlogFilters {
    status?: string;
    category?: string;
    tags?: string[];
    authorId?: string;
    page?: number;
    limit?: number;
}
export interface PaginatedBlogPosts {
    items: BlogPost[];
    nextCursor: string | null;
    total: number;
    page: number;
    limit: number;
}
export interface KBArticleParams {
    title: string;
    content: string;
    htmlContent?: string;
    excerpt?: string;
    tags?: string[];
    category?: string;
    subcategory?: string;
    authorId: string;
    slug?: string;
}
export interface KBArticle {
    id: string;
    title: string;
    slug: string;
    content: string;
    htmlContent: string | null;
    excerpt: string | null;
    tags: string[];
    category: string | null;
    subcategory: string | null;
    contentStatus: string;
    viewCount: number;
    helpfulCount: number;
    notHelpfulCount: number;
    authorId: string | null;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface KBFilters {
    status?: string;
    category?: string;
    subcategory?: string;
    tags?: string[];
    page?: number;
    limit?: number;
}
export interface PaginatedKBArticles {
    items: KBArticle[];
    nextCursor: string | null;
    total: number;
    page: number;
    limit: number;
}
export interface KBSearchResult {
    articleId: string;
    title: string;
    slug: string;
    excerpt: string | null;
    score: number;
    rank: number;
    chunkText: string;
}
export type DocumentErrorCode = 'DOCUMENT_NOT_FOUND' | 'DOCUMENT_PROCESSING_FAILED' | 'DOCUMENT_UPLOAD_FAILED' | 'DOCUMENT_INDEXING_FAILED' | 'DOCUMENT_SHARE_EXPIRED' | 'DOCUMENT_SHARE_NOT_FOUND' | 'DOCUMENT_SHARE_LIMIT_REACHED' | 'INVALID_FILE_TYPE' | 'FILE_TOO_LARGE' | 'BULK_UPLOAD_FAILED' | 'EXPORT_FAILED';
export declare class DocumentError extends Error {
    code: DocumentErrorCode;
    metadata?: Record<string, unknown> | undefined;
    constructor(code: DocumentErrorCode, message: string, metadata?: Record<string, unknown> | undefined);
}
//# sourceMappingURL=document.types.d.ts.map