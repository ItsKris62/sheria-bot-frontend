import { readdirSync, readFileSync, statSync } from "node:fs"
import { relative, resolve, sep } from "node:path"
import { describe, expect, it } from "vitest"

const projectRoot = resolve(__dirname, "../..")

function filesUnder(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = resolve(directory, name)
    return statSync(path).isDirectory() ? filesUnder(path) : [path]
  })
}

function routePattern(pageFile: string): RegExp {
  let route = relative(resolve(projectRoot, "app"), pageFile).split(sep).join("/")
  route = route.replace(/\/page\.tsx$/, "")
  route = route.replace(/(^|\/)\([^/]+\)/g, "$1")
  route = route.replace(/(^|\/)@[^/]+/g, "$1")
  route = route.replace(/(^|\/)\(\.\)[^/]+/g, "$1")
  route = `/${route}`.replace(/\/+/g, "/").replace(/\/$/, "") || "/"
  const pattern = route
    .split("/")
    .map((segment) => segment.startsWith("[") ? (segment.startsWith("[...") ? ".+" : "[^/]+") : segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("/")
  return new RegExp(`^${pattern}/?$`)
}

describe("internal route links", () => {
  it("resolves every static internal href in application source to an App Router page", () => {
    const routePatterns = filesUnder(resolve(projectRoot, "app"))
      .filter((file) => file.endsWith(`${sep}page.tsx`))
      .map(routePattern)
    const sourceFiles = [resolve(projectRoot, "app"), resolve(projectRoot, "components")]
      .flatMap(filesUnder)
      .filter((file) => /\.tsx?$/.test(file) && !/\.test\.|__tests__/.test(file))
    const failures: string[] = []
    const hrefPattern = /\bhref\s*[:=]\s*["'](\/[^"'?#]*)(?:[?#][^"']*)?["']/g

    for (const file of sourceFiles) {
      const content = readFileSync(file, "utf8")
      for (const match of content.matchAll(hrefPattern)) {
        const href = match[1]
        if (!href || href.startsWith("/api") || /\.[a-z0-9]{2,5}$/i.test(href)) continue
        if (!routePatterns.some((pattern) => pattern.test(href))) {
          failures.push(`${relative(projectRoot, file)} -> ${href}`)
        }
      }
    }

    expect([...new Set(failures)].sort()).toEqual([])
  })
})
