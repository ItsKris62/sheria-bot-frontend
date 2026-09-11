import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export interface UserDashboardHeaderProps {
  displayName: string
}

export function UserDashboardHeader({ displayName }: UserDashboardHeaderProps) {
  return (
    <header className="flex min-w-0 flex-col gap-5 border-b border-[var(--portal-border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-2">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--portal-accent)]">Regulatory intelligence / overview</p>
        <h1 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[var(--portal-text-primary)] lg:text-4xl">
          Welcome back, {displayName}
        </h1>
        <p className="max-w-xl text-sm leading-6 text-[var(--portal-text-secondary)]">
          Your compliance posture at a glance. Focus on what needs attention and keep your next filing on track.
        </p>
      </div>
      <Button
        asChild
        className="shrink-0 bg-primary font-semibold text-primary-foreground shadow-glow-green-sm hover:bg-brand-green-hover hover:text-primary-foreground hover:shadow-glow-green transition-all duration-200 active:scale-[0.98]"
      >
        <Link href="/startup/compliance-query">
          <Search className="mr-2 h-4 w-4" aria-hidden="true" />
          Ask Compliance Question
        </Link>
      </Button>
    </header>
  )
}
