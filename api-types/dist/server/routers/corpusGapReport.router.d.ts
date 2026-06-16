export declare const corpusGapReportRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc/context").Context;
    meta: object;
    errorShape: {
        message: string;
        data: {
            stack: string | undefined;
            fieldErrors: Record<string, string> | null;
            code: import("@trpc/server").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
        };
        code: import("@trpc/server").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    submitReport: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            documentName: string;
            issuingAuthority: string;
            documentType: "OTHER" | "LEGISLATION" | "REGULATION" | "CIRCULAR" | "GUIDELINE" | "POLICY" | "STANDARD";
            jurisdiction: "OTHER" | "KENYA" | "MALAWI" | "NIGERIA" | "RWANDA";
            description?: string | undefined;
            sourceUrl?: string | undefined;
        };
        output: {
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
        };
        meta: object;
    }>;
    listMyReports: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
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
        };
        meta: object;
    }>;
    adminListReports: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
            status?: "UNDER_REVIEW" | "PENDING" | "REJECTED" | "INGESTED" | "DUPLICATE" | undefined;
            jurisdiction?: "OTHER" | "KENYA" | "MALAWI" | "NIGERIA" | "RWANDA" | undefined;
            documentType?: "OTHER" | "LEGISLATION" | "REGULATION" | "CIRCULAR" | "GUIDELINE" | "POLICY" | "STANDARD" | undefined;
        };
        output: {
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
        };
        meta: object;
    }>;
    adminUpdateStatus: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            reportId: string;
            status: "UNDER_REVIEW" | "PENDING" | "REJECTED" | "INGESTED" | "DUPLICATE";
            adminNotes?: string | undefined;
        };
        output: {
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
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=corpusGapReport.router.d.ts.map