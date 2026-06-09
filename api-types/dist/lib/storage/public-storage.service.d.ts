import { z } from 'zod';
declare const AVATAR_CONTENT_TYPES: readonly ["image/jpeg", "image/png", "image/webp"];
export type AvatarContentType = (typeof AVATAR_CONTENT_TYPES)[number];
/** Max avatar file size: 5 MB  -  kept for backward compat; canonical value is AVATAR_UPLOAD_LIMITS.maxFileSizeMB */
export declare const AVATAR_MAX_FILE_SIZE: number;
export declare const avatarUploadSchema: z.ZodObject<{
    contentType: z.ZodEnum<{
        "image/png": "image/png";
        "image/jpeg": "image/jpeg";
        "image/webp": "image/webp";
    }>;
    fileSize: z.ZodNumber;
}, z.core.$strip>;
export type AvatarUploadInput = z.infer<typeof avatarUploadSchema>;
/**
 * Derives the R2 object key from an existing public avatar URL.
 * Returns null if the URL does not belong to the configured public bucket.
 */
export declare function extractKeyFromAvatarUrl(avatarUrl: string): string | null;
/**
 * Generates a presigned PUT URL so the browser can upload an avatar
 * directly to R2 without routing through the backend.
 *
 * @returns uploadUrl   -  PUT directly to this URL with the file body
 * @returns publicUrl   -  Permanent public URL once the upload completes
 * @returns key         -  R2 object key (store alongside publicUrl if needed)
 */
export declare function generateAvatarUploadUrl(userId: string, contentType: AvatarContentType, fileSize: number): Promise<{
    uploadUrl: string;
    publicUrl: string;
    key: string;
}>;
/**
 * Deletes an avatar object from R2 using its object key.
 * The key is derived from the stored avatar URL via `extractKeyFromAvatarUrl`.
 * Throws `StorageServiceError` on failure.
 */
export declare function deleteAvatarByKey(key: string): Promise<void>;
export {};
//# sourceMappingURL=public-storage.service.d.ts.map