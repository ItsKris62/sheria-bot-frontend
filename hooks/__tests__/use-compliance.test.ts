import { beforeEach, describe, expect, it, vi } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { useComplianceStream } from "../use-compliance"
import { useAuthStore } from "@/lib/auth-store"

const mocks = vi.hoisted(() => ({
  fetch: vi.fn(),
  playNotificationSound: vi.fn(),
}))

const streamInput = (question: string) => ({
  question,
  mode: "SINGLE" as const,
  jurisdictions: ["KE"] as ["KE"],
})

vi.stubGlobal("fetch", mocks.fetch)

vi.mock("@/lib/notification-sounds", () => ({
  playNotificationSound: (...args: unknown[]) => mocks.playNotificationSound(...args),
}))

beforeEach(() => {
  vi.clearAllMocks()
  useAuthStore.setState({ accessToken: "mock-test-jwt-token" })
})

describe("useComplianceStream State Machine", () => {
  it("initializes with idle phase and empty content", () => {
    const { result } = renderHook(() => useComplianceStream())

    expect(result.current.state).toEqual({
      phase: "idle",
      queryId: null,
      ragSources: 0,
      content: "",
      result: null,
      errorMessage: null,
    })
  })

  it("fails with unauthenticated error if accessToken is missing", () => {
    useAuthStore.setState({ accessToken: null })
    const { result } = renderHook(() => useComplianceStream())

    act(() => {
      result.current.submit(streamInput("What are the KYC rules for mobile lenders?"))
    })

    expect(result.current.state.phase).toBe("error")
    expect(result.current.state.errorMessage).toBe("Not authenticated")
    expect(mocks.fetch).not.toHaveBeenCalled()
  })

  it("fails with validation error if question is empty or whitespace", () => {
    const { result } = renderHook(() => useComplianceStream())

    act(() => {
      result.current.submit(streamInput("   "))
    })

    expect(result.current.state.phase).toBe("error")
    expect(result.current.state.errorMessage).toBe("Question is required")
    expect(mocks.fetch).not.toHaveBeenCalled()
  })

  it("fails with validation error if question exceeds 5000 characters", () => {
    const { result } = renderHook(() => useComplianceStream())

    act(() => {
      result.current.submit(streamInput("A".repeat(5001)))
    })

    expect(result.current.state.phase).toBe("error")
    expect(result.current.state.errorMessage).toBe("Question must be 5,000 characters or fewer")
    expect(mocks.fetch).not.toHaveBeenCalled()
  })

  it("handles non-ok HTTP response from backend stream endpoint", async () => {
    mocks.fetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: "Rate limit exceeded. Please try again later." }),
    })

    const { result } = renderHook(() => useComplianceStream())

    await act(async () => {
      result.current.submit(streamInput("What are the AML rules for payments?"))
    })

    expect(result.current.state.phase).toBe("error")
    expect(result.current.state.errorMessage).toBe("Rate limit exceeded. Please try again later.")
  })

  it("resets state and aborts active stream on reset()", async () => {
    const mockReader = {
      read: vi.fn().mockImplementation(() => new Promise(() => {})), // never resolves
      releaseLock: vi.fn(),
    }

    mocks.fetch.mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    })

    const { result } = renderHook(() => useComplianceStream())

    act(() => {
      result.current.submit(streamInput("What are CBK capital adequacy ratios?"))
    })

    expect(result.current.state.phase).toBe("connecting")

    act(() => {
      result.current.reset()
    })

    expect(result.current.state).toEqual({
      phase: "idle",
      queryId: null,
      ragSources: 0,
      content: "",
      result: null,
      errorMessage: null,
    })
  })
})
