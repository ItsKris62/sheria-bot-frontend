type Options = {
    dryRun: boolean;
};
type Summary = {
    dryRun: boolean;
    scanned: number;
    created: number;
    updated: number;
    unchanged: number;
};
export declare function seedApprovedSources(options: Options): Promise<Summary>;
export {};
//# sourceMappingURL=seed-approved-sources.d.ts.map