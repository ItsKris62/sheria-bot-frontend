import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { BlogPostJsonLd } from "./blog-post-json-ld"

describe("BlogPostJsonLd", () => {
  it("includes only sanitized public citations", () => {
    const { container } = render(
      <BlogPostJsonLd
        slug="cbk-licensing"
        title="CBK licensing"
        excerpt="Compliance guidance"
        author="SheriaBot Editorial"
        authorRole="Editorial"
        datePublished="2026-07-01T00:00:00.000Z"
        dateModified="2026-07-02T00:00:00.000Z"
        readTime="4 min read"
        sources={[
          { url: "https://centralbank.go.ke/notices?token=secret&page=2" },
          { url: "javascript:alert(1)" },
        ]}
      />,
    )

    const script = container.querySelector('script[type="application/ld+json"]')
    const schema = JSON.parse(script?.textContent || "{}")

    expect(schema.citation).toEqual(["https://centralbank.go.ke/notices?page=2"])
  })
})
