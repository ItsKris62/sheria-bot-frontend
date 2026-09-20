"use client"

import React, { useState } from "react"
import { Globe2, ArrowRight, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePlan } from "@/lib/plan-context"
import { JurisdictionSetupModal } from "./jurisdiction-setup-modal"
import { useAuthStore } from "@/lib/auth-store"

export function JurisdictionPromptBanner() {
  const { needsCountryConfirmation, homeJurisdictionCode, isLoading, plan } = usePlan()
  const userRole = useAuthStore((s) => s.user?.role)
  const [modalOpen, setModalOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Don't show for regulators, or when loading, or when dismissed, or if country is already confirmed
  if (isLoading || dismissed || userRole === "REGULATOR") return null
  if (!needsCountryConfirmation && homeJurisdictionCode) return null

  const isMultiCountry = plan === "BUSINESS" || plan === "ENTERPRISE"

  return (
    <>
      <div
        className="flex items-center justify-between gap-3 border-b border-primary/20 bg-primary/10 px-4 py-2 text-xs text-foreground backdrop-blur-md"
        role="alert"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary shrink-0">
            <Globe2 className="h-3 w-3" />
          </div>
          <p className="truncate">
            <span className="font-semibold text-foreground">Action Required:</span>{" "}
            Set your organization&apos;s primary compliance jurisdiction to enable AI compliance queries & analysis.
            {isMultiCountry && (
              <span className="text-muted-foreground hidden sm:inline ml-1">
                (Multi-country access supported)
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="h-6 px-2.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Set Country
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Dismiss country banner"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <JurisdictionSetupModal
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  )
}
