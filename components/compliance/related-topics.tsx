import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { CitationItem } from "@/hooks/use-compliance"
import {
  isRegulatoryArea,
  REGULATORY_AREA_NAMES,
  type RegulatoryArea,
} from "@/lib/compliance/compliance.types"
import { extractTopicsFromCitations } from "@/lib/compliance/topics"

interface RelatedTopicsProps {
  areas: unknown[]
  citations: Array<Partial<CitationItem> | null | undefined>
}

function normaliseAreas(areas: unknown[]): RegulatoryArea[] {
  const seen = new Set<RegulatoryArea>()
  const result: RegulatoryArea[] = []

  for (const area of areas) {
    if (!isRegulatoryArea(area) || seen.has(area)) continue
    seen.add(area)
    result.push(area)
  }

  return result
}

export function RelatedTopics({ areas, citations }: RelatedTopicsProps) {
  const primaryTopics = normaliseAreas(areas)
  const supplementalTopics =
    primaryTopics.length < 3 ? extractTopicsFromCitations(citations, primaryTopics) : []
  const topics = [...primaryTopics, ...supplementalTopics].slice(0, 6)

  if (topics.length === 0) {
    return <p className="text-sm text-muted-foreground">No related topics were identified.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((area) => (
        <Badge
          key={area}
          variant="secondary"
          className="cursor-pointer hover:bg-primary/20"
        >
          <Link href={`/startup/compliance-query?topic=${encodeURIComponent(area)}`}>
            {REGULATORY_AREA_NAMES[area]}
          </Link>
        </Badge>
      ))}
    </div>
  )
}
