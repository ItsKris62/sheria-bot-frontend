export type PageSpan = {
    pageStart?: number | null;
    pageEnd?: number | null;
};
export type HeadingPath = string[];
export type ProvisionAnchor = {
    sectionNumber?: string | null;
    clauseNumber?: string | null;
    scheduleNumber?: string | null;
    headingPath?: HeadingPath | null;
    provisionId?: string | null;
};
export type SourceVersionRef = {
    sourceDocumentVersionId?: string | null;
    officialUrl?: string | null;
    publicationDate?: Date | string | null;
    retrievedAt?: Date | string | null;
    effectiveDate?: Date | string | null;
    effectiveEndDate?: Date | string | null;
    versionLabel?: string | null;
    checksumSha256?: string | null;
};
export type V2ChunkMetadata = PageSpan & ProvisionAnchor & SourceVersionRef & {
    documentId: string;
    documentChecksum?: string | null;
    chunkIndex: number;
    charStart?: number | null;
    charEnd?: number | null;
    contentHash: string;
    indexVersion: string;
    authorityStatus?: string | null;
    corpusStatus?: string | null;
    isBinding?: boolean | null;
};
export type SourceLifecycleInput = {
    documentStatus?: string | null;
    versionStatus?: string | null;
    authorityStatus?: string | null;
    effectiveEndDate?: Date | string | null;
    supersededByDocumentId?: string | null;
    isBinding?: boolean | null;
};
export declare function generateContentHash(content: string): string;
export declare function normalizeOfficialUrl(url: string): string | null;
export declare function hostnameMatchesAllowedDomain(hostname: string, allowedDomain: string): boolean;
export declare function isOfficialUrlAllowed(officialUrl: string | null | undefined, approvedSource: {
    baseUrl?: string | null;
    allowedDomains?: unknown;
} | null | undefined): boolean;
export declare function generateProvisionId(input: {
    documentId: string;
    chunkIndex?: number | null;
    pageStart?: number | null;
    pageEnd?: number | null;
    sectionNumber?: string | null;
    clauseNumber?: string | null;
    scheduleNumber?: string | null;
    headingPath?: HeadingPath | null;
}): string;
export declare function deriveSourceLifecycleStatus(input: SourceLifecycleInput): {
    corpusStatus: 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED' | 'DRAFT' | 'CONSULTATION';
    isCurrent: boolean;
    isBinding: boolean;
};
export declare function mapV1DocumentToV2Metadata(doc: {
    id: string;
    checksum?: string | null;
    effectiveDate?: Date | string | null;
    effectiveEndDate?: Date | string | null;
    version?: string | null;
    authorityStatus?: string | null;
    isBinding?: boolean | null;
    status?: string | null;
    sourceDocumentVersionId?: string | null;
    officialUrl?: string | null;
}): SourceVersionRef & {
    documentChecksum?: string | null;
    authorityStatus?: string | null;
    corpusStatus: string;
    isBinding: boolean;
    indexVersion: string;
};
export declare function prepareV2ChunkMetadata(input: {
    documentId: string;
    chunkIndex: number;
    content: string;
    documentChecksum?: string | null;
    pageSpan?: PageSpan | null;
    provisionAnchor?: ProvisionAnchor | null;
    sourceVersion?: SourceVersionRef | null;
    charStart?: number | null;
    charEnd?: number | null;
    authorityStatus?: string | null;
    corpusStatus?: string | null;
    isBinding?: boolean | null;
    indexVersion?: string | null;
}): V2ChunkMetadata;
export declare function omitNullishMetadata<T extends Record<string, unknown>>(metadata: T): Partial<T>;
export declare function buildPreferredActiveSourceFilter(input?: {
    jurisdiction?: string | null;
    baseFilter?: Record<string, unknown> | null;
}): Record<string, unknown>;
//# sourceMappingURL=source-metadata.d.ts.map