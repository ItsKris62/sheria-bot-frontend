/**
 * Document Module Utilities
 * Validation schemas, transformation helpers, text extraction utilities
 */
import { z } from 'zod';
import type { DocumentSummary, BlogPost, KBArticle, ShareLink } from './document.types';
export declare const uploadDocumentSchema: z.ZodObject<{
    filename: z.ZodString;
    mimeType: z.ZodString;
    metadata: z.ZodOptional<z.ZodObject<{
        actName: z.ZodOptional<z.ZodString>;
        documentType: z.ZodOptional<z.ZodString>;
        regulatoryBody: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        category: z.ZodOptional<z.ZodString>;
        subcategory: z.ZodOptional<z.ZodString>;
        keywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
        title: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    autoProcess: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const documentFiltersSchema: z.ZodObject<{
    contentType: z.ZodOptional<z.ZodString>;
    contentStatus: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    searchQuery: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodString>;
    dateTo: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        updatedAt: "updatedAt";
        actName: "actName";
        viewCount: "viewCount";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export declare const searchFiltersSchema: z.ZodObject<{
    contentType: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    topK: z.ZodDefault<z.ZodNumber>;
    minScore: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const shareParamsSchema: z.ZodObject<{
    expiresAt: z.ZodOptional<z.ZodString>;
    maxDownloads: z.ZodOptional<z.ZodNumber>;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const blogPostSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    htmlContent: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodOptional<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    category: z.ZodOptional<z.ZodString>;
    seoTitle: z.ZodOptional<z.ZodString>;
    seoDescription: z.ZodOptional<z.ZodString>;
    seoKeywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
    slug: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const kbArticleSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    htmlContent: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodOptional<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    category: z.ZodOptional<z.ZodString>;
    subcategory: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const metadataUpdateSchema: z.ZodObject<{
    actName: z.ZodOptional<z.ZodString>;
    documentType: z.ZodOptional<z.ZodString>;
    regulatoryBody: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    category: z.ZodOptional<z.ZodString>;
    subcategory: z.ZodOptional<z.ZodString>;
    keywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
    title: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Generate a URL-safe slug from a title
 */
export declare function generateSlug(title: string): string;
/**
 * Generate a unique share token
 */
export declare function generateShareToken(): string;
/**
 * Generate a unique document key for storage
 */
export declare function generateStorageKey(userId: string, filename: string): string;
/**
 * Extract plain text from a TXT file buffer
 */
export declare function extractTextFromTxt(buffer: Buffer): string;
/**
 * Extract plain text from a Markdown file buffer
 */
export declare function extractTextFromMarkdown(buffer: Buffer): string;
/**
 * Attempt to extract text from a buffer based on MIME type.
 * For PDF/DOCX, returns null  -  those need the pdf-parse/mammoth packages
 * which are optional additions. The module gracefully handles the absence.
 */
export declare function extractText(buffer: Buffer, mimeType: string, filename: string): Promise<string | null>;
export declare function toDocumentSummary(doc: Record<string, unknown>): DocumentSummary;
export declare function toBlogPost(doc: Record<string, unknown>): BlogPost;
export declare function toKBArticle(doc: Record<string, unknown>): KBArticle;
export declare function toShareLink(share: Record<string, unknown>, appUrl: string): ShareLink;
export declare function docCacheKey(documentId: string): string;
export declare function orgDocsCacheKey(orgId: string, page: number, limit: number): string;
export declare function searchCacheKey(query: string, orgId: string): string;
//# sourceMappingURL=document.utils.d.ts.map