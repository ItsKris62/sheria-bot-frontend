import type { PrismaClient } from '@prisma/client';
/**
 * Content Service
 *
 * Handles content-specific operations like slug generation,
 * HTML sanitization, and markdown rendering for blogs and KB articles.
 */
export declare class ContentService {
    private prisma;
    constructor(prisma: PrismaClient);
    /**
     * Generate a URL-safe slug from a title.
     * Appends a numeric suffix if the slug already exists.
     */
    generateSlug(title: string): Promise<string>;
    /**
     * Check if a slug already exists in the database.
     */
    slugExists(slug: string, excludeId?: string): Promise<boolean>;
    /**
     * Sanitize HTML content to prevent XSS.
     * Strips dangerous tags/attributes while preserving safe formatting.
     */
    sanitizeHtml(html: string): string;
    /**
     * Convert basic markdown to HTML.
     * For full markdown support, consider adding a library like marked.
     */
    renderMarkdown(markdown: string): string;
    /**
     * Generate an excerpt from content if not provided.
     */
    generateExcerpt(content: string, maxLength?: number): string;
    /**
     * Increment the view count for a content item.
     */
    incrementViewCount(id: string): Promise<void>;
    /**
     * Record a helpful/not helpful rating.
     */
    rateContent(id: string, helpful: boolean): Promise<void>;
    /**
     * Create a new version of existing content.
     * Marks the old version as non-latest and creates a new record.
     */
    createVersion(parentId: string, updates: {
        title?: string;
        content?: string;
        excerpt?: string;
        htmlContent?: string;
    }, authorId: string): Promise<string>;
}
//# sourceMappingURL=content.service.d.ts.map