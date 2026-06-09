/**
 * Storage configuration for Cloudflare R2
 * S3-compatible object storage for legal documents and files
 */
export declare const storageConfig: {
    /**
     * Cloudflare R2 credentials
     */
    readonly credentials: {
        readonly accountId: string;
        readonly accessKeyId: string;
        readonly secretAccessKey: string;
    };
    /**
     * Bucket configuration
     */
    readonly bucket: {
        readonly name: string;
        readonly region: "auto";
        readonly publicUrl: string;
    };
    /**
     * S3 client configuration
     */
    readonly s3Config: {
        readonly endpoint: `https://${string}.r2.cloudflarestorage.com`;
        readonly region: "auto";
        readonly forcePathStyle: false;
        readonly signatureVersion: "v4";
    };
    /**
     * File upload limits
     */
    readonly limits: {
        readonly maxFileSize: {
            readonly documents: number;
            readonly images: number;
            readonly exports: number;
            readonly vault: number;
            readonly default: number;
        };
        readonly maxFiles: 10;
        readonly maxTotalSize: number;
        readonly minFileSize: 1024;
    };
    /**
     * Allowed file types by category
     */
    readonly allowedFileTypes: {
        readonly documents: {
            readonly mimeTypes: readonly ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            readonly extensions: readonly [".pdf", ".doc", ".docx"];
            readonly description: "PDF, Word documents";
        };
        readonly images: {
            readonly mimeTypes: readonly ["image/jpeg", "image/png", "image/webp"];
            readonly extensions: readonly [".jpg", ".jpeg", ".png", ".webp"];
            readonly description: "JPEG, PNG, WebP images";
        };
        readonly exports: {
            readonly mimeTypes: readonly ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/markdown"];
            readonly extensions: readonly [".pdf", ".docx", ".xlsx", ".md"];
            readonly description: "PDF, Word, Excel, Markdown";
        };
        readonly vault: {
            readonly mimeTypes: readonly ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "image/png", "image/jpeg"];
            readonly extensions: readonly [".pdf", ".doc", ".docx", ".xlsx", ".csv", ".png", ".jpg", ".jpeg"];
            readonly description: "PDF, Word, Excel, CSV, PNG, JPG";
        };
    };
    /**
     * File storage paths (prefixes)
     */
    readonly paths: {
        readonly legalDocuments: "legal-documents/";
        readonly policyExports: "policy-exports/";
        readonly checklistExports: "checklist-exports/";
        readonly userUploads: "user-uploads/";
        readonly logos: "logos/";
        readonly system: "system/";
        readonly temp: "temp/";
        readonly vault: "vault/";
    };
    /**
     * Presigned URL configuration
     */
    readonly presignedUrls: {
        readonly defaultExpiry: 3600;
        readonly expiry: {
            readonly download: 3600;
            readonly upload: 300;
            readonly view: 86400;
            readonly share: 604800;
        };
        readonly forceDownload: true;
    };
    /**
     * File naming configuration
     */
    readonly naming: {
        readonly useUUID: true;
        readonly preserveOriginalName: true;
        readonly sanitize: true;
        readonly pattern: "{timestamp}-{uuid}";
        readonly maxFilenameLength: 100;
    };
    /**
     * Metadata configuration
     */
    readonly metadata: {
        readonly enabled: true;
        readonly fields: {
            readonly uploadedBy: "x-amz-meta-uploaded-by";
            readonly uploadedAt: "x-amz-meta-uploaded-at";
            readonly originalName: "x-amz-meta-original-name";
            readonly documentType: "x-amz-meta-document-type";
            readonly organizationId: "x-amz-meta-organization-id";
            readonly contentHash: "x-amz-meta-content-hash";
        };
    };
    /**
     * CDN configuration (if using Cloudflare CDN)
     */
    readonly cdn: {
        readonly enabled: boolean;
        readonly cacheControl: {
            readonly documents: "public, max-age=31536000, immutable";
            readonly exports: "private, max-age=3600";
            readonly images: "public, max-age=604800";
            readonly temp: "no-cache, no-store, must-revalidate";
        };
    };
    /**
     * Security configuration
     */
    readonly security: {
        readonly validateContent: true;
        readonly malwareScan: boolean;
        readonly encryption: {
            readonly enabled: true;
            readonly algorithm: "AES256";
        };
        readonly cors: {
            readonly allowedOrigins: readonly [string];
            readonly allowedMethods: readonly ["GET", "HEAD", "PUT", "POST"];
            readonly allowedHeaders: readonly ["*"];
            readonly maxAge: 3600;
        };
    };
    /**
     * Lifecycle rules for automatic cleanup
     */
    readonly lifecycle: {
        readonly enabled: boolean;
        readonly rules: {
            readonly deleteTempFiles: {
                readonly prefix: "temp/";
                readonly expirationDays: 1;
            };
            readonly archiveOldExports: {
                readonly prefix: "policy-exports/";
                readonly transitionDays: 30;
                readonly storageClass: "GLACIER";
            };
        };
    };
    /**
     * Retry configuration for upload failures
     */
    readonly retry: {
        readonly maxAttempts: 3;
        readonly initialDelay: 1000;
        readonly maxDelay: 5000;
        readonly backoffMultiplier: 2;
    };
    /**
     * Logging configuration
     */
    readonly logging: {
        readonly logUploads: true;
        readonly logDownloads: boolean;
        readonly logDeletions: true;
        readonly logErrors: true;
    };
};
/**
 * Get maximum file size for category
 * @param category File category
 * @returns Maximum file size in bytes
 */
export declare function getMaxFileSize(category: keyof typeof storageConfig.limits.maxFileSize): number;
/**
 * Check if file type is allowed
 * @param mimeType File MIME type
 * @param category File category
 * @returns true if allowed
 */
export declare function isFileTypeAllowed(mimeType: string, category: keyof typeof storageConfig.allowedFileTypes): boolean;
/**
 * Check if file extension is allowed
 * @param extension File extension (with dot)
 * @param category File category
 * @returns true if allowed
 */
export declare function isExtensionAllowed(extension: string, category: keyof typeof storageConfig.allowedFileTypes): boolean;
/**
 * Generate unique filename
 * @param originalName Original filename
 * @param preserveExtension Whether to preserve file extension
 * @returns Unique filename
 */
export declare function generateUniqueFilename(originalName: string, preserveExtension?: boolean): string;
/**
 * Get full S3 key for file
 * @param category File category
 * @param filename Filename
 * @returns Full S3 key
 */
export declare function getFileKey(category: keyof typeof storageConfig.paths, filename: string): string;
/**
 * Get public URL for file
 * @param key S3 key
 * @returns Public URL
 */
export declare function getPublicUrl(key: string): string;
/**
 * Get presigned URL expiry time
 * @param useCase Use case for URL
 * @returns Expiry time in seconds
 */
export declare function getPresignedUrlExpiry(useCase: keyof typeof storageConfig.presignedUrls.expiry): number;
/**
 * Sanitize filename (remove special characters)
 * @param filename Original filename
 * @returns Sanitized filename
 */
export declare function sanitizeFilename(filename: string): string;
/**
 * Calculate retry delay with exponential backoff
 * @param attemptNumber Current attempt number (1-indexed)
 * @returns Delay in milliseconds
 */
export declare function getRetryDelay(attemptNumber: number): number;
/**
 * Export type
 */
export type StorageConfig = typeof storageConfig;
//# sourceMappingURL=storage.config.d.ts.map