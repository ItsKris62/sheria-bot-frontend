import { SourceVersionRef, V2ChunkMetadata } from './source-metadata';
export type PageAwareTextPage = {
    pageNumber?: number | null;
    text: string;
    startChar: number;
    endChar: number;
};
export type PageAwareText = {
    text: string;
    pages: PageAwareTextPage[];
    pageMetadataReliable: boolean;
    sourceType: 'pdf' | 'docx' | 'txt' | 'unknown';
};
export type V2LegalChunk = {
    index: number;
    text: string;
    section?: string | null;
    metadata: V2ChunkMetadata & {
        parser: 'v2-legal-structure';
        pageMetadataReliable: boolean;
        fallbackReason?: string | null;
    };
};
export declare function buildPageAwareText(text: string, input?: {
    sourceType?: PageAwareText['sourceType'];
    pageBreaksReliable?: boolean;
}): PageAwareText;
export declare function chunkPageAwareLegalText(input: {
    documentId: string;
    pageAwareText: PageAwareText;
    documentChecksum?: string | null;
    sourceVersion?: SourceVersionRef | null;
    authorityStatus?: string | null;
    corpusStatus?: string | null;
    isBinding?: boolean | null;
    maxChunkSize?: number;
}): V2LegalChunk[];
//# sourceMappingURL=v2-chunking.d.ts.map