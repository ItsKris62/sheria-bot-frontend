/** @type {import('next').NextConfig} */
import { withSentryConfig } from "@sentry/nextjs";


/**
 * Content-Security-Policy for the SheriaBot Next.js frontend.
 *
 * Notes:
 *  - 'unsafe-inline' on script-src is required for Next.js App Router hydration
 *    inline scripts until nonce-based CSP is implemented (future hardening).
 *  - 'unsafe-inline' on style-src is required for Tailwind CSS utility classes.
 *  - connect-src includes Supabase (auth + realtime) and the backend API.
 *    Update NEXT_PUBLIC_API_URL / Supabase project ref as needed.
 *  - frame-ancestors 'none' prevents clickjacking via iframes.
 */
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https:",
  // Allow audio files served from the Cloudflare R2 public bucket
  "media-src 'self' https://*.r2.dev",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // Apply security headers to every route
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // Suppresses source map uploading logs during bundling
  silent: true,
}, {
  // Upload a larger set of source maps for prettier stack traces (increases build time slightly)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their component name in breadcrumbs and profiles
  reactComponentAnnotation: { enabled: true },

  // Hides source maps from visitors
  hideSourceMaps: true,

  // Automatically tree-shakes Sentry logging statements to reduce bundle size
  disableLogger: true,
});
