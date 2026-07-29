import type { BlogDraftGenerationRun, BlogPost, BlogPostSource, BlogVerificationRun } from '@prisma/client';
export declare const BLOG_PUBLICATION_SNAPSHOT_VERSION = "blog-publication-snapshot-v1";
export interface BlogPublicationSnapshot {
    version: typeof BLOG_PUBLICATION_SNAPSHOT_VERSION;
    blogPostId: string;
    contentHash: string;
    sourceSetHash: string;
    publicationPayloadHash: string;
    draftGenerationRunId: string | null;
    verificationRunId: string | null;
    postUpdatedAt: string;
    computedAt: string;
}
type SnapshotPost = Pick<BlogPost, 'id' | 'title' | 'slug' | 'excerpt' | 'content' | 'category' | 'jurisdiction' | 'tags' | 'relatedRegulations' | 'updatedAt'> & {
    sources: Pick<BlogPostSource, 'url' | 'updatedAt'>[];
    draftGenerationRuns: Pick<BlogDraftGenerationRun, 'id'>[];
    verificationRuns: Pick<BlogVerificationRun, 'id'>[];
};
export declare function computeBlogPublicationSnapshot(post: SnapshotPost, computedAt?: Date): BlogPublicationSnapshot;
export declare function parseBlogPublicationSnapshot(value: unknown): BlogPublicationSnapshot | null;
export {};
//# sourceMappingURL=publication-snapshot.d.ts.map