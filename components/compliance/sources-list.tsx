"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CitationItem } from "@/hooks/use-compliance"
import { Scale } from "lucide-react"

type SourceCitation = Partial<CitationItem> | null | undefined

interface SourcesListProps {
  citations: SourceCitation[]
}

type SourceEntry = {
  key: string
  documentTitle: string
  section: string | null
  score: number
  authorityStatus: string
  isBinding: boolean
  version: string | null
  baseName: string
}

function sourceKey(citation: SourceCitation, index: number): string {
  if (citation?.documentId) return citation.documentId
  return citation?.documentTitle?.trim() || `untitled:${index}`
}

function scoreOf(citation: SourceCitation): number {
  return typeof citation?.score === "number" ? citation.score : 0
}

function baseNameOf(title: string): string {
  return title
    .replace(/\b(19|20)\d{2}\b/g, "")
    .replace(/\s+[\u00b7|-]\s+.*$/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function authorityLabel(status: string, isBinding: boolean): string | null {
  if (status === "IN_FORCE" && isBinding) return null
  if (status === "DRAFT") return "Draft"
  if (status === "CONSULTATION") return "Consultation"
  if (status === "SUPERSEDED") return "Superseded"
  return "Non-binding"
}

function dedupeSources(citations: SourceCitation[]): SourceEntry[] {
  const byKey = new Map<string, SourceEntry>()

  citations.forEach((citation, index) => {
    const documentTitle = citation?.documentTitle?.trim()
    if (!documentTitle) return

    const key = sourceKey(citation, index)
    const score = scoreOf(citation)
    const current = byKey.get(key)
    const candidate: SourceEntry = {
      key,
      documentTitle,
      section: citation?.section?.trim() || null,
      score,
      authorityStatus: citation?.authorityStatus ?? "IN_FORCE",
      isBinding: citation?.isBinding ?? true,
      version: citation?.version?.trim() || null,
      baseName: baseNameOf(documentTitle),
    }

    if (!current || score > current.score) {
      byKey.set(key, candidate)
    }
  })

  return Array.from(byKey.values()).sort((a, b) => b.score - a.score)
}

export function SourcesList({ citations }: SourcesListProps) {
  const [expanded, setExpanded] = useState(false)
  const sources = useMemo(() => dedupeSources(citations), [citations])
  const baseNameCounts = useMemo(() => {
    const counts = new Map<string, number>()
    sources.forEach((source) => counts.set(source.baseName, (counts.get(source.baseName) ?? 0) + 1))
    return counts
  }, [sources])

  if (sources.length === 0) {
    return <p className="text-sm text-muted-foreground">No source citations were stored for this query.</p>
  }

  const visibleSources = expanded ? sources : sources.slice(0, 8)
  const hiddenCount = sources.length - visibleSources.length

  return (
    <div className="space-y-3">
      {visibleSources.map((source) => {
        const label = authorityLabel(source.authorityStatus, source.isBinding)
        const showSection = !!source.section && (baseNameCounts.get(source.baseName) ?? 0) > 1

        return (
          <div key={source.key} className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-start gap-2">
              <Scale className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {source.documentTitle}
                  {source.version ? (
                    <span className="text-muted-foreground">{" \u00b7 "}{source.version}</span>
                  ) : null}
                </p>
                {showSection ? <p className="text-xs text-muted-foreground">{source.section}</p> : null}
                <p className="text-xs text-muted-foreground">Source on file</p>
              </div>
              {label ? (
                <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700">
                  {label}
                </Badge>
              ) : null}
            </div>
          </div>
        )
      })}

      {hiddenCount > 0 ? (
        <Button variant="ghost" size="sm" onClick={() => setExpanded(true)}>
          + {hiddenCount} more
        </Button>
      ) : null}
    </div>
  )
}

