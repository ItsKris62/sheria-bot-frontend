"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
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
  DEFAULT_JURISDICTION,
  isQueryableJurisdictionCode,
  type JurisdictionCapability,
  type JurisdictionCode,
  type QueryableJurisdictionCode,
} from "@/lib/jurisdictions"
import {
  ComplianceQueryHeader,
  ComplianceQueryComposer,
  ComplianceQueryProgress,
  ComplianceQuerySidebar,
  JurisdictionContextBar,
  type Message,
  type FeedbackRating,
  type FeedbackPulse,
  type DetailLevel,
  type HistoryItem,
} from "@/components/compliance/query"

const JURISDICTION_STORAGE_KEY = "sheriabot:compliance-query:selected-jurisdiction"

function readStoredJurisdictions(): QueryableJurisdictionCode[] {
  if (typeof window === "undefined") return [DEFAULT_JURISDICTION]
  const stored = window.localStorage.getItem(JURISDICTION_STORAGE_KEY)
  if (!stored) return [DEFAULT_JURISDICTION]
  try {
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isQueryableJurisdictionCode)) {
      return parsed
    }
  } catch {
    if (isQueryableJurisdictionCode(stored)) {
      return [stored]
    }
  }
  return [DEFAULT_JURISDICTION]
}

function responseJurisdictionsOf(
  result: { primaryJurisdiction?: JurisdictionCode; jurisdictions?: JurisdictionCode[] },
  fallback: QueryableJurisdictionCode[],
): JurisdictionCode[] {
  if (result.jurisdictions && result.jurisdictions.length > 0) return result.jurisdictions
  if (result.primaryJurisdiction) return [result.primaryJurisdiction]
  return fallback
}

function hasCitationJurisdictionMismatch(
  citations: Array<{ jurisdictionCode?: JurisdictionCode | null }> | undefined,
  jurisdictions: JurisdictionCode[],
): boolean {
  if (!citations || citations.length === 0) return false
  return citations.some((citation) => citation.jurisdictionCode && !jurisdictions.includes(citation.jurisdictionCode))
}

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
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<QueryableJurisdictionCode[]>(readStoredJurisdictions)
  const [activeQueryJurisdictions, setActiveQueryJurisdictions] = useState<QueryableJurisdictionCode[] | null>(null)

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
  const restrictedJurisdictionPlan = planData?.plan === "REGULATOR" || planData?.plan === "FREE_TRIAL"
  const { data: jurisdictionCapabilitiesData } = trpc.compliance.jurisdictionCapabilities.useQuery(undefined, {
    staleTime: 60 * 60 * 1000,
  })
  const jurisdictionCapabilities: JurisdictionCapability[] = useMemo(
    () => (jurisdictionCapabilitiesData?.jurisdictions ?? []).map((capability) => ({
      ...capability,
      comparisonEnabled: Boolean(capability.comparisonEnabled),
      corpusReady: Boolean(capability.corpusReady),
    })),
    [jurisdictionCapabilitiesData?.jurisdictions],
  )

  // Dedup guard - prevents double-push in React StrictMode
  const lastPushedQueryIdRef = useRef<string | null>(null)
  const topicPrefillAppliedRef = useRef(false)
  // Captures the question text at submit time for AbstainCard keyword matching
  const pendingQuestionRef = useRef<string>("")
  const feedbackInFlightRef = useRef<Set<string>>(new Set())

  const isStreaming = (["connecting", "streaming", "verifying"] as const).some(
    (p) => p === streamState.phase,
  )
  const fallbackJurisdiction = jurisdictionCapabilities.find(
    (item) => item.queryEnabled && item.corpusReady && isQueryableJurisdictionCode(item.code),
  )
  const effectiveSelectedJurisdictions = selectedJurisdictions.filter((code) => {
    const capability = jurisdictionCapabilities.find((item) => item.code === code)
    return capability?.queryEnabled !== false && capability?.corpusReady !== false
  })
  if (effectiveSelectedJurisdictions.length === 0) {
    effectiveSelectedJurisdictions.push(
      isQueryableJurisdictionCode(fallbackJurisdiction?.code) ? fallbackJurisdiction.code : DEFAULT_JURISDICTION
    )
  }
  const homeJurisdiction = isQueryableJurisdictionCode(planData?.billing?.homeJurisdictionCode)
    ? planData.billing.homeJurisdictionCode
    : null
  const singleModeJurisdiction = homeJurisdiction ?? effectiveSelectedJurisdictions[0]
  const visibleSelectedJurisdictions = restrictedJurisdictionPlan
    ? [singleModeJurisdiction]
    : effectiveSelectedJurisdictions
  const submitJurisdictions = [singleModeJurisdiction]
  const effectiveSelectedJurisdiction = singleModeJurisdiction
  const complianceQueryUsage = planData?.usage?.complianceQueries
  const remainingComplianceCredits =
    complianceQueryUsage && complianceQueryUsage.limit >= 0
      ? Math.max(complianceQueryUsage.limit - complianceQueryUsage.current, 0)
      : undefined

  const chatScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (topicPrefillAppliedRef.current) return
    topicPrefillAppliedRef.current = true

    // Track page open
    trackEvent("compliance_query_opened", {
      source: topic ? "topic_link" : "direct",
      jurisdictionCode: effectiveSelectedJurisdictions.join(","),
    })

    if (!isRegulatoryArea(topic)) return

    router.replace("/startup/compliance-query", { scroll: false })
  }, [effectiveSelectedJurisdictions, router, topic])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(JURISDICTION_STORAGE_KEY, JSON.stringify(effectiveSelectedJurisdictions))
  }, [effectiveSelectedJurisdictions])

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
      const messageJurisdictions = responseJurisdictionsOf(
        result,
        activeQueryJurisdictions ?? effectiveSelectedJurisdictions,
      )
      const hasInvalidCitations = hasCitationJurisdictionMismatch(result.citations, messageJurisdictions)
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          type: "assistant",
          content: result.answer,
          citations: hasInvalidCitations ? [] : result.citations,
          confidence: hasInvalidCitations ? null : result.confidence,
          queryId: result.queryId,
          jurisdictions: messageJurisdictions,
          timestamp: new Date(),
          abstained: result.abstained || hasInvalidCitations,
          route: hasInvalidCitations ? "abstain" : result.route,
          runId: result.runId,
          grounded: hasInvalidCitations ? false : result.grounded,
          fallbackReason: hasInvalidCitations ? "ALL_CHUNKS_FAILED_VERIFICATION" : result.fallbackReason ?? null,
          question: pendingQuestionRef.current,
        },
      ])

      trackEvent("compliance_query_completed", {
        citation_count: hasInvalidCitations ? 0 : result.citations?.length || 0,
        status: result.abstained || hasInvalidCitations ? "abstained" : "answered",
        answer_detail: answerDetail,
        usage_units_consumed: result.abstained || hasInvalidCitations ? 0 : (answerDetail === "detailed" ? 2 : 1),
        fallback_triggered: result.abstained || hasInvalidCitations,
        fallback_reason: hasInvalidCitations
          ? "citation_jurisdiction_mismatch"
          : result.fallbackReason ?? (result.abstained ? result.route ?? undefined : undefined),
        jurisdictionCode: messageJurisdictions.join(","),
        response_word_count: result.answer.split(/\s+/).length,
      })

      if (result.grounded === false || hasInvalidCitations || (result.abstained && result.route === "corpus-gap")) {
        trackEvent("compliance_query_source_insufficient", {
          jurisdictionCode: messageJurisdictions.join(","),
        })
      }

      setActiveQueryJurisdictions(null)
    }
  }, [activeQueryJurisdictions, answerDetail, effectiveSelectedJurisdictions, streamState])

  // Handlers

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed || isStreaming) return
    const effectiveCapability = jurisdictionCapabilities.find(
      (item) => isQueryableJurisdictionCode(item.code) && effectiveSelectedJurisdictions.includes(item.code),
    )
    if (effectiveCapability && !effectiveCapability.queryEnabled) return

    const requestJurisdictions = submitJurisdictions
    setActiveQueryJurisdictions(requestJurisdictions)

    trackEvent("compliance_query_started", {
      source: "manual_input",
      jurisdictionCode: requestJurisdictions.join(","),
    })

    pendingQuestionRef.current = trimmed
    setPendingQuestion(trimmed)
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        type: "user",
        content: trimmed,
        jurisdictions: requestJurisdictions,
        timestamp: new Date(),
      },
    ])
    setQuery("")
    streamSubmit({
      question: trimmed,
      mode: "SINGLE",
      jurisdictions: requestJurisdictions,
      answerDetail,
    })
    scrollChatToBottom()
  }

  const handleSuggestedQuery = (
    suggestionText: string,
    suggestionId?: string,
    surface: "empty_state" | "sidebar" = "sidebar",
  ) => {
    trackEvent("suggested_query_selected", {
      source: surface,
      jurisdictionCode: effectiveSelectedJurisdictions.join(","),
    })
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

      <JurisdictionContextBar
        capabilities={jurisdictionCapabilities}
        selectedJurisdictions={visibleSelectedJurisdictions}
        disabled={isStreaming || restrictedJurisdictionPlan}
        comparisonAllowed={!restrictedJurisdictionPlan}
        onJurisdictionChange={(values) => setSelectedJurisdictions(values.slice(0, restrictedJurisdictionPlan ? 1 : 4))}
      />

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
              selectedJurisdictions={effectiveSelectedJurisdictions}
              activeQueryJurisdictions={activeQueryJurisdictions}
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
              jurisdiction={effectiveSelectedJurisdiction}
              remainingCredits={remainingComplianceCredits}
              onQueryChange={setQuery}
              onAnswerDetailChange={setAnswerDetail}
              onSubmit={handleSubmit}
            />
          </Card>
        </div>

        {/* Right Sidebar Rail (33.3%) */}
        <div className="lg:col-span-4">
          <ComplianceQuerySidebar
            selectedJurisdiction={effectiveSelectedJurisdiction}
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
