export interface CsvUploadResult {
    url: string;
    expiresAt: Date;
    storageKey: string;
}
export declare function escapeCsvField(value: string | number | boolean | null | undefined): string;
export declare function buildCsvBuffer(headers: string[], rows: ReadonlyArray<ReadonlyArray<string | number | boolean | null | undefined>>): Buffer;
export declare function uploadCsvToR2(buffer: Buffer, keyPrefix: string, ttlSeconds: number): Promise<CsvUploadResult>;
//# sourceMappingURL=csv-export.util.d.ts.map