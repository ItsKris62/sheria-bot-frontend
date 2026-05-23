export type RegulatoryArea =
  | "CBK"
  | "CMA"
  | "IRA"
  | "SASRA"
  | "DPA"
  | "AML"
  | "CFT"
  | "CONSUMER_PROTECTION"
  | "CYBERSECURITY"
  | "E_MONEY"
  | "PAYMENT_SYSTEMS"
  | "CREDIT_REFERENCE"
  | "MICROFINANCE"
  | "DIGITAL_LENDING"

export const REGULATORY_AREA_NAMES: Record<RegulatoryArea, string> = {
  CBK: "Central Bank of Kenya Regulations",
  CMA: "Capital Markets Authority",
  IRA: "Insurance Regulatory Authority",
  SASRA: "SACCO Societies Regulatory Authority",
  DPA: "Data Protection Act 2019",
  AML: "Anti-Money Laundering",
  CFT: "Counter-Financing of Terrorism",
  CONSUMER_PROTECTION: "Consumer Protection",
  CYBERSECURITY: "Cybersecurity Guidelines",
  E_MONEY: "E-Money Regulations",
  PAYMENT_SYSTEMS: "National Payment Systems",
  CREDIT_REFERENCE: "Credit Reference Bureau",
  MICROFINANCE: "Microfinance Act",
  DIGITAL_LENDING: "Digital Credit Providers",
}

export function isRegulatoryArea(value: unknown): value is RegulatoryArea {
  return typeof value === "string" && value in REGULATORY_AREA_NAMES
}
