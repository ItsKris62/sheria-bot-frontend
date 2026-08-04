import * as React from "react"
import { PortalSurface } from "@/components/portal"
import { CheckCircle2, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DashboardEmptyStateProps {
  title: string
  description: string
  icon?: LucideIcon
  action?: React.ReactNode
  className?: string
}

export function DashboardEmptyState({
  title,
  description,
  icon: Icon = CheckCircle2,
  action,
  className,
}: DashboardEmptyStateProps) {
  return (
    <PortalSurface variant="solid" className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--portal-accent-muted)] text-[var(--portal-accent)] mb-3">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-[var(--portal-text-primary)]">{title}</h3>
      <p className="text-xs text-[var(--portal-text-secondary)] mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </PortalSurface>
  )
}
