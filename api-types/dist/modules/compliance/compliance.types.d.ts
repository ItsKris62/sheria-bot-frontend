/**
 * Compliance Module Types
 * Type definitions for compliance queries, scoring, tracking, and risk assessment
 */
/**
 * Regulatory areas for Kenya fintech compliance
 */
export type RegulatoryArea = 'CBK' | 'CMA' | 'IRA' | 'SASRA' | 'DPA' | 'AML' | 'CFT' | 'CONSUMER_PROTECTION' | 'CYBERSECURITY' | 'E_MONEY' | 'PAYMENT_SYSTEMS' | 'CREDIT_REFERENCE' | 'MICROFINANCE' | 'DIGITAL_LENDING';
/**
 * Regulatory area display names
 */
export declare const REGULATORY_AREA_NAMES: Record<RegulatoryArea, string>;
/**
 * Compliance query parameters
 */
export interface ComplianceQueryParams {
    query: string;
    regulatoryAreas?: RegulatoryArea[];
    context?: string;
    organizationId?: string;
    includeRecommendations?: boolean;
}
/**
 * Compliance query result
 */
export interface ComplianceQueryResult {
    id: string;
    query: string;
    answer: string;
    citations: QueryCitation[];
    regulatoryAreas: RegulatoryArea[];
    confidence: number;
    recommendations?: string[];
    relatedQueries?: string[];
    processingTimeMs: number;
    createdAt: Date;
}
/**
 * Citation from regulatory source
 */
export interface QueryCitation {
    id: string;
    source: string;
    title: string;
    section: string;
    content: string;
    url?: string;
    relevanceScore: number;
    regulatoryArea: RegulatoryArea;
}
/**
 * Quick check result (simplified compliance check)
 */
export interface QuickCheckResult {
    isCompliant: boolean;
    riskLevel: RiskLevel;
    summary: string;
    keyPoints: string[];
    areasOfConcern: string[];
    nextSteps: string[];
}
/**
 * Query filters
 */
export interface QueryFilters {
    regulatoryArea?: RegulatoryArea;
    startDate?: Date;
    endDate?: Date;
    searchTerm?: string;
    page?: number;
    limit?: number;
}
/**
 * Paginated queries result
 */
export interface PaginatedQueries {
    queries: ComplianceQueryResult[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
}
/**
 * Overall compliance score
 */
export interface ComplianceScore {
    overallScore: number;
    grade: ComplianceGrade;
    areaScores: AreaScore[];
    trend: ComplianceTrend;
    lastUpdated: Date;
    nextReviewDate: Date;
}
/**
 * Compliance grade
 */
export type ComplianceGrade = 'A' | 'B' | 'C' | 'D' | 'F';
/**
 * Score by regulatory area
 */
export interface AreaScore {
    area: RegulatoryArea;
    areaName: string;
    score: number;
    weight: number;
    completedRequirements: number;
    totalRequirements: number;
    status: AreaStatus;
}
/**
 * Area compliance status
 */
export type AreaStatus = 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT' | 'NOT_APPLICABLE';
/**
 * Compliance trend
 */
export interface ComplianceTrend {
    direction: 'IMPROVING' | 'STABLE' | 'DECLINING';
    changePercent: number;
    periodDays: number;
    previousScore: number;
}
/**
 * Score history entry
 */
export interface ScoreHistory {
    date: Date;
    score: number;
    grade: ComplianceGrade;
    areaScores: Record<RegulatoryArea, number>;
}
/**
 * Compliance gap
 */
export interface ComplianceGap {
    id: string;
    area: RegulatoryArea;
    areaName: string;
    requirement: string;
    description: string;
    severity: GapSeverity;
    priority: GapPriority;
    estimatedEffort: EffortEstimate;
    recommendation: string;
    resources?: string[];
    deadline?: Date;
}
/**
 * Gap severity
 */
export type GapSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
/**
 * Gap priority
 */
export type GapPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
/**
 * Effort estimate
 */
export interface EffortEstimate {
    timeframe: string;
    complexity: 'LOW' | 'MEDIUM' | 'HIGH';
    resourcesNeeded: string[];
    estimatedCost?: CostRange;
}
/**
 * Cost range
 */
export interface CostRange {
    min: number;
    max: number;
    currency: string;
}
/**
 * Compliance roadmap
 */
export interface ComplianceRoadmap {
    currentState: RoadmapState;
    targetState: RoadmapState;
    phases: RoadmapPhase[];
    totalDuration: string;
    totalEstimatedCost: CostRange;
    criticalPath: string[];
}
/**
 * Roadmap state
 */
export interface RoadmapState {
    score: number;
    grade: ComplianceGrade;
    compliantAreas: RegulatoryArea[];
    nonCompliantAreas: RegulatoryArea[];
}
/**
 * Roadmap phase
 */
export interface RoadmapPhase {
    phase: number;
    name: string;
    duration: string;
    startDate?: Date;
    endDate?: Date;
    objectives: string[];
    requirements: string[];
    deliverables: string[];
    estimatedCost: CostRange;
}
/**
 * Compliance requirement
 */
export interface Requirement {
    id: string;
    organizationId: string;
    area: RegulatoryArea;
    title: string;
    description: string;
    status: RequirementStatus;
    priority: GapPriority;
    dueDate: Date | null;
    completedAt: Date | null;
    assignedTo: string | null;
    evidence: Evidence[];
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Requirement status
 */
export type RequirementStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED' | 'OVERDUE' | 'NOT_APPLICABLE';
/**
 * Requirement input params
 */
export interface RequirementParams {
    area: RegulatoryArea;
    title: string;
    description: string;
    priority?: GapPriority;
    dueDate?: Date;
    assignedTo?: string;
    notes?: string;
}
/**
 * Requirement filters
 */
export interface RequirementFilters {
    area?: RegulatoryArea;
    status?: RequirementStatus;
    priority?: GapPriority;
    assignedTo?: string;
    overdue?: boolean;
    page?: number;
    limit?: number;
}
/**
 * Evidence for requirement completion
 */
export interface Evidence {
    id: string;
    type: EvidenceType;
    title: string;
    description: string;
    documentId?: string;
    url?: string;
    uploadedBy: string;
    uploadedAt: Date;
}
/**
 * Evidence type
 */
export type EvidenceType = 'DOCUMENT' | 'POLICY' | 'CERTIFICATE' | 'AUDIT_REPORT' | 'SCREENSHOT' | 'EXTERNAL_LINK' | 'OTHER';
/**
 * Upcoming deadline
 */
export interface UpcomingDeadline {
    requirementId: string;
    title: string;
    area: RegulatoryArea;
    dueDate: Date;
    daysRemaining: number;
    status: RequirementStatus;
    priority: GapPriority;
    assignedTo: string | null;
}
/**
 * Risk level
 */
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL';
/**
 * Risk scenario for assessment
 */
export interface RiskScenario {
    title: string;
    description: string;
    regulatoryAreas: RegulatoryArea[];
    businessContext?: string;
    proposedActions?: string[];
}
/**
 * Risk assessment result
 */
export interface RiskAssessment {
    id: string;
    scenario: RiskScenario;
    overallRisk: RiskLevel;
    riskScore: number;
    risks: IdentifiedRisk[];
    mitigationStrategies: MitigationStrategy[];
    recommendations: string[];
    requiresApproval: boolean;
    assessedAt: Date;
    assessedBy: string;
}
/**
 * Identified risk
 */
export interface IdentifiedRisk {
    id: string;
    title: string;
    description: string;
    area: RegulatoryArea;
    level: RiskLevel;
    likelihood: 'CERTAIN' | 'LIKELY' | 'POSSIBLE' | 'UNLIKELY' | 'RARE';
    impact: 'CATASTROPHIC' | 'MAJOR' | 'MODERATE' | 'MINOR' | 'INSIGNIFICANT';
    potentialConsequences: string[];
}
/**
 * Mitigation strategy
 */
export interface MitigationStrategy {
    riskId: string;
    strategy: string;
    actions: string[];
    timeline: string;
    resourcesRequired: string[];
    effectiveness: 'HIGH' | 'MEDIUM' | 'LOW';
}
/**
 * Risk report
 */
export interface RiskReport {
    organizationId: string;
    generatedAt: Date;
    period: {
        start: Date;
        end: Date;
    };
    summary: RiskSummary;
    assessments: RiskAssessment[];
    trendAnalysis: RiskTrendAnalysis;
    recommendations: string[];
    downloadUrl?: string;
}
/**
 * Risk summary
 */
export interface RiskSummary {
    totalRisks: number;
    byLevel: Record<RiskLevel, number>;
    byArea: Record<RegulatoryArea, number>;
    mitigatedCount: number;
    openCount: number;
}
/**
 * Risk trend analysis
 */
export interface RiskTrendAnalysis {
    trend: 'IMPROVING' | 'STABLE' | 'WORSENING';
    newRisks: number;
    resolvedRisks: number;
    escalatedRisks: number;
}
/**
 * Regulatory update
 */
export interface RegulatoryUpdate {
    id: string;
    area: RegulatoryArea;
    title: string;
    summary: string;
    content: string;
    source: string;
    sourceUrl?: string;
    effectiveDate: Date;
    publishedAt: Date;
    impact: UpdateImpact;
    actionRequired: boolean;
    actions?: string[];
}
/**
 * Update impact level
 */
export type UpdateImpact = 'HIGH' | 'MEDIUM' | 'LOW';
/**
 * Update subscription
 */
export interface UpdateSubscription {
    id: string;
    userId: string;
    areas: RegulatoryArea[];
    frequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY';
    emailEnabled: boolean;
    inAppEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ComplianceError extends Error {
    code: ComplianceErrorCode;
    statusCode: number;
    constructor(message: string, code: ComplianceErrorCode, statusCode?: number);
}
export type ComplianceErrorCode = 'QUERY_FAILED' | 'QUERY_NOT_FOUND' | 'RATE_LIMIT_EXCEEDED' | 'INVALID_AREA' | 'REQUIREMENT_NOT_FOUND' | 'SCORE_CALCULATION_FAILED' | 'RISK_ASSESSMENT_FAILED' | 'UNAUTHORIZED' | 'ORGANIZATION_NOT_FOUND' | 'EXPORT_FAILED';
export declare const COMPLIANCE_CONSTANTS: {
    readonly MAX_QUERIES_PER_HOUR: 50;
    readonly MAX_QUICK_CHECKS_PER_HOUR: 100;
    readonly QUERY_CACHE_TTL: number;
    readonly SCORE_CACHE_TTL: number;
    readonly REQUIREMENTS_CACHE_TTL: number;
    readonly GRADE_THRESHOLDS: {
        readonly A: 90;
        readonly B: 80;
        readonly C: 70;
        readonly D: 60;
        readonly F: 0;
    };
    readonly REMINDER_DAYS: readonly [30, 14, 7, 3, 1];
    readonly RISK_THRESHOLDS: {
        readonly CRITICAL: 90;
        readonly HIGH: 70;
        readonly MEDIUM: 50;
        readonly LOW: 30;
        readonly MINIMAL: 0;
    };
    readonly CERTIFICATE_VALIDITY_DAYS: 90;
    readonly REDIS_KEYS: {
        readonly QUERY_RATE: "compliance:query_rate:";
        readonly QUICK_CHECK_RATE: "compliance:quick_check_rate:";
        readonly SCORE: "compliance:score:";
        readonly REQUIREMENTS: "compliance:requirements:";
        readonly DEADLINES: "compliance:deadlines:";
        readonly SUBSCRIPTION: "compliance:subscription:";
    };
    readonly DEFAULT_PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
};
/**
 * Get grade from score
 */
export declare function getGradeFromScore(score: number): ComplianceGrade;
/**
 * Get risk level from score
 */
export declare function getRiskLevelFromScore(score: number): RiskLevel;
//# sourceMappingURL=compliance.types.d.ts.map