import * as React from "react"
import Link from "next/link"
import { PortalSurface, PortalSkeleton } from "@/components/portal"
import { ArrowUpRight } from "lucide-react"

export interface DashboardMetricCardProps {
  title: string
  value: string | number
  subtitle: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
  variant?: "default" | "emphasized"
  isLoading?: boolean
  href?: string
}

export function DashboardMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  isLoading = false,
  href,
}: DashboardMetricCardProps) {
  const content = (
    <PortalSurface
      variant="raised"
      className={`relative flex h-full flex-col justify-between p-5 transition-all duration-200 ${
        variant === "emphasized"
          ? "border-[var(--portal-accent-border,#A3D9BE)] bg-[var(--portal-surface,#FFFFFF)] ring-1 ring-[var(--portal-accent,#0A5C36)]/10"
          : "border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface,#FFFFFF)]"
      } ${href ? "hover:border-[var(--portal-border-strong,#B8C7C0)] hover:shadow-sm" : ""}`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[var(--portal-text-muted,#64766D)]">
          {title}
        </span>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            variant === "emphasized"
              ? "bg-[var(--portal-accent-muted,#E8F5EE)] text-[var(--portal-accent,#0A5C36)]"
              : "bg-[var(--portal-surface-hover,#F0F4F2)] text-[var(--portal-text-secondary,#53615A)]"
          }`}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Metric Value */}
      <div className="my-3">
        {isLoading ? (
          <PortalSkeleton variant="text" className="h-9 w-28" />
        ) : (
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-semibold tracking-[-0.04em] ${
                variant === "emphasized"
                  ? "text-[var(--portal-accent,#0A5C36)]"
                  : "text-[var(--portal-text-primary,#101814)]"
              }`}
            >
              {value}
            </span>
            {href && (
              <ArrowUpRight
                className="h-4 w-4 text-[var(--portal-text-muted,#64766D)] opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>

      {/* Contextual Subtext */}
      <div className="text-xs text-[var(--portal-text-secondary,#53615A)]">
        {isLoading ? <PortalSkeleton variant="text" className="h-4 w-36" /> : subtitle}
      </div>
    </PortalSurface>
  )

  if (href) {
    return (
      <Link href={href} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--portal-focus,#0A5C36)] focus-visible:ring-offset-2 rounded-xl">
        {content}
      </Link>
    )
  }

  return content
}
