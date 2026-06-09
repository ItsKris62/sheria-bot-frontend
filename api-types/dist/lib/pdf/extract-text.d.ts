/**
 * ESM/CommonJS-safe PDF text extraction helper.
 *
 * pdf-parse v2.x exports a class `PDFParse` — not a bare callable function.
 * This module encapsulates the correct instantiation so every consumer uses
 * one tested code-path regardless of bundler or runtime module interop.
 *
 * Usage:
 *   import { extractPdfText } from '@/lib/pdf/extract-text';
 *   const text = await extractPdfText(buffer);
 */
/**
 * Extract plain text from a PDF buffer.
 *
 * @param buffer - Raw PDF file contents
 * @returns The extracted text content
 * @throws Error if the buffer is not a valid PDF or pdf-parse is misconfigured
 */
export declare function extractPdfText(buffer: Buffer): Promise<string>;
//# sourceMappingURL=extract-text.d.ts.map