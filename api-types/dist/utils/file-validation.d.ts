export interface FileValidationResult {
    valid: boolean;
    detectedType: string | null;
    reason?: string;
}
/**
 * Validate a file buffer against our magic-bytes allowlist.
 *
 * For binary types (PDF, DOCX, PNG, JPEG): uses `file-type` to read the
 * actual magic bytes from the buffer and rejects mismatches.
 *
 * For text types (TXT, MD): validates that the buffer is valid UTF-8 with
 * no embedded null bytes (heuristic to detect binary files masquerading as text).
 *
 * @param buffer   File buffer (first 8 KB is sufficient  -  pass more if available)
 * @param claimedFilename  Original filename as provided by the client
 * @param claimedMimeType  MIME type as declared by the client
 */
export declare function validateFileMagicBytes(buffer: Buffer, claimedFilename: string, claimedMimeType: string): Promise<FileValidationResult>;
//# sourceMappingURL=file-validation.d.ts.map