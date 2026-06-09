/**
 * Policy Module Types
 * Type definitions for policy generation, management, and analysis
 */
/**
 * Policy status in the lifecycle
 */
export type PolicyStatus = 'DRAFT' | 'GENERATING' | 'COMPLETED' | 'FAILED' | 'PUBLISHED' | 'ARCHIVED';
/**
 * Export format options
 */
export type ExportFormat = 'PDF' | 'DOCX' | 'JSON' | 'MARKDOWN';
/**
 * Regulatory areas in Kenya
 */
export type RegulatoryArea = 'DATA_PROTECTION' | 'AML_CFT' | 'CONSUMER_PROTECTION' | 'CYBERSECURITY' | 'DIGITAL_LENDING' | 'PAYMENT_SERVICES' | 'BANKING' | 'INSURANCE' | 'CAPITAL_MARKETS' | 'MICROFINANCE' | 'SACCO' | 'TAX_COMPLIANCE' | 'CORPORATE_GOVERNANCE' | 'EMPLOYMENT' | 'ENVIRONMENTAL' | 'OTHER';
/**
 * Policy document
 */
export interface Policy {
    id: string;
    title: string;
    description: string | null;
    content: string;
    summary: string | null;
    status: PolicyStatus;
    organizationType: string;
    regulatoryAreas: RegulatoryArea[];
    scenario: string;
    userId: string;
    organizationId: string | null;
    aiModel: string | null;
    tokensUsed: number;
    generationTime: number | null;
    version: number;
    parentVersionId: string | null;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date | null;
}
/**
 * Policy with related data
 */
export interface PolicyWithDetails extends Policy {
    citations: Citation[];
    user: {
        id: string;
        name: string;
        email: string;
    };
    organization: {
        id: string;
        name: string;
    } | null;
    versions: PolicyVersion[];
    commentsCount: number;
}
/**
 * Citation from legal document
 */
export interface Citation {
    id: string;
    policyId: string;
    source: string;
    title: string;
    section: string | null;
    content: string;
    url: string | null;
    confidence: number;
    verified: boolean;
    verifiedAt: Date | null;
    createdAt: Date;
}
/**
 * Policy version for history
 */
export interface PolicyVersion {
    id: string;
    policyId: string;
    version: number;
    title: string;
    content: string;
    changeDescription: string | null;
    createdBy: string;
    createdAt: Date;
}
/**
 * Policy comment
 */
export interface PolicyComment {
    id: string;
    policyId: string;
    userId: string;
    content: string;
    parentId: string | null;
    resolved: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string;
        avatarUrl: string | null;
    };
    replies?: PolicyComment[];
}
/**
 * Parameters for policy generation
 */
export interface PolicyGenerationParams {
    scenario: string;
    organizationType: string;
    regulatoryAreas: RegulatoryArea[];
    additionalContext?: string;
    includeRecommendations?: boolean;
    detailLevel?: 'brief' | 'standard' | 'comprehensive';
    targetAudience?: 'technical' | 'executive' | 'legal';
}
/**
 * Result of policy generation
 */
export interface PolicyGenerationResult {
    policyId: string;
    status: PolicyStatus;
    message: string;
    estimatedTime?: number;
}
/**
 * Generation progress event
 */
export interface GenerationProgress {
    policyId: string;
    stage: GenerationStage;
    progress: number;
    message: string;
    currentSection?: string;
}
/**
 * Generation stages
 */
export type GenerationStage = 'INITIALIZING' | 'SEARCHING_REGULATIONS' | 'ANALYZING_CONTEXT' | 'GENERATING_OUTLINE' | 'GENERATING_SECTIONS' | 'EXTRACTING_CITATIONS' | 'VERIFYING_CITATIONS' | 'FINALIZING' | 'COMPLETED' | 'FAILED';
/**
 * Policy refinement input
 */
export interface PolicyRefinementParams {
    instructions: string;
    focusAreas?: string[];
    preserveSections?: string[];
}
/**
 * AI generation result (internal)
 */
export interface AIGenerationResult {
    content: string;
    title: string;
    summary: string;
    sections: PolicySection[];
    citations: CitationExtract[];
    recommendations: string[];
    tokensUsed: number;
    model: string;
}
/**
 * Policy section
 */
export interface PolicySection {
    id: string;
    title: string;
    content: string;
    order: number;
    level: number;
}
/**
 * Citation extracted from AI response
 */
export interface CitationExtract {
    source: string;
    title: string;
    section: string | null;
    content: string;
    confidence: number;
}
/**
 * Export result
 */
export interface ExportResult {
    success: boolean;
    format: ExportFormat;
    downloadUrl: string;
    expiresAt: Date;
    fileSize: number;
    filename: string;
}
/**
 * Export options
 */
export interface ExportOptions {
    includeMetadata?: boolean;
    includeCitations?: boolean;
    includeVersionHistory?: boolean;
    watermark?: string;
    headerLogo?: string;
    footerText?: string;
}
/**
 * Policy comparison result
 */
export interface ComparisonResult {
    policies: PolicySummary[];
    similarities: SimilarityItem[];
    differences: DifferenceItem[];
    coverage: CoverageAnalysis;
    recommendations: string[];
    generatedAt: Date;
}
/**
 * Policy summary for comparison
 */
export interface PolicySummary {
    id: string;
    title: string;
    regulatoryAreas: RegulatoryArea[];
    sectionCount: number;
    wordCount: number;
    createdAt: Date;
}
/**
 * Similarity between policies
 */
export interface SimilarityItem {
    area: string;
    description: string;
    policies: string[];
    matchPercentage: number;
}
/**
 * Difference between policies
 */
export interface DifferenceItem {
    area: string;
    description: string;
    policyA: {
        id: string;
        content: string;
    } | null;
    policyB: {
        id: string;
        content: string;
    } | null;
    significance: 'low' | 'medium' | 'high';
}
/**
 * Coverage analysis
 */
export interface CoverageAnalysis {
    totalAreas: number;
    coveredAreas: RegulatoryArea[];
    missingAreas: RegulatoryArea[];
    coveragePercentage: number;
    gaps: CoverageGap[];
}
/**
 * Coverage gap
 */
export interface CoverageGap {
    area: RegulatoryArea;
    description: string;
    importance: 'low' | 'medium' | 'high' | 'critical';
    recommendation: string;
}
/**
 * Compliance analysis result
 */
export interface ComplianceAnalysis {
    policyId: string;
    overallScore: number;
    areaScores: AreaComplianceScore[];
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    checklist: ComplianceCheckItem[];
    analyzedAt: Date;
}
/**
 * Per-area compliance score
 */
export interface AreaComplianceScore {
    area: RegulatoryArea;
    score: number;
    status: 'compliant' | 'partial' | 'non-compliant' | 'not-applicable';
    findings: string[];
}
/**
 * Compliance check item
 */
export interface ComplianceCheckItem {
    requirement: string;
    area: RegulatoryArea;
    status: 'passed' | 'failed' | 'warning' | 'not-checked';
    details: string;
    reference: string | null;
}
/**
 * Policy list filters
 */
export interface PolicyFilters {
    status?: PolicyStatus;
    regulatoryAreas?: RegulatoryArea[];
    organizationType?: string;
    search?: string;
    userId?: string;
    organizationId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'title';
    sortOrder?: 'asc' | 'desc';
}
/**
 * Paginated policies result
 */
export interface PaginatedPolicies {
    policies: Policy[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
}
export declare class PolicyError extends Error {
    code: PolicyErrorCode;
    statusCode: number;
    constructor(message: string, code: PolicyErrorCode, statusCode?: number);
}
export type PolicyErrorCode = 'POLICY_NOT_FOUND' | 'GENERATION_FAILED' | 'GENERATION_TIMEOUT' | 'EXPORT_FAILED' | 'INVALID_FORMAT' | 'RATE_LIMIT_EXCEEDED' | 'INSUFFICIENT_PERMISSIONS' | 'POLICY_LOCKED' | 'INVALID_STATUS' | 'CITATION_VERIFICATION_FAILED' | 'COMPARISON_FAILED' | 'INVALID_INPUT';
export declare const POLICY_CONSTANTS: {
    readonly MAX_GENERATIONS_PER_HOUR: 10;
    readonly MAX_REFINEMENTS_PER_DAY: 50;
    readonly MAX_EXPORTS_PER_HOUR: 20;
    readonly GENERATION_TIMEOUT_MS: number;
    readonly EXPORT_TIMEOUT_MS: number;
    readonly MAX_POLICY_SIZE_BYTES: number;
    readonly MAX_TITLE_LENGTH: 200;
    readonly MAX_SCENARIO_LENGTH: 2000;
    readonly MAX_ADDITIONAL_CONTEXT_LENGTH: 5000;
    readonly POLICY_CACHE_TTL: number;
    readonly EXPORT_CACHE_TTL: number;
    readonly EXPORT_EXPIRY_HOURS: 24;
    readonly REDIS_KEYS: {
        readonly POLICY: "policy:";
        readonly GENERATION_PROGRESS: "policy:progress:";
        readonly GENERATION_RATE: "policy:rate:";
        readonly EXPORT_CACHE: "policy:export:";
        readonly CITATIONS: "policy:citations:";
    };
    readonly PUBSUB_CHANNELS: {
        readonly GENERATION_PROGRESS: "policy:generation:progress";
        readonly GENERATION_COMPLETE: "policy:generation:complete";
        readonly GENERATION_FAILED: "policy:generation:failed";
    };
};
/**
 * All regulatory areas for validation
 */
export declare const ALL_REGULATORY_AREAS: RegulatoryArea[];
/**
 * Regulatory area display names
 */
export declare const REGULATORY_AREA_NAMES: Record<RegulatoryArea, string>;
//# sourceMappingURL=policy.types.d.ts.map