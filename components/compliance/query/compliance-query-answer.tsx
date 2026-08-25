import React, { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  Loader2,
  Scale,
  FileQuestion,
} from "lucide-react"
import { ReportMissingDocumentDialog } from "@/components/corpus-gap-report/report-missing-document-dialog"
import { cn } from "@/lib/utils"
import type { CitationItem } from "@/hooks/use-compliance"
import type {
  Message,
  FeedbackRating,
  FeedbackPulse,
} from "./compliance-query-types"
import { JurisdictionBadge } from "./jurisdiction-context"
import type { JurisdictionCode } from "@/lib/jurisdictions"

export function SheriaBotLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <Image
      src="/favicon-logo.png"
      alt=""
      width={40}
      height={40}
      className={cn("rounded-full object-contain bg-slate-900 border border-emerald-500/30 p-0.5", className)}
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
  if (label === "Verified") return "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
  if (label === "Unverified") return "border-amber-500/40 text-amber-400 bg-amber-500/10"
  return "border-muted-foreground/30 text-muted-foreground bg-muted/20"
}

const VERIFIED_HELPER_TEXT =
  "Verified sources were matched to SheriaBot's legal corpus and accepted by the verification flow. This does not replace independent legal advice."

export interface MessageActionBarProps {
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

export function MessageActionBar({
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
  const [isCopied, setIsCopied] = useState(false)
  const qId = message.queryId
  const rating = qId ? (feedbackState[qId] ?? null) : null
  const isSaved = qId ? (savedState[qId] ?? false) : false
  const isFbLoading = qId ? (feedbackLoading[qId] ?? false) : false
  const isSaveLoading = qId ? (saveLoading[qId] ?? false) : false
  const pulse = qId ? feedbackPulse[qId] : undefined
  const noQueryId = !qId

  const handleCopyClick = () => {
    onCopy(message.content)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1500)
  }

  return (
    <div className="mt-4 flex items-center gap-1 border-t border-border/40 pt-3">
      {/* Copy Button with Icon Swap Confirmation */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 motion-safe:active:scale-95 transition-all duration-150"
        onClick={handleCopyClick}
      >
        {isCopied ? (
          <>
            <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copy
          </>
        )}
      </Button>

      {/* Save / Bookmark Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-2.5 text-xs motion-safe:active:scale-95 transition-all duration-150",
          isSaved
            ? "text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          noQueryId && "opacity-40 cursor-not-allowed",
        )}
        onClick={() => qId && onSave(qId)}
        disabled={noQueryId || isSaveLoading}
        title={noQueryId ? "Available once response has been saved" : undefined}
        aria-label={isSaved ? "Remove from saved" : "Save response"}
      >
        {isSaveLoading ? (
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
        ) : isSaved ? (
          <BookmarkCheck className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
        ) : (
          <Bookmark className="mr-1.5 h-3.5 w-3.5" />
        )}
        {isSaved ? "Saved" : "Save"}
      </Button>

      <div className="flex-1" />

      {/* Thumbs Up Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 motion-safe:active:scale-95 transition-all duration-150",
          rating === "up" && "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs",
          isFbLoading && rating === "up" && "ring-1 ring-emerald-500/30",
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
          className={cn("h-3.5 w-3.5", pulse?.rating === "up" && "animate-feedback-pop")}
        />
      </Button>

      {/* Thumbs Down Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 motion-safe:active:scale-95 transition-all duration-150",
          rating === "down" && "bg-red-500/15 text-red-400 border border-red-500/30 shadow-xs",
          isFbLoading && rating === "down" && "ring-1 ring-red-500/30",
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
          className={cn("h-3.5 w-3.5", pulse?.rating === "down" && "animate-feedback-pop")}
        />
      </Button>
    </div>
  )
}

export interface ComplianceAnswerCitationsProps {
  citations: CitationItem[]
  expectedJurisdictions?: JurisdictionCode[] | null
}

export function ComplianceAnswerCitations({ citations, expectedJurisdictions }: ComplianceAnswerCitationsProps) {
  if (!citations || citations.length === 0) return null

  return (
    <div className="mt-5 border-t border-amber-500/20 pt-4 space-y-3 motion-safe:animate-fade-slide-up">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
          <Scale className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
          Referenced Documents ({citations.length}):
        </p>
        <ReportMissingDocumentDialog
          trigger={
            <Button variant="outline" size="sm" className="h-7 text-xs border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-300 transition-all duration-150">
              <FileQuestion className="mr-1.5 h-3 w-3" />
              Report Missing Document
            </Button>
          }
        />
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground/90">
        {VERIFIED_HELPER_TEXT}
      </p>

      <div className="space-y-2.5">
        {citations.map((citation, index) => {
          const verification = citationVerificationLabel(citation)

          return (
            <div
              key={index}
              className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 shadow-xs transition-all duration-150 hover:border-amber-500/40 hover:bg-amber-500/10"
            >
              <Scale
                className="h-4 w-4 mt-0.5 shrink-0 text-amber-400"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-xs font-medium text-foreground">
                  {citation.documentTitle}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <JurisdictionBadge
                    code={citation.jurisdictionCode ?? expectedJurisdictions?.[0]}
                    className="h-5 px-1.5 text-[10px]"
                  />
                  {citation.authorityStatus && citation.authorityStatus !== "IN_FORCE" && (
                    <Badge variant="outline" className="h-5 border-amber-500/35 px-1.5 text-[10px] text-amber-400">
                      {citation.authorityStatus.replace(/_/g, " ")}
                      {citation.isBinding === false ? " / Non-binding" : ""}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={cn("h-5 px-1.5 text-[10px] font-medium", citationVerificationClass(verification))}
                  >
                    {verification}
                  </Badge>
                  {citation.score > 0 ? (
                    <span className="text-[10px] text-muted-foreground/80 font-mono">
                      {Math.round(citation.score * 100)}% relevance
                    </span>
                  ) : null}
                </div>
                {citation.section ? (
                  <p className="text-xs text-muted-foreground font-mono">
                    {citation.section}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Section not available in indexed metadata
                  </p>
                )}
                {citation.textSnippet && (
                  <p className="text-xs text-muted-foreground/90 leading-relaxed line-clamp-2 bg-background/40 rounded-md p-1.5 border border-border/30">
                    &ldquo;{citation.textSnippet}&rdquo;
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
