import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Low sample rate for traces to conserve Sentry Free Tier transaction quota (10k/month)
    tracesSampleRate: 0.01,

    // Environment matching
    environment: process.env.NODE_ENV || "development",
  });
}
