import { ComplianceCategory } from '@prisma/client';
export type DashboardAvailabilityStatus = 'READY' | 'BASELINE_UNAVAILABLE' | 'JURISDICTION_NOT_ENTITLED' | 'JURISDICTION_NOT_CONFIGURED' | 'JURISDICTION_UNSUPPORTED';
export type DashboardAssessmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ASSESSED';
export type ComplianceRiskBand = 'CRITICAL' | 'POOR' | 'MODERATE' | 'GOOD' | 'EXCELLENT';
export interface RequirementItemDTO {
    id: string;
    requirementKey: string;
    jurisdictionCode: string;
    category: ComplianceCategory;
    title: string;
    description: string;
    reviewStatus: 'NOT_REVIEWED' | 'MEETS_REQUIREMENT' | 'DOES_NOT_MEET_REQUIREMENT';
    isCompleted: boolean;
    assessedAt: string | null;
    updatedAt: string;
}
export interface CategoryPostureDTO {
    category: ComplianceCategory;
    categoryName: string;
    weight: number;
    totalItems: number;
    assessedItems: number;
    compliantItems: number;
    coveragePercent: number;
    score: number | null;
    reviewStatus: 'NOT_REVIEWED' | 'IN_PROGRESS' | 'COMPLETED';
}
export interface ActiveDashboardData {
    jurisdictionCode: string;
    jurisdictionName: string;
    assessmentStatus: DashboardAssessmentStatus;
    scoreType: 'PROVISIONAL' | 'FINAL' | null;
    overallScore: number | null;
    riskBand: ComplianceRiskBand | null;
    coveragePercent: number;
    totalRequirements: number;
    assessedRequirements: number;
    compliantRequirements: number;
    categories: CategoryPostureDTO[];
    requirements: RequirementItemDTO[];
    trend: {
        direction: 'UP' | 'DOWN' | 'STABLE' | 'NONE';
        delta: number | null;
        historicalScores: Array<{
            calculatedAt: string;
            overallScore: number;
        }>;
    };
}
export interface InactiveDashboardData {
    jurisdictionCode: string | null;
    reasonCode: Exclude<DashboardAvailabilityStatus, 'READY'>;
    message: string;
    entitlement: {
        maxEnabledCountries: number;
        enabledCount: number;
        enabledJurisdictions: string[];
    };
}
export type ComplianceDashboardV2Response = {
    availabilityStatus: 'READY';
    context: {
        selectedJurisdiction: string;
        homeJurisdiction: string;
        enabledJurisdictions: string[];
        maxEnabledCountries: number;
    };
    dashboard: ActiveDashboardData;
} | {
    availabilityStatus: Exclude<DashboardAvailabilityStatus, 'READY'>;
    context: {
        selectedJurisdiction: string | null;
        homeJurisdiction: string | null;
        enabledJurisdictions: string[];
        maxEnabledCountries: number;
    };
    dashboard: InactiveDashboardData;
};
export declare class ComplianceV2Service {
    private static readonly V2_CACHE_TTL;
    private static v2CacheKey;
    invalidateCache(orgId: string, jurisdiction: string): Promise<void>;
    /**
     * Safe, idempotent baseline seeder for canonical requirements.
     * Never deletes records. Uses skipDuplicates to guarantee concurrency safety.
     */
    seedJurisdictionBaseline(orgId: string, jurisdictionCode: string): Promise<void>;
    /**
     * Retrieve full V2 compliance dashboard data.
     */
    getComplianceDashboardV2(orgId: string, requestedJurisdiction?: string): Promise<ComplianceDashboardV2Response>;
    /**
     * Assess a single dashboard requirement item with strict tenant and jurisdiction validation.
     */
    assessDashboardItem(orgId: string, itemId: string, status: 'NOT_REVIEWED' | 'MEETS_REQUIREMENT' | 'DOES_NOT_MEET_REQUIREMENT'): Promise<RequirementItemDTO>;
}
export declare const complianceV2Service: ComplianceV2Service;
//# sourceMappingURL=compliance-dashboard-v2.service.d.ts.map