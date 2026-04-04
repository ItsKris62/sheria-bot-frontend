/**
 * Centralised logo paths for all SheriaBot branding assets.
 *
 * Served from /public (Next.js static assets):
 *   hero-logo.png, navigation-bar-logo.png, footer-logo.png, favicon-logo.png
 *
 * Served from R2 public bucket (`sheria-bot-public`):
 *   branding/hero-with-text-logo.png
 *   branding/email-signature-logo.png
 */

const R2 = process.env.NEXT_PUBLIC_R2_ASSETS_URL ?? ''

export const LOGOS = {
  /** Icon-only mark — sidebars, auth pages, nav bars */
  hero: '/hero-logo.png',

  /** Full lockup: icon + "SheriaBot" wordmark — served from R2 */
  heroWithText: `${R2}/branding/hero-with-text-logo.png`,

  /** Horizontal nav-bar variant */
  navigationBar: '/navigation-bar-logo.png',

  /** Footer lockup */
  footer: '/footer-logo.png',

  /** Email signature (used by backend email templates via theme.ts) — served from R2 */
  emailSignature: `${R2}/branding/email-signature-logo.png`,

  /** Favicon — local path required for Next.js metadata */
  favicon: '/favicon-logo.png',

  /**
   * Absolute URL used in print/PDF exports — must be a full URL (not a relative
   * path) so the print window can resolve it without a base origin.
   * Served from the R2 public bucket.
   */
  exportLogo: `${R2}/branding/hero-logo.png`,
} as const
