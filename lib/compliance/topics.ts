import type { CitationItem } from "@/hooks/use-compliance"
import { isRegulatoryArea, type RegulatoryArea } from "@/lib/compliance/compliance.types"

export const TOPIC_KEYWORD_TO_AREA: Record<string, RegulatoryArea> = {
  "Central Bank of Kenya": "CBK",
  "CBK": "CBK",
  "Mobile Money Regulations": "CBK",
  "National Payment System": "PAYMENT_SYSTEMS",
  "National Payment Systems": "PAYMENT_SYSTEMS",
  "Payment Service Provider": "PAYMENT_SYSTEMS",
  "E-Money": "E_MONEY",
  "Electronic Money": "E_MONEY",
  "Digital Credit Providers": "DIGITAL_LENDING",
  "Digital Credit": "DIGITAL_LENDING",
  "Data Protection Act": "DPA",
  "Office of the Data Protection Commissioner": "DPA",
  "ODPC": "DPA",
  "POCAMLA": "AML",
  "Anti-Money Laundering": "AML",
  "Proceeds of Crime": "AML",
  "Counter Financing of Terrorism": "CFT",
  "Terrorism Financing": "CFT",
  "Capital Markets": "CMA",
  "Insurance Regulatory Authority": "IRA",
  "SACCO Societies": "SASRA",
  "Credit Reference": "CREDIT_REFERENCE",
  "Consumer Protection": "CONSUMER_PROTECTION",
  "Cybersecurity": "CYBERSECURITY",
  "Microfinance": "MICROFINANCE",
}

function normaliseAreas(areas: unknown[]): RegulatoryArea[] {
  return areas.filter(isRegulatoryArea)
}

export function extractTopicsFromCitations(
  citations: Array<Partial<CitationItem> | null | undefined>,
  existingAreas: unknown[],
): RegulatoryArea[] {
  const existing = new Set(normaliseAreas(existingAreas))
  const maxSupplemental = Math.max(0, 6 - existing.size)
  const supplemental: RegulatoryArea[] = []

  for (const citation of citations) {
    const title = citation?.documentTitle
    if (!title || supplemental.length >= maxSupplemental) continue

    for (const [keyword, area] of Object.entries(TOPIC_KEYWORD_TO_AREA)) {
      if (!title.includes(keyword) || existing.has(area)) continue
      existing.add(area)
      supplemental.push(area)
      break
    }
  }

  return supplemental
}
