import * as React from "react"
import { PortalSurface } from "@/components/portal"
import { cn } from "@/lib/utils"

export interface AdminTableShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminTableShell({ children, className, ...props }: AdminTableShellProps) {
  return (
    <PortalSurface variant="solid" className={cn("overflow-x-auto", className)} {...props}>
      {children}
    </PortalSurface>
  )
}
