"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Send,
  Loader2,
  BookOpen,
  Clock,
  ChevronRight,
  Scale,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
  FileQuestion,
} from "lucide-react"
import {
  useComplianceStream,
  useComplianceHistory,
  type CitationItem,
  type ComplianceFallbackReason,
} from "@/hooks/use-compliance"
import { formatDistanceToNow } from "date-fns"
import { ComplianceFeedback } from "@/components/compliance/compliance-feedback"

import { ThinkingIndicator } from "@/components/compliance/thinking-indicator"
import { AbstainCard } from "@/components/compliance/abstain-card"
import { UngroundedBanner } from "@/components/compliance/ungrounded-banner"
import { AllQueriesDialog } from "@/components/compliance/all-queries-dialog"
import { ReportMissingDocumentDialog } from "@/components/corpus-gap-report/report-missing-document-dialog"
import { isRegulatoryArea, REGULATORY_AREA_NAMES } from "@/lib/compliance/compliance.types"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"

// Types

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  citations?: CitationItem[]
  confidence?: number | null
  queryId?: string
  timestamp: Date
  /** Orchestrator fields - populated on the streaming path */
  abstained?: boolean
  route?: string | null
  runId?: string | null
  grounded?: boolean
  fallbackReason?: ComplianceFallbackReason | null
  /** User question that produced this response - used by AbstainCard for authority matching */
  question?: string
}

type FeedbackRating = "up" | "down" | null
type FeedbackPulse = { rating: "up" | "down"; nonce: number }

function SheriaBotLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <Image
      src="/favicon-logo.png"
      alt=""
      width={40}
      height={40}
      className={cn("rounded-full object-contain", className)}
      aria-hidden="true"
      priority={false}
    />
  )
}

function citationVerificationLabel(citation: CitationItem): "Verified" | "Unverified" | "Not checked" {
  if (citation.verificationStatus === "verified") return "Verified"
  if (citation.verificationStatus === "unverified") return "Unverified"
  return "Not checked"
}

function citationVerificationClass(label: "Verified" | "Unverified" | "Not checked"): string {
  if (label === "Verified") return "border-emerald-500/35 text-emerald-600"
  if (label === "Unverified") return "border-amber-500/35 text-amber-600"
  return "border-muted-foreground/25 text-muted-foreground"
}

const VERIFIED_HELPER_TEXT =
  "Verified sources were matched to SheriaBot's legal corpus and accepted by the verification flow. This does not replace independent legal advice."

// MessageActionBar

interface MessageActionBarProps {
  message: Message
  onCopy: (content: string) => void
  onFeedback: (queryId: string, rating: "up" | "down") => Promise<void>
  onSave: (queryId: string) => Promise<void>
  feedbackState: Record<string, FeedbackRating>
  savedState: Record<string, boolean>
  feedbackLoading: Record<string, boolean>
  saveLoading: Record<string, boolean>
  feedbackPulse: Record<string, FeedbackPulse | undefined>
}

function MessageActionBar({
  message,
  onCopy,
  onFeedback,
  onSave,
  feedbackState,
  savedState,
  feedbackLoading,
  saveLoading,
  feedbackPulse,
}: MessageActionBarProps) {
  const qId = message.queryId
  const rating = qId ? (feedbackState[qId] ?? null) : null
  const isSaved = qId ? (savedState[qId] ?? false) : false
  const isFbLoading = qId ? (feedbackLoading[qId] ?? false) : false
  const isSaveLoading = qId ? (saveLoading[qId] ?? false) : false
  const pulse = qId ? feedbackPulse[qId] : undefined
  const noQueryId = !qId

  return (
    <div className="mt-4 flex items-center gap-1">
      {/* Copy */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={() => onCopy(message.content)}
      >
        <Copy className="mr-1 h-3 w-3" />
        Copy
      </Button>

      {/* Save / Bookmark */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-2 transition-colors duration-150",
          isSaved && "text-warning",
          noQueryId && "opacity-40 cursor-not-allowed",
        )}
        onClick={() => qId && onSave(qId)}
        disabled={noQueryId || isSaveLoading}
        title={noQueryId ? "Available once response has been saved" : undefined}
        aria-label={isSaved ? "Remove from saved" : "Save response"}
      >
        {isSaveLoading ? (
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        ) : isSaved ? (
          <BookmarkCheck className="mr-1 h-3 w-3" />
        ) : (
          <Bookmark className="mr-1 h-3 w-3" />
        )}
        {isSaved ? "Saved" : "Save"}
      </Button>

      <div className="flex-1" />

      {/* Thumbs Up */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 transition-all duration-150",
          rating === "up" && "bg-primary/10 text-primary shadow-glow-green-sm",
          isFbLoading && rating === "up" && "ring-1 ring-primary/30",
          noQueryId && "opacity-40 cursor-not-allowed",
        )}
        onClick={() => qId && onFeedback(qId, "up")}
        disabled={noQueryId}
        title={noQueryId ? "Available once response has been saved" : "Mark as helpful"}
        aria-label="Mark as helpful"
        aria-pressed={rating === "up"}
        aria-busy={isFbLoading}
      >
        <ThumbsUp
          key={`up-${pulse?.nonce ?? 0}`}
          className={cn("h-3 w-3", pulse?.rating === "up" && "animate-feedback-pop")}
        />
      </Button>

      {/* Thumbs Down */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 transition-all duration-150",
          rating === "down" && "bg-destructive/10 text-destructive shadow-[0_0_0_1px_rgba(239,68,68,0.18),0_2px_8px_rgba(239,68,68,0.22)]",
          isFbLoading && rating === "down" && "ring-1 ring-destructive/30",
          noQueryId && "opacity-40 cursor-not-allowed",
        )}
        onClick={() => qId && onFeedback(qId, "down")}
        disabled={noQueryId}
        title={noQueryId ? "Available once response has been saved" : "Mark as not helpful"}
        aria-label="Mark as not helpful"
        aria-pressed={rating === "down"}
        aria-busy={isFbLoading}
      >
        <ThumbsDown
          key={`down-${pulse?.nonce ?? 0}`}
          className={cn("h-3 w-3", pulse?.rating === "down" && "animate-feedback-pop")}
        />
      </Button>
    </div>
  )
}

// Page

export default function ComplianceQueryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [answerDetail, setAnswerDetail] = useState<"standard" | "detailed">("standard")

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
  type SuggestionItem = { id: string; text: string; reason?: string; relatedArea?: string }
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
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (topicPrefillAppliedRef.current) return
    topicPrefillAppliedRef.current = true

    const topic = searchParams.get("topic")
    
    // Track page open
    trackEvent("compliance_query_opened", {
      source: topic ? "topic_link" : "direct"
    })

    if (!isRegulatoryArea(topic)) return

    const areaLabel = REGULATORY_AREA_NAMES[topic]
    setQuery(`What are the current compliance requirements for ${areaLabel} that apply to my organization?`)
    router.replace("/startup/compliance-query", { scroll: false })
  }, [router, searchParams])

  const scrollChatToBottom = () => {
    window.requestAnimationFrame(() => {
      const viewport = chatScrollRef.current?.querySelector<HTMLElement>(
        "[data-radix-scroll-area-viewport]",
      )
      viewport?.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" })
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
  }, [streamState])

  // Handlers

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed || isStreaming) return

    trackEvent("compliance_query_started", { source: "manual_input" })

    pendingQuestionRef.current = trimmed
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
        { onError: () => { /* fire-and-forget - silent failure */ } }
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

  // Render

  const showEmptyState = messages.length === 0 && !isStreaming

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Compliance Query</h1>
        <p className="text-muted-foreground">
          Ask questions about Kenya&apos;s fintech regulations and get AI-powered answers with legal
          citations
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <Card className="flex h-[calc(100vh-240px)] flex-col border-border/50 bg-card">
            {/* Messages Area */}
            <ScrollArea ref={chatScrollRef} className="flex-1 p-6">
              {showEmptyState ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-glow-green-sm">
                    <SheriaBotLogo className="h-10 w-10" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-foreground">
                    Ask a Compliance Question
                  </h2>
                  <p className="mt-2 max-w-md text-muted-foreground">
                    Get instant answers about Kenya&apos;s fintech regulations, CBK guidelines,
                    data protection requirements, and more.
                  </p>
                  <div className="mt-8 w-full max-w-md">
                    <p className="mb-3 text-sm font-medium text-muted-foreground">
                      Suggested queries:
                    </p>
                    {suggestedQueriesLoading ? (
                      <div className="flex flex-wrap justify-center gap-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-10 w-40 animate-pulse rounded-full bg-muted/50"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap justify-center gap-2">
                        {(suggestions as SuggestionItem[]).slice(0, 3).map((s) => (
                          <button
                            key={s.id}
                            onClick={() => handleSuggestedQuery(s.text, s.id, "empty_state")}
                            className="rounded-full border border-border/50 bg-muted/50 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                          >
                            {s.text.length > 40 ? s.text.slice(0, 40) + "..." : s.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.type === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      {message.type === "user" ? (
                        <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-primary text-primary-foreground">
                          <p className="text-sm leading-relaxed whitespace-pre-line">
                            {message.content}
                          </p>
                        </div>
                      ) : message.abstained ? (
                        // AbstainCard replaces the bubble for scope-abstain and corpus-gap variants
                        <AbstainCard
                          queryId={message.queryId!}
                          runId={message.runId ?? null}
                          question={message.question ?? ""}
                          route={message.route ?? null}
                          fallbackReason={message.fallbackReason ?? null}
                          className="w-full max-w-[85%]"
                        />
                      ) : (
                        <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted">
                          {/* SheriaBot header */}
                          <div className="mb-2 flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-glow-green-sm">
                              <SheriaBotLogo className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-foreground">SheriaBot</span>
                            {message.confidence != null && (
                              <Badge variant="outline" className="text-xs ml-auto">
                                {Math.round(message.confidence * 100)}% confidence
                              </Badge>
                            )}
                          </div>

                          {/* Ungrounded warning - shown when answer has limited RAG backing */}
                          {message.grounded === false && (
                            <UngroundedBanner className="mb-3" />
                          )}

                          {/* Answer content */}
                          <ComplianceFeedback content={message.content} variant="chat" />

                          {/* Legal citations */}
                          {message.citations && message.citations.length > 0 && (
                            <div className="mt-4 border-t border-[#D4AF37]/30 pt-4">
                              <p className="mb-2 text-xs font-semibold text-[#D4AF37]">
                                Referenced Documents ({message.citations.length}):
                              </p>
                              <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
                                {VERIFIED_HELPER_TEXT}
                              </p>
                              <div className="mb-3">
                                <ReportMissingDocumentDialog
                                  trigger={
                                    <Button variant="outline" size="sm" className="h-8">
                                      <FileQuestion className="mr-1 h-3 w-3" />
                                      Report Missing Document
                                    </Button>
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                {message.citations.map((citation, index) => {
                                  const verification = citationVerificationLabel(citation)

                                  return (
                                    <div
                                      key={index}
                                      className="flex items-start gap-2 rounded-lg border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] p-2 shadow-[0_0_18px_rgba(212,175,55,0.08)]"
                                    >
                                      <Scale
                                        className="h-4 w-4 mt-0.5 shrink-0 text-[#D4AF37]"
                                        aria-hidden="true"
                                      />
                                      <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-foreground">
                                          {citation.documentTitle}
                                        </p>
                                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                          {citation.authorityStatus && citation.authorityStatus !== "IN_FORCE" && (
                                            <Badge variant="outline" className="h-5 border-[#D4AF37]/35 px-1.5 text-[10px] text-[#D4AF37]">
                                              {citation.authorityStatus.replace(/_/g, " ")}
                                              {citation.isBinding === false ? " / Non-binding" : ""}
                                            </Badge>
                                          )}
                                          <Badge
                                            variant="outline"
                                            className={cn("h-5 px-1.5 text-[10px]", citationVerificationClass(verification))}
                                          >
                                            {verification}
                                          </Badge>
                                          {citation.score > 0 ? (
                                            <span className="text-[10px] text-muted-foreground">
                                              {Math.round(citation.score * 100)}% relevance
                                            </span>
                                          ) : null}
                                        </div>
                                        {citation.section ? (
                                          <p className="text-xs text-muted-foreground">
                                            {citation.section}
                                          </p>
                                        ) : (
                                          <p className="text-xs text-muted-foreground italic">
                                            Section not available in indexed metadata
                                          </p>
                                        )}
                                        {citation.textSnippet && (
                                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {citation.textSnippet}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {/* Copy / Save / Thumbs action bar */}
                          <MessageActionBar
                            message={message}
                            onCopy={handleCopy}
                            onFeedback={handleFeedback}
                            onSave={handleSave}
                            feedbackState={feedbackState}
                            savedState={savedState}
                            feedbackLoading={feedbackLoading}
                            saveLoading={saveLoading}
                            feedbackPulse={feedbackPulse}
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Live streaming bubble - visible during connecting/streaming/verifying */}
                  {isStreaming && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-glow-green-sm">
                            <SheriaBotLogo className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium text-foreground">SheriaBot</span>
                          {streamState.phase === "verifying" && (
                            <Badge variant="outline" className="text-xs ml-auto gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                              Verifying
                            </Badge>
                          )}
                        </div>
                        {streamState.content ? (
                          <ComplianceFeedback content={streamState.content} variant="chat" />
                        ) : (
                          <ThinkingIndicator query={pendingQuestionRef.current} />
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </ScrollArea>

            {/* Stream error display */}
            {streamState.phase === "error" && streamState.errorMessage && (
              <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
                <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                {streamState.errorMessage}
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-border p-4 space-y-3">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-medium">Detail Level:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="answerDetail"
                    value="standard"
                    checked={answerDetail === "standard"}
                    onChange={(e) => setAnswerDetail(e.target.value as "standard" | "detailed")}
                    className="accent-primary"
                  />
                  Standard (1 credit)
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="answerDetail"
                    value="detailed"
                    checked={answerDetail === "detailed"}
                    onChange={(e) => setAnswerDetail(e.target.value as "standard" | "detailed")}
                    className="accent-primary"
                  />
                  Detailed (2 credits)
                </label>
              </div>

              {answerDetail === "detailed" && planData?.usage?.complianceQueries?.remaining === 1 && (
                <div className="flex items-center gap-2 rounded-lg border border-warning/50 bg-warning/10 p-2 text-xs text-warning">
                  <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                  You need 2 query credits for Detailed answers. Please switch to Standard or upgrade your plan.
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault()
                      formRef.current?.requestSubmit()
                    }
                  }}
                  placeholder="Ask about KYC requirements, data protection, CBK guidelines..."
                  className="flex-1 border-primary/25 bg-background shadow-[0_0_0_1px_rgba(34,197,94,0.08),0_0_18px_rgba(34,197,94,0.12)] transition-shadow duration-200 focus-visible:border-primary/60 focus-visible:shadow-[0_0_0_1px_rgba(34,197,94,0.24),0_0_24px_rgba(34,197,94,0.22)]"
                  disabled={isStreaming}
                />
                <LoadingButton
                  type="submit"
                  disabled={!query.trim() || (answerDetail === "detailed" && planData?.usage?.complianceQueries?.remaining === 1)}
                  loading={isStreaming}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </LoadingButton>
              </form>
              <p className="mt-2 text-xs text-muted-foreground">
                Answers are AI-generated based on Kenya&apos;s legal corpus. Always verify with
                official sources.{" "}
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                  Ctrl+Enter
                </kbd>{" "}
                to submit.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Suggested Queries */}
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Suggested Queries</CardTitle>
              <CardDescription>Personalised compliance questions</CardDescription>
            </CardHeader>
            <CardContent>
              {suggestedQueriesLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 w-full animate-pulse rounded-lg bg-muted/50"
                    />
                  ))}
                </div>
              ) : suggestedQueriesError ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    Could not load suggestions
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      void utils.compliance.getSuggestedQueries.invalidate()
                    }
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {(suggestions as SuggestionItem[]).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSuggestedQuery(s.text, s.id, "sidebar")}
                      className="flex w-full items-center gap-2 rounded-lg border border-border/50 p-3 text-left text-sm transition-colors hover:bg-muted/50"
                    >
                      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="line-clamp-2 text-foreground">{s.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Query History */}
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Queries</CardTitle>
              <CardDescription>Your query history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {historyData?.queries && historyData.queries.length > 0 ? (
                  <>
                    {(historyData.queries as Array<Pick<typeof historyData.queries[number], 'id' | 'query' | 'createdAt'>>).map((item) => (
                      <Link
                        key={item.id}
                        href={`/startup/compliance-query/${item.id}`}
                        className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                      >
                        <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.query}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setShowAllQueries(true)}
                    >
                      View all
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No queries yet. Ask your first question!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Legal Corpus Info */}
          <Card className="border-border/50 bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Legal Corpus</p>
                  <p className="text-xs text-muted-foreground">50+ Kenyan laws indexed</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Our AI is trained on CBK guidelines, Data Protection Act, National Payment System
                Act, and other relevant Kenyan legislation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
