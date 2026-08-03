import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { BlogPagination } from "./blog-pagination"

describe("BlogPagination", () => {
  it("preserves filters and marks the active page", () => {
    render(
      <BlogPagination
        currentPage={2}
        totalPages={4}
        state={{ q: "licensing", category: "Regulatory Updates", tag: "CBK", page: 2 }}
      />,
    )

    expect(screen.getByRole("navigation", { name: /blog article pages/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Go to page 2" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: "Go to previous page" })).toHaveAttribute(
      "href",
      "/blog?q=licensing&category=Regulatory+Updates&tag=CBK#articles",
    )
    expect(screen.getByRole("link", { name: "Go to next page" })).toHaveAttribute(
      "href",
      "/blog?q=licensing&category=Regulatory+Updates&tag=CBK&page=3#articles",
    )
  })
})
