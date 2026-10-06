import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "../button"

describe("Button contrast and interaction states", () => {
  it("uses semantic colors for outline and ghost hover states", () => {
    render(
      <>
        <Button variant="outline">Outline action</Button>
        <Button variant="ghost">Ghost action</Button>
      </>
    )

    expect(screen.getByRole("button", { name: "Outline action" })).toHaveClass(
      "text-foreground",
      "hover:bg-accent",
      "hover:text-accent-foreground"
    )
    expect(screen.getByRole("button", { name: "Ghost action" })).toHaveClass(
      "text-muted-foreground",
      "hover:bg-accent",
      "hover:text-accent-foreground"
    )
  })

  it("keeps lift motion optional for reduced-motion users", () => {
    render(<Button>Primary action</Button>)

    expect(screen.getByRole("button", { name: "Primary action" })).toHaveClass(
      "motion-safe:hover:-translate-y-0.5",
      "active:translate-y-0"
    )
  })
})
