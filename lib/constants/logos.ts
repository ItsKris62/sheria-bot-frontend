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

/**
 * Regulator logos for marquee display.
 * These match the structure expected by the LogoMarquee component.
 */
export const REGULATOR_LOGOS = [
  {
    name: "Central Bank of Kenya",
    abbreviation: "CBK",
    logo: "/logos/CBK_LOGO.png-removebg-preview.png",
  },
  {
    name: "Capital Markets Authority",
    abbreviation: "CMA",
    logo: "/logos/CMA_Logo-removebg-preview.png",
  },
  { name: "Office of the Data Protection Commissioner", 
    abbreviation: "ODPC",
    logo: "/logos/ODPC-Logo-removebg-preview.png",
   },
  {
    name: "Communications Authority of Kenya",
    abbreviation: "CA",
    logo: "/logos/CA-logo-removebg-preview.png",
  },
  {
    name: "Insurance Regulatory Authority",
    abbreviation: "IRA",
    logo: "/logos/IRA-Logo-removebg-preview.png",
  },
  {
    name: "Financial Reporting Centre",
    abbreviation: "FRC",
    logo: "/logos/FRC-Logo-removebg-preview.png",
  },
  {
    name: "Kenya Revenue Authority",
    abbreviation: "KRA",
    logo: "/logos/KRA-Logo-removebg-preview.png",
  },
  { name: "Retirement Benefits Authority", 
    abbreviation: "RBA",
    logo: "/logos/RBA-Logo-removebg-preview.png",
  },
  /**{ name: "Competition Authority of Kenya", abbreviation: "CAK" },
  { name: "National Treasury", abbreviation: "NT" },
  { name: "Kenya Bankers Association", abbreviation: "KBA" },
  { name: "Fintech Association of Kenya", abbreviation: "FAK" },*/
] as const
