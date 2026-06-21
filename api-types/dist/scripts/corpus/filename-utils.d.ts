/**
 * Filename Utilities
 *
 * Safe filename normalization, title extraction, and local path generation
 * for corpus document files.
 */
/**
 * Normalize a discovered title: collapse whitespace, strip surrounding
 * punctuation, decode HTML entities.
 */
export declare function normalizeTitle(raw: string): string;
/**
 * Derive a human-readable title from a filename.
 * Strips extension, replaces separators with spaces, title-cases.
 */
export declare function titleFromFilename(filename: string): string;
/**
 * Normalize a filename for safe filesystem storage.
 * - Lowercases
 * - Replaces spaces and special chars with hyphens
 * - Collapses multiple hyphens
 * - Preserves extension
 * - Caps length at 120 characters
 */
export declare function normalizeFilename(raw: string): string;
/**
 * Generate a safe proposed local path for a candidate document.
 *
 * @param country - lowercase country folder name (e.g. "malawi", "nigeria")
 * @param category - category subfolder (e.g. "payments", "aml-cft")
 * @param filename - raw or normalized filename
 * @returns relative path like "documents/malawi/payments/some-document.pdf"
 */
export declare function generateLocalPath(country: string, category: string, filename: string): string;
/**
 * Generate a URL-safe slug from a title for use as part of candidate IDs.
 */
export declare function slugify(text: string, maxLength?: number): string;
/**
 * Suggest a category based on title keywords.
 * Returns the best-matching category or 'other'.
 */
export declare function suggestCategory(title: string): string;
/**
 * Suggest a document type based on title keywords.
 */
export declare function suggestDocumentType(title: string): string;
/**
 * Suggest authority status based on title keywords.
 */
export declare function suggestAuthorityStatus(title: string): string;
//# sourceMappingURL=filename-utils.d.ts.map