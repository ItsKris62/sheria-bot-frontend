import { describe, it, expect, vi, beforeEach } from "vitest";
import posthog from "posthog-js";
import { trackEvent } from "@/lib/analytics";
import { useAuthStore } from "@/lib/auth-store";

vi.mock("posthog-js", () => {
  const mockPosthog = {
    __loaded: true,
    capture: vi.fn(),
    identify: vi.fn(),
    reset: vi.fn(),
    opt_out_capturing: vi.fn(),
    opt_in_capturing: vi.fn(),
    has_opted_out_capturing: vi.fn().mockReturnValue(false),
  };
  return { default: mockPosthog };
});

describe("PostHog / Client Analytics Section 34 Restriction Propagation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isInitialized: true,
      isLoading: false,
      accessToken: null,
    });
    vi.mocked(posthog.has_opted_out_capturing).mockReturnValue(false);
  });

  it("A. Normal permitted user: captures allowlisted telemetry events", () => {
    useAuthStore.setState({
      user: {
        id: "user-normal-1",
        email: "user@normal.com",
        name: "Normal User",
        role: "STARTUP",
        organizationId: "org-1",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        preferences: {
          section34Restriction: { status: "NONE" },
        },
      },
      isAuthenticated: true,
      isInitialized: true,
      isLoading: false,
      accessToken: "token-1",
    });

    trackEvent("compliance_query_opened", { plan: "STARTUP" });

    expect(posthog.capture).toHaveBeenCalledWith("compliance_query_opened", { plan: "STARTUP" });
  });

  it("B. Restricted user: Section 34 restriction suppresses all PostHog event captures", () => {
    useAuthStore.setState({
      user: {
        id: "user-restricted-1",
        email: "user@restricted.com",
        name: "Restricted User",
        role: "STARTUP",
        organizationId: "org-1",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        preferences: {
          section34Restriction: {
            status: "RESTRICTED",
            reason: "ACCURACY_CONTESTED",
            requestId: "DSAR-2026-001",
            restrictedPurposes: ["PRODUCT_TELEMETRY", "DIRECT_MARKETING"],
          },
        },
      },
      isAuthenticated: true,
      isInitialized: true,
      isLoading: false,
      accessToken: "token-restricted",
    });

    trackEvent("compliance_query_opened", { plan: "STARTUP" });

    // Zero PostHog events emitted for Section 34 restricted users
    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it("C. Restriction lifted: PostHog event capture resumes normally", () => {
    useAuthStore.setState({
      user: {
        id: "user-lifted-1",
        email: "user@lifted.com",
        name: "Lifted User",
        role: "STARTUP",
        organizationId: "org-1",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        preferences: {
          section34Restriction: {
            status: "LIFTED",
            liftedAt: new Date().toISOString(),
            liftReason: "Accuracy verified pursuant to s.34(2)(b)",
          },
        },
      },
      isAuthenticated: true,
      isInitialized: true,
      isLoading: false,
      accessToken: "token-lifted",
    });

    trackEvent("compliance_query_opened", { plan: "STARTUP" });

    expect(posthog.capture).toHaveBeenCalledWith("compliance_query_opened", { plan: "STARTUP" });
  });

  it("D. Analytics cookie consent separately denied: PostHog opted out independently of Section 34", () => {
    // User is NOT restricted under Section 34, but opted out via cookie consent
    useAuthStore.setState({
      user: {
        id: "user-normal-2",
        email: "user2@normal.com",
        name: "Normal User 2",
        role: "STARTUP",
        organizationId: "org-2",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        preferences: {
          section34Restriction: { status: "NONE" },
        },
      },
      isAuthenticated: true,
      isInitialized: true,
      isLoading: false,
      accessToken: "token-2",
    });

    // Mock PostHog reporting that client has opted out due to cookie preferences
    vi.mocked(posthog.has_opted_out_capturing).mockReturnValue(true);

    trackEvent("compliance_query_opened", { plan: "STARTUP" });

    // Opted out capturing prevents event emission
    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
