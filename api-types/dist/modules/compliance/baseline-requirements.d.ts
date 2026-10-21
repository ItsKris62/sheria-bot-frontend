import { ComplianceCategory } from '@prisma/client';
export interface BaselineRequirementDefinition {
    requirementKey: string;
    jurisdictionCode: string;
    category: ComplianceCategory;
    title: string;
    description: string;
}
export declare const KENYA_BASELINE_REQUIREMENTS: readonly BaselineRequirementDefinition[];
export declare const CATEGORY_WEIGHTS: Record<ComplianceCategory, number>;
export declare const CATEGORY_LABELS: Record<ComplianceCategory, string>;
export declare function getBaselineRequirementsForJurisdiction(jurisdictionCode: string): readonly BaselineRequirementDefinition[];
export declare function findKenyaBaselineByKey(key: string): BaselineRequirementDefinition | undefined;
export declare function findKenyaBaselineByTitleAndCategory(title: string, category: ComplianceCategory): BaselineRequirementDefinition | undefined;
//# sourceMappingURL=baseline-requirements.d.ts.map