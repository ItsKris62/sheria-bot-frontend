export interface DocumentIngestionInput {
    filePath: string;
    fileName?: string;
    title: string;
    source: string;
    category: string;
    jurisdiction: string;
    documentType: string;
    effectiveDate?: Date;
    version?: string;
    authorityStatus?: 'DRAFT' | 'IN_FORCE' | 'SUPERSEDED' | 'CONSULTATION';
    isBinding?: boolean;
    supersedesDocumentId?: string;
    officialUrl?: string;
    publicationDate?: Date;
    retrievedAt?: Date;
    effectiveEndDate?: Date;
    sourceRegistryId?: string;
    sourceDocumentVersionId?: string;
}
export interface IngestionResult {
    documentId: string;
    chunkCount: number;
    totalCharacters: number;
    storageKey: string;
    skipped: boolean;
    reason?: string;
}
export interface DeleteDocumentOptions {
    deleteVectors?: boolean;
    deleteStorage?: boolean;
}
export interface DocumentStats {
    total: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
    byJurisdiction: Record<string, number>;
}
export declare class DocumentIngestionService {
    ingestDocument(input: DocumentIngestionInput): Promise<IngestionResult>;
    updateDocumentAuthority(documentId: string, input: {
        authorityStatus: 'DRAFT' | 'IN_FORCE' | 'SUPERSEDED' | 'CONSULTATION';
        isBinding?: boolean;
        version?: string;
        effectiveDate?: Date;
    }): Promise<void>;
}
export declare const documentIngestionService: DocumentIngestionService;
//# sourceMappingURL=document-processor.d.ts.map