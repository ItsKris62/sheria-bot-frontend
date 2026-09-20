"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Globe2, CheckCircle2, Loader2, ShieldCheck, Sparkles, Building2 } from "lucide-react"
import { trpc } from "@/lib/trpc"
import { usePlan } from "@/lib/plan-context"
import {
  AUDITED_JURISDICTIONS,
  type AuditedJurisdictionCode,
} from "@/lib/jurisdictions"

const JURISDICTION_DETAILS: Record<
  AuditedJurisdictionCode,
  { name: string; flag: string; regulator: string; ready: boolean; tag: string }
> = {
  KE: {
    name: "Kenya",
    flag: "🇰🇪",
    regulator: "Central Bank of Kenya (CBK), ODPC, CMA",
    ready: true,
    tag: "Full Corpus Ready",
  },
  RW: {
    name: "Rwanda",
    flag: "🇷🇼",
    regulator: "National Bank of Rwanda (BNR), DPPO",
    ready: true,
    tag: "Full Corpus Ready",
  },
  MW: {
    name: "Malawi",
    flag: "🇲🇼",
    regulator: "Reserve Bank of Malawi (RBM)",
    ready: true,
    tag: "Active Coverage",
  },
  NG: {
    name: "Nigeria",
    flag: "🇳🇬",
    regulator: "Central Bank of Nigeria (CBN), NDPC",
    ready: true,
    tag: "Active Coverage",
  },
}

interface JurisdictionSetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (jurisdictionCode: AuditedJurisdictionCode) => void
}

export function JurisdictionSetupModal({
  open,
  onOpenChange,
  onSuccess,
}: JurisdictionSetupModalProps) {
  const { plan, homeJurisdictionCode } = usePlan()
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<AuditedJurisdictionCode | "">(
    (homeJurisdictionCode as AuditedJurisdictionCode) || "KE"
  )

  const isMultiCountryPlan = plan === "BUSINESS" || plan === "ENTERPRISE"
  const utils = trpc.useUtils()

  const confirmMutation = trpc.organization.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Primary compliance jurisdiction confirmed!")
      utils.billing.getPlanAndUsage.invalidate()
      utils.organization.getSettings.invalidate()
      utils.user.getProfile.invalidate()
      onOpenChange(false)
      if (selectedJurisdiction) {
        onSuccess?.(selectedJurisdiction as AuditedJurisdictionCode)
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to confirm jurisdiction")
    },
  })

  const handleConfirm = () => {
    if (!selectedJurisdiction) return
    confirmMutation.mutate({
      homeJurisdictionCode: selectedJurisdiction,
      homeJurisdictionReason: "User onboarding confirmation",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Set Primary Regulatory Jurisdiction
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Ground all SheriaBot AI intelligence in the local legislation and regulatory guidelines of your operating country.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isMultiCountryPlan ? (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">Multi-Country Access ({plan}):</span>{" "}
              This selection sets your organization&apos;s <strong className="text-foreground">Primary Home Jurisdiction</strong>. You can enable additional cross-border markets in Organization Settings.
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              SheriaBot verifies citations against official gazetted acts, central bank circulars, and data protection regulations for your selected jurisdiction.
            </div>
          </div>
        )}

        <div className="space-y-3 py-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Select Operating Country
          </Label>

          <RadioGroup
            value={selectedJurisdiction}
            onValueChange={(val) => setSelectedJurisdiction(val as AuditedJurisdictionCode)}
            className="grid gap-2.5 sm:grid-cols-2"
          >
            {AUDITED_JURISDICTIONS.map((item) => {
              const details = JURISDICTION_DETAILS[item.code]
              const isSelected = selectedJurisdiction === item.code

              return (
                <Label
                  key={item.code}
                  htmlFor={`modal-jurisdiction-${item.code}`}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40"
                  }`}
                >
                  <RadioGroupItem
                    id={`modal-jurisdiction-${item.code}`}
                    value={item.code}
                    className="mt-0.5"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
                        <span className="text-base">{details.flag}</span>
                        {item.label}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-normal px-1.5 py-0 border-border/70">
                        {details.tag}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                      {details.regulator}
                    </p>
                  </div>
                </Label>
              )
            })}
          </RadioGroup>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2 border-t border-border/50">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={confirmMutation.isPending}
            className="text-muted-foreground"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedJurisdiction || confirmMutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {confirmMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm Primary Jurisdiction
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
