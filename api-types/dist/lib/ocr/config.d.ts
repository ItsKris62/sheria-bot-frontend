export interface OcrConfig {
    enabled: boolean;
    engine: 'ocrmypdf';
    command: string;
    commandArgs: string[];
    pathPrefix?: string;
    minNativeCharacters: number;
    minNativeCharsPerPage: number;
    minOcrCharacters: number;
    minOcrCharsPerPage: number;
    minAlphanumericRatio: number;
    maxGarbageRatio: number;
    maxRepeatedArtifactRatio: number;
    versionTimeoutMs: number;
    timeoutMs: number;
}
export declare function getOcrConfig(): OcrConfig;
//# sourceMappingURL=config.d.ts.map