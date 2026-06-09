import { S3Client } from '@aws-sdk/client-s3';
import type { Readable } from 'node:stream';
import { storageConfig } from '@/config/storage.config';
import { type Tracer } from '@opentelemetry/api';
import type { FastifyInstance } from 'fastify';
export interface FileMetadata {
    key: string;
    size: number;
    contentType: string;
    lastModified?: Date;
    etag?: string;
    metadata?: Record<string, string>;
    sha256?: string;
}
export interface UploadOptions {
    contentType?: string;
    metadata?: Record<string, string>;
    /**
     * Aligns with storageConfig.limits.maxFileSize keys:
     * documents | images | exports | default
     */
    category?: keyof typeof storageConfig.limits.maxFileSize;
    /**
     * Overrides global config.storage.security.malwareScan
     * - true: force scan
     * - false: skip scan
     * - undefined: use config default
     */
    malwareScan?: boolean;
    /**
     * If true and category is provided, enforce allowed mime types for that category
     */
    enforceAllowedTypes?: boolean;
}
export interface PresignedUrlOptions {
    expiresIn?: number;
    contentType?: string;
    contentDisposition?: string;
    /**
     * When set, the presigned PUT URL is bound to this exact Content-Length.
     * R2/S3 will reject any PUT whose Content-Length header does not match,
     * preventing clients from uploading files larger than they declared.
     */
    contentLength?: number;
}
export interface MalwareScanResult {
    clean: boolean;
    reason?: string;
    engine?: string;
}
export type MalwareScanner = (input: {
    key: string;
    contentType?: string;
    sha256?: string;
    size?: number;
    buffer?: Buffer;
}) => Promise<MalwareScanResult>;
export interface StorageService {
    uploadBuffer: (key: string, buffer: Buffer, options?: UploadOptions) => Promise<FileMetadata>;
    uploadStream: (key: string, stream: Readable, options: UploadOptions & {
        contentLength: number;
    }) => Promise<FileMetadata>;
    downloadFile: (key: string) => Promise<Buffer>;
    /** Download only the first `maxBytes` bytes of a file (magic-byte inspection). */
    downloadFileChunk: (key: string, maxBytes: number) => Promise<Buffer>;
    deleteFile: (key: string) => Promise<void>;
    fileExists: (key: string) => Promise<boolean>;
    getFileMetadata: (key: string) => Promise<FileMetadata | null>;
    listFiles: (prefix?: string, maxKeys?: number) => Promise<FileMetadata[]>;
    getPresignedDownloadUrl: (key: string, options?: PresignedUrlOptions) => Promise<string>;
    getPresignedUploadUrl: (key: string, options?: PresignedUrlOptions) => Promise<string>;
}
export interface VaultPresignedUploadOptions {
    expiresIn?: number;
    contentType: string;
    contentLength: number;
    metadata: Record<string, string>;
}
export interface VaultPresignedDownloadOptions {
    expiresIn?: number;
    bucket?: string;
    contentDisposition: string;
    contentType?: string;
}
export declare const vaultStorageConfig: {
    readonly bucket: string;
    readonly endpoint: string;
};
export declare const vaultS3Client: S3Client;
export declare function getVaultPresignedUploadUrl(key: string, options: VaultPresignedUploadOptions): Promise<string>;
export declare function getVaultPresignedDownloadUrl(key: string, options: VaultPresignedDownloadOptions): Promise<string>;
export declare function getVaultFileMetadata(key: string, bucket?: string): Promise<FileMetadata | null>;
export declare function createStorageService(deps?: {
    tracer?: Tracer;
    malwareScanner?: MalwareScanner;
    s3Client?: S3Client;
}): StorageService;
declare module 'fastify' {
    interface FastifyInstance {
        storage: StorageService;
    }
}
export declare const storagePlugin: (app: FastifyInstance) => Promise<void>;
//# sourceMappingURL=client.d.ts.map