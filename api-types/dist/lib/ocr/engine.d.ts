import type { OcrConfig } from './config';
export interface OcrEngineResult {
    engine: 'ocrmypdf';
    engineVersion: string | null;
    text: string;
    durationMs: number;
}
export declare function getOcrEngineVersion(timeoutMs?: number): Promise<string | null>;
export declare function runOcrMyPdf(buffer: Buffer, config: OcrConfig): Promise<OcrEngineResult>;
//# sourceMappingURL=engine.d.ts.map