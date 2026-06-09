import { ContentStatus, DocumentStatus } from '@prisma/client';
type PrismaLike = {
    legalDocument: {
        findMany(args: unknown): Promise<LegalBenchmarkRow[]>;
    };
    regulatoryDocument?: {
        findMany(args: unknown): Promise<RegulatoryBenchmarkRow[]>;
    };
};
type LegalBenchmarkRow = {
    id: string;
    title: string | null;
    actName: string;
    documentType: string;
    regulatoryBody: string | null;
    category: string | null;
    subcategory: string | null;
    tags: string[];
    contentStatus: ContentStatus;
    status: DocumentStatus;
    organizationId: string | null;
    userId: string | null;
    version: number;
    updatedAt: Date;
};
type RegulatoryBenchmarkRow = {
    id: string;
    title: string;
    source: string;
    category: string;
    documentType: string;
    authorityStatus: string;
    version: string | null;
    updatedAt: Date;
};
export type AuthorizedBenchmarkDocument = {
    id: string;
    title: string;
    source: string | null;
    frameworkSlug: string | null;
    documentType: string;
    authorityStatus: string | null;
    version: string | null;
    organizationId: string | null;
    isGlobal: boolean;
    updatedAt: Date;
    regulatoryBody: string | null;
};
export declare function buildAuthorizedLegalBenchmarkWhere(input: {
    userId: string;
    organizationId: string;
}): {
    deletedAt: null;
    contentType: "REGULATORY_DOCUMENT";
    status: "INDEXED";
    OR: ({
        organizationId: null;
        contentStatus: "PUBLISHED";
        userId?: undefined;
    } | {
        organizationId: string;
        contentStatus?: undefined;
        userId?: undefined;
    } | {
        userId: string;
        organizationId?: undefined;
        contentStatus?: undefined;
    })[];
};
export declare function buildAuthorizedRegulatoryBenchmarkWhere(): {
    status: string;
};
export declare function listAuthorizedBenchmarkDocuments(input: {
    prisma: PrismaLike;
    userId: string;
    organizationId: string;
    search?: string | null;
}): Promise<AuthorizedBenchmarkDocument[]>;
export declare function validateAuthorizedBenchmarkDocumentIds(input: {
    prisma: PrismaLike;
    userId: string;
    organizationId: string;
    benchmarkDocumentIds: string[];
}): Promise<AuthorizedBenchmarkDocument[]>;
export {};
//# sourceMappingURL=benchmark-document.service.d.ts.map