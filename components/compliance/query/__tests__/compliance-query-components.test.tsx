import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import React from "react"
import {
  ComplianceQueryHeader,
  ComplianceQueryComposer,
  ComplianceQueryProgress,
  ComplianceQueryHistory,
  ComplianceQuerySidebar,
  MessageActionBar,
  ComplianceAnswerCitations,
} from "../index"
import type { CitationItem, StreamState } from "@/hooks/use-compliance"
import type { Message } from "../compliance-query-types"

const mocks = vi.hoisted(() => ({
  onCopy: vi.fn(),
  onFeedback: vi.fn().mockResolvedValue(undefined),
  onSave: vi.fn().mockResolvedValue(undefined),
  onQueryChange: vi.fn(),
  onAnswerDetailChange: vi.fn(),
  onSubmit: vi.fn(),
  onSuggestedQuerySelect: vi.fn(),
  onShowAllQueriesChange: vi.fn(),
  onRetrySuggestions: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock("@/lib/trpc", () => ({
  getErrorMessage: (error: unknown) => error instanceof Error ? error.message : "Error",
  trpc: {
    useUtils: () => ({
      compliance: {
        getSuggestedQueries: { invalidate: vi.fn() },
      },
    }),
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
      reportGap: {
        useMutation: () => ({ mutate: vi.fn() }),
      },
    },
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe("Extracted Compliance Query Presentation Components with Phase 3 Motion & Interaction", () => {
  describe("ComplianceQueryHeader", () => {
    it("renders title, description, and trust badge with motion-safe class", () => {
      render(<ComplianceQueryHeader />)

      expect(screen.getByRole("heading", { name: "Compliance Query" })).toBeInTheDocument()
      expect(
        screen.getByText(/Ask regulatory questions and receive evidence-backed guidance/i),
      ).toBeInTheDocument()
      expect(screen.getByText("Verified Legal Corpus")).toBeInTheDocument()
    })
  })

  describe("ComplianceQueryComposer", () => {
    it("renders query input and handles input change & radio detail selection", () => {
      render(
        <ComplianceQueryComposer
          query="What is the AML threshold?"
          answerDetail="standard"
          isStreaming={false}
          onQueryChange={mocks.onQueryChange}
          onAnswerDetailChange={mocks.onAnswerDetailChange}
          onSubmit={mocks.onSubmit}
        />,
      )

      const input = screen.getByPlaceholderText(/Ask about KYC requirements/i)
      expect(input).toHaveValue("What is the AML threshold?")

      fireEvent.change(input, { target: { value: "What is the new AML threshold?" } })
      expect(mocks.onQueryChange).toHaveBeenCalledWith("What is the new AML threshold?")

      const detailedRadio = screen.getByLabelText(/Detailed \(2 credits\)/i)
      fireEvent.click(detailedRadio)
      expect(mocks.onAnswerDetailChange).toHaveBeenCalledWith("detailed")
      expect(screen.getByText("Ctrl+Enter")).toBeInTheDocument()
    })

    it("displays warning banner when detailed detail level is selected with 1 remaining credit", () => {
      render(
        <ComplianceQueryComposer
          query="What is the AML threshold?"
          answerDetail="detailed"
          remainingCredits={1}
          isStreaming={false}
          onQueryChange={mocks.onQueryChange}
          onAnswerDetailChange={mocks.onAnswerDetailChange}
          onSubmit={mocks.onSubmit}
        />,
      )

      expect(
        screen.getByText(/You need 2 query credits for Detailed answers/i),
      ).toBeInTheDocument()
    })
  })

  describe("ComplianceQueryAnswer & MessageActionBar", () => {
    it("renders MessageActionBar copy button with temporary copied confirmation state", async () => {
      const message: Message = {
        id: "msg-1",
        type: "assistant",
        content: "Detailed compliance response...",
        queryId: "q-123",
        timestamp: new Date(),
      }

      render(
        <MessageActionBar
          message={message}
          onCopy={mocks.onCopy}
          onFeedback={mocks.onFeedback}
          onSave={mocks.onSave}
          feedbackState={{ "q-123": "up" }}
          savedState={{ "q-[#q-123]": false }}
          feedbackLoading={{}}
          saveLoading={{}}
          feedbackPulse={{}}
        />,
      )

      const copyBtn = screen.getByRole("button", { name: /copy/i })
      fireEvent.click(copyBtn)
      expect(mocks.onCopy).toHaveBeenCalledWith("Detailed compliance response...")

      expect(screen.getByText("Copied!")).toBeInTheDocument()

      await waitFor(
        () => {
          expect(screen.queryByText("Copied!")).not.toBeInTheDocument()
        },
        { timeout: 2000 },
      )
    })

    it("renders citations list with verification status badges", () => {
      const citations: CitationItem[] = [
        {
          documentId: "doc-1",
          documentTitle: "National Payment System Act",
          section: "Section 12",
          textSnippet: "Payment provider obligations...",
          score: 0.88,
          citation: "NPSA s.12",
          authorityStatus: "IN_FORCE",
          isBinding: true,
          verified: true,
          verificationStatus: "verified",
        },
      ]

      render(<ComplianceAnswerCitations citations={citations} />)

      expect(screen.getByText("National Payment System Act")).toBeInTheDocument()
      expect(screen.getByText("Verified")).toBeInTheDocument()
      expect(screen.getByText("88% relevance")).toBeInTheDocument()
    })
  })

  describe("ComplianceQueryProgress & Safety Control Timelines", () => {
    it("renders thinking indicator during streaming when content is empty", () => {
      const streamState: StreamState = {
        phase: "connecting",
        queryId: null,
        ragSources: 3,
        content: "",
        result: null,
        errorMessage: null,
      }

      render(
        <ComplianceQueryProgress
          messages={[]}
          isStreaming={true}
          streamState={streamState}
          pendingQuestion="What are the capital requirements?"
          suggestedQueries={[]}
          suggestedQueriesLoading={false}
          onSuggestedQuerySelect={mocks.onSuggestedQuerySelect}
          onCopy={mocks.onCopy}
          onFeedback={mocks.onFeedback}
          onSave={mocks.onSave}
          feedbackState={{}}
          savedState={{}}
          feedbackLoading={{}}
          saveLoading={{}}
          feedbackPulse={{}}
          chatScrollRef={{ current: null }}
        />,
      )

      expect(screen.getByText(/Thinking/i)).toBeInTheDocument()
    })

    it("renders UngroundedBanner immediately when message grounded is false", () => {
      const messages: Message[] = [
        {
          id: "msg-ungrounded",
          type: "assistant",
          content: "Partial compliance text...",
          grounded: false,
          timestamp: new Date(),
        },
      ]
      const streamState: StreamState = {
        phase: "idle",
        queryId: null,
        ragSources: 0,
        content: "",
        result: null,
        errorMessage: null,
      }

      render(
        <ComplianceQueryProgress
          messages={messages}
          isStreaming={false}
          streamState={streamState}
          pendingQuestion=""
          suggestedQueries={[]}
          suggestedQueriesLoading={false}
          onSuggestedQuerySelect={mocks.onSuggestedQuerySelect}
          onCopy={mocks.onCopy}
          onFeedback={mocks.onFeedback}
          onSave={mocks.onSave}
          feedbackState={{}}
          savedState={{}}
          feedbackLoading={{}}
          saveLoading={{}}
          feedbackPulse={{}}
          chatScrollRef={{ current: null }}
        />,
      )

      expect(screen.getByText(/Answer has limited regulatory grounding/i)).toBeInTheDocument()
    })
  })

  describe("ComplianceQueryHistory & Sidebar Motion", () => {
    it("renders history queries list and triggers view all dialog", () => {
      const queries = [
        { id: "q-1", query: "What are the KYC limits?", createdAt: "2026-08-01T12:00:00Z" },
      ]

      render(
        <ComplianceQueryHistory
          queries={queries}
          showAllQueries={false}
          onShowAllQueriesChange={mocks.onShowAllQueriesChange}
        />,
      )

      expect(screen.getByText("What are the KYC limits?")).toBeInTheDocument()

      const viewAllBtn = screen.getByRole("button", { name: "View all queries" })
      fireEvent.click(viewAllBtn)
      expect(mocks.onShowAllQueriesChange).toHaveBeenCalledWith(true)
    })

    it("renders sidebar with correct card section order (Recent Queries, Suggested Queries, Legal Corpus)", () => {
      render(
        <ComplianceQuerySidebar
          suggestions={[{ id: "s-1", text: "What is the capital requirement?" }]}
          suggestedQueriesLoading={false}
          suggestedQueriesError={false}
          onRetrySuggestions={mocks.onRetrySuggestions}
          onSuggestionSelect={mocks.onSuggestedQuerySelect}
          showAllQueries={false}
          onShowAllQueriesChange={mocks.onShowAllQueriesChange}
        />,
      )

      expect(screen.getByText("Recent Queries")).toBeInTheDocument()
      expect(screen.getByText("Suggested Queries")).toBeInTheDocument()
      expect(screen.getByText("Legal Corpus Coverage")).toBeInTheDocument()
    })

    it("renders suggested queries sidebar with retry button on error", () => {
      render(
        <ComplianceQuerySidebar
          suggestions={[]}
          suggestedQueriesLoading={false}
          suggestedQueriesError={true}
          onRetrySuggestions={mocks.onRetrySuggestions}
          onSuggestionSelect={mocks.onSuggestedQuerySelect}
          showAllQueries={false}
          onShowAllQueriesChange={mocks.onShowAllQueriesChange}
        />,
      )

      expect(screen.getByText("Could not load suggestions")).toBeInTheDocument()
      const retryBtn = screen.getByRole("button", { name: "Retry" })
      fireEvent.click(retryBtn)
      expect(mocks.onRetrySuggestions).toHaveBeenCalled()
    })
  })
})
