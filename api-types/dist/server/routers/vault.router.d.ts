/**
 * Vault Router
 *
 * Thin tRPC layer for the organisation-scoped Document Vault.
 * All business logic lives in VaultModule.
 */
export declare const vaultRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Returns the caller's per-tier upload limits and current storage usage.
     * Used by the frontend to set accept/size constraints before the upload form opens.
     */
    getUploadLimits: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            maxFileSizeMB: number;
            maxTotalStorageMB: number;
            allowedMimeTypes: readonly string[];
            storageUsedMB: number;
        };
        meta: object;
    }>;
    /**
     * Step 1: Get presigned PUT URL for direct client-to-R2 upload.
     * Returns uploadUrl, documentId, and requiredHeaders for the direct R2 PUT.
     */
    getUploadUrl: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            declaredFilename: string;
            declaredMimeType: "application/pdf" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "application/vnd.openxmlformats-officedocument.presentationml.presentation" | "application/msword" | "application/vnd.ms-excel" | "application/vnd.ms-powerpoint" | "text/plain" | "text/csv" | "image/png" | "image/jpeg" | "image/webp";
            declaredSize: number;
            category: "COMPLIANCE" | "OTHER" | "CORPORATE" | "FINANCIAL" | "LICENSE" | "OPERATIONS" | "TAX";
            description?: string | undefined;
            expiryDate?: string | undefined;
            tags?: string[] | undefined;
        };
        output: import("../../modules/vault/vault.types").GenerateUploadUrlResult;
        meta: object;
    }>;
    /**
     * Step 2: Create DB record after the client successfully PUT the file to R2.
     */
    confirmUpload: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            documentId: string;
        };
        output: import("@/modules/vault").VaultDocumentListItem;
        meta: object;
    }>;
    /**
     * Paginated, filtered, searchable document list scoped to the caller's org.
     */
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
            category?: "COMPLIANCE" | "OTHER" | "CORPORATE" | "FINANCIAL" | "LICENSE" | "OPERATIONS" | "TAX" | undefined;
            status?: "EXPIRED" | "PENDING" | "VERIFIED" | undefined;
            search?: string | undefined;
            sortBy?: "createdAt" | "name" | "fileSize" | "expiryDate" | undefined;
            sortOrder?: "asc" | "desc" | undefined;
        };
        output: import("@/modules/vault").VaultDocumentListResult;
        meta: object;
    }>;
    /**
     * Single document detail with org-scoped access check.
     */
    getById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: import("@/modules/vault").VaultDocumentListItem;
        meta: object;
    }>;
    /**
     * Generate a presigned GET URL for downloading or viewing a document.
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
     * Update document metadata (name, description, category, expiry, tags, notes).
     * Owner or Admin only.
     */
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            name?: string | undefined;
            description?: string | null | undefined;
            category?: "COMPLIANCE" | "OTHER" | "CORPORATE" | "FINANCIAL" | "LICENSE" | "OPERATIONS" | "TAX" | undefined;
            expiryDate?: string | null | undefined;
            tags?: string[] | undefined;
            notes?: string | null | undefined;
        };
        output: import("@/modules/vault").VaultDocumentListItem;
        meta: object;
    }>;
    /**
     * Change verification status (PENDING -> VERIFIED / EXPIRED).
     * Admin and Regulator roles only.
     */
    updateStatus: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            status: "EXPIRED" | "PENDING" | "VERIFIED";
        };
        output: import("@/modules/vault").VaultDocumentListItem;
        meta: object;
    }>;
    /**
     * Soft-delete a document (sets isArchived = true). Owner or Admin only.
     */
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    /**
     * Category + status counts for the summary cards.
     */
    getStats: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@/modules/vault").VaultDocumentStats;
        meta: object;
    }>;
    /**
     * Step 1 of file replacement: get new presigned PUT URL for the existing doc.
     */
    getReplaceUrl: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            filename: string;
            fileType: "application/pdf" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "application/vnd.openxmlformats-officedocument.presentationml.presentation" | "application/msword" | "application/vnd.ms-excel" | "application/vnd.ms-powerpoint" | "text/plain" | "text/csv" | "image/png" | "image/jpeg" | "image/webp";
            fileSize: number;
        };
        output: import("../../modules/vault/vault.types").GenerateUploadUrlResult & {
            currentVersion: number;
            storageKey: string;
        };
        meta: object;
    }>;
    /**
     * Step 2 of file replacement: finalise the new file after R2 upload.
     */
    confirmReplace: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            documentId: string;
            storageKey: string;
            fileName: string;
            fileType: string;
            fileExtension: string;
            fileSize: number;
        };
        output: import("@/modules/vault").VaultDocumentListItem;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=vault.router.d.ts.map