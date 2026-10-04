import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

function readSource(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8")
}

describe("authenticated navigation contracts", () => {
  it("keeps blog source-item navigation inside the App Router", () => {
    const source = readSource("app/(dashboard)/admin/content/blog/sources/page.tsx")

    expect(source).toContain('<Link href="/admin/content/blog/source-items">')
    expect(source).toContain("<Link href={`/admin/content/blog/source-items?monitorId=${encodeURIComponent(item.id)}`}>")
    expect(source).not.toMatch(/window\.location\.href\s*=\s*[`'"]\/admin\/content\/blog\/source-items/)
  })

  it("uses App Router navigation for backend-generated problem-account routes", () => {
    const frontend = readSource("app/(dashboard)/admin/billing/page.tsx")
    const backend = readSource("../fintech-regulatory-backend/src/server/routers/admin.router.ts")

    expect(frontend).toContain("<Link href={account.actionHref}>View</Link>")
    expect(backend).toMatch(/actionHref:\s*`\/admin\/organizations\/\$\{/)
    expect(backend).toMatch(/actionHref:\s*`\/admin\/users\/\$\{/)
    expect(backend).not.toMatch(/actionHref:\s*[`'"]https?:\/\//)
  })

  it("preserves security and payment document handoffs", () => {
    const providers = readSource("components/providers.tsx")
    const billing = readSource("app/(dashboard)/settings/billing/page.tsx")

    expect(providers).toContain('window.location.href = "/settings/security?enforce=true"')
    expect(billing).toMatch(/router\.push\(result\.url\)/)
  })
})
