import { Loader2 } from "lucide-react"

interface DataUpdatingIndicatorProps {
  active: boolean
  label?: string
  className?: string
}

export function DataUpdatingIndicator({
  active,
  label = "Updating results",
  className = "",
}: DataUpdatingIndicatorProps) {
  if (!active) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}
    >
      <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
