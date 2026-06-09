import { FileMetadata } from './client';
/**
 * File upload result
 */
export interface FileUploadResult {
    key: string;
    url: string;
    size: number;
    contentType: string;
    metadata?: Record<string, string>;
}
/**
 * Storage Service
 * High-level file storage operations with validation
 */
export declare class StorageService {
    /**
     * Validate file before upload
     * @param fileBuffer File buffer
     * @param filename Original filename
     * @param category File category
     */
    private validateFile;
    /**
     * Scan file for malware (placeholder - implement with actual scanner)
     * @param _fileBuffer File buffer
     * @param filename Filename
     */
    private scanForMalware;
    /**
     * Upload document (PDF, DOCX)
     * @param fileBuffer File buffer
     * @param filename Original filename
     * @param userId User ID
     * @param metadata Additional metadata
     */
    uploadDocument(fileBuffer: Buffer, filename: string, userId: string, metadata?: Record<string, string>): Promise<FileUploadResult>;
    /**
     * Upload image (JPEG, PNG, WebP)
     * @param fileBuffer File buffer
     * @param filename Original filename
     * @param userId User ID
     */
    uploadImage(fileBuffer: Buffer, filename: string, userId: string): Promise<FileUploadResult>;
    /**
     * Upload policy export (PDF, DOCX)
     * @param fileBuffer File buffer
     * @param filename Filename
     * @param policyId Policy ID
     * @param userId User ID
     */
    uploadPolicyExport(fileBuffer: Buffer, filename: string, policyId: string, userId: string): Promise<FileUploadResult>;
    /**
     * Upload temporary file
     * @param fileBuffer File buffer
     * @param filename Filename
     * @param ttl Time to live in seconds
     */
    uploadTempFile(fileBuffer: Buffer, filename: string, ttl?: number): Promise<FileUploadResult>;
    /**
     * Download file
     * @param key File key
     * @returns File buffer
     */
    downloadFile(key: string): Promise<Buffer>;
    /**
     * Download only the first `maxBytes` bytes of a file.
     * Used for magic-byte inspection without loading the entire file into memory.
     * @param key File key
     * @param maxBytes Number of bytes to fetch (default: 8192)
     */
    downloadFileChunk(key: string, maxBytes?: number): Promise<Buffer>;
    /**
     * Delete file
     * @param key File key
     */
    deleteFile(key: string): Promise<void>;
    /**
     * Get presigned download URL
     * @param key File key
     * @param expiresIn Expiry in seconds
     * @param inline Whether to display inline or download
     * @param originalFilename Original user-provided filename for Content-Disposition header
     */
    getDownloadUrl(key: string, expiresIn?: number, inline?: boolean, originalFilename?: string): Promise<string>;
    /**
     * Get presigned upload URL
     * @param filename Filename (used to derive extension if explicitKey is not provided)
     * @param contentType Content type
     * @param storagePath Storage path prefix (ignored when explicitKey is set)
     * @param explicitKey If provided, use this exact key instead of auto-generating one.
     *   Callers that pre-generate document IDs (Task 2/5) should pass the full key here.
     * @param fileSize When provided, binds the presigned URL to this exact byte length
     *   so R2 rejects any PUT whose Content-Length header does not match.
     */
    getUploadUrl(filename: string, contentType: string, storagePath?: string, explicitKey?: string, fileSize?: number): Promise<{
        url: string;
        key: string;
    }>;
    /**
     * Get Vault-scoped presigned upload URL using the dedicated bucket client.
     */
    getVaultUploadUrl(args: {
        key: string;
        contentType: string;
        contentLength: number;
        metadata: Record<string, string>;
        expiresIn?: number;
    }): Promise<{
        url: string;
        key: string;
        requiredHeaders: Record<string, string>;
    }>;
    /**
     * Get Vault-scoped presigned download URL. Vault downloads default to attachment.
     */
    getVaultDownloadUrl(key: string, expiresIn?: number, originalFilename?: string, bucket?: string): Promise<string>;
    getVaultFileInfo(key: string, bucket?: string): Promise<FileMetadata | null>;
    /**
     * Get file metadata
     * @param key File key
     */
    getFileInfo(key: string): Promise<FileMetadata | null>;
    healthCheck(): Promise<{
        status: 'healthy' | 'down';
        latencyMs?: number;
        message?: string;
    }>;
    /**
     * Clean up temporary files older than specified age
     * @param maxAgeSeconds Maximum age in seconds
     */
    cleanupTempFiles(maxAgeSeconds?: number): Promise<number>;
    /**
     * Upload a generated checklist DOCX export to R2.
     * Skips file-type validation since the buffer is generated server-side.
     * @param fileBuffer  DOCX buffer
     * @param filename    Desired filename (e.g. SheriaBot_Checklist_Acme_2026-03-20.docx)
     * @param checklistId Checklist record ID  -  used as the R2 path segment
     * @param userId      Uploader user ID  -  stored as metadata
     */
    uploadChecklistExport(fileBuffer: Buffer, filename: string, checklistId: string, userId: string): Promise<FileUploadResult>;
    /**
     * Upload a generated gap analysis DOCX export to R2.
     * Skips file-type validation since the buffer is generated server-side.
     * @param fileBuffer DOCX buffer
     * @param filename   Desired filename (e.g. SheriaBot_Gap_Analysis_Acme_2026-03-20.docx)
     * @param analysisId GapAnalysis record ID  -  used as the R2 path segment
     * @param userId     Uploader user ID  -  stored as metadata
     */
    uploadGapAnalysisExport(fileBuffer: Buffer, filename: string, analysisId: string, userId: string): Promise<FileUploadResult>;
    /**
     * Upload a generated compliance query DOCX export to R2.
     * Skips file-type validation since the buffer is generated server-side.
     * @param fileBuffer DOCX buffer
     * @param queryId ComplianceQuery record ID used as the R2 path segment
     * @param timestamp Stable timestamp segment for the generated export key
     * @param userId Uploader user ID stored as metadata
     */
    uploadComplianceQueryExport(fileBuffer: Buffer, queryId: string, timestamp: number, userId: string): Promise<FileUploadResult>;
}
/**
 * Export singleton storage service instance
 */
export declare const storageService: StorageService;
/**
 * Helper functions
 */
/**
 * Upload legal document
 */
export declare function uploadLegalDocument(fileBuffer: Buffer, filename: string, userId: string, metadata?: Record<string, string>): Promise<FileUploadResult>;
/**
 * Upload user image
 */
export declare function uploadUserImage(fileBuffer: Buffer, filename: string, userId: string): Promise<FileUploadResult>;
/**
 * Get download URL with expiry
 */
export declare function getSecureDownloadUrl(key: string, expiresInHours?: number): Promise<string>;
//# sourceMappingURL=storage.service.d.ts.map