import type { EffectivePlan } from '@/types/plan.types';
export declare const AVATAR_UPLOAD_LIMITS: {
    readonly maxFileSizeMB: 5;
    readonly allowedMimeTypes: readonly ["image/jpeg", "image/png", "image/webp"];
};
export interface GapAnalysisTierLimits {
    /** Maximum size of the uploaded file in megabytes. 0 = blocked. */
    maxFileSizeMB: number;
}
export declare const GAP_ANALYSIS_UPLOAD_LIMITS: Record<EffectivePlan, GapAnalysisTierLimits>;
/** Largest single-file size any tier can upload to the vault (ENTERPRISE: 50 MB).
 * Used as the Zod schema ceiling in vault.schema.ts. */
export declare const VAULT_MAX_FILE_SIZE_BYTES: number;
/** Largest gap-analysis file any tier can upload (BUSINESS/ENTERPRISE: 20 MB).
 * A 20 MB binary file is ~27.3 MB when base64-encoded.
 * Used as the Zod schema ceiling in compliance.router.ts. */
export declare const GAP_ANALYSIS_MAX_BASE64_CHARS = 28000000;
//# sourceMappingURL=upload-limits.config.d.ts.map