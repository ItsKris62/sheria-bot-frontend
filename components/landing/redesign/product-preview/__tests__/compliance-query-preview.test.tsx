import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ComplianceQueryPreview } from "../compliance-query-preview"

describe("ComplianceQueryPreview", () => {
  it("shows the core Compliance Query product story with non-authoritative fixture content", () => {
    render(<ComplianceQueryPreview />)

    expect(screen.getByRole("heading", { name: "Compliance Query" })).toBeInTheDocument()
    expect(screen.getByText("Verified Legal Corpus")).toBeInTheDocument()
    expect(screen.getByText("What licensing requirements apply to payment service providers in Kenya?")).toBeInTheDocument()
    expect(screen.getByText("Regulatory Guidance")).toBeInTheDocument()
    expect(screen.getByText("Referenced Documents (2):")).toBeInTheDocument()
    expect(screen.getByText("Preview fixture")).toBeInTheDocument()
    expect(screen.getByText("Standard", { exact: false })).toBeInTheDocument()
    expect(screen.getByLabelText("Available Compliance Query jurisdictions")).toHaveTextContent("Kenya")
    expect(screen.getByLabelText("Available Compliance Query jurisdictions")).toHaveTextContent("Malawi")
    expect(screen.getByLabelText("Available Compliance Query jurisdictions")).toHaveTextContent("Rwanda")
    expect(screen.getByLabelText("Available Compliance Query jurisdictions")).toHaveTextContent("Nigeria")
  })

  it("does not expose the retired fictional inspector claims", () => {
    const { container } = render(<ComplianceQueryPreview />)
    const content = container.textContent ?? ""

    expect(content).not.toContain("Regulatory Inspector")
    expect(content).not.toContain("99.8%")
    expect(content).not.toContain("Grounded Law")
    expect(content).not.toContain("Bank of Ghana")
  })
})
