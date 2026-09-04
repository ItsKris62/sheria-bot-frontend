import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { UngroundedBanner } from "../ungrounded-banner"
import { AbstainCard } from "../abstain-card"
import { SourcesList } from "../sources-list"
import type { CitationItem } from "@/hooks/use-compliance"

const mocks = vi.hoisted(() => ({
  reportGapMutate: vi.fn(),
  trackEvent: vi.fn(),
}))

vi.mock("@/lib/analytics", () => ({
  trackEvent: (...args: unknown[]) => mocks.trackEvent(...args),
  trackFeatureUsage: vi.fn(),
  recordAccountActivation: vi.fn(),
}))

vi.mock("@/lib/trpc", () => ({
  getErrorMessage: (error: unknown) => error instanceof Error ? error.message : "Error",
  trpc: {
    compliance: {
      reportGap: {
        useMutation: (opts?: { onSuccess?: () => void; onError?: (err: { message: string }) => void }) => ({
          mutate: (data: unknown) => {
            mocks.reportGapMutate(data)
            opts?.onSuccess?.()
          },
          isPending: false,
        }),
      },
    },
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe("Regulatory Safety Controls Regression Suite", () => {
  describe("UngroundedBanner Component", () => {
    it("renders ungrounded answer warning banner with warning text", () => {
      render(<UngroundedBanner />)

      expect(screen.getByText("Answer has limited regulatory grounding")).toBeInTheDocument()
      expect(
        screen.getByText(/SheriaBot generated this response but could not fully verify it/i),
      ).toBeInTheDocument()
    })
  })

  describe("AbstainCard Component & Safety Controls", () => {
    it("renders out-of-scope abstention card with clear scope domain boundary text", () => {
      render(
        <AbstainCard
          queryId="q-scope-1"
          runId="run-1"
          question="How do I register a patent in Kenya?"
          route="abstain"
          fallbackReason="OUT_OF_SCOPE"
        />,
      )

      expect(screen.getByText("This question is outside SheriaBot's scope")).toBeInTheDocument()
      expect(screen.getByText(/could not locate sufficient verified/i)).toBeInTheDocument()
    })

    it("renders evidence-insufficiency abstention card with official authority links and opens GapForm", async () => {
      render(
        <AbstainCard
          queryId="q-evidence-1"
          runId="run-2"
          question="What is the precise capital threshold for a Tier 3 payment gateway under CBK rules?"
          route="simple"
          fallbackReason="ALL_CHUNKS_FAILED_VERIFICATION"
        />,
      )

      expect(screen.getByText("Retrieved sources were not strong enough")).toBeInTheDocument()

      // Confirm authority links list is present and contains CBK link
      const authoritiesList = screen.getByRole("list", { name: /Relevant regulatory authorities/i })
      expect(authoritiesList).toBeInTheDocument()
      expect(screen.getByText("CBK")).toBeInTheDocument()
      expect(screen.getByText(/Central Bank of Kenya/i)).toBeInTheDocument()

      // Click "Tell us what's missing" to trigger GapForm
      const gapButton = screen.getByRole("button", { name: /Tell us what's missing/i })
      expect(gapButton).toBeInTheDocument()
      fireEvent.click(gapButton)

      // Confirm GapForm renders
      expect(screen.getByRole("form", { name: /Report a corpus gap/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/Suggested document or regulation/i)).toBeInTheDocument()

      // Fill out gap form and submit
      fireEvent.change(screen.getByLabelText(/Suggested document or regulation/i), {
        target: { value: "CBK Payment System Guideline 2026" },
      })
      fireEvent.click(screen.getByRole("button", { name: /Submit feedback/i }))

      await waitFor(() => {
        expect(mocks.reportGapMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            queryId: "q-evidence-1",
            runId: "run-2",
            suggestedDocument: "CBK Payment System Guideline 2026",
          }),
        )
      })
    })
  })

  describe("SourcesList Component & Verification Badges", () => {
    it("renders citation items with verification status and relevance scores", () => {
      const citations: CitationItem[] = [
        {
          documentId: "doc-1",
          documentTitle: "Data Protection Act, 2019",
          section: "Section 25",
          textSnippet: "Principles of data protection...",
          score: 0.94,
          citation: "DPA 2019 s.25",
          authorityStatus: "IN_FORCE",
          isBinding: true,
          verified: true,
          verificationStatus: "verified",
        },
        {
          documentId: "doc-2",
          documentTitle: "CBK Digital Credit Providers Regulations",
          section: "Regulation 12",
          textSnippet: "Licensing requirements...",
          score: 0.78,
          citation: "DCP Reg 12",
          authorityStatus: "DRAFT",
          isBinding: false,
          verified: false,
          verificationStatus: "unverified",
        },
      ]

      render(<SourcesList citations={citations} />)

      // Verified source title & badge
      expect(screen.getByText("Data Protection Act, 2019")).toBeInTheDocument()
      expect(screen.getByText("Verified")).toBeInTheDocument()
      expect(screen.getByText(/94% relevance/i)).toBeInTheDocument()

      // Unverified source title & badge
      expect(screen.getByText("CBK Digital Credit Providers Regulations")).toBeInTheDocument()
      expect(screen.getByText("Unverified")).toBeInTheDocument()
      expect(screen.getByText("Draft")).toBeInTheDocument()
    })
  })
})
