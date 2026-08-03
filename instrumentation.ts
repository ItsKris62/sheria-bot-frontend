import type { Instrumentation } from "next/dist/server/instrumentation/types";

function isSentryEnabled() {
  return process.env.DISABLE_SENTRY !== "true" && Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);
}

export async function register() {
  if (!isSentryEnabled()) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Next.js 15+ standard hook to capture server-side rendering and middleware errors automatically
export const onRequestError: Instrumentation.onRequestError = async (...args) => {
  if (!isSentryEnabled()) return;

  const Sentry = await import("@sentry/nextjs");
  return Sentry.captureRequestError(...args);
};
