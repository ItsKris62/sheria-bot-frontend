import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ShieldCheck, Info } from "lucide-react"
import {
  PortalSurface,
  PortalSectionHeader,
  PortalStatusBadge,
  PortalSkeleton,
} from "../index"

describe("Portal Primitives (Phase 1)", () => {
  describe("PortalSurface", () => {
    it("renders default raised variant with custom class names", () => {
      render(
        <PortalSurface data-testid="surface-raised" className="custom-test-class">
          Content
        </PortalSurface>
      )
      const element = screen.getByTestId("surface-raised")
      expect(element).toHaveClass("portal-surface-raised")
      expect(element).toHaveClass("custom-test-class")
    })

    it("renders shell and solid variants correctly", () => {
      const { rerender } = render(
        <PortalSurface data-testid="surface" variant="shell">
          Shell
        </PortalSurface>
      )
      expect(screen.getByTestId("surface")).toHaveClass("portal-surface-shell")

      rerender(
        <PortalSurface data-testid="surface" variant="solid">
          Solid
        </PortalSurface>
      )
      expect(screen.getByTestId("surface")).toHaveClass("portal-surface-solid")
    })

    it("supports asChild slot rendering", () => {
      render(
        <PortalSurface asChild variant="solid">
          <section data-testid="section-element">Slot Content</section>
        </PortalSurface>
      )
      const element = screen.getByTestId("section-element")
      expect(element.tagName).toBe("SECTION")
      expect(element).toHaveClass("portal-surface-solid")
    })
  })

  describe("PortalSectionHeader", () => {
    it("renders semantic h2 heading by default with title and description", () => {
      render(
        <PortalSectionHeader
          title="Compliance Posture"
          description="Overall regulatory compliance score"
        />
      )
      const heading = screen.getByRole("heading", { level: 2, name: "Compliance Posture" })
      expect(heading).toBeInTheDocument()
      expect(screen.getByText("Overall regulatory compliance score")).toBeInTheDocument()
    })

    it("renders specified titleAs heading level and action slot", () => {
      render(
        <PortalSectionHeader
          title="Priority Attention"
          titleAs="h1"
          action={<button>Action CTA</button>}
        />
      )
      const heading = screen.getByRole("heading", { level: 1, name: "Priority Attention" })
      expect(heading).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Action CTA" })).toBeInTheDocument()
    })

    it("renders decorative icon with aria-hidden attribute", () => {
      const { container } = render(
        <PortalSectionHeader
          title="Alerts"
          icon={ShieldCheck}
        />
      )
      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute("aria-hidden", "true")
    })
  })

  describe("PortalStatusBadge", () => {
    it("renders readable status text and status variant styling", () => {
      render(
        <PortalStatusBadge status="success">
          Compliant
        </PortalStatusBadge>
      )
      const badge = screen.getByText("Compliant")
      expect(badge).toBeInTheDocument()
      expect(badge.parentElement).toHaveClass("bg-green-500/10")
    })

    it("renders status icon with aria-hidden attribute", () => {
      const { container } = render(
        <PortalStatusBadge status="warning" icon={Info}>
          Needs Attention
        </PortalStatusBadge>
      )
      expect(screen.getByText("Needs Attention")).toBeInTheDocument()
      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute("aria-hidden", "true")
    })
  })

  describe("PortalSkeleton", () => {
    it("renders portal skeleton surface with pulse animation", () => {
      render(<PortalSkeleton data-testid="skeleton" variant="card" />)
      const element = screen.getByTestId("skeleton")
      expect(element).toHaveClass("animate-pulse")
      expect(element).toHaveClass("h-32")
    })
  })
})
