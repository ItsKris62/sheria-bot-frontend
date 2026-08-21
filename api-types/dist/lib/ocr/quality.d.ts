import type { OcrConfig } from './config';
export type ExtractionMethod = 'NATIVE' | 'OCR';
export type OcrQualityStatus = 'PASS' | 'FAIL';
export interface TextUsabilityMetrics {
    characterCount: number;
    nonWhitespaceCharacters: number;
    charsPerPage: number | null;
    alphanumericRatio: number;
    garbageRatio: number;
    repeatedArtifactRatio: number;
    emptyPageRatio: number | null;
}
export interface TextUsabilityResult {
    usable: boolean;
    metrics: TextUsabilityMetrics;
    reasons: string[];
}
export declare function computeTextUsabilityMetrics(text: string, pageCount: number | null): TextUsabilityMetrics;
export declare function isNativeTextUsable(text: string, pageCount: number | null, config: Pick<OcrConfig, 'minNativeCharacters' | 'minNativeCharsPerPage'>): TextUsabilityResult;
export declare function validateOcrTextQuality(text: string, pageCount: number | null, config: Pick<OcrConfig, 'minOcrCharacters' | 'minOcrCharsPerPage' | 'minAlphanumericRatio' | 'maxGarbageRatio' | 'maxRepeatedArtifactRatio'>): TextUsabilityResult;
//# sourceMappingURL=quality.d.ts.map