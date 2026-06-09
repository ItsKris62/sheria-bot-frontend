import { SubscriptionPlan } from '@prisma/client';
/**
 * Maps legacy `subscriptionTier` string values (and the current admin-written
 * SubscriptionPlan enum strings) to the canonical `SubscriptionPlan` enum.
 *
 * Background: The `Organization` model has two subscription fields:
 *   - `subscriptionTier` (String, legacy)  -  written by the admin module and
 *     originally used arbitrary strings like "starter" / "professional".
 *     The admin module later started writing SubscriptionPlan enum values
 *     directly (e.g. "STARTUP"), so both formats appear in production.
 *   - `plan` (SubscriptionPlan, authoritative)  -  read by `withPlanContext` to
 *     gate features. Added as part of the Phase 6+ infrastructure migration.
 *
 * This mapping is the single source of truth for converting `subscriptionTier`
 * -> `SubscriptionPlan`. It is used by:
 *   - `admin.module.ts` (write path fix)
 *   - `src/scripts/backfill-org-plan.ts` (data migration)
 *
 * Tier string variants handled (case-insensitive via normalisation):
 *   "starter" | "regulator"            -> REGULATOR
 *   "startup"                          -> STARTUP
 *   "professional" | "business"        -> BUSINESS
 *   "enterprise"                       -> ENTERPRISE
 *   (SubscriptionPlan enum strings     -> their matching enum value)
 *   (anything else                     -> null  -  caller decides what to do)
 */
export declare function subscriptionTierToPlan(tier: string): SubscriptionPlan | null;
/**
 * Same as `subscriptionTierToPlan` but falls back to `SubscriptionPlan.REGULATOR`
 * when the tier string is unrecognised. Use this inside Prisma update calls
 * where a non-null plan is always required.
 */
export declare function subscriptionTierToPlanOrFree(tier: string): SubscriptionPlan;
//# sourceMappingURL=plan-mapping.d.ts.map