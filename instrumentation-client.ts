import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Low sample rate for traces to conserve Sentry Free Tier transaction quota (10k/month)
    tracesSampleRate: 0.01,

    // Session Replay optimization (Sentry Free Tier has a limit of 50 replays/month)
    // 0% sample rate for normal sessions (replaysSessionSampleRate)
    // 10% sample rate for sessions containing errors (replaysOnErrorSampleRate)
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 0.1,

    // Define integrations
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Environment matching
    environment: process.env.NODE_ENV || "development",
  });
}

// Required export to instrument Next.js router transitions
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
