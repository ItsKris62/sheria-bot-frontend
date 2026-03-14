"use client"

import React, { Suspense } from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Scale, Eye, EyeOff, CheckCircle2, Loader2, ArrowRight, AlertCircle } from "lucide-react"
import { LoadingScreen } from "@/components/loading-screen"
import { trpc } from "@/lib/trpc"
import { getAuthErrorMessage } from "@/lib/auth-error-messages"
import { PasswordStrengthIndicator, checkPasswordStrength } from "@/components/auth/password-strength-indicator"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const resetMutation = trpc.auth.resetPassword.useMutation()

  const passwordStrength = checkPasswordStrength(password)
  const confirmMismatch = confirmPassword !== "" && password !== confirmPassword
  const confirmMatch = confirmPassword !== "" && password === confirmPassword
  const canSubmit = passwordStrength.isValid && password === confirmPassword && confirmPassword !== "" && !!token

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    resetMutation.mutate({ token, newPassword: password })
  }

  if (!token) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
          <CardDescription>
            This password reset link is invalid or missing a token. Please request a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/forgot-password">Request New Link</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (resetMutation.isSuccess) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
            <CheckCircle2 className="h-8 w-8 text-secondary" />
          </div>
          <CardTitle className="mt-4 text-2xl">Password Reset Successful</CardTitle>
          <CardDescription>
            Your password has been updated. You can now log in with your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push("/login")}
          >
            Continue to Login
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="text-center">
        <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Scale className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold text-foreground">SheriaBot</span>
        </Link>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {resetMutation.isError && (
            <Alert variant="destructive" role="alert">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <AlertDescription>{getAuthErrorMessage(resetMutation.error)}</AlertDescription>
            </Alert>
          )}

          {/* New password */}
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 pr-10"
                aria-describedby="password-strength-reset"
                autoComplete="new-password"
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

            {/* Strength indicator — replaces the old partial 4-rule checklist */}
            <div id="password-strength-reset">
              <PasswordStrengthIndicator password={password} showChecklist={true} />
            </div>
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`h-11 pr-10 ${confirmMismatch ? "border-destructive focus-visible:ring-destructive" : confirmMatch ? "border-emerald-500 focus-visible:ring-emerald-500" : ""}`}
                aria-describedby={confirmMismatch ? "confirm-error-reset" : undefined}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
            {confirmMismatch && (
              <p id="confirm-error-reset" className="text-xs text-destructive" role="alert">
                Passwords don&apos;t match. Please re-enter to confirm.
              </p>
            )}
            {confirmMatch && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Passwords match.</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={resetMutation.isPending || !canSubmit}
          >
            {resetMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingScreen fullScreen={false} size="md" />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
