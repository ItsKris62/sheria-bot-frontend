# SheriaBot Design Direction

## Product surface

SheriaBot is a Kenyan fintech regulatory and compliance SaaS. The homepage is a brand and conversion surface, not a dashboard. It should communicate credibility, local regulatory expertise, evidence-backed AI, and practical business value.

## Redesign objective

Create a distinctive, premium homepage that feels trustworthy enough for compliance leaders while still communicating the speed and intelligence of a modern AI product.

The experience may draw inspiration from Pinterest's visual discovery and modular content rhythm, Awwwards-level editorial composition and motion, and X's clarity and immediacy. Inspiration must be translated into SheriaBot's own identity rather than copied.

## Audience

- Kenyan fintech founders and operators
- Compliance, risk, legal, and governance teams
- Payment service providers, digital lenders, and regulated startups
- Enterprise decision-makers evaluating compliance software

## Core message

Kenyan fintech compliance, on autopilot, with answers and workflows grounded in verifiable regulatory sources.

## Brand qualities

- Authoritative, not intimidating
- Modern, not experimental for its own sake
- Kenyan and regionally relevant, without relying on visual clichés
- Evidence-led and precise
- Calm, premium, and operational

## Visual principles

1. Lead with one strong idea per viewport.
2. Use editorial scale, purposeful asymmetry, and varied section rhythm.
3. Avoid generic SaaS card grids, excessive pills, decorative gradients, and nested cards.
4. Use the existing SheriaBot green strategically as an accent, not as a full-page wash.
5. Prefer tinted near-black and warm off-white surfaces over pure black and stark white.
6. Use product evidence: citations, compliance workflows, alerts, policy generation, and audit-ready outputs.
7. Motion should clarify hierarchy and product flow. Respect reduced-motion preferences.
8. Mobile layouts must be intentionally composed, not merely stacked desktop sections.

## Homepage narrative

1. Clear hero promise and primary conversion action
2. Trust and regulatory relevance
3. Visual product workflow: question to cited answer to action
4. Core outcomes and differentiated capabilities
5. Product proof through realistic interface excerpts
6. Use cases for startups, growing fintechs, and enterprise teams
7. Security, evidence, and governance assurances
8. Final conversion section

## Conversion priorities

Primary CTA: Start or apply for access, depending on the current commercial flow.

Secondary CTA: View how SheriaBot works or explore the product workflow.

Do not present several equal-weight calls to action in the hero.

## Accessibility and quality gates

- WCAG AA colour contrast
- Full keyboard navigation
- Visible focus states
- Semantic landmarks and heading hierarchy
- Responsive typography with controlled line lengths
- No layout shift from media
- Optimised images and restrained client-side animation
- Clear copy without unsupported legal or regulatory claims

## Agent workflow

1. Run `pnpm design:setup` once from the repository root.
2. Restart the AI coding tool.
3. Run `/impeccable init` and preserve this document's product constraints.
4. Use `design-taste-frontend` for visual direction and composition.
5. Use `/impeccable shape landing` before implementation.
6. Use `/impeccable critique landing`, `/impeccable audit landing`, and `/impeccable polish landing` before release.
