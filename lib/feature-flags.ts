import { useFeatureFlagEnabled } from "posthog-js/react";

/**
 * Known feature flags.
 * Do not change product behavior unless explicitly defined.
 */
export type FeatureFlagKey =
  | "enable_policy_generator_for_pilot"
  | "enable_new_compliance_query_ui"
  | "enable_corpus_gap_reports"
  | "enable_custom_frameworks";

/**
 * A safe wrapper around PostHog's useFeatureFlagEnabled.
 * Fails safely to `false` if PostHog is unavailable or the flag doesn't exist.
 */
export function useFeatureFlag(flag: FeatureFlagKey): boolean {
  try {
    // Return the flag value, or false by default
    return useFeatureFlagEnabled(flag) ?? false;
  } catch (error) {
    // If PostHog isn't loaded or fails, assume false for safety
    return false;
  }
}
