import * as React from "react"
import { PortalSurface } from "@/components/portal"
import { cn } from "@/lib/utils"

export interface AdminFilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode
}

export function AdminFilterBar({ children, actions, className, ...props }: AdminFilterBarProps) {
  return (
    <PortalSurface
      variant="solid"
      className={cn("flex flex-col gap-3 p-3 lg:flex-row lg:items-end lg:justify-between", className)}
      {...props}
    >
      <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
        {children}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </PortalSurface>
  )
}
