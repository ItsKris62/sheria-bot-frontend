import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export interface UserDashboardHeaderProps {
  displayName: string
  organizationName?: string | null
}

export function UserDashboardHeader({ displayName, organizationName }: UserDashboardHeaderProps) {
  return (
    <header className="flex min-w-0 flex-col gap-4 border-b border-[var(--portal-border,#E2E8E5)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--portal-accent,#0A5C36)]">
            Regulatory Intelligence
          </p>
          {organizationName && (
            <>
              <span className="text-[var(--portal-border-strong,#B8C7C0)]" aria-hidden="true">·</span>
              <span className="font-mono text-xs text-[var(--portal-text-secondary,#53615A)]">{organizationName}</span>
            </>
          )}
        </div>
        <h1 className="text-balance text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[var(--portal-text-primary,#101814)]">
          Welcome back, {displayName}
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-[var(--portal-text-secondary,#53615A)]">
          Your compliance posture and regulatory priorities at a glance.
        </p>
      </div>
      <Button
        asChild
        className="shrink-0 bg-[var(--portal-accent,#0A5C36)] font-medium text-white shadow-sm hover:bg-[var(--portal-accent-hover,#084A2B)] active:scale-[0.99] transition-all duration-150"
      >
        <Link href="/startup/compliance-query">
          <Search className="mr-2 h-4 w-4" aria-hidden="true" />
          Ask Compliance Question
        </Link>
      </Button>
    </header>
  )
}
