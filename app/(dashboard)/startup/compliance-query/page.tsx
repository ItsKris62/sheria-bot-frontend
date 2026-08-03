"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import {
  useComplianceStream,
  useComplianceHistory,
} from "@/hooks/use-compliance"
import { isRegulatoryArea, REGULATORY_AREA_NAMES } from "@/lib/compliance/compliance.types"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"
import { trackEvent } from "@/lib/analytics"
import {
  ComplianceQueryHeader,
  ComplianceQueryComposer,
  ComplianceQueryProgress,
  ComplianceQuerySidebar,
  type Message,
  type FeedbackRating,
  type FeedbackPulse,
  type SuggestionItem,
  type DetailLevel,
  type HistoryItem,
} from "@/components/compliance/query"

export default function ComplianceQueryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const topic = searchParams.get("topic")
  const [query, setQuery] = useState(() => {
    if (!isRegulatoryArea(topic)) return ""
    const areaLabel = REGULATORY_AREA_NAMES[topic]
    return `What are the current compliance requirements for ${areaLabel} that apply to my organization?`
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [answerDetail, setAnswerDetail] = useState<DetailLevel>("standard")
  const [pendingQuestion, setPendingQuestion] = useState("")

  const [feedbackState, setFeedbackState] = useState<Record<string, FeedbackRating>>({})
  const [savedState, setSavedState] = useState<Record<string, boolean>>({})
  const [feedbackLoading, setFeedbackLoading] = useState<Record<string, boolean>>({})
  const [saveLoading, setSaveLoading] = useState<Record<string, boolean>>({})
  const [feedbackPulse, setFeedbackPulse] = useState<Record<string, FeedbackPulse | undefined>>({})

  const { submit: streamSubmit, state: streamState } = useComplianceStream()
  const { data: historyData } = useComplianceHistory(1, 3)
  const [showAllQueries, setShowAllQueries] = useState(false)

  const feedbackMutation = trpc.compliance.submitFeedback.useMutation()
  const saveMutation = trpc.compliance.toggleSave.useMutation()
  const clickTrackingMutation = trpc.compliance.recordSuggestionClick.useMutation()

  const { data: planData } = trpc.billing.getPlanAndUsage.useQuery()

  // Suggested queries - server-driven personalised list, 1h client cache
  const {
    data: suggestedQueriesData,
    isLoading: suggestedQueriesLoading,
    isError: suggestedQueriesError,
  } = trpc.compliance.getSuggestedQueries.useQuery({}, {
    staleTime: 60 * 60 * 1000, // 1 hour - matches Redis TTL
  })
  const suggestions: SuggestionItem[] = suggestedQueriesData?.suggestions ?? []

  const utils = trpc.useUtils()

  // Dedup guard - prevents double-push in React StrictMode
  const lastPushedQueryIdRef = useRef<string | null>(null)
  const topicPrefillAppliedRef = useRef(false)
  // Captures the question text at submit time for AbstainCard keyword matching
  const pendingQuestionRef = useRef<string>("")
  const feedbackInFlightRef = useRef<Set<string>>(new Set())

  const isStreaming = (["connecting", "streaming", "verifying"] as const).some(
    (p) => p === streamState.phase,
  )

  const chatScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (topicPrefillAppliedRef.current) return
    topicPrefillAppliedRef.current = true

    // Track page open
    trackEvent("compliance_query_opened", {
      source: topic ? "topic_link" : "direct",
    })

    if (!isRegulatoryArea(topic)) return

    router.replace("/startup/compliance-query", { scroll: false })
  }, [router, topic])

  const scrollChatToBottom = () => {
    if (typeof window === "undefined") return
    window.requestAnimationFrame(() => {
      if (!chatScrollRef.current) return
      const viewport = chatScrollRef.current.querySelector<HTMLElement>(
        "[data-radix-scroll-area-viewport]",
      )
      const prefersReducedMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      viewport?.scrollTo({
        top: viewport.scrollHeight,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      })
    })
  }

  // Commit completed stream result into the messages array
  useEffect(() => {
    const { result } = streamState
    if (
      streamState.phase === "complete" &&
      result !== null &&
      result.queryId !== lastPushedQueryIdRef.current
    ) {
      lastPushedQueryIdRef.current = result.queryId
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          type: "assistant",
          content: result.answer,
          citations: result.citations,
          confidence: result.confidence,
          queryId: result.queryId,
          timestamp: new Date(),
          abstained: result.abstained,
          route: result.route,
          runId: result.runId,
          grounded: result.grounded,
          fallbackReason: result.fallbackReason ?? null,
          question: pendingQuestionRef.current,
        },
      ])

      trackEvent("compliance_query_completed", {
        citation_count: result.citations?.length || 0,
        status: result.abstained ? "abstained" : "answered",
        answer_detail: answerDetail,
        usage_units_consumed: result.abstained ? 0 : (answerDetail === "detailed" ? 2 : 1),
        fallback_triggered: result.abstained,
        fallback_reason: result.fallbackReason ?? (result.abstained ? result.route ?? undefined : undefined),
        response_word_count: result.answer.split(/\s+/).length,
      })

      if (result.grounded === false || (result.abstained && result.route === "corpus-gap")) {
        trackEvent("compliance_query_source_insufficient")
      }
    }
  }, [answerDetail, streamState])

  // Handlers

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed || isStreaming) return

    trackEvent("compliance_query_started", { source: "manual_input" })

    pendingQuestionRef.current = trimmed
    setPendingQuestion(trimmed)
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        type: "user",
        content: trimmed,
        timestamp: new Date(),
      },
    ])
    setQuery("")
    streamSubmit({ question: trimmed, answerDetail })
    scrollChatToBottom()
  }

  const handleSuggestedQuery = (
    suggestionText: string,
    suggestionId?: string,
    surface: "empty_state" | "sidebar" = "sidebar",
  ) => {
    trackEvent("compliance_query_started", { source: "suggestion_" + surface })
    setQuery(suggestionText)
    if (suggestionId) {
      clickTrackingMutation.mutate(
        { suggestionId, suggestionText, surface },
        { onError: () => { /* fire-and-forget - silent failure */ } },
      )
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleFeedback = async (queryId: string, rating: "up" | "down") => {
    if (feedbackInFlightRef.current.has(queryId)) return
    feedbackInFlightRef.current.add(queryId)
    const previous = feedbackState[queryId] ?? null
    const optimistic: FeedbackRating = previous === rating ? null : rating
    setFeedbackState((prev) => ({ ...prev, [queryId]: optimistic }))
    setFeedbackPulse((prev) => ({
      ...prev,
      [queryId]: { rating, nonce: Date.now() },
    }))
    setFeedbackLoading((prev) => ({ ...prev, [queryId]: true }))
    try {
      const result = await feedbackMutation.mutateAsync({ queryId, rating })
      setFeedbackState((prev) => ({ ...prev, [queryId]: result.rating }))
    } catch {
      setFeedbackState((prev) => ({ ...prev, [queryId]: previous }))
      toast.error("Couldn't save feedback", { description: "Please try again." })
    } finally {
      feedbackInFlightRef.current.delete(queryId)
      setFeedbackLoading((prev) => ({ ...prev, [queryId]: false }))
    }
  }

  const handleSave = async (queryId: string) => {
    if (saveLoading[queryId]) return
    const previous = savedState[queryId] ?? false
    setSavedState((prev) => ({ ...prev, [queryId]: !previous }))
    setSaveLoading((prev) => ({ ...prev, [queryId]: true }))
    try {
      const result = await saveMutation.mutateAsync({ queryId })
      setSavedState((prev) => ({ ...prev, [queryId]: result.saved }))
      toast(result.saved ? "Response saved" : "Removed from saved")
    } catch {
      setSavedState((prev) => ({ ...prev, [queryId]: previous }))
      toast.error("Couldn't save response", { description: "Please try again." })
    } finally {
      setSaveLoading((prev) => ({ ...prev, [queryId]: false }))
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full motion-safe:animate-fade-slide-up">
      {/* Header */}
      <ComplianceQueryHeader />

      {/* Structured Dark Workspace Grid (66% Main / 33% Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Regulatory Answer Workspace (66.7%) */}
        <div className="lg:col-span-8">
          <Card className="flex h-[calc(100vh-220px)] min-h-[580px] flex-col border-border/60 bg-card/90 shadow-xs rounded-xl overflow-hidden transition-all duration-200 hover:border-border/80">
            {/* Progress & Message History */}
            <ComplianceQueryProgress
              messages={messages}
              isStreaming={isStreaming}
              streamState={streamState}
              pendingQuestion={pendingQuestion}
              suggestedQueries={suggestions}
              suggestedQueriesLoading={suggestedQueriesLoading}
              onSuggestedQuerySelect={handleSuggestedQuery}
              onCopy={handleCopy}
              onFeedback={handleFeedback}
              onSave={handleSave}
              feedbackState={feedbackState}
              savedState={savedState}
              feedbackLoading={feedbackLoading}
              saveLoading={saveLoading}
              feedbackPulse={feedbackPulse}
              chatScrollRef={chatScrollRef}
            />

            {/* Prominent Input Composer */}
            <ComplianceQueryComposer
              query={query}
              answerDetail={answerDetail}
              isStreaming={isStreaming}
              remainingCredits={planData?.usage?.complianceQueries?.remaining}
              onQueryChange={setQuery}
              onAnswerDetailChange={setAnswerDetail}
              onSubmit={handleSubmit}
            />
          </Card>
        </div>

        {/* Right Sidebar Rail (33.3%) */}
        <div className="lg:col-span-4">
          <ComplianceQuerySidebar
            suggestions={suggestions}
            suggestedQueriesLoading={suggestedQueriesLoading}
            suggestedQueriesError={suggestedQueriesError}
            onRetrySuggestions={() => void utils.compliance.getSuggestedQueries.invalidate()}
            onSuggestionSelect={handleSuggestedQuery}
            historyQueries={historyData?.queries as HistoryItem[] | undefined}
            showAllQueries={showAllQueries}
            onShowAllQueriesChange={setShowAllQueries}
          />
        </div>
      </div>
    </div>
  )
}
