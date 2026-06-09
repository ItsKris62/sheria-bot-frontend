/**
 * Document Router
 *
 * Handles document upload, download, and management using R2 storage.
 */
export declare const documentRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc/context").Context;
    meta: object;
    errorShape: {
        message: string;
        data: {
            stack: string | undefined;
            fieldErrors: Record<string, string> | null;
            code: import("@trpc/server").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
        };
        code: import("@trpc/server").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    /**
     * Get presigned upload URL
     *
     * @protected
     */
    getUploadUrl: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            filename: string;
            fileType: string;
            fileSize: number;
            documentType?: string | undefined;
        };
        output: {
            uploadUrl: string;
            key: string;
            documentId: `${string}-${string}-${string}-${string}-${string}`;
            expiresAt: string;
        };
        meta: object;
    }>;
    /**
     * Confirm upload and create document record
     *
     * @protected
     */
    confirmUpload: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            key: string;
            filename: string;
            fileType: string;
            fileSize: number;
            documentType?: string | undefined;
            documentId?: string | undefined;
            description?: string | undefined;
            metadata?: Record<string, unknown> | undefined;
        };
        output: {
            documentId: string;
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * List documents with pagination
     *
     * @protected
     */
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
            documentType?: string | undefined;
            search?: string | undefined;
        };
        output: {
            documents: {
                id: string;
                title: string | null;
                createdAt: Date;
                actName: string;
                documentType: string;
                regulatoryBody: string | null;
                fileSize: number;
                author: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
        meta: object;
    }>;
    /**
     * List benchmark documents the current organization may use for Gap Analysis.
     *
     * Returns metadata only. Contents and download URLs are intentionally excluded.
     */
    listBenchmarkDocuments: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            search?: string | undefined;
        } | undefined;
        output: {
            documents: import("../services/benchmark-document.service").AuthorizedBenchmarkDocument[];
        };
        meta: object;
    }>;
    /**
     * Get document metadata by ID
     *
     * @protected
     */
    get: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            author: {
                id: string;
                email: string;
                fullName: string;
            } | null;
        } & {
            id: string;
            title: string | null;
            userId: string | null;
            status: import("@prisma/client").$Enums.DocumentStatus;
            organizationId: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            content: string | null;
            isLatestVersion: boolean;
            parentId: string | null;
            version: number;
            actName: string;
            documentType: string;
            enactmentDate: Date | null;
            effectiveDate: Date | null;
            amendedBy: string[];
            regulatoryBody: string | null;
            originalFilename: string;
            fileUrl: string;
            fileSize: number;
            mimeType: string;
            totalChunks: number | null;
            processedAt: Date | null;
            fullText: string | null;
            summary: string | null;
            keywords: string[];
            authorId: string | null;
            category: string | null;
            contentStatus: import("@prisma/client").$Enums.ContentStatus;
            contentType: import("@prisma/client").$Enums.ContentType;
            excerpt: string | null;
            helpfulCount: number;
            htmlContent: string | null;
            notHelpfulCount: number;
            publishedAt: Date | null;
            publishedBy: string | null;
            seoDescription: string | null;
            seoKeywords: string[];
            seoTitle: string | null;
            slug: string | null;
            subcategory: string | null;
            tags: string[];
            viewCount: number;
        };
        meta: object;
    }>;
    /**
     * Get presigned download URL
     *
     * @protected
     */
    getDownloadUrl: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            downloadUrl: string;
            filename: string;
            expiresAt: string;
        };
        meta: object;
    }>;
    /**
     * Delete document
     *
     * @protected
     */
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Restore a soft-deleted document
     *
     * Sets deletedAt back to null. Only the document owner or an admin can restore.
     * Note: Pinecone vectors are not restored automatically  -  if the document needs
     * to be searchable again, trigger a re-ingest via the `reingest` procedure.
     *
     * @protected
     */
    restore: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Get document processing status
     *
     * Returns the indexing status and chunk count for a document.
     * Useful for polling after upload to know when RAG indexing is complete.
     *
     * @protected
     */
    getProcessingStatus: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            documentId: string;
        };
        output: {
            documentId: string;
            status: import("@prisma/client").$Enums.DocumentStatus;
            totalChunks: number;
            processedChunks: number;
            processedAt: Date | null;
            isComplete: boolean;
            isFailed: boolean;
        };
        meta: object;
    }>;
    /**
     * Re-ingest a document into the RAG pipeline (admin only)
     *
     * Clears existing Pinecone vectors and DB chunks, then re-runs the full
     * ingestion pipeline. Useful after pipeline changes or failed indexing.
     *
     * @admin
     */
    reingest: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            documentId: string;
        };
        output: {
            success: boolean;
            message: string;
            documentId: string;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=document.router.d.ts.map