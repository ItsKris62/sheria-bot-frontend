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
  answer_detail?: "standard" | "detailed";
  usage_units_consumed?: number;
  fallback_triggered?: boolean;
  fallback_reason?: string;
  response_word_count?: number;

  // Specific flags for UI interactions
  status?: string;
  source?: string;
  is_pilot_feature?: boolean;

  // Additional safe metadata
  type?: string;
  reason?: string;
  depth?: string;
  framework_count?: number;
  new_status?: string;
  target_plan?: string;
  feature?: string;
  limit_type?: string;
  current_plan?: string;
  required_plan?: string;
  document_type?: string;
  jurisdiction?: string;
  
  // Blog specific
  blog_category?: string;
  blog_slug?: string;
  read_time_seconds?: number;
  share_platform?: string;
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
  // Feature Gates
  | "feature_gate_viewed"
  | "feature_gate_upgrade_clicked"
  // Pilot Access
  | "pilot_access_activated"
  | "pilot_feature_used"
  | "pilot_feedback_submitted"
  // Blog
  | "blog_post_viewed"
  | "blog_post_shared";

// A strict allowlist of keys that are permitted in the payload.
// Any key not in this list will be silently dropped before sending to PostHog.
const ALLOWED_PROPERTY_KEYS = new Set([
  "plan",
  "role",
  "pilot_status",
  "country",
  "framework_slug",
  "file_type",
  "analysis_type",
  "citation_count",
  "duration_ms",
  "error_category",
  "answer_detail",
  "usage_units_consumed",
  "fallback_triggered",
  "fallback_reason",
  "response_word_count",
  "status",
  "source",
  "is_pilot_feature",
  "type",
  "reason",
  "depth",
  "framework_count",
  "new_status",
  "target_plan",
  "feature",
  "limit_type",
  "current_plan",
  "required_plan",
  "document_type",
  "jurisdiction",
  "blog_category",
  "blog_slug",
  "read_time_seconds",
  "share_platform",
]);

/**
 * Safely track an event in PostHog.
 * Will fail silently if PostHog is blocked, uninitialized, or errors out.
 * Silently drops any property keys not explicitly allowlisted.
 */
export function trackEvent(eventName: AnalyticsEvent, properties?: SafeEventProperties) {
  try {
    // Only capture if running in browser and PostHog is initialized
    if (typeof window !== "undefined" && posthog.__loaded) {
      
      let safeProperties: Record<string, any> | undefined = undefined;
      
      if (properties) {
        safeProperties = {};
        for (const key of Object.keys(properties)) {
          if (ALLOWED_PROPERTY_KEYS.has(key)) {
            safeProperties[key] = (properties as any)[key];
          }
        }
      }
      
      posthog.capture(eventName, safeProperties);
    }
  } catch (error) {
    // Fail silently so we don't break the user workflow
    console.warn("[Analytics] Failed to track event", error);
  }
}
