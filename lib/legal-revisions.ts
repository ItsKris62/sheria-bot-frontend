export const LEGAL_REVISIONS = {
  privacy: { effective: "2026-08-25", updated: "2026-10-05" },
  terms: { effective: "2026-08-25", updated: "2026-08-25" },
  "data-protection": { effective: "2026-08-25", updated: "2026-08-25" },
  security: { effective: "2026-03-05", updated: "2026-03-05" },
  "cookie-policy": { effective: "2026-10-05", updated: "2026-10-05" },
} as const

export type LegalRevisionKey = keyof typeof LEGAL_REVISIONS

export function formatLegalDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00.000Z`))
}
