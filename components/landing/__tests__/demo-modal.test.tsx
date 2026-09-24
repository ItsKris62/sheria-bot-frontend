import React from "react"
import { render, screen, cleanup } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest"

describe("DemoModal and Demo Video URLs", () => {
  const originalEnv = process.env.NEXT_PUBLIC_R2_ASSETS_URL

  beforeEach(() => {
    vi.resetModules()
    cleanup()
  })

  afterEach(() => {
    cleanup()
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_R2_ASSETS_URL = originalEnv
    } else {
      delete process.env.NEXT_PUBLIC_R2_ASSETS_URL
    }
  })

  it("builds demo video URLs with NEXT_PUBLIC_R2_ASSETS_URL when configured", async () => {
    process.env.NEXT_PUBLIC_R2_ASSETS_URL = "https://test.example.com"
    const { DemoModal } = await import("../demo-modal")

    render(<DemoModal open={true} onClose={vi.fn()} />)
    const videoSource = document.body.querySelector("video source") as HTMLSourceElement

    expect(videoSource).toBeInTheDocument()
    expect(videoSource.src).toContain("https://test.example.com/demos/")
    expect(videoSource.src).toBe("https://test.example.com/demos/compliance-c.mp4")
  })

  it("handles empty NEXT_PUBLIC_R2_ASSETS_URL by falling back to relative path without throwing", async () => {
    delete process.env.NEXT_PUBLIC_R2_ASSETS_URL
    const { DemoModal } = await import("../demo-modal")

    render(<DemoModal open={true} onClose={vi.fn()} />)
    const videoSource = document.body.querySelector("video source") as HTMLSourceElement

    expect(videoSource).toBeInTheDocument()
    expect(videoSource.getAttribute("src")).toBe("/demos/compliance-c.mp4")
  })
})
