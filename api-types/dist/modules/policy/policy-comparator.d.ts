/**
 * Policy Comparator
 * Handles comparison between policies and coverage analysis
 */
import { type PolicyWithDetails, type ComparisonResult, type SimilarityItem, type DifferenceItem, type CoverageAnalysis, type RegulatoryArea } from './policy.types';
/**
 * Policy Comparator Class
 * Analyzes and compares multiple policies
 */
export declare class PolicyComparator {
    /**
     * Compare multiple policies
     */
    compare(policies: PolicyWithDetails[]): Promise<ComparisonResult>;
    /**
     * Compare two policies in detail
     */
    compareTwoPolicies(policyA: PolicyWithDetails, policyB: PolicyWithDetails): Promise<{
        summary: string;
        similarities: SimilarityItem[];
        differences: DifferenceItem[];
        recommendation: string;
    }>;
    /**
     * Analyze regulatory coverage across policies
     */
    analyzeCoverage(policies: PolicyWithDetails[]): CoverageAnalysis;
    /**
     * Analyze single policy coverage against required areas
     */
    analyzePolicyCoverage(policy: PolicyWithDetails, requiredAreas: RegulatoryArea[]): CoverageAnalysis;
    /**
     * Create policy summary for comparison
     */
    private createPolicySummary;
    /**
     * Find similarities between policies
     */
    private findSimilarities;
    /**
     * Find differences between policies
     */
    private findDifferences;
    /**
     * Generate recommendations based on comparison
     */
    private generateRecommendations;
    /**
     * Get AI-generated recommendation
     */
    private getAIRecommendation;
    /**
     * Generate comparison summary
     */
    private generateComparisonSummary;
    /**
     * Generate recommendation for policy pair
     */
    private generatePairRecommendation;
    /**
     * Calculate text similarity (simple Jaccard similarity)
     */
    private calculateSimilarity;
    /**
     * Get importance level for regulatory area
     */
    private getAreaImportance;
    /**
     * Truncate text
     */
    private truncate;
}
export declare const policyComparator: PolicyComparator;
//# sourceMappingURL=policy-comparator.d.ts.map