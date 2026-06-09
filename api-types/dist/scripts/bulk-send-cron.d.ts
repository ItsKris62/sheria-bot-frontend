/**
 * Bulk Send Cron Job — Async Marketing Campaign Drain (Phase B3)
 *
 * Drains the Redis send queue for all active CampaignSendJob rows.
 * Processes 50 contacts per campaign per run.
 *
 * Render Cron Job config:
 *   Command:  pnpm bulksend:cron
 *   Schedule: *\/5 * * * *   (every 5 minutes)
 *   Region:   Same region as the API service
 *
 * Design invariants:
 *   - Acquires a global Redis distributed lock (NX + EX) before any work.
 *     If the lock is already held (duplicate cron fire), exits immediately.
 *   - Per-campaign lock inside drainBatch() prevents concurrent drains.
 *   - Per-campaign errors are caught and logged — one failure does not abort
 *     the rest of the batch.
 *   - Lock is always released in a finally block.
 *   - Exits 0 on full success or partial failure (logged).
 *   - Exits 1 only if the top-level DB query itself fails.
 */
import 'dotenv/config';
//# sourceMappingURL=bulk-send-cron.d.ts.map