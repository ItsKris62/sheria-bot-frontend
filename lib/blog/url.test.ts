import { describe, expect, it } from "vitest"
import { buildBlogHref, getPaginationItems, normaliseBlogPage, safeImageUrl, safeSourceUrl } from "./url"

describe("Blog URL helpers", () => {
  it("builds shareable filter and pagination URLs without empty params", () => {
    expect(buildBlogHref({ q: " licensing ", category: "Regulatory Updates", tag: "CBK", page: 2 })).toBe(
      "/blog?q=licensing&category=Regulatory+Updates&tag=CBK&page=2#articles",
    )
    expect(buildBlogHref({ category: "All", q: "", page: 1 })).toBe("/blog#articles")
  })

  it("normalises invalid pages safely", () => {
    expect(normaliseBlogPage("3")).toBe(3)
    expect(normaliseBlogPage("-2")).toBe(1)
    expect(normaliseBlogPage("nope")).toBe(1)
  })

  it("generates accessible pagination windows with ellipses", () => {
    expect(getPaginationItems(1, 4)).toEqual([1, 2, 3, 4])
    expect(getPaginationItems(8, 12)).toEqual([1, "ellipsis", 7, 8, 9, "ellipsis", 12])
  })

  it("accepts only local and http image URLs", () => {
    expect(safeImageUrl("/cover.png")).toBe("/cover.png")
    expect(safeImageUrl("https://example.com/cover.png")).toBe("https://example.com/cover.png")
    expect(safeImageUrl("javascript:alert(1)")).toBeUndefined()
  })

  it("sanitizes public source URLs before rendering or structured data", () => {
    expect(safeSourceUrl("https://centralbank.go.ke/notices?token=secret&page=2")).toBe(
      "https://centralbank.go.ke/notices?page=2",
    )
    expect(safeSourceUrl("https://user:pass@centralbank.go.ke/notices")).toBeUndefined()
    expect(safeSourceUrl("javascript:alert(1)")).toBeUndefined()
  })
})
