type Options = {
    dryRun: boolean;
    batchSize: number;
};
type Summary = {
    dryRun: boolean;
    documentsScanned: number;
    documentsNeedingIndexVersion: number;
    chunksScanned: number;
    chunksNeedingContentHash: number;
    chunksUpdated: number;
};
export declare function backfillSourceMetadataV1(options: Options): Promise<Summary>;
export {};
//# sourceMappingURL=backfill-source-metadata-v1.d.ts.map