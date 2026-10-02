/**
 * Archive Storage Service
 *
 * Provides server-side object archiving from primary R2 buckets (sheria-bot-saas,
 * sheria-bot-public, sheriabot-storage) to the immutable sheria-bot-backups bucket
 * using dedicated backup credentials (R2_BACKUP_ACCESS_KEY_ID / R2_BACKUP_SECRET_ACCESS_KEY).
 */
import { S3Client } from '@aws-sdk/client-s3';
export declare const BACKUP_BUCKET: string;
export declare const backupClient: S3Client;
export interface ArchiveObjectArgs {
    sourceBucket: 'sheria-bot-saas' | 'sheria-bot-public' | 'sheriabot-storage' | string;
    sourceKey: string;
    archivePrefix: string;
}
export interface ArchiveObjectResult {
    archived: boolean;
    archiveKey: string | null;
}
/**
 * Copy an object from a source bucket into the sheria-bot-backups archive bucket.
 * Uses S3 CopyObjectCommand server-side copy within the Cloudflare R2 account via backupClient.
 */
export declare function archiveObject(args: {
    sourceBucket: 'sheria-bot-saas' | 'sheria-bot-public' | 'sheriabot-storage' | string;
    sourceKey: string;
    archivePrefix: string;
}): Promise<ArchiveObjectResult>;
//# sourceMappingURL=archive.service.d.ts.map