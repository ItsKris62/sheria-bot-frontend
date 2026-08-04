import * as React from "react"
import { PortalSkeleton } from "@/components/portal"
import { cn } from "@/lib/utils"

export interface AdminLoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number
}

export function AdminLoadingState({ rows = 5, className, ...props }: AdminLoadingStateProps) {
  return (
    <div className={cn("space-y-3", className)} aria-label="Loading admin data" {...props}>
      {Array.from({ length: rows }).map((_, index) => (
        <PortalSkeleton key={index} variant="custom" className="h-14 w-full rounded-lg" />
      ))}
    </div>
  )
}
