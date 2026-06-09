/**
 * Pilot Lifecycle Cron Job
 *
 * Sends timed lifecycle emails to pilot testers and invalidates the plan cache
 * for expired pilots. Designed to run daily via a Render Cron Job service.
 *
 * Render Cron Job config:
 *   Command:  pnpm pilot:cron
 *   Schedule: 0 5 * * *   (08:00 EAT / 05:00 UTC, daily)
 *   Region:   Same region as the API service
 *
 * Lifecycle email schedule (days since pilotStartedAt):
 *   Day  0 -> PilotWelcomeEmail        (sent by provision-pilot-testers.ts, not here)
 *   Day  3 -> PilotDay3NudgeEmail      (only if user has never logged in)
 *   Day  7 -> PilotDay7CheckinEmail
 *   Day 10 -> PilotDay10FeaturesEmail
 *   Day 13 -> PilotDay13WarningEmail
 *   Day ≥14 -> PilotExpiredEmail       (pilotExpiresAt <= now, once per user)
 *
 * Design invariants:
 *   - Acquires a Redis distributed lock (NX + EX) before any work.
 *     If the lock is already held (duplicate cron fire), exits immediately.
 *   - Each email type is gated by a Redis sentinel key (NX write)  -
 *     so each email is sent at most once per user per stage even if the
 *     cron fires multiple times on the same day.
 *   - Plan cache (sheriabot:planctx:{userId}) is DELeted for expired pilots so
 *     the next API request resolves REGULATOR without waiting for TTL.
 *   - Never crashes the process  -  all per-user errors are caught and logged.
 *   - Exits 0 on full success or partial failure (logged); exits 1 only if the
 *     top-level DB query itself fails.
 */
import 'dotenv/config';
//# sourceMappingURL=pilot-lifecycle-cron.d.ts.map