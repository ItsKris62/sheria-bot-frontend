import { describe, expect, it } from "vitest"
import { extractTableOfContents, slugifyHeading } from "./markdown"

describe("Blog Markdown helpers", () => {
  it("extracts h2 and h3 headings with stable IDs", () => {
    expect(extractTableOfContents("## Licensing\n\n### CBK rules\n\n## Licensing")).toEqual([
      { id: "licensing", text: "Licensing", level: 2 },
      { id: "cbk-rules", text: "CBK rules", level: 3 },
      { id: "licensing-2", text: "Licensing", level: 2 },
    ])
  })

  it("slugifies markdown heading text", () => {
    expect(slugifyHeading("AML/CFT & Data Protection")).toBe("amlcft-and-data-protection")
  })
})
