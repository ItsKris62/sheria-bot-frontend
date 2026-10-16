export declare const gapAnalysisRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    getFrameworks: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            jurisdiction?: "KE" | "MW" | "RW" | "NG" | undefined;
        } | undefined;
        output: {
            slug: string;
            name: string;
            category: string;
            description: string | null;
            tier: string;
            locked: boolean;
            scope: import("../../config/framework-metadata.config.js").FrameworkScope;
            jurisdictions: ("KE" | "MW" | "RW" | "NG")[];
            applicable: boolean;
            pilotEnabled: boolean;
            readiness: import("../../config/gap-analysis.config.js").PilotCorpusReadiness;
        }[];
        meta: object;
    }>;
    runGapAnalysis: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            fileName: string;
            fileType: "pdf" | "docx" | "txt";
            fileContent: string;
            regulatoryFrameworks: string[];
            processingConsentAcknowledged?: boolean | undefined;
            consentVersion?: string | undefined;
            jurisdiction?: "KE" | "MW" | "RW" | "NG" | undefined;
            benchmarkDocumentIds?: string[] | undefined;
            analysisDepth?: "quick" | "standard" | "deep" | undefined;
            focusAreas?: string[] | undefined;
        };
        output: any;
        meta: object;
    }>;
    getGapAnalyses: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            documentName: string;
            documentType: string;
            regulatoryFrameworks: import("@prisma/client/runtime/client").JsonValue;
            analysisDepth: string;
            overallScore: number | null;
            status: string;
            progress: number;
            errorMessage: string | null;
            jurisdictionCode: string | null;
            results?: import("@prisma/client/runtime/client").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: object;
    }>;
    getGapAnalysisStatus: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    getGapAnalysisResult: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
            documentName: string;
            documentType: string;
            documentUrl: string;
            regulatoryFrameworks: import("@prisma/client/runtime/client").JsonValue;
            analysisDepth: string;
            focusAreas: import("@prisma/client/runtime/client").JsonValue | null;
            results: import("../../lib/ai/prompts/gap-analysis").GapAnalysisResult | null;
            overallScore: number | null;
            status: string;
            progress: number;
            errorMessage: string | null;
            ragGrounded: boolean;
            chunksProcessed: number;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            userName: string | null;
            organizationName: string | null;
        };
        meta: object;
    }>;
    getGapAnalysisLimits: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            readonly enabled: boolean;
            readonly usageLimit: number;
            readonly usagePeriod: "lifetime" | "month";
            readonly benchmarkDocuments: boolean;
            readonly countryLimit: number;
            readonly allowedDepths: readonly ("quick" | "standard" | "deep")[];
            readonly depthOptions: ({
                label: "Quick Scan";
                description: "Fast screening for significant evidence-backed risks.";
                breadth: "Limited breadth";
                depth: "quick" | "standard" | "deep";
                units: number;
            } | {
                label: "Standard Analysis";
                description: "Balanced policy and regulatory review with broader retrieval and document traversal.";
                breadth: "Recommended";
                depth: "quick" | "standard" | "deep";
                units: number;
            } | {
                label: "Deep Analysis";
                description: "Expanded retrieval, cross-section review and enhanced verification.";
                breadth: "Most thorough";
                depth: "quick" | "standard" | "deep";
                units: number;
            })[];
            readonly maxFileSizeBytes: number;
            readonly allowedFileTypes: readonly [{
                readonly extension: "pdf";
                readonly label: "PDF";
                readonly mimeTypes: readonly ["application/pdf"];
            }, {
                readonly extension: "docx";
                readonly label: "DOCX";
                readonly mimeTypes: readonly ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            }, {
                readonly extension: "txt";
                readonly label: "TXT";
                readonly mimeTypes: readonly ["text/plain"];
            }];
            readonly processingAcknowledgement: {
                readonly version: "2026-10-01";
                readonly text: "I understand that my document may be processed using AI services hosted outside my home jurisdiction, in accordance with SheriaBot's Privacy Policy and applicable data-protection law.";
            };
            readonly pilotAvailability: import("../../config/gap-analysis.config.js").GapAnalysisPilotAvailability;
            readonly depthAvailability: {
                readonly default: Readonly<Record<"quick" | "standard" | "deep", boolean>>;
                readonly frameworks: Readonly<Record<string, Readonly<Record<"quick" | "standard" | "deep", boolean>>>>;
            };
        };
        meta: object;
    }>;
    deleteGapAnalysis: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
}>>;
