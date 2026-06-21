export type ApprovedSourceSeed = {
    id: string;
    jurisdiction: string;
    authorityName: string;
    authorityType: string;
    baseUrl: string;
    allowedDomains: string[];
    notes?: string;
};
export declare const KENYA_PRIORITY_APPROVED_SOURCES: ApprovedSourceSeed[];
export declare const PRIORITY_SOURCE_KEYWORDS: string[];
export declare function isPriorityRegulatoryDocument(doc: {
    title?: string | null;
    category?: string | null;
    source?: string | null;
    documentType?: string | null;
}): boolean;
export declare function matchApprovedSourceId(doc: {
    source?: string | null;
    title?: string | null;
    category?: string | null;
    officialUrl?: string | null;
}): string | null;
export declare function buildSourceDocumentVersionId(input: {
    regulatoryDocumentId: string;
    officialUrl: string;
    checksumSha256?: string | null;
    versionLabel?: string | null;
}): string;
//# sourceMappingURL=approved-sources.d.ts.map