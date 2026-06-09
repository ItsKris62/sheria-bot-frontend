import type { EffectivePlan } from '@/types/plan.types';
import type { VaultDocumentListItem, VaultDocumentListResult, VaultDocumentStats, GenerateUploadUrlParams, GenerateUploadUrlResult, CreateDocumentParams, ListDocumentsParams, GetDocumentByIdParams, GenerateDownloadUrlParams, UpdateDocumentParams, UpdateDocumentStatusParams, DeleteDocumentParams, GetDocumentStatsParams, ReplaceDocumentParams } from './vault.types';
declare class VaultModule {
    /**
     * Step 1 of the two-step upload flow.
     * Enforces tier-based file size, MIME type, and total storage quota checks
     * BEFORE generating the presigned PUT URL. If any check fails the client
     * never receives a URL and cannot upload.
     */
    generateUploadPresignedUrl(params: GenerateUploadUrlParams): Promise<GenerateUploadUrlResult>;
    /**
     * Step 2 of the two-step upload flow.
     * Creates the VaultDocument DB record after the client confirms R2 upload.
     */
    createDocument(params: CreateDocumentParams): Promise<VaultDocumentListItem>;
    /**
     * Paginated, filtered document list scoped to the caller's organization.
     * Also triggers an async expiry check (fire-and-forget).
     */
    listDocuments(params: ListDocumentsParams): Promise<VaultDocumentListResult>;
    /**
     * Fetch a single vault document, enforcing org-scoped access.
     */
    getDocumentById(params: GetDocumentByIdParams): Promise<VaultDocumentListItem>;
    /**
     * Generate a presigned GET URL for downloading or viewing a document.
     */
    generateDownloadPresignedUrl(params: GenerateDownloadUrlParams): Promise<{
        downloadUrl: string;
        filename: string;
        expiresAt: string;
    }>;
    /**
     * Update document metadata. Restricted to the uploader or an admin.
     */
    updateDocument(params: UpdateDocumentParams): Promise<VaultDocumentListItem>;
    /**
     * Update verification status. Restricted to Admin and Regulator roles.
     */
    updateDocumentStatus(params: UpdateDocumentStatusParams): Promise<VaultDocumentListItem>;
    /**
     * Soft-delete a document (sets isArchived = true). Owner or Admin only.
     */
    deleteDocument(params: DeleteDocumentParams): Promise<{
        success: boolean;
    }>;
    /**
     * Category + status counts for the summary cards, scoped to the org.
     */
    getDocumentStats(params: GetDocumentStatsParams): Promise<VaultDocumentStats>;
    /**
     * Scan for documents whose expiryDate has passed and flip their status to
     * EXPIRED. Designed to be called fire-and-forget; never throws to callers.
     */
    checkExpiredDocuments(organizationId?: string): Promise<void>;
    /**
     * Returns the total active (non-archived) storage used by an org in megabytes.
     * Used by the getUploadLimits tRPC query to show the storage usage indicator.
     */
    getStorageUsedMB(organizationId: string): Promise<number>;
    getUploadLimits(organizationId: string, plan: EffectivePlan): Promise<{
        maxFileSizeMB: number;
        maxTotalStorageMB: number;
        allowedMimeTypes: readonly string[];
        storageUsedMB: number;
    }>;
    /**
     * Generate a new presigned upload URL for replacing an existing document.
     * Increments the version counter once confirmUpload is called.
     * Returns the new storageKey and documentId (same as existing docId so the
     * caller passes it back to a dedicated confirmReplace flow).
     */
    replaceDocument(params: ReplaceDocumentParams): Promise<GenerateUploadUrlResult & {
        currentVersion: number;
        storageKey: string;
    }>;
    /**
     * Finalize a file replacement: update storageKey, fileName, fileType,
     * fileSize, fileExtension, version, and reset status to PENDING.
     */
    confirmReplacement(params: {
        documentId: string;
        storageKey: string;
        fileName: string;
        fileType: string;
        fileExtension: string;
        fileSize: number;
        userId: string;
        organizationId: string;
        userRole: string;
    }): Promise<VaultDocumentListItem>;
}
export declare const vaultModule: VaultModule;
export { VaultModule };
//# sourceMappingURL=vault.module.d.ts.map