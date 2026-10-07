"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { trpc } from "@/lib/trpc"
import type { RequirementItemDTO } from "./dashboard-types"
import { CheckCircle2, XCircle, HelpCircle, Loader2 } from "lucide-react"

export interface ComplianceReviewDrawerProps {
  isOpen: boolean
  onClose: () => void
  categoryKey: string | null
  categoryName: string
  requirements: RequirementItemDTO[]
  onSuccess?: () => void
}

export function ComplianceReviewDrawer({
  isOpen,
  onClose,
  categoryKey,
  categoryName,
  requirements,
  onSuccess,
}: ComplianceReviewDrawerProps) {
  const [inFlightItemId, setInFlightItemId] = React.useState<string | null>(null)
  const utils = trpc.useUtils()

  const assessMutation = (trpc.complianceDashboard as any).assessDashboardItem?.useMutation({
    onSuccess: async () => {
      await utils.complianceDashboard.getComplianceDashboard.invalidate()
      if ((utils.complianceDashboard as any).getComplianceDashboardV2) {
        await (utils.complianceDashboard as any).getComplianceDashboardV2.invalidate()
      }
      onSuccess?.()
    },
    onSettled: () => {
      setInFlightItemId(null)
    },
  })

  const categoryRequirements = React.useMemo(() => {
    if (!categoryKey) return requirements
    return requirements.filter((r) => r.category === categoryKey)
  }, [requirements, categoryKey])

  const handleStatusChange = async (
    itemId: string,
    status: 'NOT_REVIEWED' | 'MEETS_REQUIREMENT' | 'DOES_NOT_MEET_REQUIREMENT'
  ) => {
    if (!assessMutation || inFlightItemId) return
    setInFlightItemId(itemId)
    try {
      await assessMutation.mutateAsync({ itemId, status })
    } catch {
      // Handled by TRPC error boundary or alert
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl border-border bg-background p-0 shadow-2xl">
        <DialogHeader className="border-b border-border/80 px-6 py-4">
          <div className="flex items-center justify-between pr-6">
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight">
                Review Requirements — {categoryName}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                Mark compliance status for each baseline requirement. Changes update your provisional posture immediately.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {categoryRequirements.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No requirements found for this category.
            </div>
          ) : (
            categoryRequirements.map((req) => {
              const isLoading = inFlightItemId === req.id

              return (
                <div
                  key={req.id}
                  className="rounded-xl border border-border/60 bg-card/60 p-4 transition-colors hover:border-border"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground">
                          {req.title}
                        </span>
                        {req.requirementKey && (
                          <Badge variant="outline" className="text-[10px] font-mono py-0 h-5">
                            {req.requirementKey}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {req.description}
                      </p>
                    </div>

                    {/* Current Status Badge */}
                    <div className="shrink-0">
                      {req.reviewStatus === 'MEETS_REQUIREMENT' ? (
                        <Badge variant="outline" className="gap-1 text-xs border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="size-3" /> Meets
                        </Badge>
                      ) : req.reviewStatus === 'DOES_NOT_MEET_REQUIREMENT' ? (
                        <Badge variant="destructive" className="gap-1 text-xs">
                          <XCircle className="size-3" /> Does Not Meet
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1 text-xs text-muted-foreground">
                          <HelpCircle className="size-3" /> Not Reviewed
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Review Actions */}
                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/40 pt-3">
                    {isLoading ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="size-3.5 animate-spin" /> Saving...
                      </div>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant={req.reviewStatus === 'NOT_REVIEWED' ? 'secondary' : 'ghost'}
                          size="sm"
                          className="h-7 text-xs px-2.5"
                          onClick={() => handleStatusChange(req.id, 'NOT_REVIEWED')}
                        >
                          Not Reviewed
                        </Button>
                        <Button
                          type="button"
                          variant={req.reviewStatus === 'DOES_NOT_MEET_REQUIREMENT' ? 'destructive' : 'outline'}
                          size="sm"
                          className="h-7 text-xs px-2.5"
                          onClick={() => handleStatusChange(req.id, 'DOES_NOT_MEET_REQUIREMENT')}
                        >
                          Does Not Meet
                        </Button>
                        <Button
                          type="button"
                          variant={req.reviewStatus === 'MEETS_REQUIREMENT' ? 'default' : 'outline'}
                          size="sm"
                          className="h-7 text-xs px-2.5"
                          onClick={() => handleStatusChange(req.id, 'MEETS_REQUIREMENT')}
                        >
                          Meets Requirement
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="border-t border-border/80 px-6 py-3 flex items-center justify-between bg-muted/20">
          <span className="text-xs text-muted-foreground">
            {categoryRequirements.filter((r) => r.assessedAt !== null).length} of {categoryRequirements.length} assessed
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
