/**
 * Policy Module
 * Main module orchestrating all policy operations
 *
 * Operations:
 * - CRUD operations for policies
 * - AI-powered policy generation
 * - Export to PDF/DOCX/JSON/Markdown
 * - Policy comparison and coverage analysis
 * - Citation management
 * - Versioning
 */
import { type Policy, type PolicyWithDetails, type Citation, type PolicyVersion, type PolicyGenerationParams, type PolicyGenerationResult, type PolicyRefinementParams, type GenerationProgress, type ExportFormat, type ExportResult, type ExportOptions, type ComparisonResult, type ComplianceAnalysis, type PolicyFilters, type PaginatedPolicies, type RegulatoryArea } from './policy.types';
/**
 * Policy Module Class
 * Central orchestrator for all policy-related business logic
 */
declare class PolicyModule {
    private readonly appUrl;
    constructor();
    /**
     * Get policy by ID
     */
    getPolicy(userId: string, policyId: string): Promise<PolicyWithDetails>;
    /**
     * List policies with filters
     */
    listPolicies(userId: string, filters?: PolicyFilters): Promise<PaginatedPolicies>;
    /**
     * Update policy
     */
    updatePolicy(userId: string, policyId: string, updates: {
        title?: string;
        description?: string;
        content?: string;
        regulatoryAreas?: RegulatoryArea[];
    }): Promise<Policy>;
    /**
     * Delete policy (soft delete)
     */
    deletePolicy(userId: string, policyId: string): Promise<boolean>;
    /**
     * Publish policy
     */
    publishPolicy(userId: string, policyId: string): Promise<Policy>;
    /**
     * Generate a new policy using AI
     */
    generatePolicy(userId: string, params: PolicyGenerationParams): Promise<PolicyGenerationResult>;
    /**
     * Process generation in background
     */
    private processGeneration;
    /**
     * Refine existing policy with new instructions
     */
    refinePolicy(userId: string, policyId: string, params: PolicyRefinementParams): Promise<Policy>;
    /**
     * Get generation progress
     */
    getGenerationProgress(policyId: string): Promise<GenerationProgress | null>;
    /**
     * Export policy to specified format
     */
    exportPolicy(userId: string, policyId: string, format: ExportFormat, options?: ExportOptions): Promise<ExportResult>;
    /**
     * Compare multiple policies
     */
    comparePolicies(userId: string, policyIds: string[]): Promise<ComparisonResult>;
    /**
     * Analyze policy compliance coverage
     */
    analyzeCompliance(userId: string, policyId: string, requiredAreas?: RegulatoryArea[]): Promise<ComplianceAnalysis>;
    /**
     * Get citations for a policy
     */
    getCitations(userId: string, policyId: string): Promise<Citation[]>;
    /**
     * Verify citations for a policy
     */
    verifyCitations(userId: string, policyId: string): Promise<{
        verified: number;
        failed: number;
        citations: Citation[];
    }>;
    /**
     * Get policy versions
     */
    getVersions(userId: string, policyId: string): Promise<PolicyVersion[]>;
    /**
     * Restore policy to a previous version
     */
    restoreVersion(userId: string, policyId: string, versionId: string): Promise<Policy>;
    /**
     * Check if user has access to policy
     */
    private checkAccess;
    /**
     * Check generation rate limit
     */
    private checkGenerationRateLimit;
    /**
     * Record generation attempt for rate limiting
     */
    private recordGenerationAttempt;
    /**
     * Create a policy version
     */
    private createVersion;
    /**
     * Invalidate policy cache
     */
    private invalidatePolicyCache;
}
export declare const policyModule: PolicyModule;
export { PolicyModule };
//# sourceMappingURL=policy.module.d.ts.map