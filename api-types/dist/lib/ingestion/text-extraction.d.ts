import { type OcrConfig } from '@/lib/ocr/config';
import { type OcrEngineResult } from '@/lib/ocr/engine';
import { type ExtractionMethod, type OcrQualityStatus, type TextUsabilityMetrics } from '@/lib/ocr/quality';
export interface ExtractionMetadata {
    extractionMethod: ExtractionMethod;
    ocrEngine?: string;
    ocrVersion?: string | null;
    ocrPageCount?: number | null;
    nativeCharacterCount?: number;
    extractedCharacterCount: number;
    pageCount?: number | null;
    durationMs: number;
    nativeExtractionDurationMs?: number;
    ocrDurationMs?: number;
    ocrQualityStatus?: OcrQualityStatus;
    qualityMetrics?: TextUsabilityMetrics;
    qualityReasons?: string[];
}
export interface ExtractDocumentTextDeps {
    config?: OcrConfig;
    ocrProvider?: (buffer: Buffer, config: OcrConfig) => Promise<OcrEngineResult>;
}
export interface ExtractedDocumentText {
    text: string;
    metadata: ExtractionMetadata;
}
export declare function normalizeExtractedText(raw: string): string;
export declare function extractPdfTextWithOcrFallback(buffer: Buffer, context: {
    documentId?: string;
    title: string;
    jurisdiction: string;
}, deps?: ExtractDocumentTextDeps): Promise<ExtractedDocumentText>;
//# sourceMappingURL=text-extraction.d.ts.map