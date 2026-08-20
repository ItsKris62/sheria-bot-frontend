export const AUDITED_JURISDICTIONS = [
  { code: "KE", label: "Kenya", currency: "KES" },
  { code: "RW", label: "Rwanda", currency: "RWF" },
  { code: "MW", label: "Malawi", currency: "MWK" },
] as const

export type AuditedJurisdictionCode = typeof AUDITED_JURISDICTIONS[number]["code"]

export function jurisdictionLabel(code: string | null | undefined): string {
  return AUDITED_JURISDICTIONS.find((item) => item.code === code)?.label ?? "Kenya"
}

export function currencyForJurisdiction(code: string | null | undefined): string {
  return AUDITED_JURISDICTIONS.find((item) => item.code === code)?.currency ?? "KES"
}
