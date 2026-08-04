import * as React from "react"
import { PortalSectionHeader, PortalSurface } from "@/components/portal"
import { cn } from "@/lib/utils"

export interface AdminDataPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  action?: React.ReactNode
  contentClassName?: string
}

export function AdminDataPanel({
  title,
  description,
  icon,
  action,
  children,
  className,
  contentClassName,
  ...props
}: AdminDataPanelProps) {
  return (
    <PortalSurface className={cn("overflow-hidden", className)} {...props}>
      {title && (
        <div className="border-b border-[var(--portal-border)] px-5 pt-5">
          <PortalSectionHeader
            title={title}
            description={description}
            icon={icon}
            action={action}
            titleAs="h2"
            className="pb-5"
          />
        </div>
      )}
      <div className={cn("p-5", contentClassName)}>{children}</div>
    </PortalSurface>
  )
}
