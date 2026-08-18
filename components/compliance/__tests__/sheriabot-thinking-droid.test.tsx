import React from "react"
import { render, screen, act } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest"
import { SheriaBotThinkingDroid } from "../sheriabot-thinking-droid"
import type { StreamState, StreamPhase } from "@/hooks/use-compliance"

// Mock window.matchMedia for reduced motion testing
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

// Mock the environment variable required by the component
process.env.NEXT_PUBLIC_R2_ASSETS_URL = "https://mock-r2-url.com"

const mockState = (phase: StreamPhase): StreamState => ({
  phase,
  queryId: "test-query",
  ragSources: 0,
  content: "",
  result: null,
  errorMessage: null,
})

describe("SheriaBotThinkingDroid", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockMatchMedia(false) // Default to normal motion
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it("should not render when phase is idle", () => {
    const { container } = render(<SheriaBotThinkingDroid state={mockState("idle")} query="" />)
    expect(container).toBeEmptyDOMElement()
  })

  it("should render error state correctly", () => {
    const { container } = render(<SheriaBotThinkingDroid state={mockState("error")} query="" />)
    expect(container).toBeEmptyDOMElement()
  })

  it("should cycle frames correctly in connecting phase", () => {
    const { container } = render(<SheriaBotThinkingDroid state={mockState("connecting")} query="" />)
    const img = container.querySelector("img") as HTMLImageElement
    
    // Starts with FOCUS
    expect(img.src).toContain("sheriabot-droid-thinking-01-focus.webp")
    
    // First tick
    act(() => { vi.advanceTimersByTime(700) })
    expect(img.src).toContain("sheriabot-droid-thinking-02-searching.webp")
    
    // Second tick loops back to FOCUS
    act(() => { vi.advanceTimersByTime(700) })
    expect(img.src).toContain("sheriabot-droid-thinking-01-focus.webp")
  })

  it("should cycle frames correctly in streaming phase", () => {
    const { container } = render(<SheriaBotThinkingDroid state={mockState("streaming")} query="" />)
    const img = container.querySelector("img") as HTMLImageElement
    
    // Starts with SEARCHING
    expect(img.src).toContain("sheriabot-droid-thinking-02-searching.webp")
    
    act(() => { vi.advanceTimersByTime(700) })
    expect(img.src).toContain("sheriabot-droid-thinking-03-reading.webp")
    
    act(() => { vi.advanceTimersByTime(700) })
    expect(img.src).toContain("sheriabot-droid-thinking-04-processing.webp")
    
    act(() => { vi.advanceTimersByTime(700) })
    expect(img.src).toContain("sheriabot-droid-thinking-02-searching.webp")
  })

  it("should cycle frames correctly in verifying phase", () => {
    const { container } = render(<SheriaBotThinkingDroid state={mockState("verifying")} query="" />)
    const img = container.querySelector("img") as HTMLImageElement
    
    expect(img.src).toContain("sheriabot-droid-thinking-04-processing.webp")
    
    act(() => { vi.advanceTimersByTime(700) })
    expect(img.src).toContain("sheriabot-droid-thinking-05-verifying.webp")
    
    act(() => { vi.advanceTimersByTime(700) })
    expect(img.src).toContain("sheriabot-droid-thinking-04-processing.webp")
  })

  it("should render ready frame and start fade out on complete phase", () => {
    const { container } = render(<SheriaBotThinkingDroid state={mockState("complete")} query="" />)
    const img = container.querySelector("img") as HTMLImageElement
    
    expect(img.src).toContain("sheriabot-droid-thinking-06-ready.webp")
    
    const containerDiv = img.closest(".transition-opacity")
    expect(containerDiv).toHaveClass("opacity-100")
    
    // After 1000ms, it should start fading out
    act(() => { vi.advanceTimersByTime(1000) })
    expect(containerDiv).toHaveClass("opacity-0")
  })

  it("should reset frame sequence correctly on phase change", () => {
    const { container, rerender } = render(<SheriaBotThinkingDroid state={mockState("connecting")} query="" />)
    let img = container.querySelector("img") as HTMLImageElement
    
    expect(img.src).toContain("sheriabot-droid-thinking-01-focus.webp")
    act(() => { vi.advanceTimersByTime(700) })
    expect(img.src).toContain("sheriabot-droid-thinking-02-searching.webp")
    
    // Change to verifying
    rerender(<SheriaBotThinkingDroid state={mockState("verifying")} query="" />)
    img = container.querySelector("img") as HTMLImageElement
    // Should reset to the first frame of verifying (04-processing)
    expect(img.src).toContain("sheriabot-droid-thinking-04-processing.webp")
  })

  it("should stop animating when prefers-reduced-motion is true", () => {
    mockMatchMedia(true)
    
    const { container } = render(<SheriaBotThinkingDroid state={mockState("streaming")} query="" />)
    const img = container.querySelector("img") as HTMLImageElement
    
    expect(img.src).toContain("sheriabot-droid-thinking-02-searching.webp")
    
    // Even after advancing time, the frame should not change
    act(() => { vi.advanceTimersByTime(2100) })
    expect(img.src).toContain("sheriabot-droid-thinking-02-searching.webp")
  })
})
