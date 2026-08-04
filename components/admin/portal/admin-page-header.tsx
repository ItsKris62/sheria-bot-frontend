import * as React from "react"
import { Shield } from "lucide-react"
import { PortalSectionHeader, PortalStatusBadge } from "@/components/portal"
import { cn } from "@/lib/utils"

export interface AdminPageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  action?: React.ReactNode
  metadata?: React.ReactNode
}

export function AdminPageHeader({
  title,
  description,
  icon: Icon = Shield,
  action,
  metadata,
  className,
  ...props
}: AdminPageHeaderProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-3 pb-1", className)} {...props}>
      <PortalSectionHeader
        title={title}
        description={description}
        icon={Icon}
        action={action}
        titleAs="h1"
        className="pb-0"
      />
      <div className="flex flex-wrap items-center gap-2">
        <PortalStatusBadge status="neutral" icon={Shield}>
          Admin
        </PortalStatusBadge>
        {metadata}
      </div>
    </div>
  )
}
