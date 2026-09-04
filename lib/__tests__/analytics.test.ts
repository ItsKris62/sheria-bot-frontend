import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  sanitizeUrlForAnalytics,
  filterSafeProperties,
  isAnalyticsAllowed,
  trackEvent,
  trackFeatureUsage,
  trackBeginCheckout,
  trackPurchase,
  trackTrialStart,
  trackEmailVerified,
  recordAccountActivation,
  setAnalyticsUser,
  clearAnalyticsUser,
  resetAnalyticsDedupForTests,
  GA_MEASUREMENT_ID,
} from "../analytics";
import { useAuthStore } from "../auth-store";
import posthog from "posthog-js";

// Mock posthog
vi.mock("posthog-js", () => {
  const ph = {
    __loaded: true,
    capture: vi.fn(),
    identify: vi.fn(),
    reset: vi.fn(),
    group: vi.fn(),
    opt_in_capturing: vi.fn(),
    has_opted_out_capturing: vi.fn(() => false),
  };
  return { default: ph };
});

describe("Analytics Instrumentation & Privacy Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    resetAnalyticsDedupForTests();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true,
    });

    // Mock window.gtag and dataLayer
    window.dataLayer = [];
    window.gtag = vi.fn((...args: unknown[]) => {
      window.dataLayer.push(args);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("1. Automatic Page-View & URL Privacy Sanitization", () => {
    it("strips sensitive tokens and authentication parameters from URL queries", () => {
      const dirtyUrl = "https://sheriabot.com/startup/compliance-query?token=secret123&token_hash=abc&invitationToken=inv456&code=authCode99&password=mypassword&email=ceo@fintech.co.ke&payer_id=pay999&page=2";
      const cleanUrl = sanitizeUrlForAnalytics(dirtyUrl);

      expect(cleanUrl).not.toContain("secret123");
      expect(cleanUrl).not.toContain("token_hash");
      expect(cleanUrl).not.toContain("invitationToken");
      expect(cleanUrl).not.toContain("authCode99");
      expect(cleanUrl).not.toContain("mypassword");
      expect(cleanUrl).not.toContain("ceo@fintech.co.ke");
      expect(cleanUrl).not.toContain("payer_id");
      expect(cleanUrl).toContain("page=2");
    });

    it("strips search and query text parameters to prevent leaking user queries in page_location", () => {
      const searchUrl = "https://sheriabot.com/knowledge-base?search=how+to+evade+CBK+inspection&q=sensitive+trade+secret&tab=articles";
      const cleanUrl = sanitizeUrlForAnalytics(searchUrl);

      expect(cleanUrl).not.toContain("how+to+evade");
      expect(cleanUrl).not.toContain("sensitive+trade+secret");
      expect(cleanUrl).toContain("tab=articles");
    });

    it("completely strips query strings from sensitive auth and recovery routes", () => {
      const sensitivePaths = [
        "https://sheriabot.com/verify-email?token=0192837482910&email=user@example.com",
        "https://sheriabot.com/reset-password?token=abcdef123456&expiry=3600",
        "https://sheriabot.com/auth/callback?code=supabase_code_123&state=xyz",
        "https://sheriabot.com/unsubscribe?token=unsub_token_789",
        "https://sheriabot.com/change-password?temp_token=temp123",
      ];

      for (const rawUrl of sensitivePaths) {
        const clean = sanitizeUrlForAnalytics(rawUrl);
        expect(clean).not.toContain("?");
        expect(clean).not.toContain("token=");
        expect(clean).not.toContain("code=");
      }
    });

    it("preserves safe, non-sensitive relative paths and query parameters", () => {
      const clean = sanitizeUrlForAnalytics("/startup/checklists?view=active&category=lending");
      expect(clean).toBe("/startup/checklists?view=active&category=lending");
    });
  });

  describe("2. Strict Property Allowlisting & PII Defense", () => {
    it("allows strictly whitelisted keys and removes arbitrary or sensitive metadata", () => {
      const dirtyPayload = {
        plan_type: "STARTUP",
        jurisdiction_code: "KE",
        placement: "pricing_page",
        user_password: "supersecretpassword",
        customer_ssn: "123-45-6789",
        raw_user_prompt: "Tell me how to register in Kenya",
        credit_card_number: "4111222233334444",
      } as any;

      const safe = filterSafeProperties(dirtyPayload);
      expect(safe).toEqual({
        plan_type: "STARTUP",
        jurisdiction_code: "KE",
        placement: "pricing_page",
      });
      expect(safe?.user_password).toBeUndefined();
      expect(safe?.customer_ssn).toBeUndefined();
      expect(safe?.raw_user_prompt).toBeUndefined();
      expect(safe?.credit_card_number).toBeUndefined();
    });
  });

  describe("3. Section 34 Statutory Restrictions & Consent Gating", () => {
    it("permits analytics when user is unrestricted and consent is not denied", () => {
      expect(isAnalyticsAllowed()).toBe(true);
    });

    it("blocks analytics completely and sets ga-disable flag when Section 34 restriction is active", () => {
      useAuthStore.setState({
        user: {
          id: "user-1",
          email: "restricted@entity.co.ke",
          name: "Restricted Officer",
          role: "STARTUP",
          emailVerified: true,
          mustChangePassword: false,
          createdAt: new Date().toISOString(),
          preferences: {
            section34Restriction: {
              status: "RESTRICTED",
              restrictedAt: new Date().toISOString(),
              reason: "Pending CBK Review",
            },
          },
        },
        isAuthenticated: true,
      });

      expect(isAnalyticsAllowed()).toBe(false);

      // Verify trackEvent suppresses capture
      trackEvent("pricing_viewed", { placement: "pricing_page" });
      expect(posthog.capture).not.toHaveBeenCalled();
      expect(window.gtag).not.toHaveBeenCalled();
    });

    it("blocks analytics when user has explicitly denied cookie consent", () => {
      localStorage.setItem("sheriabot:cookie_consent:analytics", "denied");

      expect(isAnalyticsAllowed()).toBe(false);

      trackEvent("sign_up", { role: "STARTUP", jurisdiction_code: "KE" });
      expect(posthog.capture).not.toHaveBeenCalled();
      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  describe("4. User Identity & Privacy-Safe User-ID Sync", () => {
    it("sets opaque user UUID and whitelisted attributes in PostHog and GA4", () => {
      setAnalyticsUser("usr_abc123_opaque_uuid", {
        role: "STARTUP",
        plan: "BUSINESS",
        pilot_status: "none",
        organization_id: "org_456",
      });

      expect(posthog.identify).toHaveBeenCalledWith("usr_abc123_opaque_uuid", {
        role: "STARTUP",
        plan: "BUSINESS",
        pilot_status: "none",
        organization_id: "org_456",
      });

      if (GA_MEASUREMENT_ID) {
        expect(window.gtag).toHaveBeenCalledWith("set", { user_id: "usr_abc123_opaque_uuid" });
        expect(window.gtag).toHaveBeenCalledWith("set", "user_properties", {
          plan_type: "BUSINESS",
          user_role: "STARTUP",
        });
      }
    });

    it("clears identity and resets identifiers on logout", () => {
      clearAnalyticsUser();
      expect(posthog.reset).toHaveBeenCalled();
      if (GA_MEASUREMENT_ID) {
        expect(window.gtag).toHaveBeenCalledWith("set", { user_id: null });
      }
    });
  });

  describe("5. Lifecycle Events, Commercial Funnels & Deduplication", () => {
    it("emits begin_checkout on real checkout intent initiation", () => {
      trackBeginCheckout({
        plan_type: "BUSINESS",
        payment_provider: "INTASEND",
        value: 12500,
        currency: "KES",
        cycle: "monthly",
      });

      expect(posthog.capture).toHaveBeenCalledWith(
        "begin_checkout",
        expect.objectContaining({
          plan_type: "BUSINESS",
          payment_provider: "INTASEND",
          value: 12500,
          currency: "KES",
          cycle: "monthly",
        })
      );
    });

    it("emits purchase on COMPLETED confirmation and deduplicates subsequent polling/rerenders", () => {
      const purchaseParams = {
        transaction_id: "tx_intasend_987654321",
        plan_type: "STARTUP",
        payment_provider: "INTASEND" as const,
        value: 4500,
        currency: "KES",
      };

      // First call (authoritative completion)
      trackPurchase(purchaseParams);
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith("purchase", expect.objectContaining({
        transaction_id: "tx_intasend_987654321",
        plan_type: "STARTUP",
        payment_provider: "INTASEND",
        value: 4500,
        currency: "KES",
      }));

      // Simulate polling re-trigger with identical transaction ID
      trackPurchase(purchaseParams);
      trackPurchase(purchaseParams);

      // Still only called once!
      expect(posthog.capture).toHaveBeenCalledTimes(1);
    });

    it("deduplicates trial_start events by user ID", () => {
      trackTrialStart({ userId: "usr_trial_1", plan_type: "FREE_TRIAL", jurisdiction_code: "KE" });
      trackTrialStart({ userId: "usr_trial_1", plan_type: "FREE_TRIAL", jurisdiction_code: "KE" });

      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith("trial_start", expect.objectContaining({
        plan_type: "FREE_TRIAL",
        jurisdiction_code: "KE",
      }));
    });

    it("deduplicates email_verified events", () => {
      trackEmailVerified({ requires_approval: false });
      trackEmailVerified({ requires_approval: false });

      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith("email_verified", expect.objectContaining({
        requires_approval: false,
      }));
    });

    it("records authoritative account_activated once and persists timestamp", () => {
      useAuthStore.setState({
        user: {
          id: "usr_first_time_act",
          email: "founder@fintech.co.ke",
          name: "Founder",
          role: "STARTUP",
          emailVerified: true,
          mustChangePassword: false,
          createdAt: new Date().toISOString(),
          preferences: {},
        },
        isAuthenticated: true,
      });

      // First workflow completion
      recordAccountActivation({
        first_feature: "compliance_query",
        jurisdiction_code: "KE",
        plan_type: "STARTUP",
      });

      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith("account_activated", expect.objectContaining({
        first_feature: "compliance_query",
        jurisdiction_code: "KE",
        plan_type: "STARTUP",
      }));

      // Verify timestamp is persisted in user preferences
      const updatedUser = useAuthStore.getState().user;
      expect(updatedUser?.preferences?.accountActivatedAt).toBeDefined();

      // Subsequent workflow completion in same session or new workflow
      recordAccountActivation({
        first_feature: "compliance_checklist",
        jurisdiction_code: "KE",
        plan_type: "STARTUP",
      });

      // Should still be exactly 1 event
      expect(posthog.capture).toHaveBeenCalledTimes(1);
    });
  });

  describe("6. Normalized Product Feature Usage Model", () => {
    it("distinguishes passive surface viewing from active workflow completion", () => {
      // 1. Passive surface view
      trackFeatureUsage({
        feature_name: "compliance_dashboard",
        status: "viewed",
      });

      expect(posthog.capture).toHaveBeenCalledWith("feature_usage", {
        feature_name: "compliance_dashboard",
        status: "viewed",
      });

      // 2. Active workflow started
      trackFeatureUsage({
        feature_name: "gap_analysis",
        status: "started",
        jurisdiction_code: "KE",
      });

      expect(posthog.capture).toHaveBeenCalledWith("feature_usage", {
        feature_name: "gap_analysis",
        status: "started",
        jurisdiction_code: "KE",
      });

      // 3. Active workflow completed
      trackFeatureUsage({
        feature_name: "gap_analysis",
        status: "completed",
        jurisdiction_code: "KE",
      });

      expect(posthog.capture).toHaveBeenCalledWith("feature_usage", {
        feature_name: "gap_analysis",
        status: "completed",
        jurisdiction_code: "KE",
      });
    });

    it("differentiates pricing page vs homepage pricing section placements", () => {
      trackEvent("pricing_viewed", { placement: "pricing_page" });
      trackEvent("pricing_viewed", { placement: "homepage_pricing_section" });
      trackEvent("upgrade_clicked", { target_plan: "BUSINESS", placement: "feature_gate" });

      expect(posthog.capture).toHaveBeenCalledWith("pricing_viewed", { placement: "pricing_page" });
      expect(posthog.capture).toHaveBeenCalledWith("pricing_viewed", { placement: "homepage_pricing_section" });
      expect(posthog.capture).toHaveBeenCalledWith("upgrade_clicked", {
        target_plan: "BUSINESS",
        placement: "feature_gate",
      });
    });
  });
});
