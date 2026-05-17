"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
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
  Sparkles,
  Clock,
  ChevronRight,
  Scale,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
} from "lucide-react"
import {
  useComplianceStream,
  useComplianceHistory,
  type CitationItem,
} from "@/hooks/use-compliance"
import { formatDistanceToNow } from "date-fns"
import { ComplianceFeedback } from "@/components/compliance/compliance-feedback"
import { ThinkingIndicator } from "@/components/compliance/thinking-indicator"
import { AbstainCard } from "@/components/compliance/abstain-card"
import { UngroundedBanner } from "@/components/compliance/ungrounded-banner"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ─── Constants ────────────────────────────────────────────────────────────────

const suggestedQueries = [
  "What are the KYC requirements for digital lenders in Kenya?",
  "How do I comply with the Data Protection Act for mobile money?",
  "What are the CBK reporting requirements for payment service providers?",
  "Consumer protection obligations for fintech companies",
  "AML compliance requirements for cryptocurrency exchanges",
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  citations?: CitationItem[]
  confidence?: number | null
  queryId?: string
  timestamp: Date
  /** Orchestrator fields — populated on the streaming path */
  abstained?: boolean
  route?: string | null
  runId?: string | null
  grounded?: boolean
  /** User question that produced this response — used by AbstainCard for authority matching */
  question?: string
}

type FeedbackRating = "up" | "down" | null

// ─── MessageActionBar ─────────────────────────────────────────────────────────

interface MessageActionBarProps {
  message: Message
  onCopy: (content: string) => void
  onFeedback: (queryId: string, rating: "up" | "down") => Promise<void>
  onSave: (queryId: string) => Promise<void>
  feedbackState: Record<string, FeedbackRating>
  savedState: Record<string, boolean>
  feedbackLoading: Record<string, boolean>
  saveLoading: Record<string, boolean>
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
}: MessageActionBarProps) {
  const qId = message.queryId
  const rating = qId ? (feedbackState[qId] ?? null) : null
  const isSaved = qId ? (savedState[qId] ?? false) : false
  const isFbLoading = qId ? (feedbackLoading[qId] ?? false) : false
  const isSaveLoading = qId ? (saveLoading[qId] ?? false) : false
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
          rating === "up" && "bg-primary/10 text-primary",
          noQueryId && "opacity-40 cursor-not-allowed",
        )}
        onClick={() => qId && onFeedback(qId, "up")}
        disabled={noQueryId || isFbLoading}
        title={noQueryId ? "Available once response has been saved" : "Mark as helpful"}
        aria-label="Mark as helpful"
        aria-pressed={rating === "up"}
      >
        {isFbLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <ThumbsUp className="h-3 w-3" />
        )}
      </Button>

      {/* Thumbs Down */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 transition-all duration-150",
          rating === "down" && "bg-destructive/10 text-destructive",
          noQueryId && "opacity-40 cursor-not-allowed",
        )}
        onClick={() => qId && onFeedback(qId, "down")}
        disabled={noQueryId || isFbLoading}
        title={noQueryId ? "Available once response has been saved" : "Mark as not helpful"}
        aria-label="Mark as not helpful"
        aria-pressed={rating === "down"}
      >
        {isFbLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <ThumbsDown className="h-3 w-3" />
        )}
      </Button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ComplianceQueryPage() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>([])

  const [feedbackState, setFeedbackState] = useState<Record<string, FeedbackRating>>({})
  const [savedState, setSavedState] = useState<Record<string, boolean>>({})
  const [feedbackLoading, setFeedbackLoading] = useState<Record<string, boolean>>({})
  const [saveLoading, setSaveLoading] = useState<Record<string, boolean>>({})

  const { submit: streamSubmit, state: streamState } = useComplianceStream()
  const { data: historyData } = useComplianceHistory(1, 5)

  const feedbackMutation = trpc.compliance.submitFeedback.useMutation()
  const saveMutation = trpc.compliance.toggleSave.useMutation()

  // Dedup guard — prevents double-push in React StrictMode
  const lastPushedQueryIdRef = useRef<string | null>(null)
  // Captures the question text at submit time for AbstainCard keyword matching
  const pendingQuestionRef = useRef<string>("")

  const isStreaming = (["connecting", "streaming", "verifying"] as const).some(
    (p) => p === streamState.phase,
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Auto-scroll whenever messages update or live content grows
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamState.content])

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
          question: pendingQuestionRef.current,
        },
      ])
    }
  }, [streamState.phase, streamState.result])

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed || isStreaming) return

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
    streamSubmit({ question: trimmed })
  }

  const handleSuggestedQuery = (suggested: string) => setQuery(suggested)

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleFeedback = async (queryId: string, rating: "up" | "down") => {
    if (feedbackLoading[queryId]) return
    const previous = feedbackState[queryId] ?? null
    const optimistic: FeedbackRating = previous === rating ? null : rating
    setFeedbackState((prev) => ({ ...prev, [queryId]: optimistic }))
    setFeedbackLoading((prev) => ({ ...prev, [queryId]: true }))
    try {
      const result = await feedbackMutation.mutateAsync({ queryId, rating })
      setFeedbackState((prev) => ({ ...prev, [queryId]: result.rating }))
    } catch {
      setFeedbackState((prev) => ({ ...prev, [queryId]: previous }))
      toast.error("Couldn't save feedback", { description: "Please try again." })
    } finally {
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

  // ─── Render ─────────────────────────────────────────────────────────────────

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
            <ScrollArea className="flex-1 p-6">
              {showEmptyState ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
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
                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestedQueries.slice(0, 3).map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuery(suggestion)}
                          className="rounded-full border border-border/50 bg-muted/50 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                        >
                          {suggestion.length > 40 ? suggestion.slice(0, 40) + "..." : suggestion}
                        </button>
                      ))}
                    </div>
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
                          className="w-full max-w-[85%]"
                        />
                      ) : (
                        <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted">
                          {/* SheriaBot header */}
                          <div className="mb-2 flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <Sparkles className="h-3 w-3 text-primary" aria-hidden="true" />
                            </div>
                            <span className="text-sm font-medium text-foreground">SheriaBot</span>
                            {message.confidence != null && (
                              <Badge variant="outline" className="text-xs ml-auto">
                                {Math.round(message.confidence * 100)}% confidence
                              </Badge>
                            )}
                          </div>

                          {/* Ungrounded warning — shown when answer has limited RAG backing */}
                          {message.grounded === false && (
                            <UngroundedBanner className="mb-3" />
                          )}

                          {/* Answer content */}
                          <ComplianceFeedback content={message.content} variant="chat" />

                          {/* Legal citations */}
                          {message.citations && message.citations.length > 0 && (
                            <div className="mt-4 border-t border-border/50 pt-4">
                              <p className="mb-2 text-xs font-medium text-muted-foreground">
                                Legal Citations ({message.citations.length}):
                              </p>
                              <div className="space-y-2">
                                {message.citations.map((citation, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2 rounded-lg bg-background/50 p-2"
                                  >
                                    <Scale
                                      className="h-4 w-4 mt-0.5 shrink-0 text-primary"
                                      aria-hidden="true"
                                    />
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium text-foreground">
                                        {citation.documentTitle}
                                      </p>
                                      {citation.section && (
                                        <p className="text-xs text-muted-foreground">
                                          {citation.section}
                                        </p>
                                      )}
                                      {citation.textSnippet && (
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                          {citation.textSnippet}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
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
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Live streaming bubble — visible during connecting/streaming/verifying */}
                  {isStreaming && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                            <Sparkles className="h-3 w-3 text-primary" aria-hidden="true" />
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

                  {/* Sentinel — keeps latest content in view */}
                  <div ref={messagesEndRef} />
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
            <div className="border-t border-border p-4">
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
                  placeholder="Ask about KYC requirements, data protection, CBK guidelines…"
                  className="flex-1 bg-background"
                  disabled={isStreaming}
                />
                <LoadingButton
                  type="submit"
                  disabled={!query.trim()}
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
              <CardDescription>Common compliance questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suggestedQueries.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuery(suggestion)}
                    className="flex w-full items-center gap-2 rounded-lg border border-border/50 p-3 text-left text-sm transition-colors hover:bg-muted/50"
                  >
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="line-clamp-2 text-foreground">{suggestion}</span>
                  </button>
                ))}
              </div>
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
                  historyData.queries.map((item: any) => (
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
                  ))
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
