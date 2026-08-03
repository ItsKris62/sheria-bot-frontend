import * as React from "react"
import { PortalSurface } from "@/components/portal"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface DashboardErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function DashboardErrorState({
  title = "We could not load this section right now",
  message = "Please check your network connection and try again.",
  onRetry,
  className,
}: DashboardErrorStateProps) {
  return (
    <PortalSurface variant="solid" className={cn("flex flex-col items-center justify-center p-8 text-center border-red-500/20 bg-red-500/5", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400 mb-3">
        <AlertCircle className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-[var(--portal-text-primary)]">{title}</h3>
      <p className="text-xs text-[var(--portal-text-secondary)] mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-4 text-xs">
          Try again
        </Button>
      )}
    </PortalSurface>
  )
}
