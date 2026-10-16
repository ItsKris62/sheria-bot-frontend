import { type PlanEntitlementConfig } from './entitlements.config';
import type { EffectivePlan } from '../types/plan.types.js';
export declare const GAP_ANALYSIS_DEPTHS: readonly ["quick", "standard", "deep"];
export type GapAnalysisDepth = (typeof GAP_ANALYSIS_DEPTHS)[number];
export type GapAnalysisDepthAvailability = Readonly<Record<GapAnalysisDepth, boolean>>;
export declare const GAP_ANALYSIS_DEFAULT_DEPTH_AVAILABILITY: GapAnalysisDepthAvailability;
export declare function getFrameworkDepthAvailability(jurisdiction: string, frameworkSlug: string): GapAnalysisDepthAvailability;
export declare function isFrameworkDepthAvailable(jurisdiction: string, frameworkSlug: string, depth: GapAnalysisDepth): boolean;
export declare const GAP_ANALYSIS_DEPTH_UNIT_COST: Readonly<Record<GapAnalysisDepth, number>>;
export declare const GAP_ANALYSIS_MAX_FILE_BYTES: number;
export declare const GAP_ANALYSIS_MAX_BASE64_CHARS: number;
export declare const GAP_ANALYSIS_FILE_EXTENSIONS: readonly ["pdf", "docx", "txt"];
export declare const GAP_ANALYSIS_ALLOWED_FILE_TYPES: readonly [{
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
export type GapAnalysisFileType = (typeof GAP_ANALYSIS_FILE_EXTENSIONS)[number];
export declare function getAllowedGapAnalysisDepths(plan: EffectivePlan): readonly GapAnalysisDepth[];
export declare function isGapAnalysisDepthAllowed(plan: EffectivePlan, depth: GapAnalysisDepth): boolean;
export declare function isGapAnalysisFileType(value: string): value is GapAnalysisFileType;
export declare function getGapAnalysisFileExtension(fileName: string): string;
export declare function getGapAnalysisContract(plan: EffectivePlan, effectiveEntitlements?: PlanEntitlementConfig): {
    readonly enabled: boolean;
    readonly usageLimit: number;
    readonly usagePeriod: "month" | "lifetime";
    readonly benchmarkDocuments: boolean;
    readonly countryLimit: number;
    readonly allowedDepths: readonly ("standard" | "quick" | "deep")[];
    readonly depthOptions: ({
        label: "Quick Scan";
        description: "Fast screening for significant evidence-backed risks.";
        breadth: "Limited breadth";
        depth: "standard" | "quick" | "deep";
        units: number;
    } | {
        label: "Standard Analysis";
        description: "Balanced policy and regulatory review with broader retrieval and document traversal.";
        breadth: "Recommended";
        depth: "standard" | "quick" | "deep";
        units: number;
    } | {
        label: "Deep Analysis";
        description: "Expanded retrieval, cross-section review and enhanced verification.";
        breadth: "Most thorough";
        depth: "standard" | "quick" | "deep";
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
    readonly pilotAvailability: GapAnalysisPilotAvailability;
    readonly depthAvailability: {
        readonly default: Readonly<Record<"standard" | "quick" | "deep", boolean>>;
        readonly frameworks: Readonly<Record<string, Readonly<Record<"standard" | "quick" | "deep", boolean>>>>;
    };
};
export type PilotCorpusReadiness = 'UNAVAILABLE' | 'INDEXED_PARTIAL' | 'VALIDATED_FOR_GAP_ANALYSIS' | 'STALE_OR_UNKNOWN';
export interface PilotCountryConfig {
    pilotEnabled: boolean;
    readiness: PilotCorpusReadiness;
    validatedFrameworks: readonly string[];
    indexedPartialFrameworks: readonly string[];
    unavailableFrameworks: readonly string[];
    message?: string;
}
export declare const GAP_ANALYSIS_PILOT_CONFIG: Readonly<{
    jurisdictions: Record<string, PilotCountryConfig>;
}>;
export interface PilotJurisdictionAvailability {
    jurisdiction: string;
    pilotEnabled: boolean;
    readiness: PilotCorpusReadiness;
    message?: string;
}
export interface PilotFrameworkAvailability {
    slug: string;
    pilotEnabled: boolean;
    readiness: PilotCorpusReadiness;
}
export interface GapAnalysisPilotAvailability {
    jurisdictions: Record<string, PilotJurisdictionAvailability>;
}
export declare function getPilotJurisdictionAvailability(code: string): PilotJurisdictionAvailability;
export declare function getPilotFrameworkAvailability(slug: string, _jurisdiction?: string): PilotFrameworkAvailability;
export declare function getGapAnalysisPilotAvailability(): GapAnalysisPilotAvailability;
export declare const GAP_ANALYSIS_PROCESSING_ACK_VERSION = "2026-10-01";
export declare const GAP_ANALYSIS_PROCESSING_ACK_TEXT = "I understand that my document may be processed using AI services hosted outside my home jurisdiction, in accordance with SheriaBot's Privacy Policy and applicable data-protection law.";
export declare const GAP_ANALYSIS_STORAGE_PATH_PREFIX = "gap-analysis/";
export type GapAnalysisLifecycleState = 'ACTIVE' | 'PENDING_DELETION' | 'DELETED';
