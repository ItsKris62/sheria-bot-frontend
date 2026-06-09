import { z } from 'zod';
import { FREE_TRIAL_LIMITS } from '@/types/plan.types';
export declare const TrialUsageSchema: z.ZodObject<{
    complianceQueries: z.ZodNumber;
    gapAnalyses: z.ZodNumber;
    checklists: z.ZodNumber;
    vaultUploads: z.ZodNumber;
    totalTokensUsed: z.ZodNumber;
}, z.core.$strip>;
export type TrialUsage = z.infer<typeof TrialUsageSchema>;
export declare const EMPTY_TRIAL_USAGE: TrialUsage;
export interface TrialStatus {
    /** User has never activated a trial. */
    isEligible: boolean;
    /** Trial is currently active (activated and not yet expired). */
    isActive: boolean;
    /** User has activated a trial at some point (whether active or expired). */
    hasUsedTrial: boolean;
    /** When the trial expires. Null if never activated. */
    expiresAt: Date | null;
    /** Calendar days remaining, rounded down. Null if not active. */
    daysRemaining: number | null;
    /** Current usage counters. Null if never activated. */
    usage: TrialUsage | null;
    /** Hard caps for each feature. Always present for UI rendering. */
    limits: typeof FREE_TRIAL_LIMITS;
}
export interface TrialContextState {
    isActive: boolean;
    daysRemaining: number | null;
}
//# sourceMappingURL=trial.types.d.ts.map