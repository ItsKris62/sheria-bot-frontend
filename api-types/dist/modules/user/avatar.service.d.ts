import { type AvatarContentType } from '@/lib/storage/public-storage.service';
export interface AvatarUploadUrlResult {
    uploadUrl: string;
    publicUrl: string;
}
export interface AvatarUpdateResult {
    avatar: string | null;
}
/**
 * Derives a 1-2 character display string from a user's full name.
 *
 * Rules:
 * - Two words or more  -> first letter of word 1 + first letter of word 2
 * - Single word ≥ 2    -> first two characters
 * - Single char / null -> "U"
 *
 * Always returns uppercase.
 */
export declare function getInitials(fullName: string | null | undefined): string;
export declare const avatarService: {
    /**
     * Generates a presigned PUT URL so the browser can upload directly to R2.
     * Does NOT touch the database  -  the URL is valid for 5 minutes.
     * Call `confirmUpload` after the browser PUT succeeds.
     */
    getUploadUrl(userId: string, contentType: AvatarContentType, fileSize: number): Promise<AvatarUploadUrlResult>;
    /**
     * Persists the avatar URL in the database after a successful R2 upload.
     * Validates that the URL belongs to the configured public bucket before saving.
     * Clears the user profile cache so the next `getProfile` call returns fresh data.
     */
    confirmUpload(userId: string, publicUrl: string): Promise<AvatarUpdateResult>;
    /**
     * Deletes the user's current avatar from R2 and clears the DB field.
     * Safe to call when no avatar is set  -  returns early without error.
     */
    deleteAvatar(userId: string): Promise<AvatarUpdateResult>;
};
//# sourceMappingURL=avatar.service.d.ts.map