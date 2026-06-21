type Options = {
    dryRun: boolean;
    limit?: number;
    documentIds: string[];
    upsertVectors: boolean;
};
type ReindexSummary = {
    dryRun: boolean;
    scanned: number;
    processed: number;
    skipped: number;
    chunksCreated: number;
    chunksSkipped: number;
    vectorsPrepared: number;
    vectorsUpserted: number;
    warnings: string[];
};
export declare function reindexPriorityDocumentsV2(options: Options): Promise<ReindexSummary>;
export {};
//# sourceMappingURL=reindex-priority-documents-v2.d.ts.map