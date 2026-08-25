"use client";

import React, { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as CSPostHogProvider } from "posthog-js/react";
import { useAuthStore } from "@/lib/auth-store";
import { usePlan } from "@/lib/plan-context";
import { usePathname, useSearchParams } from "next/navigation";

// Initialize PostHog client side only
if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
    // Privacy defaults
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "*", // Mask all text by default if replay is ever enabled
    },
    disable_session_recording: true, // Explicitly disable session replay as requested
    capture_pageview: false, // We'll handle this manually to ensure it's clean
    capture_pageleave: true,
    autocapture: {
      css_selector_allowlist: ["[data-ph-capture]"], // Only autocapture elements explicitly marked
    },
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") {
        posthog.debug(false);
      }
    },
  });
}

function PostHogAuthSync() {
  const { user, isInitialized, isAuthenticated } = useAuthStore();
  const { plan, isPilotAccess } = usePlan();

  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated && user) {
      const isSection34Restricted =
        user.preferences?.section34Restriction?.status === "RESTRICTED";

      if (isSection34Restricted) {
        // Section 34 Statutory Processing Restriction: forcibly disable PostHog telemetry & reset user state
        if (typeof posthog.opt_out_capturing === "function") {
          posthog.opt_out_capturing();
        }
        posthog.reset();
        return;
      }

      // Check cookie/analytics consent separately (conceptually separate from s.34 statutory restriction)
      const consentDenied =
        typeof window !== "undefined" &&
        localStorage.getItem("sheriabot:cookie_consent:analytics") === "denied";

      if (consentDenied) {
        if (typeof posthog.opt_out_capturing === "function") {
          posthog.opt_out_capturing();
        }
        return;
      }

      // Normal permitted & consented user: ensure opted in & identify
      if (typeof posthog.opt_in_capturing === "function") {
        posthog.opt_in_capturing();
      }

      posthog.identify(user.id, {
        role: user.role,
        plan: plan,
        pilot_status: isPilotAccess ? "active" : "none",
        organization_id: user.organizationId,
      });

      if (user.organizationId) {
        posthog.group("organization", user.organizationId, {
          plan: plan,
          pilot_status: isPilotAccess ? "active" : "none",
        });
      }
    } else {
      posthog.reset();
    }
  }, [isInitialized, isAuthenticated, user, plan, isPilotAccess]);

  return null;
}

function PostHogPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (pathname && posthog) {
      // Check Section 34 statutory restriction before emitting pageview
      if (user?.preferences?.section34Restriction?.status === "RESTRICTED") {
        return;
      }
      if (typeof posthog.has_opted_out_capturing === "function" && posthog.has_opted_out_capturing()) {
        return;
      }

      const params = new URLSearchParams(searchParams?.toString());
      if (pathname === "/blog" || pathname.startsWith("/blog/")) {
        params.delete("q");
        params.delete("query");
        params.delete("search");
      }
      const queryString = params.toString();
      const url = `${window.origin}${pathname}${queryString ? `?${queryString}` : ""}`;
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams, user]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // If no key is set, we can just return children to fail silently without breaking workflows
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return (
    <CSPostHogProvider client={posthog}>
      <PostHogAuthSync />
      <React.Suspense fallback={null}>
        <PostHogPageViewTracker />
      </React.Suspense>
      {children}
    </CSPostHogProvider>
  );
}
