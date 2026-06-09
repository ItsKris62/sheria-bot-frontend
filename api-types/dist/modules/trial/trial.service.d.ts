import { type TrialFeature } from '@/types/plan.types';
import { type TrialStatus, type TrialUsage } from './trial.types';
/** Plan+trial context cache for a user. TTL: 5 minutes. */
export declare const planCtxCacheKey: (userId: string) => string;
/**
 * Activates the free trial for a user.
 *
 * - One-time only. Throws CONFLICT if already used.
 * - Sets freeTrialActivatedAt, freeTrialExpiresAt (now + 7 days), freeTrialUsage.
 * - Invalidates the user-scoped plan context cache.
 * - Fires the welcome email asynchronously (non-blocking).
 */
export declare function activateTrial(userId: string): Promise<TrialStatus>;
/**
 * Returns the current trial status for a user.
 *
 * Also handles lazy side-effects:
 *  - Fires the "trial expiring soon" email once when daysRemaining <= 2.
 */
export declare function getTrialStatus(userId: string): Promise<TrialStatus>;
export interface AtomicTrialIncrementResult {
    allowed: boolean;
    newCount: number;
    limit: number;
}
/**
 * Atomically checks and increments a free-trial usage counter in one Postgres
 * statement. The increment is rejected when current + incrementBy would exceed
 * the configured trial limit.
 */
export declare function incrementTrialUsageAtomic(userId: string, feature: TrialFeature, incrementBy?: number): Promise<AtomicTrialIncrementResult>;
/**
 * Increments a trial usage counter after a successful feature execution.
 *
 * When feature === 'totalTokensUsed', the tokenCount argument is added to the
 * running total. For all other features, the counter is incremented by 1.
 */
export declare function incrementTrialUsage(userId: string, feature: TrialFeature, tokenCount?: number): Promise<void>;
/**
 * Checks whether a user is still within their trial limit for a given feature.
 * Does NOT throw -- returns an object so the caller can decide how to respond.
 */
export declare function checkTrialLimit(userId: string, feature: TrialFeature): Promise<{
    allowed: boolean;
    current: number;
    limit: number;
}>;
/**
 * Fires the trial-expired email once per trial (idempotent via Redis sentinel).
 * Called from withPlanContext when a trial expiry is detected on cache miss.
 */
export declare function fireTrialExpiredEmail(userId: string, email: string, fullName: string, usage: TrialUsage): Promise<void>;
//# sourceMappingURL=trial.service.d.ts.map