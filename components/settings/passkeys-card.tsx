"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { format, formatDistanceToNow } from "date-fns"
import { startRegistration } from "@simplewebauthn/browser"

type RegistrationResponseJSON = Awaited<ReturnType<typeof startRegistration>>

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  Fingerprint,
  KeyRound,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  ShieldCheck,
  Smartphone,
  Laptop,
} from "lucide-react"
import { trpc, getErrorMessage } from "@/lib/trpc"
import { isWebAuthnSupported, translateWebAuthnError } from "@/lib/webauthn"

function getDefaultDeviceName(): string {
  if (typeof navigator === "undefined") return "My Passkey"
  const ua = navigator.userAgent
  let browser = "Browser"
  if (ua.includes("Edg/")) browser = "Edge"
  else if (ua.includes("Chrome/")) browser = "Chrome"
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari"
  else if (ua.includes("Firefox/")) browser = "Firefox"

  let os = "Device"
  if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS"
  else if (ua.includes("Windows")) os = "Windows"
  else if (ua.includes("iPhone")) os = "iPhone"
  else if (ua.includes("iPad")) os = "iPad"
  else if (ua.includes("Android")) os = "Android"
  else if (ua.includes("Linux")) os = "Linux"

  return `${browser} on ${os}`
}

export function PasskeysCard() {
  const [isSupported, setIsSupported] = useState<boolean>(true)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deviceNameInput, setDeviceNameInput] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)

  // Rename state
  const [renameTarget, setRenameTarget] = useState<{ id: string; deviceName: string } | null>(null)
  const [newDeviceName, setNewDeviceName] = useState("")
  const [isRenaming, setIsRenaming] = useState(false)

  // Delete target state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; deviceName: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const utils = trpc.useUtils()

  useEffect(() => {
    setIsSupported(isWebAuthnSupported())
  }, [])

  // Queries & Mutations
  const listQuery = trpc.passkey.listUserPasskeys.useQuery(undefined, {
    staleTime: 30_000,
  })

  const generateOptionsMutation = trpc.passkey.generateRegistrationOptions.useMutation()
  const verifyRegistrationMutation = trpc.passkey.verifyRegistration.useMutation()
  const renameMutation = trpc.passkey.renamePasskey.useMutation()
  const deleteMutation = trpc.passkey.deletePasskey.useMutation()

  const openAddModal = () => {
    setDeviceNameInput(getDefaultDeviceName())
    setAddModalOpen(true)
  }

  const handleStartRegistration = async () => {
    setIsRegistering(true)
    try {
      // 1. Generate options from backend
      const options = await generateOptionsMutation.mutateAsync()

      // 2. Perform browser ceremony
      const registrationResponse: RegistrationResponseJSON = await startRegistration({
        optionsJSON: options as any,
      })

      // 3. Verify on backend
      const trimmedName = deviceNameInput.trim().slice(0, 64) || undefined
      await verifyRegistrationMutation.mutateAsync({
        response: registrationResponse,
        deviceName: trimmedName,
      })

      toast.success("Passkey registered successfully")
      setAddModalOpen(false)
      await utils.passkey.listUserPasskeys.invalidate()
      await utils.organization.getSecurityCenter.invalidate()
    } catch (err: any) {
      const errorDetails = translateWebAuthnError(err, "registration")
      if (!errorDetails.isCancellation) {
        toast.error(errorDetails.message)
      }
    } finally {
      setIsRegistering(false)
    }
  }

  const handleRename = async () => {
    if (!renameTarget) return
    const trimmed = newDeviceName.trim().slice(0, 64)
    if (!trimmed) {
      toast.error("Device name cannot be empty")
      return
    }

    setIsRenaming(true)
    try {
      await renameMutation.mutateAsync({
        id: renameTarget.id,
        deviceName: trimmed,
      })
      toast.success("Passkey renamed")
      setRenameTarget(null)
      await utils.passkey.listUserPasskeys.invalidate()
    } catch (err: any) {
      toast.error(getErrorMessage(err) || "Failed to rename passkey")
    } finally {
      setIsRenaming(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteMutation.mutateAsync({ id: deleteTarget.id })
      toast.success("Passkey deleted")
      setDeleteTarget(null)
      await utils.passkey.listUserPasskeys.invalidate()
      await utils.organization.getSecurityCenter.invalidate()
    } catch (err: any) {
      toast.error(getErrorMessage(err) || "Failed to delete passkey")
    } finally {
      setIsDeleting(false)
    }
  }

  const passkeys = listQuery.data ?? []

  return (
    <Card id="passkeys" className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Fingerprint className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">Passkeys & Hardware Keys</CardTitle>
              <CardDescription className="text-muted-foreground mt-0.5">
                Sign in securely without a password using Touch ID, Face ID, Windows Hello, or FIDO2 hardware keys.
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={openAddModal}
            disabled={!isSupported || isRegistering}
            size="sm"
            className="gap-1.5"
            title={!isSupported ? "Passkeys aren't supported in this browser" : undefined}
          >
            <Plus className="h-4 w-4" />
            Add Passkey
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isSupported && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
            Passkeys are not supported in this browser or environment. Use a modern browser with WebAuthn enabled.
          </div>
        )}

        {listQuery.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : listQuery.isError ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {getErrorMessage(listQuery.error)}
          </div>
        ) : passkeys.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <KeyRound className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium text-foreground">No passkeys registered</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Add a passkey to enable instant, phishing-resistant sign-in without needing to enter a password or 2FA code.
            </p>
            {isSupported && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-1.5 bg-background"
                onClick={openAddModal}
              >
                <Plus className="h-3.5 w-3.5" />
                Register First Passkey
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {passkeys.map((pk) => {
                  const isMobile = pk.deviceName?.toLowerCase().includes("iphone") || pk.deviceName?.toLowerCase().includes("android")
                  const DeviceIcon = isMobile ? Smartphone : Laptop

                  return (
                    <TableRow key={pk.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2.5">
                          <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{pk.deviceName || "Unnamed passkey"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {pk.backedUp ? (
                          <Badge variant="outline" className="text-blue-500 border-blue-500/30 text-xs">
                            Synced
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-zinc-500 border-zinc-500/30 text-xs">
                            Device-bound
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(pk.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {pk.lastUsedAt
                          ? `Last used ${formatDistanceToNow(new Date(pk.lastUsedAt), { addSuffix: true })}`
                          : "Never used"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setRenameTarget({ id: pk.id, deviceName: pk.deviceName || "" })
                              setNewDeviceName(pk.deviceName || "")
                            }}
                            title="Rename"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteTarget({ id: pk.id, deviceName: pk.deviceName || "Unnamed passkey" })}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <span>
            Passkeys satisfy your organization's MFA requirements and provide cryptographic protection against phishing attacks.
          </span>
        </div>
      </CardContent>

      {/* Add Passkey Modal */}
      <Dialog open={addModalOpen} onOpenChange={(open) => !isRegistering && setAddModalOpen(open)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-primary" />
              Register a New Passkey
            </DialogTitle>
            <DialogDescription>
              Give this device or key a recognizable name to help identify it later.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                id="deviceName"
                placeholder="e.g. MacBook Touch ID, YubiKey 5C"
                value={deviceNameInput}
                onChange={(e) => setDeviceNameInput(e.target.value.slice(0, 64))}
                maxLength={64}
                disabled={isRegistering}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">Max 64 characters.</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddModalOpen(false)}
              disabled={isRegistering}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartRegistration}
              disabled={isRegistering}
              className="gap-2"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Follow Device Prompts...
                </>
              ) : (
                <>
                  <Fingerprint className="h-4 w-4" />
                  Continue & Scan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={Boolean(renameTarget)} onOpenChange={(open) => !open && setRenameTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename Passkey</DialogTitle>
            <DialogDescription>
              Update the descriptive label for this passkey.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="newDeviceName">Device Name</Label>
            <Input
              id="newDeviceName"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value.slice(0, 64))}
              maxLength={64}
              disabled={isRenaming}
              className="bg-background"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTarget(null)} disabled={isRenaming}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={isRenaming || !newDeviceName.trim()}>
              {isRenaming ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Passkey?</AlertDialogTitle>
            <AlertDialogDescription>
              You won&apos;t be able to sign in with this passkey anymore. If it&apos;s your only MFA method, you&apos;ll be prompted to enroll another one next time you sign in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete Passkey
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
