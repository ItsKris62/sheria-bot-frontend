import React, { useRef } from "react"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { AlertCircle, Send, Sparkles, Command } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DetailLevel } from "./compliance-query-types"
import { jurisdictionLabel, type QueryableJurisdictionCode } from "@/lib/jurisdictions"

export interface ComplianceQueryComposerProps {
  query: string
  answerDetail: DetailLevel
  isStreaming: boolean
  jurisdiction: QueryableJurisdictionCode
  remainingCredits?: number
  onQueryChange: (value: string) => void
  onAnswerDetailChange: (detail: DetailLevel) => void
  onSubmit: (e: React.FormEvent) => void
}

export function ComplianceQueryComposer({
  query,
  answerDetail,
  isStreaming,
  jurisdiction,
  remainingCredits,
  onQueryChange,
  onAnswerDetailChange,
  onSubmit,
}: ComplianceQueryComposerProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const isDetailedCreditWarning =
    answerDetail === "detailed" && remainingCredits === 1
  const country = jurisdictionLabel(jurisdiction)

  return (
    <div className="border-t border-border/50 bg-card/80 p-4 sm:p-5 space-y-3.5 rounded-b-xl">
      {/* Detail Level Selector Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground/80 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            Detail Level:
          </span>
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-1">
            <label
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer transition-all duration-150 min-h-[36px] sm:min-h-[28px] active:scale-98",
                answerDetail === "standard"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
              )}
            >
              <input
                type="radio"
                name="answerDetail"
                value="standard"
                checked={answerDetail === "standard"}
                onChange={(e) => onAnswerDetailChange(e.target.value as DetailLevel)}
                className="sr-only"
              />
              Standard <span className="text-[10px] opacity-70">(1 credit)</span>
            </label>
            <label
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer transition-all duration-150 min-h-[36px] sm:min-h-[28px] active:scale-98",
                answerDetail === "detailed"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
              )}
            >
              <input
                type="radio"
                name="answerDetail"
                value="detailed"
                checked={answerDetail === "detailed"}
                onChange={(e) => onAnswerDetailChange(e.target.value as DetailLevel)}
                className="sr-only"
              />
              Detailed <span className="text-[10px] opacity-70">(2 credits)</span>
            </label>
          </div>
        </div>

        {remainingCredits !== undefined && (
          <span className="text-[11px] text-muted-foreground/80">
            Available credits: <strong className="text-foreground">{remainingCredits}</strong>
          </span>
        )}
      </div>

      {/* Detailed Credit Warning Alert */}
      {isDetailedCreditWarning && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-2.5 text-xs text-amber-400 motion-safe:animate-fade-slide-up">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>You need 2 query credits for Detailed answers. Please switch to Standard or upgrade your plan.</span>
        </div>
      )}

      {/* Prominent Composer Input Container with Ambient Glow & Focus Transition */}
      <form ref={formRef} onSubmit={onSubmit} className="relative">
        <div className="group relative flex items-center rounded-xl border border-border/70 bg-background/90 shadow-[0_0_15px_rgba(16,185,129,0.05)] transition-all duration-200 focus-within:border-emerald-500/60 focus-within:shadow-[0_0_22px_rgba(16,185,129,0.15)] focus-within:ring-1 focus-within:ring-emerald-500/30">
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault()
                formRef.current?.requestSubmit()
              }
            }}
            placeholder={`Ask a compliance question about ${country}...`}
            className="flex-1 border-0 bg-transparent py-3.5 pl-4 pr-14 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[48px]"
            disabled={isStreaming}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <LoadingButton
              type="submit"
              disabled={!query.trim() || isDetailedCreditWarning}
              loading={isStreaming}
              size="sm"
              className="h-9 min-h-[36px] w-9 min-w-[36px] rounded-lg bg-emerald-600 p-0 text-white shadow-xs hover:bg-emerald-500 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 transition-all duration-150 disabled:opacity-40 disabled:hover:translate-y-0"
              aria-label="Submit query"
            >
              <Send className="h-4 w-4" />
            </LoadingButton>
          </div>
        </div>
      </form>

      {/* Footer Helper & Keyboard Shortcut Hint */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground/80">
        <p>
          Answers are evidence-backed from {country}&apos;s indexed regulatory corpus. Always verify critical decisions.
        </p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
          <Command className="h-3 w-3" aria-hidden="true" />
          <span>Press</span>
          <kbd className="rounded border border-border/80 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-foreground/80">
            Ctrl+Enter
          </kbd>
          <span>to submit</span>
        </div>
      </div>
    </div>
  )
}
