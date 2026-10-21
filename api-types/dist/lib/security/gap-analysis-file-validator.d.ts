export declare const GAP_ANALYSIS_ZIP_MAX_ENTRIES = 500;
export declare const GAP_ANALYSIS_ZIP_MAX_UNCOMPRESSED_BYTES: number;
export declare const GAP_ANALYSIS_ZIP_MAX_COMPRESSION_RATIO = 100;
export declare const GAP_ANALYSIS_ZIP_MAX_SINGLE_PART_BYTES: number;
export declare const GAP_ANALYSIS_MIN_EXTRACTED_TEXT_LENGTH = 50;
export declare const SCANNED_PDF_REJECTION_MESSAGE = "This PDF appears to contain little or no extractable text. OCR is not currently available for Gap Analysis. Please upload a text-searchable PDF or DOCX.";
export declare const ENCRYPTED_PDF_REJECTION_MESSAGE = "This PDF is password-protected or encrypted. Please upload an unencrypted document.";
export interface GapAnalysisValidationSuccess {
    valid: true;
    detectedType: 'pdf' | 'docx' | 'txt';
    mimeType: string;
    fileSize: number;
    extractedTextLength: number;
}
export interface GapAnalysisValidationFailure {
    valid: false;
    code: 'INVALID_SIGNATURE' | 'MALFORMED' | 'ENCRYPTED_PDF' | 'OCR_REQUIRED' | 'ZIP_SAFETY_VIOLATION' | 'BINARY_IN_TEXT' | 'TYPE_MISMATCH' | 'SIZE_EXCEEDED' | 'INSUFFICIENT_TEXT';
    reason: string;
}
export type GapAnalysisFileValidationResult = GapAnalysisValidationSuccess | GapAnalysisValidationFailure;
export declare class GapAnalysisFileValidationError extends Error {
    readonly code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
export interface ValidateGapAnalysisFileOptions {
    buffer: Buffer;
    fileName: string;
    fileType: string;
    claimedMimeType?: string;
}
export interface ZipArchiveInspection {
    isValidZip: boolean;
    entryCount: number;
    totalUncompressedSize: number;
    entryNames: Set<string>;
    maxSingleEntrySize: number;
}
/**
 * Low-level safe parser for ZIP container headers.
 * Extracts entry names and uncompressed sizes without uncompressing file data.
 */
export declare function inspectZipArchive(buffer: Buffer): ZipArchiveInspection;
/**
 * Authoritative Gap Analysis server-side file validator.
 * Validates claimed extension, declared MIME, size limits, binary magic bytes,
 * archive integrity, PDF safety, and extractability. Fails closed on any inconsistency.
 */
export declare function validateGapAnalysisFile(bufferOrOptions: Buffer | ValidateGapAnalysisFileOptions, fileNameArg?: string, fileTypeArg?: string, claimedMimeTypeArg?: string): Promise<GapAnalysisValidationSuccess>;
//# sourceMappingURL=gap-analysis-file-validator.d.ts.map