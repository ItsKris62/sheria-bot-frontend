/**
 * Soft-Bounce 3-Strikes Auto-Suppression Cron Job
 *
 * Queries contacts with 3+ soft-bounce events in the last 30 days and
 * adds them to the suppression list automatically.
 *
 * Render Cron Job config:
 *   Command:  pnpm softbounce:cron
 *   Schedule: 0 6 * * *   (09:00 EAT / 06:00 UTC, daily)
 *   Region:   Same region as the API service
 *
 * Design invariants:
 *   - Acquires a Redis distributed lock (NX + EX) before any work.
 *     If the lock is already held (duplicate cron fire), exits immediately.
 *   - Idempotency: skips contacts already in SuppressionList.
 *   - Per-contact errors are caught and logged — one failure does not abort
 *     the rest of the batch.
 *   - Lock is always released in a finally block.
 *   - Exits 0 on full success or partial failure (logged).
 *   - Exits 1 only if the top-level DB query itself fails.
 */
import 'dotenv/config';
//# sourceMappingURL=soft-bounce-cron.d.ts.map