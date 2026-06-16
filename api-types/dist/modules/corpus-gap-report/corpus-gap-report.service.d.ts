import { CorpusGapDocumentType, CorpusGapJurisdiction, CorpusGapReportStatus } from '@prisma/client';
export interface SubmitCorpusGapReportInput {
    documentName: string;
    issuingAuthority: string;
    documentType: CorpusGapDocumentType;
    jurisdiction: CorpusGapJurisdiction;
    description?: string;
    sourceUrl?: string;
}
export interface ListMyCorpusGapReportsInput {
    page: number;
    limit: number;
}
export interface AdminListCorpusGapReportsInput {
    status?: CorpusGapReportStatus;
    jurisdiction?: CorpusGapJurisdiction;
    documentType?: CorpusGapDocumentType;
    page: number;
    limit: number;
}
export interface AdminUpdateCorpusGapReportStatusInput {
    reportId: string;
    status: CorpusGapReportStatus;
    adminNotes?: string;
}
export declare class CorpusGapReportService {
    submitReport(params: {
        organizationId: string;
        userId: string;
        input: SubmitCorpusGapReportInput;
    }): Promise<{
        outcome: "DUPLICATE";
        reportId: string;
        report?: undefined;
    } | {
        outcome: "CREATED";
        reportId: string;
        report: {
            id: string;
            status: import("@prisma/client").$Enums.CorpusGapReportStatus;
            createdAt: Date;
            documentName: string;
            jurisdiction: import("@prisma/client").$Enums.CorpusGapJurisdiction;
            reportedByUser: {
                email: string;
                fullName: string;
            };
        };
    }>;
    listMyReports(params: {
        organizationId: string;
        input: ListMyCorpusGapReportsInput;
    }): Promise<{
        reports: {
            id: string;
            status: import("@prisma/client").$Enums.CorpusGapReportStatus;
            createdAt: Date;
            documentName: string;
            jurisdiction: import("@prisma/client").$Enums.CorpusGapJurisdiction;
            resolvedAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    adminListReports(params: {
        input: AdminListCorpusGapReportsInput;
    }): Promise<{
        reports: {
            id: string;
            description: string | null;
            organization: {
                id: string;
                name: string;
            };
            status: import("@prisma/client").$Enums.CorpusGapReportStatus;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            documentType: import("@prisma/client").$Enums.CorpusGapDocumentType;
            documentName: string;
            jurisdiction: import("@prisma/client").$Enums.CorpusGapJurisdiction;
            sourceUrl: string | null;
            reportedByUserId: string;
            issuingAuthority: string;
            adminNotes: string | null;
            resolvedAt: Date | null;
            reportedByUser: {
                id: string;
                email: string;
                fullName: string;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    adminUpdateStatus(params: {
        adminUserId: string;
        input: AdminUpdateCorpusGapReportStatusInput;
    }): Promise<{
        id: string;
        description: string | null;
        organization: {
            id: string;
            name: string;
        };
        status: import("@prisma/client").$Enums.CorpusGapReportStatus;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        documentType: import("@prisma/client").$Enums.CorpusGapDocumentType;
        documentName: string;
        jurisdiction: import("@prisma/client").$Enums.CorpusGapJurisdiction;
        sourceUrl: string | null;
        reportedByUserId: string;
        issuingAuthority: string;
        adminNotes: string | null;
        resolvedAt: Date | null;
        reportedByUser: {
            id: string;
            email: string;
            fullName: string;
        };
    }>;
}
export declare const corpusGapReportService: CorpusGapReportService;
//# sourceMappingURL=corpus-gap-report.service.d.ts.map