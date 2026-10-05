"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  COOKIE_CONSENT_STORAGE_KEY,
  createConsentRecord,
  readConsentRecord,
  revokeOptionalStorage,
  writeConsentRecord,
  type CookieConsentRecord,
} from "@/lib/cookie-consent"

interface CookieConsentContextValue {
  consent: CookieConsentRecord | null | undefined
  openPreferences: () => void
}

const CookieConsentContext = createContext<CookieConsentContextValue>({
  consent: undefined,
  openPreferences: () => undefined,
})

export function useCookieConsent() {
  return useContext(CookieConsentContext)
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<CookieConsentRecord | null | undefined>(undefined)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [functional, setFunctional] = useState(false)
  const [analytics, setAnalytics] = useState(false)

  useEffect(() => {
    const stored = readConsentRecord()
    // Browser storage is intentionally read after hydration to keep server markup deterministic.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(stored)
    setFunctional(stored?.functional ?? false)
    setAnalytics(stored?.analytics ?? false)

    // Migrate the legacy one-key rejection without changing the user's choice.
    if (stored && !window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)) {
      writeConsentRecord(stored)
    }
  }, [])

  const persist = (nextFunctional: boolean, nextAnalytics: boolean) => {
    const record = createConsentRecord({ functional: nextFunctional, analytics: nextAnalytics })
    writeConsentRecord(record)
    revokeOptionalStorage(record)
    setConsent(record)
    setFunctional(record.functional)
    setAnalytics(record.analytics)
    setPreferencesOpen(false)
  }

  const openPreferences = useCallback(() => {
    setFunctional(consent?.functional ?? false)
    setAnalytics(consent?.analytics ?? false)
    setPreferencesOpen(true)
  }, [consent])

  const value = useMemo(() => ({ consent, openPreferences }), [consent, openPreferences])

  return (
    <CookieConsentContext.Provider value={value}>
      {children}

      {consent === null ? (
        <section
          aria-label="Cookie consent"
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-4xl rounded-2xl border border-border bg-card p-4 shadow-2xl sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-base font-semibold text-foreground">Your privacy choices</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                SheriaBot uses necessary storage for secure sign-in. With your permission, we also remember optional preferences and measure product usage. Read our{" "}
                <Link href="/cookie-policy" className="font-medium text-primary underline underline-offset-4">Cookie Policy</Link>.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[430px]">
              <Button variant="outline" onClick={() => persist(false, false)}>Reject Non-Essential</Button>
              <Button variant="outline" onClick={openPreferences}>Manage Preferences</Button>
              <Button onClick={() => persist(true, true)}>Accept All</Button>
            </div>
          </div>
        </section>
      ) : null}

      <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cookie preferences</DialogTitle>
            <DialogDescription>
              Choose which optional browser storage and analytics SheriaBot may use. Necessary authentication and security storage cannot be disabled here.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <PreferenceRow
              id="necessary-consent"
              title="Strictly necessary"
              description="Maintains authentication, security, consent, and cross-tab session state."
              checked
              disabled
              status="Always active"
            />
            <PreferenceRow
              id="functional-consent"
              title="Functional preferences"
              description="Remembers interface choices such as sidebar state, recent searches, jurisdiction selection, and unsent drafts."
              checked={functional}
              onCheckedChange={setFunctional}
              status="Optional"
            />
            <PreferenceRow
              id="analytics-consent"
              title="Analytics"
              description="Allows PostHog, Google Analytics, Vercel Analytics, and Speed Insights to measure usage and performance. Session replay is disabled."
              checked={analytics}
              onCheckedChange={setAnalytics}
              status="Optional"
            />
          </div>

          <DialogFooter className="grid gap-2 sm:grid-cols-3">
            <Button variant="outline" onClick={() => persist(false, false)}>Reject All</Button>
            <Button variant="outline" onClick={() => persist(functional, analytics)}>Save Preferences</Button>
            <Button onClick={() => persist(true, true)}>Accept All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CookieConsentContext.Provider>
  )
}

function PreferenceRow({
  id,
  title,
  description,
  status,
  checked,
  disabled = false,
  onCheckedChange,
}: {
  id: string
  title: string
  description: string
  status: string
  checked: boolean
  disabled?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
      <div>
        <Label htmlFor={id} className="text-sm font-semibold">{title}</Label>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
        <p className="mt-2 text-xs font-medium text-primary">{status}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-label={`${title}: ${status}`}
      />
    </div>
  )
}
