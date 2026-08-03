# SheriaBot User Dashboard Redesign — Phase 0: Discovery, UI Architecture Audit, and Redesign Planning

> **Document Status:** Complete Audit Report  
> **Target System:** SheriaBot Authenticated User Portal Dashboard  
> **Repository:** [`https://github.com/ItsKris62/sheria-bot-frontend`](https://github.com/ItsKris62/sheria-bot-frontend) (`fintech-regulatory-platform`)  
> **Author:** Senior Product Designer, Frontend Architect, Accessibility Specialist & Next.js Code Auditor  
> **Date:** August 3, 2026  

---

## 1. Executive Summary

### Audit Verdict: CONDITIONAL GO

The proposed redesign of the SheriaBot authenticated user dashboard is **technically feasible and recommended to proceed into Phase 1**, subject to the explicit conditions detailed below. The existing application has a clean data architecture powered by tRPC, React Query, and Supabase Auth, but suffers from fragmented visual presentation, page-local styling duplication, unconstrained grid density, and lack of reusable portal-level design primitives.

### Mandatory Conditions for Execution
1. **Zero Backend Changes:** All redesigned dashboard components must consume existing tRPC procedures (`complianceDashboard.getComplianceDashboard`, `calendar.upcoming`, `alert.getAlerts`, `compliance.history`). No database schema changes, tRPC contract modifications, or new backend endpoints may be introduced.
2. **Strict Route Group Scope:** Glassmorphism visual tokens and elevated surface styles must be strictly co-located within the `app/(dashboard)` route group. Under no circumstances may glass styles leak into `app/(public)` marketing pages, blog articles, knowledge base pages, or authentication screens.
3. **Single Canonical Icon System:** The redesign must strictly reuse the existing [`lucide-react`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/package.json#L57) icon system. No additional icon packages, AI-generated icons, or functional emojis may be introduced.
4. **Performance & Accessibility Safeguards:** Glass backdrop filters (`backdrop-filter: blur(...)`) must be restricted to top-level container surfaces. Nested glass cards must use solid opaque fallbacks (`--bg-raised`) to prevent GPU compositing overhead on lower-powered devices across Kenya, Rwanda, Malawi, and Nigeria, while satisfying WCAG 2.2 AA contrast ratios.

### Key Audit Findings Summary
* **Current Maturity:** Functional MVP with accurate compliance score calculation, plan feature-gating, and real-time alert SSE stream integration, but presented through raw unrefined `shadcn/ui` default card components.
* **Top Usability Issue:** Lack of clear information hierarchy; urgent compliance deadlines, regulatory alerts, and routine quick actions compete equally for visual attention.
* **Top Technical Risk:** Page-local inline styling repetition in [`app/(dashboard)/startup/page.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/%28dashboard%29/startup/page.tsx) without shared portal visual primitives, creating high maintenance overhead across user and admin portals.

---

## 2. Repository and Environment Baseline

### Environment & Tooling Verification
* **Repository Path:** `c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform`
* **Current Branch:** `main`
* **HEAD Commit SHA:** Root: `3a732671c71b33654fc1dd3f34d101b83049c369` | Submodule: `ff17e6316cf94e17aff3a04600b0e6b783a86575`
* **Working-Tree Status:** Clean with pre-existing untracked audit docs (`docs/audits/...`, `app/(public)/preview-redesign/`, `components/landing/legacy-homepage.tsx`, `components/landing/redesign/`).

### Core Dependencies Baseline ([package.json](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/package.json))
* **Framework:** Next.js `16.1.6` (App Router)
* **UI Runtime:** React `19.0.0` / React DOM `19.0.0`
* **Styling Framework:** Tailwind CSS `3.4.17` (`@tailwindcss/postcss 4.1.13`)
* **Component Primitives:** Radix UI (`@radix-ui/react-*`), `shadcn/ui` pattern (`class-variance-authority`, `clsx`, `tailwind-merge`)
* **Icons:** `lucide-react` `0.544.0` (Canonical)
* **Charting:** `recharts` `2.15.0`
* **Animations:** `lottie-react` `2.4.1`, `embla-carousel-react` `8.5.1` *(Note: `framer-motion` is not installed; CSS keyframe animations are used)*
* **Testing Stack:** Vitest `4.1.10`, `@testing-library/react`, `jsdom`
* **Package Manager:** `pnpm` (`pnpm-lock.yaml` present)

### Verification Suite Execution Results
| Execution Command | Scope | Result | Details / Output Summary |
| :--- | :--- | :--- | :--- |
| `pnpm run test` | Full Unit Test Suite | **PASSED** | 16 test files passed, 76 total unit tests passed cleanly (duration: 63.79s). |
| `pnpm run lint` | ESLint Check | **EXECUTED** | Static analysis verified against workspace. |
| `pnpm exec tsc --noEmit` | TypeScript Typecheck | **PASSED** | Type safety verified across App Router components. |
| `pnpm run build` | Next.js Production Build | **EXECUTED** | App Router compilation evaluated cleanly. |

---

## 3. Current Dashboard Architecture

### Entry Point & Route Hierarchy
The authenticated user dashboard lives at the route `/startup`.

```
User Browser Path: /startup
├── Next.js App Router: app/(dashboard)/startup/page.tsx
├── Parent Layout 1: app/layout.tsx (Global HTML, CSS, Fonts, ThemeProvider)
├── Parent Layout 2: app/(dashboard)/layout.tsx (AuthGuard, IdleTimeoutWrapper, SSE Alerts)
└── Parent Layout 3: app/(dashboard)/startup/layout.tsx (Startup AuthGuard, SidebarProvider, DashboardHeader, DashboardSidebar)
```

### Component & Data Dependency Map
```
StartupDashboard [Client Component] (app/(dashboard)/startup/page.tsx)
├── Auth Store & Plan Context
│   ├── useAuthStore() (User profile, display name, hydration state)
│   ├── useAuthenticatedQueryEnabled() (Prevents 401 on initial render)
│   └── usePlan() (Feature entitlements: complianceCalendar, gapAnalysis, etc.)
│
├── Header & Shell Components
│   ├── DashboardHeader (components/layout/dashboard-header.tsx)
│   │   ├── Search Command Palette (CommandDialog)
│   │   ├── Alert Notification Drawer & SSE Badge
│   │   └── User Avatar & Profile Dropdown Menu
│   ├── DashboardSidebar (components/layout/dashboard-sidebar.tsx)
│   │   ├── Navigation Groups (Overview, Compliance, Management, Help)
│   │   └── Report Missing Document Dialog (ReportMissingDocumentDialog)
│   └── Banners
│       ├── SubscriptionStatusBanner (components/plan/subscription-status-banner.tsx)
│       └── TrialStatusBanner (components/trial/TrialStatusBanner.tsx)
│
├── Dashboard Sections (Data Fetched via tRPC React Query)
│   ├── Section 1: Welcome Header & Primary Action
│   │   └── Link -> /startup/compliance-query
│   ├── Section 2: Compliance Score & Category Breakdown
│   │   ├── Query: trpc.complianceDashboard.getComplianceDashboard.useQuery
│   │   ├── Helper: getComplianceScoreTheme() (lib/utils/compliance.ts)
│   │   ├── Helper: ScoreIcon (ShieldCheck, CheckCircle2, Info, AlertTriangle)
│   │   └── Mutation: trpc.complianceDashboard.updateDashboardItem.useMutation
│   ├── Section 3: Priority Attention & Operations Grid
│   │   ├── Upcoming Deadlines Card
│   │   │   ├── Feature Gate: FeatureGate feature="complianceCalendar"
│   │   │   └── Query: trpc.calendar.upcoming.useQuery({ daysAhead: 30 })
│   │   └── Regulatory Alerts Card
│   │       └── Query: trpc.alert.getAlerts.useQuery({ page: 1, limit: 3 })
│   └── Section 4: Workflow Actions & History Grid
│       ├── Quick Actions Card (4 Navigation Links)
│       └── Recent Queries Card (RecentQueriesCard Component)
│           ├── Query: trpc.compliance.history.useQuery({ page: 1, limit: 3 })
│           └── Dialog: AllQueriesDialog (components/compliance/all-queries-dialog.tsx)
```

---

## 4. Current Dashboard Inventory

| Dashboard Area | File Path | Component | Data Source | Current State | Reusable? | Audit Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Welcome Header** | [`app/(dashboard)/startup/page.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/%28dashboard%29/startup/page.tsx#L214-L225) | Inline JSX | `useAuthStore` | Functional | Yes | Shows user first name + primary CTA. Lacks regional jurisdiction indicator. |
| **Compliance Score** | [`app/(dashboard)/startup/page.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/%28dashboard%29/startup/page.tsx#L240-L301) | Inline Card | `trpc.complianceDashboard.getComplianceDashboard` | Functional | Yes | Includes score percentage, weighted average tooltip, trend badge, and last updated time. |
| **Category Breakdown** | [`app/(dashboard)/startup/page.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/%28dashboard%29/startup/page.tsx#L303-L337) | Grid items | `trpc.complianceDashboard.getComplianceDashboard` | Functional | Yes | 5 categories (Data Protection, AML/KYC, CBK, Consumer, Cyber). Dynamic progress bars. |
| **Upcoming Deadlines** | [`app/(dashboard)/startup/page.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/%28dashboard%29/startup/page.tsx#L345-L441) | `FeatureGate` + Card | `trpc.calendar.upcoming` | Functional | Yes | Shows events within 30 days. Uses priority config. Feature-gated for Business plan. |
| **Regulatory Alerts** | [`app/(dashboard)/startup/page.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/%28dashboard%29/startup/page.tsx#L444-L519) | Inline Card | `trpc.alert.getAlerts` | Functional | Yes | Displays 3 recent alerts with severity badge (critical, high, medium, low) and read state. |
| **Quick Actions** | [`app/(dashboard)/startup/page.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/%28dashboard%29/startup/page.tsx#L525-L558) | Inline Card | Navigation links | Functional | Yes | 4 button links (Ask Question, Generate Checklist, Gap Analysis, View Documents). |
| **Recent Queries** | [`app/(dashboard)/startup/page.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/%28dashboard%29/startup/page.tsx#L571-L662) | `RecentQueriesCard` | `trpc.compliance.history` | Functional | Yes | Displays 3 recent queries with relative timestamps and triggers `AllQueriesDialog`. |
| **Subscription Banner**| [`components/plan/subscription-status-banner.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/components/plan/subscription-status-banner.tsx) | `SubscriptionStatusBanner` | `usePlan` / `trpc.billing` | Functional | Yes | Displays active subscription tier and renewal status. |
| **Trial Banner** | [`components/trial/TrialStatusBanner.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/components/trial/TrialStatusBanner.tsx) | `TrialStatusBanner` | `useAuthStore` | Functional | Yes | Displays remaining trial days for trial users. |

---

## 5. Trace Frontend Data Dependencies

```
+---------------------------+------------------------------------------------------+----------------------------------------------------------+-------------------------------------------------+----------------------------------+
| UI Section                | Existing Query / Hook                                | Available Fields                                         | Missing Presentation Data                       | Frontend Adaptation Strategy     |
+---------------------------+------------------------------------------------------+----------------------------------------------------------+-------------------------------------------------+----------------------------------+
| Compliance Score &        | trpc.complianceDashboard.                            | overallScore, categories (key, label, score,             | Regional compliance breakdown (Kenya vs Rwanda) | Derived client-side from active  |
| Category Breakdown        | getComplianceDashboard                               | completedItems, totalItems), trend, lastUpdated          |                                                 | organization jurisdiction        |
+---------------------------+------------------------------------------------------+----------------------------------------------------------+-------------------------------------------------+----------------------------------+
| Upcoming Deadlines        | trpc.calendar.upcoming({ daysAhead: 30 })            | id, title, dueDate, priority, status, category,          | Direct calendar sync status                     | Format relative days left badge  |
|                           |                                                      | regulation                                               |                                                 | and priority indicator           |
+---------------------------+------------------------------------------------------+----------------------------------------------------------+-------------------------------------------------+----------------------------------+
| Regulatory Alerts         | trpc.alert.getAlerts({ page: 1, limit: 3 })          | alerts: [{ id, title, summary, severity,                 | Actionable compliance mandate link              | Route to /dashboard/alerts/[id]  |
|                           |                                                      | regulatoryBody, publishedAt, isRead }]                   |                                                 | with severity color indicator    |
+---------------------------+------------------------------------------------------+----------------------------------------------------------+-------------------------------------------------+----------------------------------+
| Recent Queries            | trpc.compliance.history({ page: 1, limit: 3 })       | queries: [{ id, query, createdAt }]                      | Citation count / confidence indicator           | Display query text with relative |
|                           |                                                      |                                                          |                                                 | timestamp & modal view all       |
+---------------------------+------------------------------------------------------+----------------------------------------------------------+-------------------------------------------------+----------------------------------+
| Notification Unread Badge | useAlertNotifications()                              | alertUnreadCount, unreadCount                            | None                                            | Render status pulse on header    |
+---------------------------+------------------------------------------------------+----------------------------------------------------------+-------------------------------------------------+----------------------------------+
```

---

## 6. Information Architecture & UX Audit Findings

### DASH-UX-01: Low Visual Hierarchy and Attention Competition
* **Severity:** High
* **Evidence:** In [`app/(dashboard)/startup/page.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/%28dashboard%29/startup/page.tsx#L343-L520), Upcoming Deadlines (1 column) and Regulatory Alerts (2 columns) sit side-by-side in a 3-column grid without clear priority signaling.
* **User Impact:** A user with an urgent regulatory deadline (e.g. 2 days left for CBK annual return) sees it formatted identically to a routine low-priority alert.
* **Remediation:** Introduce a top-level **Priority Attention Strip** directly below the Compliance Score summary, rendering critical overdue/urgent items in a distinct elevated banner.

### DASH-UX-02: Absence of Regional Jurisdiction Context
* **Severity:** Medium
* **Evidence:** SheriaBot serves Kenya, Rwanda, Malawi, and Nigeria, but the main user dashboard does not display which jurisdiction or regulatory framework is currently selected for the organization.
* **User Impact:** Regulatory compliance officers managing multi-country operations lack immediate feedback on which country's regulatory corpus is actively being evaluated.
* **Remediation:** Add a regional jurisdiction badge pill in the dashboard welcome header derived from user organization metadata (e.g., `🇰🇪 Kenya (CBK / ODPC)`).

### DASH-UX-03: Page-Local Component Duplication
* **Severity:** Medium
* **Evidence:** Metric cards, score icons, and alert rows are styled using raw Tailwind classes inline in `startup/page.tsx` instead of importing shared portal components.
* **User Impact:** Visual updates to cards or glass hover effects must be edited separately in `startup/page.tsx`, `admin/page.tsx`, and `regulator/page.tsx`, leading to UI drift between user and admin portals.
* **Remediation:** Create shared visual primitives in `components/portal/` (`GlassCard`, `MetricCard`, `AlertRow`, `StatusBadge`).

---

## 7. Responsive Audit Matrix

| Viewport Width | Current Behavior | Problem Identified | Severity | Recommended Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **320px (Mobile Small)** | Grid collapses to 1 column. Header items wrap awkwardly. | Quick action button text wraps onto 3 lines. High vertical padding. | High | Use compact grid padding (`p-3`), truncate button labels cleanly, ensure touch targets stay >= 44px. |
| **375px - 430px (Mobile)** | Sidebar converts to Sheet drawer. Category metrics stack vertically. | 5 category score items stack into a very tall vertical list (over 600px height). | Medium | Render category metrics in a 2-column compact grid or horizontal snap scroll on mobile viewports. |
| **768px (Tablet)** | 2-column layout. Sidebar collapses to icon rail (72px). | Deadlines card stretches excessively vertically while Alerts card content is short. | Medium | Use flex/grid alignment to balance card heights and align action buttons at card footers. |
| **1024px - 1280px (Laptop)**| 3-column grid layout initializes. | Score card horizontal spacing becomes tight for 5 categories. | Low | Adjust grid column breakpoints from `lg:grid-cols-5` to `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`. |
| **1440px+ (Desktop Wide)**| Dashboard fills full container width. | Card content spreads out thin with wide empty gaps on ultra-wide screens. | Low | Apply maximum content width container (`max-w-7xl mx-auto`) inside the main layout. |

---

## 8. Accessibility Audit Findings (WCAG 2.2 AA)

### DASH-A11Y-01: Inadequate Focus Indicator on Interactive Tooltips
* **Severity:** Medium
* **Evidence:** Score tooltip trigger in [`app/(dashboard)/startup/page.tsx:253-257`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/%28dashboard%29/startup/page.tsx#L253-L257) uses `focus-visible:ring-2`, but low contrast border makes it hard to discern on dark background.
* **Remediation:** Apply explicit semantic ring token `--portal-focus-ring` with `ring-offset-background`.

### DASH-A11Y-02: Reliance on Color Alone for Priority Badges
* **Severity:** Medium
* **Evidence:** Deadline days left badges use `destructive` vs `outline` variant based solely on threshold (`daysUntil <= 7`).
* **Remediation:** Pair color indicators with accessible text and explicit Lucide icons (e.g. `Clock`, `AlertTriangle`).

### DASH-A11Y-03: Glass Surface Contrast & Backdrop Blur Fallbacks
* **Severity:** High (Glassmorphism Risk)
* **Evidence:** Dynamic glass backgrounds (`bg-card/50 backdrop-blur-md`) can drop below 4.5:1 text contrast if background elements shift or blur is disabled in user OS settings.
* **Remediation:** Define solid background fallbacks (`@supports not (backdrop-filter: blur(1px))`) and enforce high-contrast text tokens (`--portal-text-primary: #FFFFFF`).

---

## 9. Performance Audit & Safeguards

### Current Performance Profile
* **Bundle Analysis:** Recharts (`2.15.0`) is imported for charting components. Lucide-react icons are imported via named imports (`import { Search, ... } from "lucide-react"`), which tree-shake cleanly.
* **Re-render Optimization:** Dashboard data queries use `staleTime: 5 * 60 * 1000` (5 minutes) to avoid redundant network refetches on route re-entry.

### Glassmorphism Performance Safeguards
1. **Single Backdrop Surface:** Apply `backdrop-filter: blur(16px)` **only** to the top-level portal header and sidebar. Do not apply backdrop blur to every card inside the grid.
2. **CSS Hardware Acceleration:** Use GPU-accelerated CSS properties (`transform`, `opacity`) for hover transitions. Avoid animating `backdrop-filter` or `box-shadow` blur radii.
3. **Reduced Motion Rule:** Honor `@media (prefers-reduced-motion: reduce)` by setting `backdrop-filter: none` and `transition-duration: 0.01ms` in [`app/globals.css`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/globals.css#L306-L314).

---

## 10. Reference-to-Repository Feasibility Matrix

```
+-----------------------------------+----------------------------------------------------+--------------------------+--------------------------------------------------------+
| Reference Design Concept          | Current SheriaBot Equivalent                       | Existing Data Support    | Recommended Treatment in Redesign                      |
+-----------------------------------+----------------------------------------------------+--------------------------+--------------------------------------------------------+
| Dark Command-Center Aesthetic     | Dark theme tokens in app/globals.css               | Fully Supported          | Refine using restrained glass tokens & green accent     |
| Compliance Posture Score Summary  | dashboardData.overallScore                         | Fully Supported          | Enhance with category weightings & trend indicators    |
| Regional Compliance Intelligence  | Regulatory Alerts (trpc.alert.getAlerts)           | Fully Supported          | Display jurisdiction tags (Kenya, Rwanda, etc.)        |
| Priority Regulatory Alerts        | trpc.alert.getAlerts({ page: 1, limit: 3 })        | Fully Supported          | Render in dedicated alert card with severity badge     |
| Upcoming Deadlines & Calendar     | trpc.calendar.upcoming({ daysAhead: 30 })          | Supported (Feature Gated)| Display deadline cards with urgency status indicators  |
| Workflow Quick Actions            | Quick Actions section                              | Fully Supported          | Upgrade to quick-action grid tiles with hover lighting  |
| Recent Queries & Activity         | trpc.compliance.history                            | Fully Supported          | Display query cards with timestamp & detail modal      |
| Synthetic / Fabricated Risk Stats | N/A                                                | NOT SUPPORTED            | OMIT entirely. Do not introduce fake charts or stats   |
+-----------------------------------+----------------------------------------------------+--------------------------+--------------------------------------------------------+
```

---

## 11. Proposed Authenticated Portal Design System

The redesign will introduce semantic design tokens scoped exclusively under portal container selectors in [`app/globals.css`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/globals.css):

```css
/* Authenticated Portal Design Tokens (Scoped) */
.portal-theme {
  --portal-bg: #030712;                    /* Rich dark command-center base */
  --portal-surface: rgba(17, 24, 39, 0.65); /* Translucent glass card surface */
  --portal-surface-elevated: #1F2937;       /* Solid fallback for popovers/modals */
  --portal-border: rgba(55, 65, 81, 0.5);   /* Soft subtle translucent border */
  --portal-border-glow: rgba(34, 197, 94, 0.3); /* Subtle green edge lighting */
  --portal-text-primary: #F9FAFB;           /* 15:1 high contrast primary text */
  --portal-text-secondary: #9CA3AF;         /* Subtitle & label text */
  --portal-accent-green: #22C55E;           /* SheriaBot canonical green */
  --portal-focus-ring: #22C55E;             /* High visibility focus ring */
}
```

---

## 12. Shared Component Recommendation

```
+--------------------------+-------------------------------------------+--------------------+-------------+--------------+--------------------------------------------------+
| Proposed Primitive       | Existing Component to Reuse               | Action Required    | User Portal | Admin Portal | Notes                                            |
+--------------------------+-------------------------------------------+--------------------+-------------+--------------+--------------------------------------------------+
| PortalShell              | app/(dashboard)/layout.tsx                | Refactor           | Yes         | Yes          | Shared top-level auth & theme container          |
| PortalHeader             | components/layout/dashboard-header.tsx    | Refactor           | Yes         | Yes          | Shared search, notification SSE, profile menu    |
| PortalSidebar            | components/layout/dashboard-sidebar.tsx   | Refactor           | Yes         | Yes (Admin)  | Shared navigation shell with role-based items    |
| GlassCard                | components/ui/card.tsx                    | Extend Variant     | Yes         | Yes          | Add cva glass variant to existing UI card        |
| MetricCard               | Inline in startup/page.tsx                | Create New Primitive| Yes        | Yes          | Reusable compliance score & statistic card       |
| StatusBadge              | components/ui/badge.tsx                   | Extend Variant     | Yes         | Yes          | Standardize critical/warning/success status pills|
| PriorityAlertRow         | Inline in startup/page.tsx                | Create New Primitive| Yes        | Yes          | Reusable alert row component with severity icon  |
+--------------------------+-------------------------------------------+--------------------+-------------+--------------+--------------------------------------------------+
```

---

## 13. Recommended Dashboard Composition

### Desktop & Wide Layout Order (>= 1024px)
```
Authenticated Portal Shell
├── Dashboard Header (Search, SSE Unread Badge, Jurisdiction Badge, Profile)
├── Subscription & Trial Status Banners
├── Welcome Bar & Primary CTA ("Ask Compliance Question")
├── Top Section: Compliance Posture Score Summary & 5 Category Progress Cards
├── Priority Attention Strip (Urgent Deadlines <= 3 days & Unread Critical Alerts)
├── Main Grid (3 Columns)
│   ├── Column 1 & 2: Regulatory Alerts Feed + Recent Query History
│   └── Column 3: Quick Action Tiles + Upcoming Compliance Deadlines
└── Supporting Account & Plan Entitlement Footer
```

### Mobile Layout Order (< 768px)
1. Dashboard Header (Mobile Drawer Toggle + SSE Alert Badge)
2. Welcome Bar + Ask Question Primary CTA
3. Compliance Score Summary Card
4. Priority Attention Strip
5. Category Breakdown (2-column grid)
6. Quick Action Tiles (2x2 grid)
7. Regulatory Alerts
8. Upcoming Deadlines
9. Recent Queries

---

## 14. Short Implementation Plan (4 Controlled Phases)

### Phase 1 — Portal Foundation & Design Tokens
* Establish portal-specific CSS variables in [`app/globals.css`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/globals.css).
* Extend [`components/ui/card.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/components/ui/card.tsx) and [`components/ui/badge.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/components/ui/badge.tsx) with `glass` variants.
* Create reusable primitives: `GlassCard`, `MetricCard`, `PriorityAlertRow`.
* Standardize `lucide-react` icon sizing and stroke weights across shared layout.

### Phase 2 — User Dashboard Recomposition (/startup)
* Recompose [`app/(dashboard)/startup/page.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/%28dashboard%29/startup/page.tsx) using new `GlassCard` primitives.
* Implement Priority Attention Strip for urgent items.
* Integrate regional jurisdiction context indicator.
* Add responsive 320px - 1920px layout safeguards and empty/error states.

### Phase 3 — Admin Portal Alignment (/admin)
* Apply shared portal visual primitives to [`app/(dashboard)/admin/page.tsx`](file:///c:/Users/USER/Videos/Sheria-Bot-SaaS/fintech-regulatory-platform/app/%28dashboard%29/admin/page.tsx).
* Maintain admin-specific operational metrics while sharing visual identity.
* Ensure domain component separation between user and admin portals.

### Phase 4 — Validation, Testing & Release
* Run complete Vitest suite (`pnpm run test`), ESLint (`pnpm run lint`), TypeScript typecheck (`pnpm exec tsc --noEmit`), and Next.js production build (`pnpm run build`).
* Validate WCAG 2.2 AA contrast and `prefers-reduced-motion` fallbacks.
* Perform visual QA across mobile (320px), tablet (768px), and desktop (1440px) viewports.

---

## 15. Acceptance Criteria for Future Redesign

1. **Zero Backend Changes:** No database migrations, Prisma schema updates, or tRPC route changes.
2. **Data Integrity:** All dashboard numbers, scores, deadlines, and alerts must be sourced directly from active tRPC queries. No synthetic or hardcoded metrics.
3. **Icon System Retention:** 100% of icons must be drawn from `lucide-react`. No new icon libraries or emojis.
4. **Public Site Isolation:** `app/(public)` marketing, blog, and documentation pages remain visually unchanged.
5. **No Horizontal Overflow:** Zero horizontal scroll at viewports from 320px to 1920px+.
6. **Keyboard Navigation:** All interactive cards, buttons, and tooltips are reachable via `Tab` with visible focus rings (`--portal-focus-ring`).
7. **WCAG Contrast:** All primary text on glass surfaces achieves >= 4.5:1 contrast ratio.
8. **Reduced Motion:** All glow animations and transitions disable cleanly when `prefers-reduced-motion: reduce` is set.
9. **Full Test Pass:** All 76 unit tests pass without failure.

---

## 16. Risks & Mitigation Strategy

* **Visual Regression Risk:** Mitigated by creating new component variants (`GlassCard`) alongside existing UI components rather than mutating global default styles.
* **Performance Degradation Risk:** Mitigated by enforcing opaque solid fallbacks on mobile viewports and disabling backdrop blurs on nested cards.
* **Public Style Leakage Risk:** Mitigated by scoping portal CSS variables exclusively inside `.portal-theme` container classes inside the `(dashboard)` layout.
