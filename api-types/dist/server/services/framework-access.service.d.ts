import type { EffectivePlan } from '@/types/plan.types';
export declare const FRAMEWORK_TIER_LEVEL: Record<string, number>;
export declare const PLAN_FRAMEWORK_LEVEL: Record<EffectivePlan, number>;
export declare function getFrameworkAccessLevel(plan: EffectivePlan): number;
export declare function canAccessFrameworkTier(plan: EffectivePlan, frameworkTier: string | null | undefined): boolean;
export declare function allowedFrameworkTiersForPlan(plan: EffectivePlan): string[];
//# sourceMappingURL=framework-access.service.d.ts.map