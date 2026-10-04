import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

function readSource(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8")
}

describe("authenticated bundle boundaries", () => {
  it("defers interaction-only security dependencies", () => {
    const security = readSource("app/(dashboard)/settings/security/page.tsx")
    const passkeys = readSource("components/settings/passkeys-card.tsx")

    expect(security).toContain('import("qrcode.react").then((module) => module.QRCodeSVG)')
    expect(security).not.toMatch(/import\s+\{\s*QRCodeSVG\s*\}\s+from\s+["']qrcode\.react["']/)
    expect(passkeys).toContain('await import("@simplewebauthn/browser")')
    expect(passkeys).not.toMatch(/import\s+\{\s*startRegistration\s*\}\s+from\s+["']@simplewebauthn\/browser["']/)
  })

  it("defers billing overlays until they are requested", () => {
    const billing = readSource("app/(dashboard)/settings/billing/page.tsx")

    expect(billing).toContain('import("@/components/billing/InvoiceModal")')
    expect(billing).toContain('import("@/components/billing/MpesaPaymentFlow")')
    expect(billing).not.toMatch(/import\s+\{\s*InvoiceModal\s*\}\s+from/)
    expect(billing).not.toMatch(/import\s+\{\s*MpesaPaymentFlow\s*\}\s+from/)
  })

  it("defers response formatting and analysis animation", () => {
    const compliance = readSource("components/compliance/query/compliance-query-progress.tsx")
    const gapAnalysis = readSource("app/(dashboard)/startup/gap-analysis/page.tsx")

    expect(compliance).toContain('import("@/components/compliance/compliance-feedback")')
    expect(compliance).not.toMatch(/import\s+\{\s*ComplianceFeedback\s*\}\s+from/)
    expect(gapAnalysis).toContain('import("@/components/loading-screen")')
    expect(gapAnalysis).not.toMatch(/import\s+\{\s*LoadingScreen\s*\}\s+from/)
  })

  it("keeps Recharts behind the admin revenue chart boundary", () => {
    const billing = readSource("app/(dashboard)/admin/billing/page.tsx")
    const chart = readSource("components/admin/billing/revenue-chart.tsx")

    expect(billing).toContain('import("@/components/admin/billing/revenue-chart")')
    expect(billing).not.toContain('from "recharts"')
    expect(chart).toContain('from "recharts"')
  })
})
