/**
 * Usage Reservation & Settlement Service
 *
 * Durable two-phase usage accounting mechanism:
 * 1. Atomically reserves capacity before starting expensive or AI operations.
 * 2. Settles and commits usage durably to the database upon successful completion.
 * 3. Releases reserved units upon failure, timeout, or cancellation.
 * 4. Ensures idempotency: duplicate requests with same operationId retrieve existing result without re-charging.
 * 5. Fails closed: Redis outage falls back to durable DB period checks without granting unlimited usage.
 */
import { BillingMetric } from '@prisma/client';
import { type PlanEntitlementConfig } from '@/config/entitlements.config';
import type { EffectivePlan } from '@/types/plan.types';
export declare const RESERVATION_TTL_SECONDS: number;
export interface ReserveUsageInput {
    orgId: string;
    userId?: string;
    metric: BillingMetric;
    units: number;
    operationId: string;
    plan: EffectivePlan;
    entitlements?: PlanEntitlementConfig;
}
export interface ReserveUsageResult {
    allowed: boolean;
    reservationId: string;
    current: number;
    limit: number;
    remaining: number;
    isDuplicateSettled?: boolean;
}
export interface SettleUsageInput {
    orgId: string;
    userId?: string;
    reservationId: string;
    operationId: string;
    metric: BillingMetric;
    units: number;
    costUsd?: number;
    metadata?: Record<string, unknown>;
}
export interface ReleaseUsageInput {
    orgId: string;
    reservationId: string;
    metric: BillingMetric;
    units: number;
    reason?: string;
}
declare class UsageReservationService {
    /**
     * Atomically reserves usage units before processing.
     */
    reserveUsage(input: ReserveUsageInput): Promise<ReserveUsageResult>;
    /**
     * Settles a previously reserved usage after successful execution.
     */
    settleUsage(input: SettleUsageInput): Promise<void>;
    /**
     * Releases a reserved usage back to the quota if the operation failed.
     */
    releaseUsage(input: ReleaseUsageInput): Promise<void>;
    private fallbackDbCheck;
}
export declare const usageReservationService: UsageReservationService;
export {};
//# sourceMappingURL=usage-reservation.service.d.ts.map