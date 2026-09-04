import posthog from "posthog-js";
import { useAuthStore } from "./auth-store";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export type SupportedFeatureName =
  | "compliance_query"
  | "compliance_checklist"
  | "gap_analysis"
  | "compliance_dashboard"
  | "policy_generator"
  | "compliance_calendar"
  | "compliance_roadmap"
  | "custom_framework"
  | "document_analysis"
  | "regulatory_alerts";

export type FeatureUsageStatus = "viewed" | "started" | "completed" | "failed";

export type AnalyticsPlacement =
  | "pricing_page"
  | "homepage_pricing_section"
  | "feature_gate"
  | "billing_settings"
  | "dashboard_sidebar"
  | "header";

export type SafeEventProperties = {
  // Common Dimensions
  plan?: string | null;
  plan_type?: string | null;
  role?: string | null;
  user_role?: string | null;
  pilot_status?: "active" | "none" | null;
  country?: string;
  jurisdiction?: string;
  jurisdiction_code?: string;
  jurisdictionCode?: string;
  placement?: AnalyticsPlacement | string;
  source?: string;
  target_plan?: string;

  // Normalized Feature Usage
  feature_name?: SupportedFeatureName | string;
  status?: FeatureUsageStatus | string;

  // Commercial & Funnel
  payment_provider?: "INTASEND" | "STRIPE";
  currency?: "KES" | "USD" | string;
  value?: number;
  transaction_id?: string;
  cycle?: "monthly" | "yearly";
  lead_type?: "contact_form" | "enterprise_quote" | "pilot_application" | string;
  first_feature?: SupportedFeatureName | string;
  requires_approval?: boolean;
  method?: string;

  // Domain specific metadata (never send raw content or PII)
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
  is_pilot_feature?: boolean;
  type?: string;
  reason?: string;
  depth?: string;
  framework_count?: number;
  new_status?: string;
  feature?: string;
  limit_type?: string;
  current_plan?: string;
  required_plan?: string;
  document_type?: string;

  // Blog & KB specific
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
  feedbackValue?: "HELPFUL" | "NOT_HELPFUL";
  topicCategory?: string;
  kb_category?: string;
  kb_tag?: string;
  kb_slug?: string;
  has_search?: boolean;
  result_count?: number;
  page?: number;

  page_location?: string;
  page_path?: string;
  page_title?: string;

  // Blog Automation
  blog_automation_action?: string;
  blog_automation_type?: string;
  blog_automation_priority?: string;
  blog_automation_status?: string;
  blog_source_region?: string;
};

// GA4 & PostHog Lifecycle Events
export type LifecycleEvent =
  | "page_view"
  | "sign_up"
  | "email_verified"
  | "login"
  | "account_activated"
  | "trial_start"
  | "pricing_viewed"
  | "upgrade_clicked"
  | "begin_checkout"
  | "purchase"
  | "generate_lead"
  | "feature_usage";

export type AnalyticsEvent =
  | LifecycleEvent
  // Compliance Query
  | "compliance_query_opened"
  | "compliance_query_started"
  | "compliance_query_completed"
  | "compliance_query_source_insufficient"
  | "compliance_query_citation_expanded"
  | "suggested_query_selected"
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

// Strict allowlist of keys permitted in payloads
const ALLOWED_PROPERTY_KEYS = new Set([
  "plan",
  "plan_type",
  "role",
  "user_role",
  "pilot_status",
  "country",
  "jurisdiction",
  "jurisdiction_code",
  "jurisdictionCode",
  "placement",
  "source",
  "page_location",
  "page_path",
  "page_title",
  "target_plan",
  "feature_name",
  "status",
  "payment_provider",
  "currency",
  "value",
  "transaction_id",
  "cycle",
  "lead_type",
  "first_feature",
  "requires_approval",
  "method",
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
  "is_pilot_feature",
  "type",
  "reason",
  "depth",
  "framework_count",
  "new_status",
  "feature",
  "limit_type",
  "current_plan",
  "required_plan",
  "document_type",
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

// Sensitive URL parameters that must NEVER be recorded in page_location
const SENSITIVE_URL_PARAMS = new Set([
  "token",
  "invitationtoken",
  "token_hash",
  "email",
  "code",
  "access_token",
  "refresh_token",
  "secret",
  "key",
  "password",
  "signature",
  "payer_id",
  "checkout_id",
  "state",
  "session_id",
  "otp",
  "auth_token",
  "q",
  "query",
  "search",
]);

// Sensitive path prefixes where query parameters must always be stripped entirely
const SENSITIVE_PATH_PREFIXES = [
  "/verify-email",
  "/reset-password",
  "/auth/callback",
  "/unsubscribe",
  "/change-password",
];

// In-memory deduplication trackers for critical one-time events (backed by localStorage in browser)
const trackedPurchases = new Set<string>();
const trackedActivations = new Set<string>();
const trackedEmailVerifications = new Set<string>();
const trackedTrials = new Set<string>();

const DEDUP_STORAGE_KEYS = {
  purchases: "sheriabot:analytics:purchases",
  activations: "sheriabot:analytics:activations",
  trials: "sheriabot:analytics:trials",
  emailVerifications: "sheriabot:analytics:email_verifications",
} as const;

function isDurableKeyPresent(storageKey: string, inMemorySet: Set<string>, key: string): boolean {
  if (inMemorySet.has(key)) return true;
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return false;
    const list = JSON.parse(raw);
    if (Array.isArray(list) && list.includes(key)) {
      inMemorySet.add(key);
      return true;
    }
  } catch {
    // Ignore storage parse errors
  }
  return false;
}

function markDurableKey(storageKey: string, inMemorySet: Set<string>, key: string): void {
  inMemorySet.add(key);
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(storageKey);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (Array.isArray(list)) {
      if (!list.includes(key)) {
        list.push(key);
        // Retain last 100 entries to prevent unbounded storage
        localStorage.setItem(storageKey, JSON.stringify(list.slice(-100)));
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify([key]));
    }
  } catch {
    // Ignore storage write errors (e.g. private mode quota)
  }
}

/**
 * Resets in-memory and durable deduplication sets for testing.
 */
export function resetAnalyticsDedupForTests(): void {
  trackedPurchases.clear();
  trackedActivations.clear();
  trackedEmailVerifications.clear();
  trackedTrials.clear();
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(DEDUP_STORAGE_KEYS.purchases);
      localStorage.removeItem(DEDUP_STORAGE_KEYS.activations);
      localStorage.removeItem(DEDUP_STORAGE_KEYS.trials);
      localStorage.removeItem(DEDUP_STORAGE_KEYS.emailVerifications);
    } catch {
      // Ignore
    }
  }
}

/**
 * Checks whether analytics processing is legally and contractually permitted.
 * Returns false if user has Section 34 restriction or denied analytics consent.
 */
export function isAnalyticsAllowed(): boolean {
  if (typeof window === "undefined") return false;

  // Check Section 34 Statutory Processing Restriction
  try {
    const user = useAuthStore.getState().user;
    if (user?.preferences?.section34Restriction?.status === "RESTRICTED") {
      syncGaDisable(true);
      return false;
    }
  } catch {
    // Ignore store access errors in SSR/test
  }

  // Check Cookie Consent
  try {
    const consent = localStorage.getItem("sheriabot:cookie_consent:analytics");
    if (consent === "denied") {
      syncGaDisable(true);
      return false;
    }
  } catch {
    // Ignore localStorage errors
  }

  syncGaDisable(false);
  return true;
}

function syncGaDisable(disabled: boolean): void {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
  const disableKey = `ga-disable-${GA_MEASUREMENT_ID}` as const;
  window[disableKey] = disabled;
}

/**
 * Sanitizes URLs to remove sensitive tokens and user-generated text query parameters.
 */
export function sanitizeUrlForAnalytics(rawUrlOrPath: string): string {
  try {
    if (!rawUrlOrPath) return "";
    const isAbsolute = rawUrlOrPath.startsWith("http://") || rawUrlOrPath.startsWith("https://");
    const parsed = new URL(isAbsolute ? rawUrlOrPath : `https://sheriabot.com${rawUrlOrPath.startsWith("/") ? "" : "/"}${rawUrlOrPath}`);
    
    // Check sensitive path prefix
    const isSensitivePath = SENSITIVE_PATH_PREFIXES.some(prefix => 
      parsed.pathname === prefix || parsed.pathname.startsWith(`${prefix}/`)
    );

    if (isSensitivePath) {
      // Return origin + pathname only, strip entire search
      return isAbsolute ? `${parsed.origin}${parsed.pathname}` : parsed.pathname;
    }

    // Strip specific sensitive parameters
    const searchParams = new URLSearchParams(parsed.search);
    const keysToDelete: string[] = [];
    searchParams.forEach((_, key) => {
      if (SENSITIVE_URL_PARAMS.has(key.toLowerCase())) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => searchParams.delete(key));

    const queryString = searchParams.toString();
    const cleanPathWithSearch = `${parsed.pathname}${queryString ? `?${queryString}` : ""}`;
    return isAbsolute ? `${parsed.origin}${cleanPathWithSearch}` : cleanPathWithSearch;
  } catch {
    return rawUrlOrPath.split("?")[0] || "";
  }
}

/**
 * Normalizes and filters event payload to strictly allowlisted keys.
 */
export function filterSafeProperties(properties?: SafeEventProperties): Record<string, unknown> | undefined {
  if (!properties) return undefined;
  const safe: Record<string, unknown> = {};
  for (const key of Object.keys(properties)) {
    if (ALLOWED_PROPERTY_KEYS.has(key)) {
      const val = properties[key as keyof SafeEventProperties];
      if (val !== undefined && val !== null) {
        safe[key] = val;
      }
    }
  }
  return Object.keys(safe).length > 0 ? safe : undefined;
}

/**
 * Dispatches an event to Google Analytics 4 via gtag.js.
 */
export function trackGA4Event(eventName: string, properties?: SafeEventProperties): void {
  try {
    if (typeof window === "undefined" || !GA_MEASUREMENT_ID || !window.gtag) return;
    if (!isAnalyticsAllowed()) return;

    const safeProps = filterSafeProperties(properties) ?? {};
    window.gtag("event", eventName, safeProps);
  } catch (error) {
    // Fail silently in production
    if (process.env.NODE_ENV === "development") {
      console.warn("[GA4] Failed to track event", error);
    }
  }
}

/**
 * Main analytics event tracker. Dispatches to PostHog and GA4 with allowlist filtering.
 */
export function trackEvent(eventName: AnalyticsEvent, properties?: SafeEventProperties): void {
  try {
    if (typeof window === "undefined") return;
    if (!isAnalyticsAllowed()) return;

    const safeProps = filterSafeProperties(properties);

    // 1. PostHog capture
    if (posthog && posthog.__loaded) {
      if (typeof posthog.has_opted_out_capturing !== "function" || !posthog.has_opted_out_capturing()) {
        posthog.capture(eventName, safeProps);
      }
    }

    // 2. GA4 capture
    trackGA4Event(eventName, properties);
  } catch (error) {
    // Fail silently so we don't break user workflows
    if (process.env.NODE_ENV === "development") {
      console.warn("[Analytics] Failed to track event", error);
    }
  }
}

/**
 * Normalized product feature usage tracking.
 */
export function trackFeatureUsage(params: {
  feature_name: SupportedFeatureName;
  status: FeatureUsageStatus;
  jurisdiction_code?: string;
  plan_type?: string;
}): void {
  trackEvent("feature_usage", {
    feature_name: params.feature_name,
    status: params.status,
    jurisdiction_code: params.jurisdiction_code,
    plan_type: params.plan_type,
  });
}

/**
 * Authoritative, backend-deduplicated purchase tracker.
 * Only emits once per opaque transaction_id across all sessions, devices, and tabs
 * governed by the authoritative backend claim boundary.
 */
export async function trackPurchase(params: {
  transaction_id: string;
  plan_type: "STARTUP" | "BUSINESS" | "ENTERPRISE" | string;
  payment_provider: "INTASEND" | "STRIPE";
  value?: number;
  currency?: "KES" | "USD" | string;
  claimChecker?: () => Promise<{ firstPurchaseTelemetry?: boolean }>;
}): Promise<boolean> {
  if (
    !params.transaction_id ||
    isDurableKeyPresent(DEDUP_STORAGE_KEYS.purchases, trackedPurchases, params.transaction_id)
  ) {
    return false;
  }

  // 1. Authoritative backend claim check if claimChecker is supplied
  if (params.claimChecker) {
    try {
      const claimResult = await params.claimChecker();
      if (!claimResult?.firstPurchaseTelemetry) {
        markDurableKey(DEDUP_STORAGE_KEYS.purchases, trackedPurchases, params.transaction_id);
        return false;
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Analytics] Purchase telemetry claim check failed", error);
      }
      return false;
    }
  }

  // 2. Mark in durable local storage as secondary fast safeguard
  markDurableKey(DEDUP_STORAGE_KEYS.purchases, trackedPurchases, params.transaction_id);

  // 3. Emit GA4 and PostHog purchase event
  trackEvent("purchase", {
    transaction_id: params.transaction_id,
    plan_type: params.plan_type,
    payment_provider: params.payment_provider,
    value: params.value,
    currency: params.currency ?? (params.payment_provider === "INTASEND" ? "KES" : "USD"),
  });

  return true;
}

/**
 * Checkout initiation tracker. Fires only on confirmed checkout intent.
 */
export function trackBeginCheckout(params: {
  plan_type: "STARTUP" | "BUSINESS" | "ENTERPRISE" | string;
  payment_provider: "INTASEND" | "STRIPE";
  cycle?: "monthly" | "yearly";
  value?: number;
  currency?: "KES" | "USD" | string;
}): void {
  trackEvent("begin_checkout", {
    plan_type: params.plan_type,
    payment_provider: params.payment_provider,
    cycle: params.cycle,
    value: params.value,
    currency: params.currency ?? (params.payment_provider === "INTASEND" ? "KES" : "USD"),
  });
}

/**
 * Authoritative, durable deduplicated trial start tracker.
 */
export function trackTrialStart(params: {
  userId: string;
  plan_type?: string;
  jurisdiction_code?: string;
}): void {
  if (
    !params.userId ||
    isDurableKeyPresent(DEDUP_STORAGE_KEYS.trials, trackedTrials, params.userId)
  ) {
    return;
  }
  markDurableKey(DEDUP_STORAGE_KEYS.trials, trackedTrials, params.userId);

  trackEvent("trial_start", {
    plan_type: params.plan_type ?? "FREE_TRIAL",
    jurisdiction_code: params.jurisdiction_code,
  });
}

/**
 * Authoritative, durable deduplicated email verification tracker.
 */
export function trackEmailVerified(params: {
  userIdOrEmailHash?: string;
  requires_approval?: boolean;
}): void {
  const dedupKey = params.userIdOrEmailHash || "verified";
  if (
    isDurableKeyPresent(
      DEDUP_STORAGE_KEYS.emailVerifications,
      trackedEmailVerifications,
      dedupKey,
    )
  ) {
    return;
  }
  markDurableKey(
    DEDUP_STORAGE_KEYS.emailVerifications,
    trackedEmailVerifications,
    dedupKey,
  );

  trackEvent("email_verified", {
    requires_approval: params.requires_approval,
  });
}

/**
 * Authoritative account activation tracker.
 * Checks if user is authenticated and records activation once durably.
 * Invariant: Exactly one activation event emitted per user across workflows and tabs.
 */
export function recordAccountActivation(params: {
  first_feature: SupportedFeatureName;
  jurisdiction_code?: string;
  plan_type?: string;
}): void {
  try {
    const { user, updateUser } = useAuthStore.getState();
    if (!user) return;

    // Check if account was already activated via backend user profile or durable dedup
    if (
      user.preferences?.accountActivatedAt ||
      isDurableKeyPresent(DEDUP_STORAGE_KEYS.activations, trackedActivations, user.id)
    ) {
      return;
    }

    markDurableKey(DEDUP_STORAGE_KEYS.activations, trackedActivations, user.id);
    const activatedAt = new Date().toISOString();

    // Update local user state so it won't fire again in this session
    updateUser({
      preferences: {
        ...(user.preferences ?? {}),
        accountActivatedAt: activatedAt,
      },
    });

    trackEvent("account_activated", {
      first_feature: params.first_feature,
      jurisdiction_code: params.jurisdiction_code,
      plan_type: params.plan_type,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Analytics] Activation check error", error);
    }
  }
}

/**
 * Sets authenticated user identity in PostHog and GA4.
 * Uses ONLY the internal opaque user UUID.
 */
export function setAnalyticsUser(
  userId: string,
  properties?: {
    role?: string | null;
    plan?: string | null;
    pilot_status?: "active" | "none" | null;
    organization_id?: string | null;
  }
): void {
  try {
    if (typeof window === "undefined" || !userId) return;
    if (!isAnalyticsAllowed()) return;

    // 1. PostHog identity
    if (posthog && posthog.__loaded) {
      if (typeof posthog.opt_in_capturing === "function") {
        posthog.opt_in_capturing();
      }
      posthog.identify(userId, {
        role: properties?.role,
        plan: properties?.plan,
        pilot_status: properties?.pilot_status,
        organization_id: properties?.organization_id,
      });

      if (properties?.organization_id) {
        posthog.group("organization", properties.organization_id, {
          plan: properties?.plan,
          pilot_status: properties?.pilot_status,
        });
      }
    }

    // 2. GA4 User-ID and user properties
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag("set", { user_id: userId });
      window.gtag("set", "user_properties", {
        plan_type: properties?.plan,
        user_role: properties?.role,
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Analytics] Failed to set user", error);
    }
  }
}

/**
 * Clears user identity from PostHog and GA4 on logout.
 */
export function clearAnalyticsUser(): void {
  try {
    if (typeof window === "undefined") return;

    // 1. PostHog reset
    if (posthog && posthog.__loaded) {
      posthog.reset();
    }

    // 2. GA4 User-ID clear
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag("set", { user_id: null });
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Analytics] Failed to clear user", error);
    }
  }
}
