import type { CitationItem, ComplianceFallbackReason } from "@/hooks/use-compliance"
import type { JurisdictionCode } from "@/lib/jurisdictions"

export interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  citations?: CitationItem[]
  confidence?: number | null
  queryId?: string
  jurisdictionCode?: JurisdictionCode
  jurisdictionSource?: string | null
  timestamp: Date
  abstained?: boolean
  route?: string | null
  runId?: string | null
  grounded?: boolean
  fallbackReason?: ComplianceFallbackReason | null
  question?: string
}

export type FeedbackRating = "up" | "down" | null

export type FeedbackPulse = {
  rating: "up" | "down"
  nonce: number
}

export type SuggestionItem = {
  id: string
  text: string
  reason?: string
  relatedArea?: string
}

export type DetailLevel = "standard" | "detailed"

export type SuggestionSource = "empty_state" | "sidebar"
