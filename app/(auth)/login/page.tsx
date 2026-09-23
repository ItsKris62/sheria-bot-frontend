"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { LoadingButton } from "@/components/ui/loading-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, AlertCircle, Clock, Smartphone, KeyRound, ArrowLeft, Fingerprint, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { SESSION_EXPIRED_FLAG } from "@/lib/session-timeouts"
import { isWebAuthnSupported, translateWebAuthnError } from "@/lib/webauthn"

export default function LoginPage() {
  const {
    login,
    isLoginLoading,
    loginError,
    verifyTotpLogin,
    isVerifyTotpLoading,
    verifyTotpError,
    loginWithPasskey,
    isPasskeyLoading: isAuthHookPasskeyLoading,
  } = useAuth()

  const [step, setStep] = useState<"credentials" | "mfa">("credentials")
  const [mfaTempToken, setMfaTempToken] = useState<string | null>(null)
  const [mfaCode, setMfaCode] = useState("")
  const [isBackupCode, setIsBackupCode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isWebAuthnAvailable] = useState<boolean>(() => isWebAuthnSupported())
  const [isPasskeyManualLoading, setIsPasskeyManualLoading] = useState(false)

  const [sessionExpired] = useState(() => {
    if (typeof window === "undefined") return false

    const params = new URLSearchParams(window.location.search)
    const reason = params.get("reason")
    const storageFlag = sessionStorage.getItem(SESSION_EXPIRED_FLAG)

    if (storageFlag === "1") {
      sessionStorage.removeItem(SESSION_EXPIRED_FLAG)
    }

    return reason === "session_expired" || storageFlag === "1"
  })

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  // TODO: [FEATURE-FLAG] If browser conditional autofill is desired in the future,
  // implement it behind an explicit feature flag with session+IP keying, cached challenges,
  // and strict abort controllers to avoid burning public rate limits on page load.

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const result = await login(formData.email, formData.password)
      if (result && result.mfaRequired && result.tempToken) {
        setMfaTempToken(result.tempToken)
        setMfaCode("")
        setIsBackupCode(false)
        setStep("mfa")
      }
    } catch (err: unknown) {
      const { getAuthErrorMessage } = await import("@/lib/auth-error-messages")
      setError(getAuthErrorMessage(err))
    }
  }

  const handlePasskeyLogin = async () => {
    setError(null)
    setIsPasskeyManualLoading(true)

    try {
      await loginWithPasskey({ useBrowserAutofill: false })
    } catch (err: any) {
      const errorDetails = translateWebAuthnError(err, "authentication")
      if (!errorDetails.isCancellation) {
        setError(errorDetails.message)
      }
    } finally {
      setIsPasskeyManualLoading(false)
    }
  }

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mfaTempToken) return
    setError(null)

    try {
      await verifyTotpLogin(mfaTempToken, mfaCode, isBackupCode)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ""
      if (msg.includes("MFA_ATTEMPTS_EXCEEDED") || msg.includes("Too many requests")) {
        setError("Too many failed attempts. Your temporary MFA session has expired. Please sign in again.")
        setStep("credentials")
        setMfaTempToken(null)
        setMfaCode("")
        return
      }
      const { getAuthErrorMessage } = await import("@/lib/auth-error-messages")
      setError(getAuthErrorMessage(err))
    }
  }

  const handleBackToCredentials = () => {
    setStep("credentials")
    setMfaTempToken(null)
    setMfaCode("")
    setError(null)
  }

  const displayError = error || (step === "credentials" ? loginError : verifyTotpError)
  const isPasskeyBusy = isPasskeyManualLoading || isAuthHookPasskeyLoading

  return (
    <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="text-center">
        {step === "credentials" ? (
          <>
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <CardDescription className="text-muted-foreground">
              Sign in to your SheriaBot account
            </CardDescription>
          </>
        ) : (
          <>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              {isBackupCode ? <KeyRound className="h-6 w-6" /> : <Smartphone className="h-6 w-6" />}
            </div>
            <h1 className="text-2xl font-bold text-foreground">Two-Factor Authentication</h1>
            <CardDescription className="text-muted-foreground">
              {isBackupCode
                ? "Enter one of your 8-character recovery backup codes"
                : "Enter the 6-digit security code generated by your authenticator app"}
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        {sessionExpired && step === "credentials" && (
          <div
            className="mb-4 flex items-start gap-3 rounded-lg p-3 text-sm"
            style={{
              borderLeft: "3px solid #F59E0B",
              backgroundColor: "#F9FAFB",
              color: "#6B7280",
            }}
          >
            <Clock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#F59E0B" }} />
            <p>
              Your session expired due to inactivity. Please sign in to
              continue.
            </p>
          </div>
        )}

        {displayError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{displayError}</p>
          </div>
        )}

        {step === "credentials" ? (
          <div className="space-y-4">
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-background"
                  autoComplete="username webauthn"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="bg-background pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me for 30 days
                </Label>
              </div>

              <LoadingButton
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-brand-green-hover font-semibold shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] transition-all duration-200 h-10 rounded-xl"
                loading={isLoginLoading}
                loadingText="Signing in..."
                disabled={isPasskeyBusy}
              >
                Sign in
              </LoadingButton>
            </form>

            {isWebAuthnAvailable && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/60" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePasskeyLogin}
                  disabled={isLoginLoading || isPasskeyBusy}
                  className="w-full h-10 rounded-xl font-semibold gap-2 border-border/80 hover:bg-muted/50 transition-all duration-200 bg-background"
                >
                  {isPasskeyBusy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authenticating with Passkey...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="h-4 w-4 text-primary" />
                      Sign in with Passkey
                    </>
                  )}
                </Button>
              </>
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleMfaSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="mfaCode" className="text-foreground">
                {isBackupCode ? "Backup Recovery Code" : "Verification Code"}
              </Label>
              <Input
                id="mfaCode"
                type="text"
                placeholder={isBackupCode ? "XXXX-XXXX" : "000000"}
                value={mfaCode}
                onChange={(e) => {
                  const val = e.target.value.trim()
                  if (!isBackupCode) {
                    setMfaCode(val.replace(/\D/g, "").slice(0, 6))
                  } else {
                    setMfaCode(val.toUpperCase().slice(0, 15))
                  }
                }}
                required
                autoFocus
                className="bg-background text-center text-xl font-mono tracking-widest"
                maxLength={isBackupCode ? 15 : 6}
                autoComplete="one-time-code"
              />
            </div>

            <LoadingButton
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-brand-green-hover font-semibold shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] transition-all duration-200 h-10 rounded-xl"
              loading={isVerifyTotpLoading}
              loadingText="Verifying code..."
              disabled={isBackupCode ? mfaCode.length < 6 : mfaCode.length !== 6}
            >
              Verify & Sign in
            </LoadingButton>

            <div className="flex flex-col gap-2 pt-2 text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsBackupCode(!isBackupCode)
                  setMfaCode("")
                  setError(null)
                }}
                className="text-primary hover:underline"
              >
                {isBackupCode ? "Use Authenticator App code instead" : "Use a backup recovery code instead"}
              </button>

              <button
                type="button"
                onClick={handleBackToCredentials}
                className="inline-flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
