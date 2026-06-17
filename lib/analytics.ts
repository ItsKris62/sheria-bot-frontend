import posthog from "posthog-js";

// Safe properties we are allowed to send
export type SafeEventProperties = {
  // Common
  plan?: string | null;
  role?: string | null;
  pilot_status?: "active" | "none" | null;
  country?: string;

  // Domain specific metadata (never send raw content)
  framework_slug?: string;
  file_type?: string;
  analysis_type?: string;
  citation_count?: number;
  duration_ms?: number;
  error_category?: string;

  // Specific flags for UI interactions
  status?: string;
  source?: string;
  is_pilot_feature?: boolean;

  [key: string]: string | number | boolean | null | undefined;
};

// Strongly typed event names based on requirements
export type AnalyticsEvent =
  // Compliance Query
  | "compliance_query_opened"
  | "compliance_query_started"
  | "compliance_query_completed"
  | "compliance_query_source_insufficient"
  | "compliance_query_citation_expanded"
  // Gap Analysis
  | "gap_analysis_opened"
  | "gap_analysis_file_uploaded"
  | "gap_analysis_started"
  | "gap_analysis_completed"
  | "gap_analysis_failed"
  | "gap_analysis_export_generated"
  // Corpus Gap Reports
  | "corpus_gap_report_opened"
  | "corpus_gap_report_submitted"
  | "admin_corpus_gap_report_status_updated"
  // Billing and Entitlements
  | "plan_limit_reached"
  | "upgrade_clicked"
  | "billing_page_opened"
  // Pilot Access
  | "pilot_access_activated"
  | "pilot_feature_used"
  | "pilot_feedback_submitted";

/**
 * Safely track an event in PostHog.
 * Will fail silently if PostHog is blocked, uninitialized, or errors out.
 */
export function trackEvent(eventName: AnalyticsEvent, properties?: SafeEventProperties) {
  try {
    // Only capture if running in browser and PostHog is initialized
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture(eventName, properties);
    }
  } catch (error) {
    // Fail silently so we don't break the user workflow
    console.warn("[Analytics] Failed to track event", error);
  }
}
