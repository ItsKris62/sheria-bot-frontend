export declare const OFFICIAL_CANONICAL_URL_MAPPINGS: Record<string, {
    officialUrl: string;
    sourceRegistryId?: string;
}>;
export declare function remediatePrioritySourceUrls(options?: {
    dryRun: boolean;
}): Promise<{
    updated: number;
}>;
//# sourceMappingURL=remediate-priority-source-urls.d.ts.map