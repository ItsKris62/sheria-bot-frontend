import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export interface UserDashboardHeaderProps {
  displayName: string
}

export function UserDashboardHeader({ displayName }: UserDashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--portal-text-primary)] lg:text-3xl">
          Welcome back, {displayName}
        </h1>
        <p className="text-sm text-[var(--portal-text-secondary)]">
          Track your regulatory posture and stay compliant across operations.
        </p>
      </div>
      <Button
        asChild
        className="bg-[var(--portal-accent)] text-black hover:bg-[var(--portal-accent)]/90 font-medium shrink-0 shadow-sm"
      >
        <Link href="/startup/compliance-query">
          <Search className="mr-2 h-4 w-4" aria-hidden="true" />
          Ask Compliance Question
        </Link>
      </Button>
    </div>
  )
}
