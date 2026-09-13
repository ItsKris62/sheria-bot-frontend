/**
 * Frontend Plan Configuration — mirrors backend plans.config.ts
 *
 * IMPORTANT: Keep this file in sync with:
 *   fintech-regulatory-backend/src/config/plans.config.ts
 *
 * The backend is the source of truth for entitlements (enforced server-side).
 * This file is the source of truth for UI display on the frontend.
 * Both the pricing page AND billing settings page import from here.
 *
 * Catalog Version: 2026-09-01
 * Convention: -1 = unlimited, 0 = disabled/unavailable, null = not applicable.
 */

export const CATALOG_VERSION = '2026-09-01';

export type PlanId =
  | 'FREE'
  | 'STARTER'
  | 'GROWTH'
  | 'BUSINESS'
  | 'ENTERPRISE'
  | 'STARTUP'
  | 'REGULATOR';

export interface PlanFeatureRow {
  text: string;
  included: boolean;
}

export type PlanCta =
  | { type: 'none' }
  | { type: 'subscribe'; label: string }
  | { type: 'contact-sales'; label: string };

export interface PlanConfig {
  id: PlanId;
  name: string;
  tagline: string;
  seats: number;
  maxEnabledCountries: number;
  price: {
    monthly: number | null;
    yearly: number | null;
    currency: 'KES';
  };
  badge: 'Free' | 'Most Popular' | 'Custom' | null;
  cta: PlanCta;
  popular: boolean;
  trialDays: number;
  features: PlanFeatureRow[];
}

export interface ComparisonRow {
  feature: string;
  free: string;
  starter: string;
  growth: string;
  business: string;
  enterprise: string;
}

// ── Canonical 5-tier plan configurations ────────────────────────────────────

export const PLANS: Record<PlanId, PlanConfig> = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    tagline: 'Basic evaluation access for solo users in their home country',
    seats: 1,
    maxEnabledCountries: 1,
    price: { monthly: 0, yearly: 0, currency: 'KES' },
    badge: 'Free',
    cta: { type: 'none' },
    popular: false,
    trialDays: 0,
    features: [
      { text: 'Bounded evaluation queries in home country', included: true },
      { text: 'Read-only regulatory knowledge base', included: true },
      { text: '1 user seat', included: true },
      { text: 'Single home jurisdiction', included: true },
      { text: 'Automated compliance checklists', included: false },
      { text: 'Gap analysis tool', included: false },
      { text: 'Multi-country comparison', included: false },
    ],
  },

  STARTER: {
    id: 'STARTER',
    name: 'Starter',
    tagline: 'For solo compliance professionals and early startups',
    seats: 1,
    maxEnabledCountries: 1,
    price: { monthly: 7500, yearly: 76500, currency: 'KES' },
    badge: null,
    cta: { type: 'subscribe', label: 'Get Started' },
    popular: false,
    trialDays: 14,
    features: [
      { text: 'Cited compliance queries in home country', included: true },
      { text: 'Quick gap analysis', included: true },
      { text: 'Regulatory alerts & calendar', included: true },
      { text: 'Compliance checklists & license tracking', included: true },
      { text: '1 seat & 1 home jurisdiction', included: true },
      { text: 'Standard/Deep analysis', included: false },
      { text: 'Multi-country comparison', included: false },
    ],
  },

  GROWTH: {
    id: 'GROWTH',
    name: 'Growth',
    tagline: 'For growing teams requiring collaboration and standard analysis',
    seats: 2,
    maxEnabledCountries: 1,
    price: { monthly: 15000, yearly: 153000, currency: 'KES' },
    badge: null,
    cta: { type: 'subscribe', label: 'Get Started' },
    popular: false,
    trialDays: 14,
    features: [
      { text: 'Everything in Starter', included: true },
      { text: 'Quick & Standard gap analysis', included: true },
      { text: '2-person team collaboration', included: true },
      { text: 'Audit trail & activity tracking', included: true },
      { text: '1 home jurisdiction', included: true },
      { text: 'Multi-country comparison', included: false },
    ],
  },

  BUSINESS: {
    id: 'BUSINESS',
    name: 'Business',
    tagline: 'Multi-country compliance and full analysis for scaling fintechs',
    seats: 6,
    maxEnabledCountries: 2,
    price: { monthly: 35000, yearly: 357000, currency: 'KES' },
    badge: 'Most Popular',
    cta: { type: 'subscribe', label: 'Start Free Trial' },
    popular: true,
    trialDays: 14,
    features: [
      { text: 'Everything in Growth', included: true },
      { text: 'All analysis depths (Quick, Standard, Comprehensive, Deep)', included: true },
      { text: 'Multi-country access & comparison (up to 2 countries)', included: true },
      { text: '6 pooled team seats with RBAC', included: true },
      { text: 'Team MFA security posture', included: true },
      { text: 'Priority support', included: true },
    ],
  },

  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    tagline: 'Custom frameworks, policy generation, and regional pan-African compliance',
    seats: 12,
    maxEnabledCountries: 4,
    price: { monthly: 75000, yearly: 765000, currency: 'KES' },
    badge: 'Custom',
    cta: { type: 'contact-sales', label: 'Contact Sales' },
    popular: false,
    trialDays: 0,
    features: [
      { text: 'Everything in Business', included: true },
      { text: 'AI Policy Generator & Refinement', included: true },
      { text: 'Custom regulatory frameworks & legal corpus management', included: true },
      { text: 'Up to 4 enabled jurisdictions (KE, RW, MW, NG)', included: true },
      { text: '12+ team seats (customizable)', included: true },
      { text: 'Dedicated account manager & SLA guarantee', included: true },
    ],
  },

  // Compatibility aliases for legacy accounts
  STARTUP: {
    id: 'STARTUP',
    name: 'Startup (Legacy)',
    tagline: 'Legacy startup plan',
    seats: 1,
    maxEnabledCountries: 1,
    price: { monthly: 4999, yearly: 49790, currency: 'KES' },
    badge: null,
    cta: { type: 'subscribe', label: 'Manage Plan' },
    popular: false,
    trialDays: 14,
    features: [
      { text: 'Legacy single-country compliance queries', included: true },
      { text: 'Basic checklists & alerts', included: true },
    ],
  },

  REGULATOR: {
    id: 'REGULATOR',
    name: 'Regulator (Legacy)',
    tagline: 'For government regulatory bodies',
    seats: 1,
    maxEnabledCountries: 1,
    price: { monthly: 0, yearly: 0, currency: 'KES' },
    badge: 'Free',
    cta: { type: 'none' },
    popular: false,
    trialDays: 0,
    features: [
      { text: 'Read-only regulatory knowledge base', included: true },
      { text: 'Regulatory dashboard', included: true },
    ],
  },
};

// ── Plan ordered list (canonical 5 tiers) ───────────────────────────────────

export const PLAN_ORDER: PlanId[] = [
  'FREE',
  'STARTER',
  'GROWTH',
  'BUSINESS',
  'ENTERPRISE',
];

// ── Plans shown on the public pricing page ──────────────────────────────────

export const PUBLIC_PRICING_PLANS: PlanConfig[] = [
  PLANS.STARTER,
  PLANS.GROWTH,
  PLANS.BUSINESS,
  PLANS.ENTERPRISE,
];

// ── Feature comparison table ─────────────────────────────────────────────────

export const PLAN_COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: 'Team Seats',
    free: '1',
    starter: '1',
    growth: '2',
    business: '6 total',
    enterprise: '12 (Customizable)',
  },
  {
    feature: 'Enabled Jurisdictions',
    free: '1 (Home)',
    starter: '1 (Home)',
    growth: '1 (Home)',
    business: 'Up to 2',
    enterprise: 'Up to 4',
  },
  {
    feature: 'Multi-Country Comparison',
    free: '-',
    starter: '-',
    growth: '-',
    business: 'Yes (within 2)',
    enterprise: 'Yes (within 4)',
  },
  {
    feature: 'Gap Analysis',
    free: '-',
    starter: 'Quick',
    growth: 'Quick & Standard',
    business: 'All Depths',
    enterprise: 'All Depths',
  },
  {
    feature: 'AI Policy Generator',
    free: '-',
    starter: '-',
    growth: '-',
    business: '-',
    enterprise: 'Yes',
  },
  {
    feature: 'Custom Frameworks',
    free: '-',
    starter: '-',
    growth: '-',
    business: '-',
    enterprise: 'Yes',
  },
  {
    feature: 'Support SLA',
    free: 'Community',
    starter: 'Standard',
    growth: 'Standard',
    business: 'Priority (24h)',
    enterprise: 'Dedicated (4h)',
  },
];

// ── Display helpers ───────────────────────────────────────────────────────────

export function formatPrice(price: number | null, currency: 'KES'): string {
  if (price === null) return 'Custom';
  if (price === 0) return 'Free';
  return `${currency} ${price.toLocaleString('en-KE')}`;
}

export function getAnnualSavings(plan: PlanConfig): string | null {
  if (plan.price.monthly === null || plan.price.yearly === null) return null;
  if (plan.price.monthly === 0) return null;
  const annualIfMonthly = plan.price.monthly * 12;
  const savings = Math.round(((annualIfMonthly - plan.price.yearly) / annualIfMonthly) * 100);
  return savings > 0 ? `Save ${savings}%` : null;
}
