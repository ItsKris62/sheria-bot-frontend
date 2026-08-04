import * as React from "react"
import { cn } from "@/lib/utils"

export interface PortalSectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Main section title text or element. */
  title: React.ReactNode
  /** Optional supporting description text. */
  description?: React.ReactNode
  /** Optional decorative Lucide icon component. */
  icon?: React.ComponentType<{ className?: string }>
  /** Optional right-aligned action elements (e.g. primary CTA button or link). */
  action?: React.ReactNode
  /** Semantic HTML heading tag level. Defaults to `h2`. */
  titleAs?: "h1" | "h2" | "h3" | "h4"
}

export function PortalSectionHeader({
  title,
  description,
  icon: Icon,
  action,
  titleAs: TitleTag = "h2",
  className,
  ...props
}: PortalSectionHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4", className)}
      {...props}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <Icon
              className="h-5 w-5 shrink-0 text-[var(--portal-accent)]"
              aria-hidden="true"
            />
          )}
          <TitleTag className="text-xl font-bold tracking-tight text-[var(--portal-text-primary)]">
            {title}
          </TitleTag>
        </div>
        {description && (
          <p className="text-sm text-[var(--portal-text-secondary)]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  )
}
