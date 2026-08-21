import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import React from "react"
import ComplianceQueryPage from "@/app/(dashboard)/startup/compliance-query/page"
import type { StreamState } from "@/hooks/use-compliance"

const mocks = vi.hoisted(() => ({
  submit: vi.fn(),
  reset: vi.fn(),
  streamState: {
    phase: "idle",
    queryId: null,
    ragSources: 0,
    content: "",
    result: null,
    errorMessage: null,
  } as StreamState,
  historyData: {
    queries: [
      {
        id: "q-hist-1",
        query: "What are the KYC limits for Tier 1 mobile wallets?",
        createdAt: "2026-08-01T10:00:00Z",
        primaryJurisdiction: "KE",
      },
    ],
    pagination: { page: 1, limit: 3, total: 1, pages: 1 },
  },
  suggestedQueriesData: {
    suggestions: [
      { id: "sug-1", text: "What are the CBK capital requirements for payment processors?" },
    ],
  },
  jurisdictionCapabilitiesData: {
    jurisdictions: [
      { code: "KE", name: "Kenya", queryEnabled: true, status: "ACTIVE" },
      { code: "RW", name: "Rwanda", queryEnabled: true, status: "ACTIVE" },
      { code: "MW", name: "Malawi", queryEnabled: true, status: "ACTIVE" },
      { code: "NG", name: "Nigeria", queryEnabled: false, status: "COMING_SOON" },
    ],
  },
  planData: {
    usage: {
      complianceQueries: { current: 90, limit: 100 },
    },
  },
  feedbackMutate: vi.fn(),
  saveMutate: vi.fn(),
  suggestionClickMutate: vi.fn(),
  trackEvent: vi.fn(),
  routerReplace: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mocks.routerReplace,
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock("@/lib/analytics", () => ({
  trackEvent: (...args: unknown[]) => mocks.trackEvent(...args),
}))

vi.mock("@/hooks/use-compliance", () => ({
  useComplianceStream: () => ({
    submit: mocks.submit,
    state: mocks.streamState,
    reset: mocks.reset,
  }),
  useComplianceHistory: () => ({
    data: mocks.historyData,
  }),
}))

vi.mock("@/lib/trpc", () => ({
  getErrorMessage: (error: unknown) => error instanceof Error ? error.message : "Error",
  trpc: {
    useUtils: () => ({
      compliance: {
        getSuggestedQueries: { invalidate: vi.fn() },
      },
    }),
    billing: {
      getPlanAndUsage: {
        useQuery: () => ({ data: mocks.planData }),
      },
    },
    corpusGapReport: {
      submitReport: {
        useMutation: () => ({ mutate: vi.fn(), mutateAsync: vi.fn() }),
      },
    },
    compliance: {
      history: {
        useQuery: () => ({
          data: { queries: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } },
          isLoading: false,
          isError: false,
        }),
      },
      getSuggestedQueries: {
        useQuery: () => ({
          data: mocks.suggestedQueriesData,
          isLoading: false,
          isError: false,
        }),
      },
      jurisdictionCapabilities: {
        useQuery: () => ({
          data: mocks.jurisdictionCapabilitiesData,
        }),
      },
      submitFeedback: {
        useMutation: () => ({ mutateAsync: mocks.feedbackMutate }),
      },
      toggleSave: {
        useMutation: () => ({ mutateAsync: mocks.saveMutate }),
      },
      recordSuggestionClick: {
        useMutation: () => ({ mutate: mocks.suggestionClickMutate }),
      },
      reportGap: {
        useMutation: () => ({ mutate: vi.fn() }),
      },
    },
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  window.localStorage.clear()
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = vi.fn(() => false)
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = vi.fn()
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = vi.fn()
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn()
  }
  if (!Element.prototype.scrollTo) {
    Element.prototype.scrollTo = vi.fn()
  }
  mocks.streamState = {
    phase: "idle",
    queryId: null,
    ragSources: 0,
    content: "",
    result: null,
    errorMessage: null,
  }
})

describe("ComplianceQueryPage Integration Baseline Suite", () => {
  it("renders empty initial state with title, suggested prompt, and history sidebar", () => {
    render(<ComplianceQueryPage />)

    expect(screen.getByRole("heading", { name: "Compliance Query" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Ask a Compliance Question" })).toBeInTheDocument()
    expect(screen.getAllByText("Suggested for Kenya").length).toBeGreaterThan(0)
    expect(
      screen.getByText("What are the KYC limits for Tier 1 mobile wallets?"),
    ).toBeInTheDocument()
  })

  it("submits question via input form and calls streamSubmit", async () => {
    render(<ComplianceQueryPage />)

    const input = screen.getByPlaceholderText(/Ask a compliance question about Kenya/i)
    fireEvent.change(input, {
      target: { value: "What are the data localization rules in Kenya?" },
    })

    const submitBtn = screen.getByRole("button", { name: "Submit query" })
    fireEvent.click(submitBtn)

    expect(mocks.submit).toHaveBeenCalledWith({
      question: "What are the data localization rules in Kenya?",
      mode: "SINGLE",
      jurisdictions: ["KE"],
      answerDetail: "standard",
    })
    expect(mocks.trackEvent).toHaveBeenCalledWith(
      "compliance_query_started",
      expect.objectContaining({ source: "manual_input" }),
    )
  })

  it("submits question using Ctrl+Enter keyboard shortcut", () => {
    render(<ComplianceQueryPage />)

    const input = screen.getByPlaceholderText(/Ask a compliance question about Kenya/i)
    fireEvent.change(input, {
      target: { value: "What is the penalty for late AML reporting?" },
    })

    fireEvent.keyDown(input, { key: "Enter", ctrlKey: true })

    expect(mocks.submit).toHaveBeenCalledWith({
      question: "What is the penalty for late AML reporting?",
      mode: "SINGLE",
      jurisdictions: ["KE"],
      answerDetail: "standard",
    })
  })

  it.each([
    ["Rwanda", "RW"],
    ["Malawi", "MW"],
  ] as const)("submits explicit SINGLE jurisdiction for %s", async (country, code) => {
    window.localStorage.setItem("sheriabot:compliance-query:selected-jurisdiction", code)
    render(<ComplianceQueryPage />)

    const input = screen.getByPlaceholderText(new RegExp(`Ask a compliance question about ${country}`, "i"))
    fireEvent.change(input, { target: { value: `What licensing requirements apply in ${country}?` } })
    fireEvent.click(screen.getByRole("button", { name: "Submit query" }))

    expect(mocks.submit).toHaveBeenCalledWith({
      question: `What licensing requirements apply in ${country}?`,
      mode: "SINGLE",
      jurisdictions: [code],
      answerDetail: "standard",
    })
  })

  it("does not submit Nigeria when an invalid stored selection is present", () => {
    window.localStorage.setItem("sheriabot:compliance-query:selected-jurisdiction", "NG")
    render(<ComplianceQueryPage />)

    const input = screen.getByPlaceholderText(/Ask a compliance question about Kenya/i)
    fireEvent.change(input, { target: { value: "What licensing requirements apply in Nigeria?" } })
    fireEvent.click(screen.getByRole("button", { name: "Submit query" }))

    expect(mocks.submit).toHaveBeenCalledWith({
      question: "What licensing requirements apply in Nigeria?",
      mode: "SINGLE",
      jurisdictions: ["KE"],
      answerDetail: "standard",
    })
  })

  it("renders connecting/verifying state with thinking indicator", () => {
    mocks.streamState = {
      phase: "connecting",
      queryId: "q-stream-1",
      ragSources: 5,
      content: "",
      result: null,
      errorMessage: null,
    }

    render(<ComplianceQueryPage />)

    expect(screen.getByText(/Thinking/i)).toBeInTheDocument()
  })

  it("renders stream error message when streamState phase is error", () => {
    mocks.streamState = {
      phase: "error",
      queryId: null,
      ragSources: 0,
      content: "",
      result: null,
      errorMessage: "Rate limit exceeded. Please try again later.",
    }

    render(<ComplianceQueryPage />)

    expect(
      screen.getByText("Rate limit exceeded. Please try again later."),
    ).toBeInTheDocument()
  })
})
