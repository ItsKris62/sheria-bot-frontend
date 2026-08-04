import * as React from "react"
import { CheckCircle2 } from "lucide-react"
import { PortalSurface } from "@/components/portal"
import { cn } from "@/lib/utils"

export interface AdminEmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  action?: React.ReactNode
}

export function AdminEmptyState({
  title,
  description,
  icon: Icon = CheckCircle2,
  action,
  className,
  ...props
}: AdminEmptyStateProps) {
  return (
    <PortalSurface
      variant="solid"
      className={cn("flex min-h-40 flex-col items-center justify-center p-6 text-center", className)}
      {...props}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--portal-accent-muted)] text-[var(--portal-accent)]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-[var(--portal-text-primary)]">{title}</h3>
      {description && <p className="mt-1 max-w-xl text-sm text-[var(--portal-text-secondary)]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </PortalSurface>
  )
}
