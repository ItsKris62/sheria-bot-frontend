import * as React from "react"
import Link from "next/link"
import { PortalSurface, PortalSectionHeader } from "@/components/portal"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, AlertTriangle, FileText, Zap } from "lucide-react"
import { ComplianceQueryMascotIcon } from "@/components/compliance/compliance-query-mascot-icon"

export function DashboardQuickActions() {
  return (
    <PortalSurface variant="raised" className="p-6">
      <PortalSectionHeader
        title="Quick Actions"
        description="Common compliance tasks and tools"
        icon={Zap}
      />

      <div className="mt-4 grid gap-2.5">
        <Button
          asChild
          variant="outline"
          className="h-11 justify-start border-[var(--portal-border)] bg-[var(--portal-surface-solid)] text-[var(--portal-text-primary)] hover:border-[var(--portal-accent-border)] hover:bg-[var(--portal-accent-muted)] hover:text-white transition-colors"
        >
          <Link href="/startup/compliance-query">
            <ComplianceQueryMascotIcon className="mr-2.5 h-4 w-4" />
            Ask Compliance Question
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-11 justify-start border-[var(--portal-border)] bg-[var(--portal-surface-solid)] text-[var(--portal-text-primary)] hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-white transition-colors"
        >
          <Link href="/startup/checklists">
            <ClipboardCheck className="mr-2.5 h-4 w-4 text-blue-400" aria-hidden="true" />
            Generate Checklist
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-11 justify-start border-[var(--portal-border)] bg-[var(--portal-surface-solid)] text-[var(--portal-text-primary)] hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-white transition-colors"
        >
          <Link href="/startup/gap-analysis">
            <AlertTriangle className="mr-2.5 h-4 w-4 text-amber-400" aria-hidden="true" />
            Run Gap Analysis
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-11 justify-start border-[var(--portal-border)] bg-[var(--portal-surface-solid)] text-[var(--portal-text-primary)] hover:border-gray-500/30 hover:bg-gray-500/10 hover:text-white transition-colors"
        >
          <Link href="/startup/documents">
            <FileText className="mr-2.5 h-4 w-4 text-gray-400" aria-hidden="true" />
            View Documents
          </Link>
        </Button>
      </div>
    </PortalSurface>
  )
}
