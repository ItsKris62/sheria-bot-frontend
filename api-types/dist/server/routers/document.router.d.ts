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
            documentId: any;
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
            documents: any;
            pagination: {
                page: number;
                limit: number;
                total: any;
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
        output: any;
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
            filename: any;
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
            documentId: any;
            status: any;
            totalChunks: any;
            processedChunks: number;
            processedAt: any;
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