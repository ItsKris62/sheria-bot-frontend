import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PortalSurface } from "@/components/portal"
import { cn } from "@/lib/utils"

export interface AdminErrorStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  retryLabel?: string
  onRetry?: () => void
}

export function AdminErrorState({
  title,
  description,
  retryLabel = "Retry",
  onRetry,
  className,
  ...props
}: AdminErrorStateProps) {
  return (
    <PortalSurface
      variant="solid"
      className={cn("flex flex-col gap-4 border-red-500/30 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between", className)}
      role="alert"
      {...props}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
        <div>
          <h3 className="text-sm font-semibold text-[var(--portal-text-primary)]">{title}</h3>
          {description && <p className="mt-1 text-sm text-[var(--portal-text-secondary)]">{description}</p>}
        </div>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </PortalSurface>
  )
}
