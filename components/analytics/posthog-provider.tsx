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
  const { plan, isPilotAccess, entitlements, hasFeature } = usePlan();

  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated && user) {
      // Create a hashed version of the ID to avoid raw PII (if user ID is considered sensitive)
      // Since it's an internal SaaS, using the raw ID is usually fine, but we will use it safely.
      // We will not send email or name.
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

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

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
