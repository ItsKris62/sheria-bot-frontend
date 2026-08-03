import { describe, expect, it } from "vitest"
import { buildBlogHref, cleanBlogParam, getPaginationItems, normaliseBlogPage, safeImageUrl, safeSourceUrl } from "./url"

describe("Blog URL helpers", () => {
  it("normalises invalid pages and removes blank params", () => {
    expect(normaliseBlogPage("0")).toBe(1)
    expect(normaliseBlogPage("-2")).toBe(1)
    expect(normaliseBlogPage("3.9")).toBe(3)
    expect(cleanBlogParam("   ")).toBeUndefined()
  })

  it("preserves valid listing URL state without empty search params", () => {
    expect(buildBlogHref({ q: " AML reporting ", category: "All", tag: "", page: 1 })).toBe("/blog?q=AML+reporting#articles")
    expect(buildBlogHref({ category: "Regulatory Updates", tag: "CBK", page: 3 })).toBe("/blog?category=Regulatory+Updates&tag=CBK&page=3#articles")
  })

  it("builds accessible pagination windows with ellipses", () => {
    expect(getPaginationItems(1, 10)).toEqual([1, 2, "ellipsis", 10])
    expect(getPaginationItems(5, 10)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10])
    expect(getPaginationItems(10, 10)).toEqual([1, "ellipsis", 9, 10])
  })

  it("allows only safe image and source URLs", () => {
    expect(safeImageUrl("javascript:alert(1)")).toBeUndefined()
    expect(safeImageUrl("https://example.com/image.jpg")).toBe("https://example.com/image.jpg")
    expect(safeSourceUrl("https://authority.example/path?token=secret&ref=public")).toBe("https://authority.example/path?ref=public")
    expect(safeSourceUrl("https://user:pass@authority.example/path")).toBeUndefined()
  })
})
