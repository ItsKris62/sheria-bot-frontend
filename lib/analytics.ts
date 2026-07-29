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
  postId?: string;
  slug?: string;
  category?: string;
  tags?: string[];
  authorId?: string;
  publishedAt?: string;
  placement?: "featured" | "recent" | "related" | "search" | "category";
  referrerType?: "internal" | "search" | "social" | "newsletter" | "direct" | "other";
  readingSessionId?: string;
  resultCount?: number;
  queryLength?: number;
  queryFingerprint?: string;
  hasResults?: boolean;
  activeReadSeconds?: number;
  maxScrollDepthBucket?: 25 | 50 | 75 | 90 | 100;
  estimatedReadMinutes?: number;
  sourcePosition?: number;
  sourcePublisher?: string;
  sourceType?: string;
  sourceDomain?: string;
  destinationPostId?: string;
  relatedCardPosition?: number;
  relationshipBasis?: string;
  ctaId?: "request_demo" | "start_compliance_query" | "explore_regulatory_library" | "view_pricing" | "start_free_trial";
  sharePlatform?: string;
  feedbackValue?: "HELPFUL" | "NOT_HELPFUL";
  topicCategory?: string;

  // Knowledge Base specific
  kb_category?: string;
  kb_tag?: string;
  kb_slug?: string;
  has_search?: boolean;
  result_count?: number;
  page?: number;
  
  // Blog Automation Admin
  blog_automation_action?: string;
  blog_automation_type?: string;
  blog_automation_priority?: string;
  blog_automation_status?: string;
  blog_source_region?: string;
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
  | "blog_post_shared"
  | "blog_listing_viewed"
  | "blog_article_impression"
  | "blog_article_opened"
  | "blog_article_engagement_started"
  | "blog_article_engaged"
  | "blog_article_completed"
  | "blog_search_performed"
  | "blog_search_no_results"
  | "blog_category_selected"
  | "blog_tag_selected"
  | "blog_featured_article_opened"
  | "blog_related_article_opened"
  | "blog_source_opened"
  | "blog_product_cta_clicked"
  | "blog_newsletter_cta_viewed"
  | "blog_newsletter_subscription_completed"
  | "blog_feedback_submitted"
  | "blog_topic_request_submitted"
  | "blog_article_shared"
  // Knowledge Base
  | "knowledge_base_viewed"
  | "knowledge_base_searched"
  | "knowledge_base_category_selected"
  | "knowledge_base_article_opened"
  // Blog Automation
  | "blog_automation_monitor_created"
  | "blog_automation_monitor_failed"
  | "blog_automation_suggestion_approved"
  | "blog_automation_suggestion_rejected"
  | "blog_automation_draft_generated"
  | "blog_automation_draft_verified"
  | "blog_automation_draft_published"
  | "blog_automation_digest_generated";

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
  "postId",
  "slug",
  "category",
  "tags",
  "authorId",
  "publishedAt",
  "placement",
  "referrerType",
  "readingSessionId",
  "resultCount",
  "queryLength",
  "queryFingerprint",
  "hasResults",
  "activeReadSeconds",
  "maxScrollDepthBucket",
  "estimatedReadMinutes",
  "sourcePosition",
  "sourcePublisher",
  "sourceType",
  "sourceDomain",
  "destinationPostId",
  "relatedCardPosition",
  "relationshipBasis",
  "ctaId",
  "sharePlatform",
  "feedbackValue",
  "topicCategory",
  "kb_category",
  "kb_tag",
  "kb_slug",
  "has_search",
  "result_count",
  "page",
  "blog_automation_action",
  "blog_automation_type",
  "blog_automation_priority",
  "blog_automation_status",
  "blog_source_region",
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
