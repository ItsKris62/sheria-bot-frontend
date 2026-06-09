/**
 * Compliance Module
 * Main module orchestrating all compliance operations
 *
 * Operations:
 * - RAG-powered compliance queries
 * - Compliance scoring and history
 * - Gap analysis and roadmap generation
 * - Requirement tracking
 * - Risk assessment
 * - Regulatory updates subscription
 */
import { Prisma } from '@prisma/client';
import type { GeneratedChecklist } from '@/lib/ai/prompts/checklist-generation';
import type { BenchmarkDocumentSummary, GapAnalysisResult } from '@/lib/ai/prompts/gap-analysis';
import { type ComplianceQueryParams, type ComplianceQueryResult, type QuickCheckResult, type QueryFilters, type PaginatedQueries, type ComplianceScore, type ScoreHistory, type ComplianceGap, type ComplianceRoadmap, type Requirement, type RequirementParams, type RequirementStatus, type RequirementFilters, type Evidence, type UpcomingDeadline, type RiskScenario, type RiskAssessment, type RiskReport, type RegulatoryUpdate, type UpdateSubscription, type RegulatoryArea } from './compliance.types';
interface GapAnalysisPipelineParams {
    analysisId: string;
    userId: string;
    trialUserId?: string;
    fileName: string;
    fileContent: string;
    fileType: string;
    regulatoryFrameworks: string[];
    regulatoryFrameworkSlugs?: string[];
    benchmarkDocumentIds?: string[];
    benchmarkDocuments?: BenchmarkDocumentSummary[];
    analysisDepth: 'quick' | 'standard' | 'deep';
    focusAreas?: string[];
    ipAddress?: string;
    userAgent?: string;
}
/**
 * Background gap analysis pipeline.
 * Runs after the HTTP response is sent. Manages its own lifecycle via DB status
 * updates. The top-level try/catch guarantees FAILED is set on any unhandled error.
 */
export declare function executeGapAnalysisPipeline(params: GapAnalysisPipelineParams): Promise<void>;
/**
 * Compliance Module Class
 * Central orchestrator for all compliance-related business logic
 */
declare class ComplianceModule {
    constructor();
    /**
     * Submit a compliance query
     * Uses RAG to search regulatory documents and AI to generate answer
     */
    submitQuery(userId: string, params: ComplianceQueryParams): Promise<ComplianceQueryResult>;
    /**
     * Submit a follow-up query
     */
    submitFollowUp(userId: string, originalQueryId: string, followUp: string): Promise<ComplianceQueryResult>;
    /**
     * Quick compliance check for a scenario
     */
    quickCheck(userId: string, scenario: string, areas?: RegulatoryArea[]): Promise<QuickCheckResult>;
    /**
     * Build personalised suggested queries for the active user.
     *
     * Signal priority (graceful degradation):
     * 1. Organization.industry -> curated template match
     * 2. User's recent query regulatory areas (last ~20)
     * 3. Most recent active RegulatoryAlert
     * 4. Cohort popular templates (same organizationType, >=5 distinct orgs, 30d)
     * 5. Curated baseline (DEFAULT_SUGGESTIONS)
     *
     * Always returns exactly 5 suggestions. Cached in Redis for 1 hour.
     */
    buildSuggestedQueries(userId: string, organizationId: string): Promise<Array<{
        id: string;
        text: string;
        reason: 'industry' | 'history' | 'alert' | 'cohort' | 'curated';
        relatedArea?: string;
    }>>;
    /**
     * Get query history for a user
     */
    getQueryHistory(userId: string, filters?: QueryFilters): Promise<PaginatedQueries>;
    /**
     * Calculate compliance score for an organization
     */
    calculateComplianceScore(userId: string, orgId: string): Promise<ComplianceScore>;
    /**
     * Get compliance score history
     */
    getComplianceScoreHistory(userId: string, orgId: string, days?: number): Promise<ScoreHistory[]>;
    /**
     * Get improvement recommendations
     */
    getRecommendations(userId: string, orgId: string): Promise<string[]>;
    /**
     * Analyze compliance gaps
     */
    analyzeComplianceGaps(userId: string, orgId: string, requiredAreas?: RegulatoryArea[]): Promise<ComplianceGap[]>;
    /**
     * Generate compliance roadmap
     */
    generateRoadmap(userId: string, orgId: string): Promise<ComplianceRoadmap>;
    /**
     * Estimate time to compliance
     */
    estimateTimeToCompliance(userId: string, orgId: string): Promise<{
        estimatedDays: number;
        estimatedWeeks: number;
        confidence: 'HIGH' | 'MEDIUM' | 'LOW';
        factors: string[];
    }>;
    /**
     * Create a requirement
     */
    trackRequirement(userId: string, orgId: string, params: RequirementParams): Promise<Requirement>;
    /**
     * Update requirement status
     */
    updateRequirementStatus(userId: string, requirementId: string, status: RequirementStatus, notes?: string): Promise<Requirement>;
    /**
     * Get requirements for an organization
     */
    getRequirements(userId: string, orgId: string, filters?: RequirementFilters): Promise<{
        requirements: Requirement[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    /**
     * Check upcoming deadlines
     */
    checkDeadlines(userId: string, orgId: string, daysAhead?: number): Promise<UpcomingDeadline[]>;
    /**
     * Track requirement completion with evidence
     */
    trackCompletion(userId: string, requirementId: string, evidence: Omit<Evidence, 'id' | 'uploadedBy' | 'uploadedAt'>): Promise<Requirement>;
    /**
     * Generate compliance certificate
     */
    generateCertificate(userId: string, orgId: string, area: RegulatoryArea): Promise<{
        certificateId: string;
        downloadUrl: string;
        validUntil: Date;
    }>;
    /**
     * Assess risk for a scenario
     */
    assessRisk(userId: string, orgId: string, scenario: RiskScenario): Promise<RiskAssessment>;
    /**
     * Generate risk report
     */
    generateRiskReport(userId: string, orgId: string, periodDays?: number): Promise<RiskReport>;
    /**
     * Get regulatory updates
     */
    getRegulatorUpdates(area: RegulatoryArea, limit?: number): Promise<RegulatoryUpdate[]>;
    /**
     * Subscribe to regulatory updates
     */
    subscribeToUpdates(userId: string, params: {
        areas: RegulatoryArea[];
        frequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY';
        emailEnabled: boolean;
        inAppEnabled: boolean;
    }): Promise<UpdateSubscription>;
    /**
     * Notify users of regulatory changes
     */
    notifyRegulatorChanges(update: RegulatoryUpdate): Promise<void>;
    /**
     * Check query rate limit
     */
    private checkQueryRateLimit;
    /**
     * Check quick check rate limit
     */
    private checkQuickCheckRateLimit;
    /**
     * Record query usage
     */
    private recordQueryUsage;
    /**
     * Record quick check usage
     */
    private recordQuickCheckUsage;
    /**
     * Get cache key for query
     */
    private getQueryCacheKey;
    /**
     * Build context from RAG results
     */
    private buildQueryContext;
    /**
     * Extract citations from RAG results
     */
    private extractCitationsFromRag;
    /**
     * Detect regulatory areas from response
     */
    private detectRegulatoryAreas;
    /**
     * Verify user holds an active OrganizationMember row for the given org.
     * Returns the membership row so callers can inspect the role if needed.
     */
    private verifyOrgAccess;
    /**
     * Get organization type
     */
    private getOrgType;
    /**
     * Build risk summary from assessments
     */
    private buildRiskSummary;
    /**
     * Build risk trend analysis
     */
    private buildRiskTrendAnalysis;
    /**
     * Generate risk recommendations
     */
    private generateRiskRecommendations;
    /**
     * Safely narrow a Prisma JsonValue (stored as JSON in the DB) to string[].
     * Returns an empty array for any non-array or mixed-type value so callers
     * always get a clean string[] without unsafe casts.
     */
    private narrowJsonStringArray;
    /**
     * Generate an AI+RAG compliance checklist for a fintech.
     * Saves result to DB; returns the full checklist record.
     */
    generateChecklist(userId: string, params: {
        productType: string;
        businessStage: string;
        targetSegments: string[];
        servicesOffered: string[];
        additionalConcerns?: string;
        organizationId: string;
    }): Promise<{
        id: string;
        title: string;
        status: string;
        checklistData: GeneratedChecklist;
        itemProgress: Record<string, string>;
        progress: number;
        createdAt: Date;
    }>;
    /**
     * List all checklists for a user within an organization.
     * Includes legacy null-org rows owned by this user (KNOWN_ISSUES B5).
     */
    getUserChecklists(userId: string, organizationId: string): Promise<{
        id: string;
        title: string;
        productType: string | null;
        businessStage: string | null;
        targetSegments: unknown;
        servicesOffered: unknown;
        additionalConcerns: string | null;
        progress: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        totalItems: number;
        criticalItems: number;
    }[]>;
    /**
     * Get a single checklist by ID.
     * Org-scoped: org records require active membership; legacy null-org records remain owner-only.
     */
    getChecklist(userId: string, checklistId: string, organizationId: string): Promise<{
        id: string;
        title: string;
        productType: string | null;
        businessStage: string | null;
        targetSegments: unknown;
        servicesOffered: unknown;
        additionalConcerns: string | null;
        checklistData: GeneratedChecklist | null;
        itemProgress: Record<string, string>;
        progress: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Update the per-item progress states and recalculate overall progress %.
     */
    updateChecklistProgress(userId: string, checklistId: string, itemProgress: Record<string, string>): Promise<{
        progress: number;
        itemProgress: Record<string, string>;
    }>;
    /**
     * Soft-delete a checklist (sets deletedAt timestamp; record is NOT destroyed).
     * Org-scoped: owner within the org can delete; legacy null-org records remain owner-only.
     */
    deleteChecklist(userId: string, checklistId: string, organizationId: string): Promise<void>;
    /**
     * Run a gap analysis  -  Part A (synchronous, within the HTTP request).
     *
     * Validates inputs, creates the DB record, uploads the file to R2, then
     * fires the background pipeline (Part B) as a non-blocking Promise and
     * returns immediately with { id, status: 'QUEUED', progress: 5 }.
     *
     * The heavy lifting (text extraction, RAG, AI analysis, DB save) happens in
     * executeGapAnalysisPipeline() which runs after the HTTP response is sent.
     */
    runGapAnalysis(userId: string, params: {
        fileName: string;
        fileType: string;
        fileContent: string;
        regulatoryFrameworks: string[];
        regulatoryFrameworkSlugs?: string[];
        benchmarkDocumentIds?: string[];
        benchmarkDocuments?: BenchmarkDocumentSummary[];
        analysisDepth: 'quick' | 'standard' | 'deep';
        focusAreas?: string[];
        organizationId?: string;
        ipAddress?: string;
        userAgent?: string;
        trialUserId?: string;
    }): Promise<{
        id: string;
        status: string;
        progress: number;
    }>;
    /**
     * List all gap analyses for a user (summary list).
     * Triggers stale job recovery lazily before returning results.
     */
    getUserGapAnalyses(userId: string): Promise<{
        id: string;
        documentName: string;
        documentType: string;
        regulatoryFrameworks: Prisma.JsonValue;
        analysisDepth: string;
        overallScore: number | null;
        status: string;
        progress: number;
        errorMessage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    /**
     * Get a single gap analysis result by ID.
     */
    getGapAnalysisResult(userId: string, analysisId: string, opts?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        id: string;
        documentName: string;
        documentType: string;
        documentUrl: string;
        regulatoryFrameworks: Prisma.JsonValue;
        analysisDepth: string;
        focusAreas: Prisma.JsonValue | null;
        results: GapAnalysisResult | null;
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
    }>;
    /**
     * Delete a gap analysis record (and R2 file).
     */
    deleteGapAnalysis(userId: string, analysisId: string, opts?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<void>;
    /**
     * Compliance Score cache.
     * Key:   compliance:score:{orgId}
     * Value: full DashboardResponse (JSON, auto-parsed by Upstash SDK)
     * TTL:   300s (5 min -- matches frontend React Query staleTime)
     * Invalidated by:
     *   - updateChecklistItem (item toggle)
     *   - Snapshot creation (score change detected on dashboard read)
     */
    private static readonly SCORE_CACHE_KEY;
    private static readonly SCORE_CACHE_TTL;
    private static readonly DASHBOARD_WEIGHTS;
    private static readonly CATEGORY_LABELS;
    private static readonly DEFAULT_CHECKLIST_ITEMS;
    /**
     * Seed default checklist items for an organization (idempotent  -  skips if items already exist)
     */
    seedDefaultChecklist(orgId: string): Promise<void>;
    /**
     * Calculate score for a single compliance category.
     * Returns scoreFloat (unrounded, 0-100) for use in the weighted sum, plus
     * the integer display score and item counts. No rounding inside this function --
     * the single Math.round lives in getComplianceDashboardData (fixes F-05).
     */
    calculateCategoryScore(orgId: string, category: import('@prisma/client').ComplianceCategory): Promise<{
        scoreFloat: number;
        score: number;
        completedItems: number;
        totalItems: number;
    }>;
    /**
     * Get full compliance dashboard data for an organization.
     * Fixes:
     *   F-04 -- trend semantics (pts vs 30d, not %, not calendar month)
     *   F-05 -- single rounding: floats used in weighted sum; round only at the end
     *   F-06 -- no fallback to latestSnapshot (masked progress for new orgs)
     *   F-10 -- lastUpdated reflects actual data freshness
     */
    getComplianceDashboardData(orgId: string): Promise<{
        overallScore: number;
        trend: {
            points: number | null;
            label: 'increase' | 'decrease' | 'no_change' | 'insufficient_history';
            comparedAt: string | null;
            windowDays: 30;
        };
        categories: Array<{
            key: string;
            label: string;
            score: number;
            completedItems: number;
            totalItems: number;
        }>;
        lastUpdated: string;
    }>;
    /**
     * Update a single compliance checklist item
     */
    updateChecklistItem(userId: string, orgId: string, itemId: string, isCompleted: boolean): Promise<{
        id: string;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    /**
     * Get all checklist items for a compliance category
     */
    getChecklistByCategory(userId: string, orgId: string, category: import('@prisma/client').ComplianceCategory): Promise<Array<{
        id: string;
        category: string;
        title: string;
        description: string;
        isCompleted: boolean;
        completedAt: Date | null;
        updatedAt: Date;
    }>>;
}
export declare const complianceModule: ComplianceModule;
export { ComplianceModule };
//# sourceMappingURL=compliance.module.d.ts.map