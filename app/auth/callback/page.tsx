"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { trpc } from "@/lib/trpc"
import { LoadingScreen } from "@/components/loading-screen"
import { Scale } from "lucide-react"
import Link from "next/link"

/**
 * /auth/callback
 *
 * Landing page for the Supabase OTP verification redirect.
 *
 * Flow:
 *  1. User clicks the verification link in their email.
 *  2. Supabase processes the OTP at /auth/v1/verify, sets email_confirmed_at,
 *     then redirects here with the session tokens in the URL hash:
 *     /auth/callback#access_token=xxx&refresh_token=xxx&type=signup
 *  3. The Supabase browser client (detectSessionInUrl: true) automatically
 *     reads the hash and establishes the session.
 *  4. We call trpc.auth.confirmEmailCallback to sync Prisma emailVerified.
 *  5. Redirect to /login (with ?verified=true) or /login (with pending notice
 *     for regulators).
 */
export default function AuthCallbackPage() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const confirmMutation = trpc.auth.confirmEmailCallback.useMutation()

  useEffect(() => {
    // Guard so we don't call the mutation twice in React strict-mode double invokes
    let cancelled = false

    async function handleCallback() {
      try {
        // Let the Supabase client process the URL hash and establish the session.
        // With detectSessionInUrl: true this happens synchronously on createClient,
        // so getSession() immediately returns the session derived from the hash.
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !session) {
          if (!cancelled) {
            setErrorMessage(
              "The verification link is invalid or has expired. Please request a new one."
            )
          }
          return
        }

        // Sync Prisma emailVerified via the backend
        const result = await confirmMutation.mutateAsync({ accessToken: session.access_token })

        if (cancelled) return

        if (result.requiresApproval) {
          // Regulator — email verified but account needs admin approval
          router.replace("/login?pending_approval=true")
        } else {
          // Startup / Financial Institution — ready to log in
          router.replace("/login?verified=true")
        }
      } catch (err: any) {
        if (!cancelled) {
          setErrorMessage(err?.message || "Email verification failed. Please try again.")
        }
      }
    }

    handleCallback()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (errorMessage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Scale className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">SheriaBot</span>
        </Link>
        <div className="w-full max-w-md rounded-lg border border-destructive/40 bg-card/50 p-6 text-center backdrop-blur">
          <h2 className="text-xl font-semibold text-destructive">Verification Failed</h2>
          <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
          <Link
            href="/login"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return <LoadingScreen fullScreen message="Verifying your email…" />
}
