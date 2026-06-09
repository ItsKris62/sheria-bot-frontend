import { type S3Client } from '@aws-sdk/client-s3';
interface ComputeContentHashParams {
    s3Client: S3Client;
    bucket: string;
    key: string;
    expectedSize: number;
    context: {
        organizationId: string;
        documentId: string;
    };
}
interface ContentHashResult {
    hash: string;
    bytesRead: number;
    durationMs: number;
}
/**
 * Streams an R2 object through SHA-256 without buffering the entire object.
 * Throws if the object cannot be fetched or the byte count does not match.
 */
export declare function computeObjectContentHash(params: ComputeContentHashParams): Promise<ContentHashResult>;
export {};
//# sourceMappingURL=content-hash.d.ts.map