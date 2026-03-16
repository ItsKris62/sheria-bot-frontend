export type RegulatorTier = "primary" | "secondary"

export interface Regulator {
  id: string
  acronym: string
  name: string
  logo: string
  url: string
  tier: RegulatorTier
  scope: string
}

export const REGULATORS: Regulator[] = [
  {
    id: "cbk",
    acronym: "CBK",
    name: "Central Bank of Kenya",
    logo: "/logos/CBK_LOGO.png-removebg-preview.png",
    url: "https://centralbank.go.ke",
    tier: "primary",
    scope: "Payments · Digital Credit · AML",
  },
  {
    id: "cma",
    acronym: "CMA",
    name: "Capital Markets Authority",
    logo: "/logos/CMA_Logo-removebg-preview.png",
    url: "https://cma.or.ke",
    tier: "primary",
    scope: "Securities · Investment · P2P",
  },
  {
    id: "odpc",
    acronym: "ODPC",
    name: "Office of the Data Protection Commissioner",
    logo: "/logos/ODPC-Logo-removebg-preview.png",
    url: "https://odpc.go.ke",
    tier: "primary",
    scope: "Data · Privacy · DPA 2019",
  },
  {
    id: "ca",
    acronym: "CA",
    name: "Communications Authority of Kenya",
    logo: "/logos/CA-logo-removebg-preview.png",
    url: "https://ca.go.ke",
    tier: "primary",
    scope: "Mobile Money · Telco · Sandbox",
  },
  {
    id: "ira",
    acronym: "IRA",
    name: "Insurance Regulatory Authority",
    logo: "/logos/IRA-Logo-removebg-preview.png",
    url: "https://ira.go.ke",
    tier: "secondary",
    scope: "Insurtech · Insurance Act",
  },
  {
    id: "frc",
    acronym: "FRC",
    name: "Financial Reporting Centre",
    logo: "/logos/FRC-Logo-removebg-preview.png",
    url: "https://frc.go.ke",
    tier: "secondary",
    scope: "AML · CFT Reporting",
  },
  {
    id: "kra",
    acronym: "KRA",
    name: "Kenya Revenue Authority",
    logo: "/logos/KRA-Logo-removebg-preview.png",
    url: "https://kra.go.ke",
    tier: "secondary",
    scope: "Tax · TIN · Digital Services",
  },
  {
    id: "rba",
    acronym: "RBA",
    name: "Retirement Benefits Authority",
    logo: "/logos/RBA-Logo-removebg-preview.png",
    url: "https://rba.go.ke",
    tier: "secondary",
    scope: "Pension · Benefits Fintech",
  },
]

export const PRIMARY_REGULATORS = REGULATORS.filter((r) => r.tier === "primary")
export const SECONDARY_REGULATORS = REGULATORS.filter((r) => r.tier === "secondary")
