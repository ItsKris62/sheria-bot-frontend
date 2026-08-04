import * as React from "react"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type PortalStatusType = "success" | "warning" | "danger" | "info" | "neutral"

export interface PortalStatusBadgeProps extends Omit<BadgeProps, "variant"> {
  /** Operational or compliance status type. */
  status?: PortalStatusType
  /** Optional status icon component. */
  icon?: React.ComponentType<{ className?: string }>
}

const statusStyles: Record<PortalStatusType, string> = {
  success: "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
  danger: "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
  neutral: "border-gray-500/30 bg-gray-500/10 text-gray-300 hover:bg-gray-500/20",
}

export function PortalStatusBadge({
  status = "neutral",
  icon: Icon,
  children,
  className,
  ...props
}: PortalStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium border transition-colors", statusStyles[status], className)}
      {...props}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </Badge>
  )
}
