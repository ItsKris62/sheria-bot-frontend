"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Fingerprint, X } from "lucide-react"
import { isWebAuthnSupported } from "@/lib/webauthn"
import { useAuth } from "@/hooks/use-auth"
import { trpc } from "@/lib/trpc"

export function PasskeyEnrollmentNudge() {
  const { user } = useAuth()
  const [dismissed, setDismissed] = useState(true)
  const [supported, setSupported] = useState(false)

  const passkeysQuery = trpc.passkey.listUserPasskeys.useQuery(undefined, {
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  })

  useEffect(() => {
    if (!user?.id) return
    const isSupp = isWebAuthnSupported()
    setSupported(isSupp)

    const key = `sheriabot_passkey_nudge_dismissed_${user.id}`
    const isDismissed = localStorage.getItem(key) === "true"
    setDismissed(isDismissed)
  }, [user?.id])

  if (dismissed || !supported || passkeysQuery.isLoading || (passkeysQuery.data?.length ?? 0) > 0) {
    return null
  }

  const handleDismiss = () => {
    if (user?.id) {
      localStorage.setItem(`sheriabot_passkey_nudge_dismissed_${user.id}`, "true")
    }
    setDismissed(true)
  }

  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/10 p-3.5 text-sm text-foreground">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-primary/20 p-1.5 text-primary">
          <Fingerprint className="h-4 w-4" />
        </div>
        <p>
          <span className="font-semibold">Upgrade your login:</span> Add a passkey for faster, passwordless sign-in with Touch ID, Face ID, or Windows Hello.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href="/settings/security#passkeys"
          className="text-xs font-semibold text-primary hover:underline"
        >
          Add Passkey
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded p-1 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss passkey prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
