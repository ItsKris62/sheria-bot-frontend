/**
 * Compliance Analyzer
 * Handles gap analysis, requirement analysis, and compliance roadmap generation
 */
import { type ComplianceGap, type ComplianceRoadmap, type RegulatoryArea, type GapPriority } from './compliance.types';
/**
 * Compliance Analyzer Class
 * Handles analysis and roadmap generation
 */
declare class ComplianceAnalyzer {
    /**
     * Identify compliance gaps for an organization
     */
    identifyGaps(orgId: string, requiredAreas?: RegulatoryArea[]): Promise<ComplianceGap[]>;
    /**
     * Analyze requirements for an organization
     */
    analyzeRequirements(orgId: string): Promise<{
        total: number;
        completed: number;
        inProgress: number;
        notStarted: number;
        overdue: number;
        byArea: Record<RegulatoryArea, {
            total: number;
            completed: number;
        }>;
        byPriority: Record<GapPriority, {
            total: number;
            completed: number;
        }>;
        completionRate: number;
    }>;
    /**
     * Generate a compliance roadmap
     */
    generateRoadmap(orgId: string): Promise<ComplianceRoadmap>;
    /**
     * Estimate time to compliance
     */
    estimateTimeToCompliance(orgId: string): Promise<{
        estimatedDays: number;
        estimatedWeeks: number;
        confidence: 'HIGH' | 'MEDIUM' | 'LOW';
        factors: string[];
    }>;
    /**
     * Generate AI-powered gap recommendations
     */
    generateGapRecommendations(gap: ComplianceGap): Promise<string[]>;
    /**
     * Get default regulatory areas for organization type
     */
    private getDefaultAreasForType;
    /**
     * Create a compliance gap from a requirement
     */
    private createGapFromRequirement;
    /**
     * Create a gap for missing regulatory area
     */
    private createMissingAreaGap;
    /**
     * Estimate effort for a gap
     */
    private estimateEffort;
    /**
     * Get resources for a regulatory area
     */
    private getResourcesForArea;
    /**
     * Generate phases from gaps
     */
    private generatePhases;
    /**
     * Sum costs from multiple gaps
     */
    private sumCosts;
    /**
     * Calculate total duration from phases
     */
    private calculateTotalDuration;
    /**
     * Calculate total cost from phases
     */
    private calculateTotalCost;
}
export declare const complianceAnalyzer: ComplianceAnalyzer;
export { ComplianceAnalyzer };
//# sourceMappingURL=compliance-analyzer.d.ts.map