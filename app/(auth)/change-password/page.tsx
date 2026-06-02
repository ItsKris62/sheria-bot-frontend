"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react"

import { PasswordStrengthIndicator, checkPasswordStrength } from "@/components/auth/password-strength-indicator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getErrorMessage, trpc } from "@/lib/trpc"
import { useAuthStore, type UserRole } from "@/lib/auth-store"

function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "REGULATOR":
      return "/regulator"
    case "ADMIN":
      return "/admin"
    case "ENTERPRISE":
    case "STARTUP":
    default:
      return "/startup"
  }
}

export default function ChangePasswordPage() {
  const router = useRouter()
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [complete, setComplete] = useState(false)

  const passwordStrength = useMemo(() => checkPasswordStrength(form.newPassword), [form.newPassword])
  const confirmMismatch = form.confirmPassword !== "" && form.newPassword !== form.confirmPassword
  const canSubmit =
    form.currentPassword.length > 0 &&
    passwordStrength.isValid &&
    form.newPassword === form.confirmPassword &&
    form.newPassword !== form.currentPassword

  const changeMutation = trpc.auth.changeTemporaryPassword.useMutation({
    onSuccess: () => {
      updateUser({ mustChangePassword: false })
      setComplete(true)
      const role = user?.role ?? "STARTUP"
      setTimeout(() => router.replace(getDashboardPath(role)), 700)
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    if (!canSubmit) return
    changeMutation.mutate(form)
  }

  return (
    <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Change Password</CardTitle>
        <CardDescription>Your temporary password must be replaced before dashboard access.</CardDescription>
      </CardHeader>
      <CardContent>
        {complete ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" aria-hidden="true" />
            </div>
            <p className="text-sm text-muted-foreground">Password updated. Opening your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" role="alert">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Temporary Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(event) => setForm((current) => ({ ...current, currentPassword: event.target.value }))}
                  autoComplete="current-password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showCurrent ? "Hide temporary password" : "Show temporary password"}
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))}
                  autoComplete="new-password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showNew ? "Hide new password" : "Show new password"}
                >
                  {showNew ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
              <PasswordStrengthIndicator password={form.newPassword} showChecklist />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  autoComplete="new-password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirm ? "Hide confirmed password" : "Show confirmed password"}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
              {confirmMismatch && <p className="text-xs text-destructive">Passwords do not match.</p>}
              {form.newPassword === form.currentPassword && form.newPassword !== "" && (
                <p className="text-xs text-destructive">New password must be different from the temporary password.</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={!canSubmit || changeMutation.isPending}>
              {changeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              Change Password
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
