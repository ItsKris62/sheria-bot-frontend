"use client"

import { useCookieConsent } from "@/components/privacy/cookie-consent-provider"
import { Button } from "@/components/ui/button"

export function CookieSettingsButton({ compact = false }: { compact?: boolean }) {
  const { openPreferences } = useCookieConsent()
  return (
    <Button type="button" variant={compact ? "link" : "outline"} size={compact ? "sm" : "default"} onClick={openPreferences} className={compact ? "h-auto p-0 text-sm text-muted-foreground" : undefined}>
      Cookie Settings
    </Button>
  )
}
