import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8")
}

const directRoutes = [
  "app/(dashboard)/startup/applications/page.tsx",
  "app/(dashboard)/startup/licenses/page.tsx",
  "app/(dashboard)/admin/organizations/page.tsx",
  "app/(dashboard)/admin/support/page.tsx",
  "app/(dashboard)/admin/content/blog/page.tsx",
  "app/(dashboard)/admin/content/knowledge-base/page.tsx",
  "app/(dashboard)/admin/marketing/leads/page.tsx",
]

describe("LOAD-D route continuity contracts", () => {
  it.each(directRoutes)("marks retained results as updating in %s", (path) => {
    const content = source(path)

    expect(content).toMatch(/placeholderData:\s*keepPreviousData/)
    expect(content).toContain("isPlaceholderData")
    expect(content).toContain("aria-busy={isPlaceholderData}")
    expect(content).toContain("DataUpdatingIndicator")
  })

  it("covers hook-backed admin users and policy history", () => {
    expect(source("hooks/use-admin.ts")).toMatch(/placeholderData:\s*keepPreviousData/)
    expect(source("app/(dashboard)/admin/users/page.tsx")).toContain("aria-busy={isPlaceholderData}")
    expect(source("hooks/use-enterprise-policies.ts")).toMatch(/placeholderData:\s*keepPreviousData/)
    expect(source("app/(dashboard)/regulator/policy-generator/history/page.tsx")).toContain("aria-busy={isPlaceholderData}")
  })

  it("retains payment pages with an explicit payment-history status", () => {
    const content = source("app/(dashboard)/settings/billing/page.tsx")

    expect(content).toMatch(/placeholderData:\s*keepPreviousData/)
    expect(content).toContain('label="Updating payment history"')
    expect(content).toContain("disabled={paymentPage <= 1 || paymentHistoryQuery.isFetching}")
  })

  it("does not retain incompatible calendar months or analytics ranges", () => {
    expect(source("app/(dashboard)/startup/calendar/page.tsx")).not.toContain("placeholderData")
    expect(source("app/(dashboard)/admin/analytics/page.tsx")).not.toContain("placeholderData")
  })

  it("preserves existing continuity in documents and blog suggestions", () => {
    expect(source("app/(dashboard)/startup/documents/page.tsx")).toMatch(/placeholderData:\s*keepPreviousData/)
    expect(source("app/(dashboard)/admin/content/blog/suggestions/page.tsx")).toMatch(/placeholderData:\s*\(previousData: any\) => previousData/)
  })

  it("keeps audit-log date changes out of previous-data retention", () => {
    const content = source("app/(dashboard)/admin/audit-logs/page.tsx")

    expect(content).toContain("hasCompatibleDateRange ? keepPreviousData(previousData) : undefined")
    expect(content).toContain("previousInput?.dateFrom === queryInput.dateFrom")
  })
})
