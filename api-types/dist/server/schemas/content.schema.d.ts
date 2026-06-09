import { z } from 'zod';
/**
 * Content Schemas
 *
 * Zod validation schemas for blog posts, knowledge base articles,
 * and other content management operations.
 */
export declare const contentTypeEnum: z.ZodEnum<{
    REGULATORY_DOCUMENT: "REGULATORY_DOCUMENT";
    BLOG_POST: "BLOG_POST";
    KNOWLEDGE_BASE_ARTICLE: "KNOWLEDGE_BASE_ARTICLE";
    POLICY_TEMPLATE: "POLICY_TEMPLATE";
}>;
export declare const contentStatusEnum: z.ZodEnum<{
    DRAFT: "DRAFT";
    ARCHIVED: "ARCHIVED";
    PUBLISHED: "PUBLISHED";
    UNDER_REVIEW: "UNDER_REVIEW";
}>;
/**
 * Create blog post or KB article
 */
export declare const createContentSchema: z.ZodObject<{
    contentType: z.ZodEnum<{
        BLOG_POST: "BLOG_POST";
        KNOWLEDGE_BASE_ARTICLE: "KNOWLEDGE_BASE_ARTICLE";
        POLICY_TEMPLATE: "POLICY_TEMPLATE";
    }>;
    title: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    subcategory: z.ZodOptional<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    seoTitle: z.ZodOptional<z.ZodString>;
    seoDescription: z.ZodOptional<z.ZodString>;
    seoKeywords: z.ZodDefault<z.ZodArray<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        DRAFT: "DRAFT";
        ARCHIVED: "ARCHIVED";
        PUBLISHED: "PUBLISHED";
        UNDER_REVIEW: "UNDER_REVIEW";
    }>>;
}, z.core.$strip>;
export type CreateContentInput = z.infer<typeof createContentSchema>;
/**
 * Update content
 */
export declare const updateContentSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    subcategory: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    seoTitle: z.ZodOptional<z.ZodString>;
    seoDescription: z.ZodOptional<z.ZodString>;
    seoKeywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        ARCHIVED: "ARCHIVED";
        PUBLISHED: "PUBLISHED";
        UNDER_REVIEW: "UNDER_REVIEW";
    }>>;
}, z.core.$strip>;
export type UpdateContentInput = z.infer<typeof updateContentSchema>;
/**
 * List content with filtering
 */
export declare const listContentSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    contentType: z.ZodOptional<z.ZodEnum<{
        REGULATORY_DOCUMENT: "REGULATORY_DOCUMENT";
        BLOG_POST: "BLOG_POST";
        KNOWLEDGE_BASE_ARTICLE: "KNOWLEDGE_BASE_ARTICLE";
        POLICY_TEMPLATE: "POLICY_TEMPLATE";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        ARCHIVED: "ARCHIVED";
        PUBLISHED: "PUBLISHED";
        UNDER_REVIEW: "UNDER_REVIEW";
    }>>;
    category: z.ZodOptional<z.ZodString>;
    tag: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    authorId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ListContentInput = z.infer<typeof listContentSchema>;
/**
 * Get content by ID
 */
export declare const getContentSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type GetContentInput = z.infer<typeof getContentSchema>;
/**
 * Get content by slug (public)
 */
export declare const getContentBySlugSchema: z.ZodObject<{
    slug: z.ZodString;
}, z.core.$strip>;
export type GetContentBySlugInput = z.infer<typeof getContentBySlugSchema>;
/**
 * Publish content
 */
export declare const publishContentSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type PublishContentInput = z.infer<typeof publishContentSchema>;
/**
 * Delete content
 */
export declare const deleteContentSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type DeleteContentInput = z.infer<typeof deleteContentSchema>;
/**
 * Rate content (helpful/not helpful)
 */
export declare const rateContentSchema: z.ZodObject<{
    id: z.ZodString;
    helpful: z.ZodBoolean;
}, z.core.$strip>;
export type RateContentInput = z.infer<typeof rateContentSchema>;
//# sourceMappingURL=content.schema.d.ts.map