/**
 * Send Queue Service — Async Bulk Send Infrastructure (Phase B3)
 *
 * Provides a Redis-backed queue for sending marketing campaigns to large
 * contact lists (>25 recipients) without blocking the HTTP request.
 *
 * Architecture:
 *   - enqueue()    — Creates a CampaignSendJob row + pushes contactIds to Redis list
 *   - drainBatch() — Atomically pops N contactIds, sends each, updates job counters
 *   - cancelJob()  — Clears the Redis list + marks job CANCELLED
 *
 * Redis keys:
 *   sheriabot:marketing:sendqueue:{campaignId}       — RPUSH list of contactIds
 *   sheriabot:marketing:sendqueue:lock:{campaignId}  — per-campaign distributed lock
 *
 * TTL: 48 hours (campaigns should complete well within this window)
 *
 * Distributed lock pattern:
 *   Per-campaign lock prevents two cron runs from draining the same campaign
 *   simultaneously. Lock TTL = 120s (generous for a 50-contact batch).
 */
import { CampaignSendJobStatus } from '@prisma/client';
export interface DrainResult {
    processed: number;
    succeeded: number;
    failed: number;
    skipped: number;
    remaining: number;
    jobStatus: CampaignSendJobStatus;
}
export declare class SendQueueService {
    /**
     * Enqueue a campaign for async bulk send.
     * Creates a CampaignSendJob row and pushes contactIds to Redis list.
     * Sets campaign status to SENDING.
     */
    enqueue(campaignId: string, contactIds: string[]): Promise<{
        jobId: string;
        queued: number;
    }>;
    /**
     * Drain up to `batchSize` contacts from the queue and send them.
     * Called by the cron job. Returns counts for this batch.
     *
     * Uses LPOP (atomic, safe for concurrent cron runs with distributed lock).
     * Acquires per-campaign lock before draining.
     */
    drainBatch(campaignId: string, batchSize: number): Promise<DrainResult>;
    /**
     * Get the number of contacts remaining in the queue.
     */
    getQueueDepth(campaignId: string): Promise<number>;
    /**
     * Cancel a queued/running job. Clears the Redis list and marks job CANCELLED.
     */
    cancelJob(jobId: string): Promise<void>;
    /**
     * Get the latest CampaignSendJob for a campaign.
     */
    getLatestJob(campaignId: string): Promise<{
        id: string;
        failed: number;
        status: import(".prisma/client").$Enums.CampaignSendJobStatus;
        createdAt: Date;
        updatedAt: Date;
        errorMessage: string | null;
        completedAt: Date | null;
        startedAt: Date | null;
        campaignId: string;
        totalContacts: number;
        processed: number;
        succeeded: number;
        skipped: number;
    } | null>;
    private finalizeJob;
}
export declare const sendQueueService: SendQueueService;
//# sourceMappingURL=send-queue.service.d.ts.map