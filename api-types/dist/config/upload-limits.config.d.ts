export declare const AVATAR_UPLOAD_LIMITS: {
    readonly maxFileSizeMB: 5;
    readonly allowedMimeTypes: readonly ["image/jpeg", "image/png", "image/webp"];
};
/** Largest single-file size any tier can upload to the vault (ENTERPRISE: 50 MB).
 * Used as the Zod schema ceiling in vault.schema.ts. */
export declare const VAULT_MAX_FILE_SIZE_BYTES: number;
export { GAP_ANALYSIS_MAX_BASE64_CHARS, GAP_ANALYSIS_MAX_FILE_BYTES, } from './gap-analysis.config';
//# sourceMappingURL=upload-limits.config.d.ts.map