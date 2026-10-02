import * as React from "react"
import Link from "next/link"
import { PortalSurface, PortalSectionHeader } from "@/components/portal"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, AlertTriangle, FileText, Zap, ArrowRight } from "lucide-react"
import { ComplianceQueryMascotIcon } from "@/components/compliance/compliance-query-mascot-icon"

export function DashboardQuickActions() {
  return (
    <PortalSurface variant="raised" className="p-6">
      <PortalSectionHeader
        title="Quick Actions"
        description="Common compliance tasks and tools"
        icon={Zap}
        className="pb-3 border-b border-[var(--portal-border,#E2E8E5)]"
      />

      <div className="mt-4 grid gap-2.5">
        <Button
          asChild
          variant="outline"
          className="group h-11 justify-between border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface,#FFFFFF)] px-3.5 text-xs font-semibold text-[var(--portal-text-primary,#101814)] hover:border-[var(--portal-accent-border,#A3D9BE)] hover:bg-[var(--portal-surface-hover,#F0F4F2)] hover:text-[var(--portal-text-primary,#101814)] transition-all"
        >
          <Link href="/startup/compliance-query">
            <div className="flex items-center gap-2.5 min-w-0">
              <ComplianceQueryMascotIcon className="h-4 w-4 shrink-0 text-[var(--portal-accent,#0A5C36)]" />
              <span className="truncate">Ask Compliance Question</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-[var(--portal-text-muted,#64766D)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--portal-accent,#0A5C36)]" />
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="group h-11 justify-between border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface,#FFFFFF)] px-3.5 text-xs font-semibold text-[var(--portal-text-primary,#101814)] hover:border-[var(--portal-border-strong,#B8C7C0)] hover:bg-[var(--portal-surface-hover,#F0F4F2)] hover:text-[var(--portal-text-primary,#101814)] transition-all"
        >
          <Link href="/startup/checklists">
            <div className="flex items-center gap-2.5 min-w-0">
              <ClipboardCheck className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
              <span className="truncate">Generate Checklist</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-[var(--portal-text-muted,#64766D)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--portal-text-primary,#101814)]" />
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="group h-11 justify-between border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface,#FFFFFF)] px-3.5 text-xs font-semibold text-[var(--portal-text-primary,#101814)] hover:border-[var(--portal-border-strong,#B8C7C0)] hover:bg-[var(--portal-surface-hover,#F0F4F2)] hover:text-[var(--portal-text-primary,#101814)] transition-all"
        >
          <Link href="/startup/gap-analysis">
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
              <span className="truncate">Run Gap Analysis</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-[var(--portal-text-muted,#64766D)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--portal-text-primary,#101814)]" />
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="group h-11 justify-between border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface,#FFFFFF)] px-3.5 text-xs font-semibold text-[var(--portal-text-primary,#101814)] hover:border-[var(--portal-border-strong,#B8C7C0)] hover:bg-[var(--portal-surface-hover,#F0F4F2)] hover:text-[var(--portal-text-primary,#101814)] transition-all"
        >
          <Link href="/startup/documents">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="h-4 w-4 shrink-0 text-gray-600" aria-hidden="true" />
              <span className="truncate">View Documents</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-[var(--portal-text-muted,#64766D)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--portal-text-primary,#101814)]" />
          </Link>
        </Button>
      </div>
    </PortalSurface>
  )
}
