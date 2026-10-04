import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const appDirectory = join(process.cwd(), "app")
const dashboardDirectory = join(appDirectory, "(dashboard)")

function findLoadingFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name)
    if (entry.isDirectory()) return findLoadingFiles(entryPath)
    return entry.name === "loading.tsx" ? [entryPath] : []
  })
}

describe("authenticated route loading boundaries", () => {
  const loadingFiles = findLoadingFiles(dashboardDirectory)

  it("keeps the global root free of a loading boundary", () => {
    expect(existsSync(join(appDirectory, "loading.tsx"))).toBe(false)
    expect(existsSync(join(appDirectory, "(public)", "loading.tsx"))).toBe(true)
  })

  it("does not render full-screen route loaders or duplicate the dashboard shell", () => {
    expect(loadingFiles.length).toBeGreaterThan(0)

    for (const file of loadingFiles) {
      const source = readFileSync(file, "utf8")
      expect(source, file).not.toMatch(/LoadingScreen|fullScreen|min-h-screen/)
      expect(source, file).not.toMatch(/DashboardSidebar|AdminSidebar|DashboardHeader|DashboardShell/)
    }
  })

  it("gives every authenticated fallback one accessible busy region", () => {
    for (const file of loadingFiles) {
      const source = readFileSync(file, "utf8")
      expect(source, file).toContain("PortalLoadingRegion")
    }
  })
})
