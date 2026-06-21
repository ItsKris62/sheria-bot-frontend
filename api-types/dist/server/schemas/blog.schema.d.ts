import { z } from 'zod';
export declare const blogPostStatusSchema: z.ZodEnum<{
    DRAFT: "DRAFT";
    IN_REVIEW: "IN_REVIEW";
    PUBLISHED: "PUBLISHED";
    ARCHIVED: "ARCHIVED";
}>;
export declare const blogSourceTypeSchema: z.ZodEnum<{
    OFFICIAL: "OFFICIAL";
    THIRD_PARTY: "THIRD_PARTY";
    INTERNAL: "INTERNAL";
    MEDIA: "MEDIA";
    INTERNATIONAL_STANDARD: "INTERNATIONAL_STANDARD";
}>;
export declare const blogSourceSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    sourceType: z.ZodEnum<{
        OFFICIAL: "OFFICIAL";
        THIRD_PARTY: "THIRD_PARTY";
        INTERNAL: "INTERNAL";
        MEDIA: "MEDIA";
        INTERNATIONAL_STANDARD: "INTERNATIONAL_STANDARD";
    }>;
    title: z.ZodString;
    publisher: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    url: z.ZodUnion<[z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodLiteral<"">]>;
    publishedAt: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const publicListBlogPostsSchema: z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    tag: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    featured: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const publicGetBlogPostBySlugSchema: z.ZodObject<{
    slug: z.ZodString;
}, z.core.$strip>;
export declare const adminListBlogPostsSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        IN_REVIEW: "IN_REVIEW";
        PUBLISHED: "PUBLISHED";
        ARCHIVED: "ARCHIVED";
    }>>;
    category: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const adminGetBlogPostByIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const adminCreateBlogPostSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const adminUpdateBlogPostSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    content: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    coverImageUrl: z.ZodUnion<[z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodLiteral<"">]>;
    category: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    jurisdiction: z.ZodOptional<z.ZodString>;
    relatedRegulations: z.ZodOptional<z.ZodArray<z.ZodString>>;
    featured: z.ZodOptional<z.ZodBoolean>;
    seoTitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    seoDescription: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    canonicalUrl: z.ZodUnion<[z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodLiteral<"">]>;
    ogImageUrl: z.ZodUnion<[z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodLiteral<"">]>;
    reviewerId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        sourceType: z.ZodEnum<{
            OFFICIAL: "OFFICIAL";
            THIRD_PARTY: "THIRD_PARTY";
            INTERNAL: "INTERNAL";
            MEDIA: "MEDIA";
            INTERNATIONAL_STANDARD: "INTERNATIONAL_STANDARD";
        }>;
        title: z.ZodString;
        publisher: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        url: z.ZodUnion<[z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodLiteral<"">]>;
        publishedAt: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
        notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const adminSetBlogPostStatusSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<{
        DRAFT: "DRAFT";
        IN_REVIEW: "IN_REVIEW";
        PUBLISHED: "PUBLISHED";
        ARCHIVED: "ARCHIVED";
    }>;
}, z.core.$strip>;
export declare const adminDeleteBlogPostSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=blog.schema.d.ts.map