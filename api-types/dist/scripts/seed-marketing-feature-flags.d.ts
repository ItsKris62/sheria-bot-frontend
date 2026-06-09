/**
 * Seed Script: Marketing Feature Flags
 *
 * Seeds the FeatureFlag records required by the Marketing & Outreach module.
 * Safe to run multiple times — uses ON CONFLICT DO NOTHING semantics via upsert.
 *
 * Usage:
 *   pnpm seed:marketing:flags
 *
 * Flags seeded:
 *   marketing_utm_tracking — When enabled, marketing email links are tagged
 *                            with UTM parameters for analytics tracking.
 *                            Disabled by default (enable only when an analytics
 *                            tool is configured to receive the parameters).
 */
import 'dotenv/config';
//# sourceMappingURL=seed-marketing-feature-flags.d.ts.map