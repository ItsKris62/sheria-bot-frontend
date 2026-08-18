import React from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Loader2, Sparkles } from "lucide-react"
import { ComplianceFeedback } from "@/components/compliance/compliance-feedback"
import { SheriaBotThinkingDroid } from "@/components/compliance/sheriabot-thinking-droid"
import { AbstainCard } from "@/components/compliance/abstain-card"
import { UngroundedBanner } from "@/components/compliance/ungrounded-banner"
import { cn } from "@/lib/utils"
import type { StreamState } from "@/hooks/use-compliance"
import { SheriaBotLogo, MessageActionBar, ComplianceAnswerCitations } from "./compliance-query-answer"
import type {
  Message,
  FeedbackRating,
  FeedbackPulse,
  SuggestionItem,
  SuggestionSource,
} from "./compliance-query-types"

export interface ComplianceQueryProgressProps {
  messages: Message[]
  isStreaming: boolean
  streamState: StreamState
  pendingQuestion: string
  suggestedQueries: SuggestionItem[]
  suggestedQueriesLoading: boolean
  onSuggestedQuerySelect: (
    suggestionText: string,
    suggestionId?: string,
    surface?: SuggestionSource,
  ) => void
  onCopy: (content: string) => void
  onFeedback: (queryId: string, rating: "up" | "down") => Promise<void>
  onSave: (queryId: string) => Promise<void>
  feedbackState: Record<string, FeedbackRating>
  savedState: Record<string, boolean>
  feedbackLoading: Record<string, boolean>
  saveLoading: Record<string, boolean>
  feedbackPulse: Record<string, FeedbackPulse | undefined>
  chatScrollRef: React.RefObject<HTMLDivElement | null>
}

export function ComplianceQueryProgress({
  messages,
  isStreaming,
  streamState,
  pendingQuestion,
  suggestedQueries,
  suggestedQueriesLoading,
  onSuggestedQuerySelect,
  onCopy,
  onFeedback,
  onSave,
  feedbackState,
  savedState,
  feedbackLoading,
  saveLoading,
  feedbackPulse,
  chatScrollRef,
}: ComplianceQueryProgressProps) {
  const showEmptyState = messages.length === 0 && !isStreaming

  return (
    <>
      <ScrollArea ref={chatScrollRef} className="flex-1 p-4 sm:p-6">
        {showEmptyState ? (
          <div className="flex h-full flex-col items-center justify-center py-12 text-center my-auto motion-safe:animate-fade-slide-up">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.15)] transition-transform duration-200 hover:scale-105">
              <SheriaBotLogo className="h-10 w-10 border-0 bg-transparent p-0" />
            </div>
            <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Ask a Compliance Question
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Get instant, evidence-backed answers about Kenya&apos;s fintech regulations, CBK guidelines,
              data protection requirements, and market licensing rules.
            </p>

            {/* Suggested Queries Empty State Section */}
            <div className="mt-8 w-full max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                Suggested Queries
              </p>
              {suggestedQueriesLoading ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-10 w-44 animate-pulse rounded-full bg-muted/40"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedQueries.slice(0, 3).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onSuggestedQuerySelect(s.text, s.id, "empty_state")}
                      className="rounded-full border border-border/70 bg-card/90 px-4 py-2 text-xs font-medium text-foreground transition-all duration-150 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-left max-w-full truncate"
                    >
                      {s.text.length > 55 ? s.text.slice(0, 55) + "..." : s.text}
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
                  "flex motion-safe:animate-fade-slide-up",
                  message.type === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.type === "user" ? (
                  <div className="max-w-[88%] sm:max-w-[80%] rounded-2xl rounded-br-sm bg-emerald-600 px-4 py-3 text-white shadow-sm">
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {message.content}
                    </p>
                  </div>
                ) : message.abstained ? (
                  <AbstainCard
                    queryId={message.queryId!}
                    runId={message.runId ?? null}
                    question={message.question ?? ""}
                    route={message.route ?? null}
                    fallbackReason={message.fallbackReason ?? null}
                    className="w-full max-w-[95%] sm:max-w-[90%]"
                  />
                ) : (
                  <div className="max-w-[95%] sm:max-w-[90%] rounded-2xl border border-border/60 bg-card/90 p-4 sm:p-5 text-foreground shadow-sm space-y-3">
                    {/* Header bar */}
                    <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 shadow-xs">
                        <SheriaBotLogo className="h-4 w-4 border-0 p-0 bg-transparent" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-foreground">SheriaBot</span>
                        <span className="ml-2 text-[10px] text-muted-foreground/80">Regulatory Intelligence</span>
                      </div>
                      {message.confidence != null && (
                        <Badge variant="outline" className="text-[10px] ml-auto border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                          {Math.round(message.confidence * 100)}% confidence
                        </Badge>
                      )}
                    </div>

                    {/* Ungrounded warning banner */}
                    {message.grounded === false && (
                      <UngroundedBanner className="my-3" />
                    )}

                    {/* Droid Animation for just-completed message */}
                    {streamState.phase === "complete" && streamState.queryId === message.queryId && (
                      <SheriaBotThinkingDroid state={streamState} query={message.question ?? ""} />
                    )}

                    {/* Main Markdown Content */}
                    <ComplianceFeedback content={message.content} variant="chat" />

                    {/* Citations list */}
                    {message.citations && message.citations.length > 0 && (
                      <ComplianceAnswerCitations citations={message.citations} />
                    )}

                    {/* Copy, Save & Feedback Action Bar */}
                    <MessageActionBar
                      message={message}
                      onCopy={onCopy}
                      onFeedback={onFeedback}
                      onSave={onSave}
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

            {/* Live Streaming / Verifying Bubble */}
            {isStreaming && (
              <div className="flex justify-start motion-safe:animate-fade-slide-up">
                <div className="max-w-[95%] sm:max-w-[90%] rounded-2xl border border-border/60 bg-card/90 p-4 sm:p-5 text-foreground shadow-sm space-y-3">
                  <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 shadow-xs">
                      <SheriaBotLogo className="h-4 w-4 border-0 p-0 bg-transparent" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">SheriaBot</span>
                    {streamState.phase === "verifying" && (
                      <Badge variant="outline" className="text-[10px] ml-auto gap-1 border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                        Verifying Sources
                      </Badge>
                    )}
                  </div>

                  {/* The Droid is always visible during streaming */}
                  <SheriaBotThinkingDroid state={streamState} query={pendingQuestion} />

                  {streamState.content && (
                    <ComplianceFeedback content={streamState.content} variant="chat" />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Stream Error Alert Display */}
      {streamState.phase === "error" && streamState.errorMessage && (
        <div className="mx-4 mb-3 flex items-center gap-2.5 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400 motion-safe:animate-fade-slide-up">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{streamState.errorMessage}</span>
        </div>
      )}
    </>
  )
}
