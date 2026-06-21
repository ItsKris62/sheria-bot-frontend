type Options = {
    dryRun: boolean;
    limit?: number;
};
type LinkSummary = {
    dryRun: boolean;
    scanned: number;
    priorityDocuments: number;
    linked: number;
    skipped: number;
    missingOfficialUrl: string[];
    missingChecksum: string[];
    manualReview: Array<{
        id: string;
        title: string;
        reason: string;
    }>;
};
export declare function linkPrioritySourceVersions(options: Options): Promise<LinkSummary>;
export {};
//# sourceMappingURL=link-priority-source-versions.d.ts.map