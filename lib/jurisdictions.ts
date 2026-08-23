export const JURISDICTION_CODES = ["KE", "RW", "MW", "NG"] as const

export type JurisdictionCode = typeof JURISDICTION_CODES[number]
export type QueryableJurisdictionCode = JurisdictionCode
export type JurisdictionStatus = "ACTIVE" | "COMING_SOON" | "DISABLED"

export type JurisdictionCapability = {
  code: JurisdictionCode
  name: string
  queryEnabled: boolean
  status: JurisdictionStatus
}

export const AUDITED_JURISDICTIONS = [
  { code: "KE", label: "Kenya", currency: "KES" },
  { code: "RW", label: "Rwanda", currency: "RWF" },
  { code: "MW", label: "Malawi", currency: "MWK" },
] as const

export const DEFAULT_JURISDICTION: QueryableJurisdictionCode = "KE"

export const COUNTRY_FLAGS: Record<JurisdictionCode, string> = {
  KE: "KE",
  RW: "RW",
  MW: "MW",
  NG: "NG",
}

export type AuditedJurisdictionCode = typeof AUDITED_JURISDICTIONS[number]["code"]

export function jurisdictionLabel(code: string | null | undefined): string {
  if (code === "NG") return "Nigeria"
  return AUDITED_JURISDICTIONS.find((item) => item.code === code)?.label ?? "Kenya"
}

export function currencyForJurisdiction(code: string | null | undefined): string {
  return AUDITED_JURISDICTIONS.find((item) => item.code === code)?.currency ?? "KES"
}

export function isJurisdictionCode(value: unknown): value is JurisdictionCode {
  return typeof value === "string" && JURISDICTION_CODES.includes(value as JurisdictionCode)
}

export function isQueryableJurisdictionCode(value: unknown): value is QueryableJurisdictionCode {
  return value === "KE" || value === "RW" || value === "MW" || value === "NG"
}
