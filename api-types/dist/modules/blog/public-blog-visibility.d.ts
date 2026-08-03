import { Prisma } from '@prisma/client';
/**
 * Canonical public visibility rule for SheriaBot BlogPost records.
 *
 * Archived posts are not public in the current product policy: archiving sets
 * status=ARCHIVED and archivedAt, while public blog surfaces require
 * status=PUBLISHED and archivedAt=null.
 */
export declare function publicBlogWhere(now?: Date): Prisma.BlogPostWhereInput;
export declare function publicBlogOrderBy(): Prisma.BlogPostOrderByWithRelationInput[];
//# sourceMappingURL=public-blog-visibility.d.ts.map