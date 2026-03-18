"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Shield,
  Key,
  Smartphone,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  Eye,
  EyeOff,
  LogOut,
  Laptop,
  Trash2,
  Sparkles,
} from "lucide-react"
import { useUserActions, useSessions, useTotp, type SessionInfo } from "@/hooks/use-user"
import { useAuth } from "@/hooks/use-auth"
import { format, formatDistanceToNow } from "date-fns"
import { PasswordStrengthIndicator, checkPasswordStrength } from "@/components/auth/password-strength-indicator"
import { generateStrongPassword } from "@/lib/password"

// ─── Change Password ───────────────────────────────────────────────────────────

function ChangePasswordCard() {
  const { changePassword, isChangingPassword } = useUserActions()
  const { logout } = useAuth()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" })
  const [error, setError] = useState<string | null>(null)
  // Stores the last generated password so the user can copy it.
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)

  const newPassStrength = checkPasswordStrength(form.newPass)

  // Submit is enabled only when all fields are filled, new password passes all
  // rules, confirmation matches, and new password differs from current.
  const canSubmit =
    !isChangingPassword &&
    form.current.trim().length > 0 &&
    form.newPass.length > 0 &&
    form.confirm.length > 0 &&
    newPassStrength.isValid &&
    form.newPass === form.confirm &&
    form.newPass !== form.current

  const handleSubmit = async () => {
    setError(null)

    if (form.newPass !== form.confirm) {
      setError("New passwords do not match")
      return
    }
    if (!newPassStrength.isValid) {
      setError("New password does not meet the requirements shown below")
      return
    }
    if (form.newPass === form.current) {
      setError("New password must be different from your current password")
      return
    }

    try {
      await changePassword({
        currentPassword: form.current,
        newPassword: form.newPass,
        confirmPassword: form.confirm,
      })
      toast.success(
        "Password changed. You will be signed out — please log in again with your new password.",
        { duration: 5000 }
      )
      setForm({ current: "", newPass: "", confirm: "" })
      setGeneratedPassword(null)
      // All Supabase sessions were revoked on the backend. Sign out locally.
      await logout()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to change password"
      setError(message)
    }
  }

  const handleSuggestPassword = () => {
    try {
      const pw = generateStrongPassword(16)
      setForm((prev) => ({ ...prev, newPass: pw, confirm: pw }))
      setGeneratedPassword(pw)
      setShowNew(true)
      setShowConfirm(true)
      setError(null)
      toast.info("Strong password generated. Save it in a password manager.")
    } catch {
      toast.error("Could not generate a password. Please try again.")
    }
  }

  const handleCopyGenerated = () => {
    if (!generatedPassword) return
    navigator.clipboard.writeText(generatedPassword).then(() => {
      toast.success("Password copied to clipboard")
    }).catch(() => {
      toast.error("Failed to copy. Please copy it manually.")
    })
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          Change Password
        </CardTitle>
        <CardDescription>Update your account password. All active sessions will be signed out after a successful change.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Current Password */}
        <div className="space-y-2">
          <Label>Current Password</Label>
          <div className="relative">
            <Input
              type={showCurrent ? "text" : "password"}
              className="bg-muted/50 pr-10"
              value={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.value })}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setShowCurrent((v) => !v)}
              aria-label={showCurrent ? "Hide current password" : "Show current password"}
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>New Password</Label>
            <button
              type="button"
              onClick={handleSuggestPassword}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Suggest strong password
            </button>
          </div>
          <div className="relative">
            <Input
              type={showNew ? "text" : "password"}
              className="bg-muted/50 pr-10"
              value={form.newPass}
              onChange={(e) => {
                setForm({ ...form, newPass: e.target.value })
                // Clear generated password display if user types manually.
                if (e.target.value !== generatedPassword) setGeneratedPassword(null)
              }}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setShowNew((v) => !v)}
              aria-label={showNew ? "Hide new password" : "Show new password"}
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Strength meter — shown as soon as the user starts typing */}
          {form.newPass.length > 0 && (
            <PasswordStrengthIndicator
              password={form.newPass}
              showChecklist={true}
              className="mt-2"
            />
          )}

          {/* Generated password display */}
          {generatedPassword && form.newPass === generatedPassword && (
            <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30 px-3 py-2">
              <code className="flex-1 truncate text-xs font-mono text-emerald-800 dark:text-emerald-300">
                {generatedPassword}
              </code>
              <button
                type="button"
                onClick={handleCopyGenerated}
                className="shrink-0 text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200 transition-colors"
                aria-label="Copy generated password"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <Label>Confirm New Password</Label>
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              className={`bg-muted/50 pr-10 ${
                form.confirm.length > 0 && form.newPass !== form.confirm
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.confirm.length > 0 && form.newPass !== form.confirm && (
            <p className="text-xs text-destructive">Passwords do not match</p>
          )}
          {form.confirm.length > 0 && form.newPass === form.confirm && form.confirm.length > 0 && (
            <p className="text-xs text-emerald-600">Passwords match</p>
          )}
        </div>

        <Button
          className="bg-primary text-primary-foreground"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {isChangingPassword ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

// ─── TOTP / 2FA ───────────────────────────────────────────────────────────────

function TwoFactorCard() {
  const { totpEnabled, isLoadingStatus, setupTotp, isSettingUp, setupData, setupError, confirmTotpSetup, isConfirming, confirmError, disableTotp, isDisabling, disableError } = useTotp()

  const [setupDialogOpen, setSetupDialogOpen] = useState(false)
  const [disableDialogOpen, setDisableDialogOpen] = useState(false)
  const [verifyCode, setVerifyCode] = useState("")
  const [disablePassword, setDisablePassword] = useState("")
  const [step, setStep] = useState<"qr" | "verify">("qr")

  const handleStartSetup = async () => {
    setStep("qr")
    setVerifyCode("")
    setSetupDialogOpen(true)
    try {
      await setupTotp({})
    } catch {
      setSetupDialogOpen(false)
    }
  }

  const handleConfirm = async () => {
    try {
      await confirmTotpSetup({ code: verifyCode })
      toast.success("Two-factor authentication enabled")
      setSetupDialogOpen(false)
      setVerifyCode("")
    } catch {
      // Error shown via confirmError
    }
  }

  const handleDisable = async () => {
    try {
      await disableTotp({ password: disablePassword })
      toast.success("Two-factor authentication disabled")
      setDisableDialogOpen(false)
      setDisablePassword("")
    } catch {
      // Error shown via disableError
    }
  }

  const copySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret)
      toast.success("Secret copied to clipboard")
    }
  }

  if (isLoadingStatus) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Authenticator App */}
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              {totpEnabled ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Shield className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium text-foreground">Authenticator App</p>
                <p className="text-sm text-muted-foreground">
                  {totpEnabled
                    ? "Enabled — your account is protected with TOTP"
                    : "Use Google Authenticator, Authy, or any TOTP app"}
                </p>
              </div>
            </div>
            {totpEnabled ? (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 bg-transparent"
                onClick={() => setDisableDialogOpen(true)}
              >
                Disable
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartSetup}
                disabled={isSettingUp}
              >
                {isSettingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enable"}
              </Button>
            )}
          </div>

          {/* SMS placeholder */}
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4 opacity-50">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">SMS Authentication</p>
                <p className="text-sm text-muted-foreground">Receive codes via SMS (coming soon)</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Setup Dialog */}
      <Dialog open={setupDialogOpen} onOpenChange={setSetupDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app, then enter the 6-digit code to confirm.
            </DialogDescription>
          </DialogHeader>

          {isSettingUp || !setupData ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-lg border-2 border-border p-4 bg-white">
                  <QRCodeSVG value={setupData.otpauth} size={180} />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Scan with Google Authenticator, Authy, or any TOTP-compatible app
                </p>
              </div>

              {/* Manual entry */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Can&apos;t scan? Enter this key manually:
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={setupData.secret}
                    readOnly
                    className="font-mono text-xs bg-muted/50"
                  />
                  <Button variant="outline" size="icon" onClick={copySecret}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Verification */}
              <div className="space-y-2">
                <Label>Enter the 6-digit code from your app</Label>
                <Input
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-xl tracking-widest font-mono bg-background"
                />
                {confirmError && (
                  <p className="text-sm text-destructive">{confirmError}</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSetupDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={verifyCode.length !== 6 || isConfirming || isSettingUp}
            >
              {isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Confirm & Enable"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable Dialog */}
      <Dialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter your current password to confirm disabling 2FA. This will reduce your account security.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input
              type="password"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              className="bg-background"
              placeholder="Enter your password"
            />
            {disableError && <p className="text-sm text-destructive">{disableError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisableDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisable}
              disabled={!disablePassword || isDisabling}
            >
              {isDisabling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disabling...
                </>
              ) : (
                "Disable 2FA"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─── Active Sessions ───────────────────────────────────────────────────────────

function ActiveSessionsCard() {
  const { sessions, isLoadingSessions, revokeSession, isRevokingSession, revokeOtherSessions, isRevokingOthers, revokeAllSessions, isRevokingAll } = useSessions()
  const { logout } = useAuth()
  const [revokeAllDialogOpen, setRevokeAllDialogOpen] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  const handleRevokeOne = async (id: string) => {
    setRevokingId(id)
    try {
      await revokeSession({ sessionId: id })
      toast.success("Session revoked")
    } catch {
      toast.error("Failed to revoke session")
    } finally {
      setRevokingId(null)
    }
  }

  const handleRevokeOthers = async () => {
    try {
      const result = await revokeOtherSessions(undefined)
      toast.success(`Signed out of ${result.sessionsRevoked} other session(s)`)
    } catch {
      toast.error("Failed to revoke other sessions")
    }
  }

  const handleRevokeAll = async () => {
    try {
      await revokeAllSessions(undefined)
      toast.success("Signed out of all sessions")
      setRevokeAllDialogOpen(false)
      // Log out locally since current session was also revoked
      await logout()
    } catch {
      toast.error("Failed to revoke all sessions")
    }
  }

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Active Sessions
              </CardTitle>
              <CardDescription className="mt-1">
                Manage your active login sessions across devices
              </CardDescription>
            </div>
            {sessions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground"
                onClick={handleRevokeOthers}
                disabled={isRevokingOthers || sessions.filter((s: SessionInfo) => !s.isCurrent).length === 0}
              >
                {isRevokingOthers ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Sign out others"
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoadingSessions ? (
            [...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No active sessions found. Sessions are created when you log in.
            </p>
          ) : (
            sessions.map((session: SessionInfo) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg bg-muted/30 p-4"
              >
                <div className="flex items-start gap-3">
                  <Laptop className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">{session.device}</p>
                      {session.isCurrent && (
                        <Badge className="bg-primary/10 text-primary text-xs">Current</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      IP: {session.ipAddress}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Signed in{" "}
                      {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                      {" · "}Expires{" "}
                      {formatDistanceToNow(new Date(session.expiresAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30 bg-transparent flex-shrink-0"
                    onClick={() => handleRevokeOne(session.id)}
                    disabled={isRevokingSession && revokingId === session.id}
                  >
                    {isRevokingSession && revokingId === session.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            ))
          )}

          {sessions.length > 0 && (
            <Button
              variant="outline"
              className="w-full text-destructive bg-transparent border-destructive/30"
              onClick={() => setRevokeAllDialogOpen(true)}
              disabled={isRevokingAll}
            >
              {isRevokingAll ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing out all...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out of All Sessions
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Confirm revoke all */}
      <AlertDialog open={revokeAllDialogOpen} onOpenChange={setRevokeAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of all sessions?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately sign you out of all devices, including this one. You will need
              to log in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleRevokeAll}
            >
              Sign Out All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Security Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account security and authentication
        </p>
      </div>

      <div className="grid gap-6">
        <ChangePasswordCard />
        <TwoFactorCard />
        <ActiveSessionsCard />

        {/* Delete Account */}
        <Card className="border-border/50 bg-card/50 backdrop-blur border-l-4 border-l-warning">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground">Delete Account</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Permanently delete your account and all associated data. This action cannot be
                  undone.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 text-destructive border-destructive bg-transparent"
                  disabled
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
