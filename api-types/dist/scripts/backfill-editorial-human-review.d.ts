/**
 * Pack 1 Editorial Intelligence - requiresHumanReview backfill.
 *
 * Recomputes the requiresHumanReview policy (src/modules/blog-automation/
 * human-review-policy.ts) against existing BlogArticleSuggestion rows and
 * persists an explicit value where it differs from what's currently stored.
 * See docs/editorial-intelligence/human-review-backfill-runbook.md for the
 * required rollout order - this script must be reviewed in dry-run before
 * --write is ever used, and the enforcement flag
 * (EDITORIAL_HUMAN_REVIEW_ENFORCEMENT_ENABLED) must not be enabled until this
 * has run in write mode.
 *
 * Dry run (default, and explicit):
 *   pnpm tsx src/scripts/backfill-editorial-human-review.ts --dry-run
 *
 * Write (updates only rows whose computed value differs from what's stored):
 *   pnpm tsx src/scripts/backfill-editorial-human-review.ts --write
 *
 * Write mode against a database identifying itself as production is refused
 * unless --allow-production is also passed - see validateEnvironmentSafety
 * (src/utils/schema-verifier.ts), reused here rather than reimplemented.
 *
 * This script never runs automatically - it has no import side effects other
 * than a `require.main === module` guard, matching every other backfill
 * script in this repo (see backfill-pilot-access.ts, backfill-compliance-snapshots.ts).
 */
import 'dotenv/config';
declare function main(): Promise<void>;
export { main as runEditorialHumanReviewBackfill };
//# sourceMappingURL=backfill-editorial-human-review.d.ts.map