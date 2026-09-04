"use client";

import React, { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as CSPostHogProvider } from "posthog-js/react";
import { useAuthStore } from "@/lib/auth-store";
import { usePlan } from "@/lib/plan-context";
import { usePathname, useSearchParams } from "next/navigation";
import {
  GA_MEASUREMENT_ID,
  isAnalyticsAllowed,
  sanitizeUrlForAnalytics,
  setAnalyticsUser,
  clearAnalyticsUser,
} from "@/lib/analytics";

// Initialize PostHog client side only if key is present
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
    // Privacy defaults
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "*", // Mask all text by default if replay is ever enabled
    },
    disable_session_recording: true, // Explicitly disable session replay
    capture_pageview: false, // Handled manually to ensure clean, sanitized URLs
    capture_pageleave: true,
    autocapture: {
      css_selector_allowlist: ["[data-ph-capture]"], // Only autocapture elements explicitly marked
    },
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") {
        ph.debug(false);
      }
    },
  });
}

function AnalyticsAuthSync() {
  const { user, isInitialized, isAuthenticated } = useAuthStore();
  const { plan, isPilotAccess } = usePlan();

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAnalyticsAllowed()) {
      clearAnalyticsUser();
      return;
    }

    if (isAuthenticated && user) {
      setAnalyticsUser(user.id, {
        role: user.role,
        plan: plan,
        pilot_status: isPilotAccess ? "active" : "none",
        organization_id: user.organizationId,
      });
    } else {
      clearAnalyticsUser();
    }
  }, [isInitialized, isAuthenticated, user, plan, isPilotAccess]);

  return null;
}

function AnalyticsPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || typeof window === "undefined") return;
    if (!isAnalyticsAllowed()) return;

    const rawQuery = searchParams?.toString() ? `?${searchParams.toString()}` : "";
    const rawUrl = `${window.origin}${pathname}${rawQuery}`;
    const cleanUrl = sanitizeUrlForAnalytics(rawUrl);
    const cleanPath = sanitizeUrlForAnalytics(pathname);

    // 1. PostHog pageview
    if (posthog && posthog.__loaded) {
      if (typeof posthog.has_opted_out_capturing !== "function" || !posthog.has_opted_out_capturing()) {
        posthog.capture("$pageview", {
          $current_url: cleanUrl,
        });
      }
    }

    // 2. GA4 pageview with sanitized page_location
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag("event", "page_view", {
        page_location: cleanUrl,
        page_path: cleanPath,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const content = (
    <>
      <AnalyticsAuthSync />
      <React.Suspense fallback={null}>
        <AnalyticsPageViewTracker />
      </React.Suspense>
      {children}
    </>
  );

  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <CSPostHogProvider client={posthog}>{content}</CSPostHogProvider>;
  }

  return <>{content}</>;
}
