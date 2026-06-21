import { ExternalLink, BookOpen, Building2, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type BlogSourceType = "OFFICIAL" | "THIRD_PARTY" | "INTERNAL" | "MEDIA" | "INTERNATIONAL_STANDARD"

interface SourceItem {
  id: string
  sourceType: BlogSourceType
  title: string
  publisher?: string | null
  url?: string | null
  publishedAt?: Date | null
  accessedAt?: Date | null
  notes?: string | null
}

interface SourceListProps {
  sources: SourceItem[]
}

const getSourceIcon = (type: BlogSourceType) => {
  switch (type) {
    case "OFFICIAL": return <Building2 className="w-4 h-4 text-primary" />
    case "INTERNATIONAL_STANDARD": return <Globe className="w-4 h-4 text-secondary" />
    default: return <BookOpen className="w-4 h-4 text-muted-foreground" />
  }
}

const getSourceBadgeVariant = (type: BlogSourceType): "default" | "secondary" | "outline" => {
  switch (type) {
    case "OFFICIAL": return "default"
    case "INTERNATIONAL_STANDARD": return "secondary"
    case "THIRD_PARTY": return "outline"
    case "MEDIA": return "outline"
    default: return "outline"
  }
}

export function SourceList({ sources }: SourceListProps) {
  if (!sources || sources.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-xl font-semibold mb-6 text-foreground">Sources & References</h3>
      <div className="space-y-4">
        {sources.map((source) => (
          <div key={source.id} className="flex gap-4 p-4 rounded-lg border border-border bg-card">
            <div className="mt-1">{getSourceIcon(source.sourceType)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={getSourceBadgeVariant(source.sourceType)} className="text-[10px] py-0">
                  {source.sourceType.replace('_', ' ')}
                </Badge>
              </div>
              <h4 className="font-medium text-card-foreground">{source.title}</h4>
              <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {source.publisher && <span>{source.publisher}</span>}
                {source.publishedAt && <span>Published: {new Date(source.publishedAt).toLocaleDateString()}</span>}
                {source.accessedAt && <span>Accessed: {new Date(source.accessedAt).toLocaleDateString()}</span>}
              </div>
              {source.notes && <p className="text-sm text-muted-foreground mt-2">{source.notes}</p>}
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:text-primary/80 mt-2 font-medium"
                >
                  View Source <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
