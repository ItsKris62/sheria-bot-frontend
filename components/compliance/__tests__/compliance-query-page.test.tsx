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
      },
    ],
    pagination: { page: 1, limit: 3, total: 1, pages: 1 },
  },
  suggestedQueriesData: {
    suggestions: [
      { id: "sug-1", text: "What are the CBK capital requirements for payment processors?" },
    ],
  },
  planData: {
    usage: {
      complianceQueries: { remaining: 10, limit: 100 },
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
    expect(
      screen.getByText("What are the CBK capital requirements for payment processors?"),
    ).toBeInTheDocument()
    expect(
      screen.getByText("What are the KYC limits for Tier 1 mobile wallets?"),
    ).toBeInTheDocument()
  })

  it("submits question via input form and calls streamSubmit", async () => {
    render(<ComplianceQueryPage />)

    const input = screen.getByPlaceholderText(/Ask about KYC requirements/i)
    fireEvent.change(input, {
      target: { value: "What are the data localization rules in Kenya?" },
    })

    const submitBtn = screen.getByRole("button", { name: "Submit query" })
    fireEvent.click(submitBtn)

    expect(mocks.submit).toHaveBeenCalledWith({
      question: "What are the data localization rules in Kenya?",
      answerDetail: "standard",
    })
    expect(mocks.trackEvent).toHaveBeenCalledWith(
      "compliance_query_started",
      expect.objectContaining({ source: "manual_input" }),
    )
  })

  it("submits question using Ctrl+Enter keyboard shortcut", () => {
    render(<ComplianceQueryPage />)

    const input = screen.getByPlaceholderText(/Ask about KYC requirements/i)
    fireEvent.change(input, {
      target: { value: "What is the penalty for late AML reporting?" },
    })

    fireEvent.keyDown(input, { key: "Enter", ctrlKey: true })

    expect(mocks.submit).toHaveBeenCalledWith({
      question: "What is the penalty for late AML reporting?",
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
