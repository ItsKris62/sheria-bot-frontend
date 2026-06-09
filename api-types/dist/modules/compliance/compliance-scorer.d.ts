/**
 * Compliance Scorer
 * Calculates compliance scores based on requirements and regulatory areas
 */
import { type ComplianceScore, type ComplianceTrend, type ScoreHistory, type RegulatoryArea } from './compliance.types';
/**
 * Compliance Scorer Class
 * Handles all score calculation logic
 */
declare class ComplianceScorer {
    /**
     * Calculate overall compliance score for an organization
     */
    calculate(orgId: string): Promise<ComplianceScore>;
    /**
     * Calculate scores by regulatory area
     */
    private calculateAreaScores;
    /**
     * Calculate score for a single area
     */
    private calculateAreaScore;
    /**
     * Get area status based on score
     */
    private getAreaStatus;
    /**
     * Calculate score trend over time
     */
    calculateTrend(orgId: string, periodDays?: number): Promise<ComplianceTrend>;
    /**
     * Score a single regulatory area for an organization
     */
    scoreByArea(orgId: string, area: RegulatoryArea): Promise<number>;
    /**
     * Identify weak areas needing attention
     */
    identifyWeakAreas(orgId: string): Promise<Array<{
        area: RegulatoryArea;
        score: number;
        gap: number;
    }>>;
    /**
     * Generate improvement recommendations based on score
     */
    generateRecommendations(orgId: string): Promise<string[]>;
    /**
     * Get score history for an organization
     */
    getScoreHistory(orgId: string, days?: number): Promise<ScoreHistory[]>;
    /**
     * Save score to history
     */
    private saveScoreHistory;
    /**
     * Invalidate cached score
     */
    invalidateScore(orgId: string): Promise<void>;
}
export declare const complianceScorer: ComplianceScorer;
export { ComplianceScorer };
//# sourceMappingURL=compliance-scorer.d.ts.map