"use client"

import React, { useEffect, useState } from "react"
import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import posthog from "posthog-js"
import { PostHogProvider as ClientPostHogProvider } from "posthog-js/react"
import { useCookieConsent } from "@/components/privacy/cookie-consent-provider"
import { revokeOptionalStorage } from "@/lib/cookie-consent"
import { useAuthStore } from "@/lib/auth-store"
import { usePlan } from "@/lib/plan-context"
import { GA_MEASUREMENT_ID, clearAnalyticsUser, isAnalyticsAllowed, sanitizeUrlForAnalytics, setAnalyticsUser } from "@/lib/analytics"

function AnalyticsAuthSync() {
  const { user, isInitialized, isAuthenticated } = useAuthStore()
  const { plan, isPilotAccess } = usePlan()

  useEffect(() => {
    if (!isInitialized) return
    if (!isAnalyticsAllowed()) {
      clearAnalyticsUser()
      return
    }
    if (isAuthenticated && user) {
      setAnalyticsUser(user.id, {
        role: user.role,
        plan,
        pilot_status: isPilotAccess ? "active" : "none",
        organization_id: user.organizationId,
      })
    } else {
      clearAnalyticsUser()
    }
  }, [isInitialized, isAuthenticated, user, plan, isPilotAccess])
  return null
}

function AnalyticsPageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname || typeof window === "undefined" || !isAnalyticsAllowed()) return
    const rawQuery = searchParams?.toString() ? `?${searchParams.toString()}` : ""
    const cleanUrl = sanitizeUrlForAnalytics(`${window.origin}${pathname}${rawQuery}`)
    const cleanPath = sanitizeUrlForAnalytics(pathname)

    if (posthog.__loaded && !posthog.has_opted_out_capturing()) {
      posthog.capture("$pageview", { $current_url: cleanUrl })
    }
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag("event", "page_view", { page_location: cleanUrl, page_path: cleanPath })
    }
  }, [pathname, searchParams])
  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { consent } = useCookieConsent()
  const analyticsAllowed = consent?.analytics === true
  const [posthogReady, setPosthogReady] = useState(false)

  useEffect(() => {
    if (!analyticsAllowed) {
      isAnalyticsAllowed()
      if (posthog.__loaded) {
        posthog.reset()
        posthog.opt_out_capturing()
        if (consent) revokeOptionalStorage(consent)
      }
      // Consent is the external source of truth; immediately hide the initialized provider on revocation.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosthogReady(false)
      return
    }

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return
    if (!posthog.__loaded) {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
        persistence: "localStorage+cookie",
        opt_out_capturing_by_default: false,
        disable_session_recording: true,
        capture_pageview: false,
        capture_pageleave: true,
        autocapture: { css_selector_allowlist: ["[data-ph-capture]"] },
        session_recording: { maskAllInputs: true, maskTextSelector: "*" },
        loaded: (client) => {
          client.opt_in_capturing()
          setPosthogReady(true)
        },
      })
    } else {
      posthog.opt_in_capturing()
      setPosthogReady(true)
    }
  }, [analyticsAllowed, consent])

  const content = (
    <>
      {analyticsAllowed ? (
        <>
          <AnalyticsAuthSync />
          <React.Suspense fallback={null}><AnalyticsPageViewTracker /></React.Suspense>
          {GA_MEASUREMENT_ID ? (
            <>
              <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
              <Script id="google-analytics" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{send_page_view:false});`}
              </Script>
            </>
          ) : null}
          <Analytics />
          <SpeedInsights />
        </>
      ) : null}
      {children}
    </>
  )

  return posthogReady ? <ClientPostHogProvider client={posthog}>{content}</ClientPostHogProvider> : content
}
