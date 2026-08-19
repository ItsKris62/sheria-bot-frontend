"use client"

import { useMemo, useState } from "react"
import { format, formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  MailPlus,
  RotateCw,
  Shield,
  Trash2,
  UserMinus,
  UserRoundCheck,
  Users,
  XCircle,
} from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getErrorMessage, trpc } from "@/lib/trpc"

type OrgRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
type MemberStatus = "ACTIVE" | "SUSPENDED" | "INVITED" | "REMOVED"

type TeamMember = {
  id: string
  name: string
  email: string
  role: OrgRole
  orgRole: OrgRole
  platformRole: string
  status: MemberStatus
  joinedAt: string | Date
  lastActive: string | Date | null
  totpEnabled: boolean
}

type PendingInvitation = {
  id: string
  email: string
  organizationRole: OrgRole | null
  expiresAt: string | Date
  createdAt: string | Date
}

const roleLabels: Record<OrgRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
  VIEWER: "Viewer",
}

const statusStyles: Record<MemberStatus, string> = {
  ACTIVE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  SUSPENDED: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  INVITED: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  REMOVED: "border-muted bg-muted text-muted-foreground",
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Never"
  return format(new Date(value), "dd MMM yyyy")
}

function formatRelative(value: string | Date | null | undefined) {
  if (!value) return "Never"
  return formatDistanceToNow(new Date(value), { addSuffix: true })
}

function roleForMutation(role: OrgRole): "ADMIN" | "MEMBER" | "VIEWER" {
  return role === "ADMIN" ? "ADMIN" : role === "VIEWER" ? "VIEWER" : "MEMBER"
}

export default function TeamSettingsPage() {
  const utils = trpc.useUtils()
  const teamQuery = trpc.organization.getTeamOverview.useQuery()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER" | "VIEWER">("MEMBER")
  const [pendingAction, setPendingAction] = useState<
    | { kind: "remove"; userId: string; label: string }
    | { kind: "suspend"; userId: string; label: string }
    | { kind: "reactivate"; userId: string; label: string }
    | { kind: "revoke-invite"; invitationId: string; label: string }
    | null
  >(null)

  const invalidate = () => {
    void utils.organization.getTeamOverview.invalidate()
    void utils.organization.getSeatUsage.invalidate()
    void utils.organization.listPendingInvitations.invalidate()
    void utils.organization.getActivityLog.invalidate()
    void utils.organization.getSecurityCenter.invalidate()
  }

  const createInvitation = trpc.organization.createInvitation.useMutation({
    onSuccess: () => {
      toast.success("Invitation sent")
      setInviteEmail("")
      setInviteRole("MEMBER")
      setInviteOpen(false)
      invalidate()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const updateRole = trpc.organization.updateMemberRole.useMutation({
    onSuccess: (result) => {
      toast.success(result.message)
      invalidate()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const removeMember = trpc.organization.removeMember.useMutation({
    onSuccess: () => {
      toast.success("Member removed")
      setPendingAction(null)
      invalidate()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const suspendMember = trpc.organization.suspendMember.useMutation({
    onSuccess: (result) => {
      toast.success(result.message)
      setPendingAction(null)
      invalidate()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const reactivateMember = trpc.organization.reactivateMember.useMutation({
    onSuccess: (result) => {
      toast.success(result.message)
      setPendingAction(null)
      invalidate()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const resendInvitation = trpc.organization.resendInvitation.useMutation({
    onSuccess: () => {
      toast.success("Invitation resent")
      invalidate()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const revokeInvitation = trpc.organization.revokeInvitation.useMutation({
    onSuccess: () => {
      toast.success("Invitation revoked")
      setPendingAction(null)
      invalidate()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const data = teamQuery.data
  const members = useMemo(() => (data?.members ?? []) as TeamMember[], [data?.members])
  const pendingInvitations = useMemo(
    () => (data?.pendingInvitations ?? []) as PendingInvitation[],
    [data?.pendingInvitations]
  )
  const canManage = Boolean(data?.canManageMembers)
  const seatLimit = data?.seatUsage.seatLimit ?? 0
  const usedSeats = data?.seatUsage.usedSeats ?? 0
  const availableSeats = data?.seatUsage.availableSeats ?? 0
  const seatsFull = seatLimit !== -1 && availableSeats <= 0

  const activeMembers = useMemo(() => members.filter((member) => member.status === "ACTIVE"), [members])
  const suspendedMembers = useMemo(() => members.filter((member) => member.status === "SUSPENDED"), [members])

  const confirmAction = () => {
    if (!pendingAction || !data?.organization.id) return

    if (pendingAction.kind === "remove") {
      removeMember.mutate({ organizationId: data.organization.id, userId: pendingAction.userId })
    }
    if (pendingAction.kind === "suspend") {
      suspendMember.mutate({ organizationId: data.organization.id, userId: pendingAction.userId })
    }
    if (pendingAction.kind === "reactivate") {
      reactivateMember.mutate({ organizationId: data.organization.id, userId: pendingAction.userId })
    }
    if (pendingAction.kind === "revoke-invite") {
      revokeInvitation.mutate({ invitationId: pendingAction.invitationId })
    }
  }

  if (teamQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, index) => <Skeleton key={index} className="h-28 rounded-lg" />)}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    )
  }

  if (teamQuery.isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {getErrorMessage(teamQuery.error)}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team</h1>
          <p className="mt-1 text-muted-foreground">
            {data?.organization.name} shares one Business compliance workspace.
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setInviteOpen(true)} disabled={seatsFull || createInvitation.isPending}>
            <MailPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        )}
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Business</CardTitle>
              <CardDescription>
                {seatLimit === -1 ? `${usedSeats} seats used` : `${usedSeats} of ${seatLimit} seats used`}
              </CardDescription>
            </div>
            <Badge variant="outline" className="w-fit">
              {availableSeats === -1 ? "Unlimited seats available" : `${availableSeats} seats available`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-md border border-border/50 bg-muted/30 p-3">
              <p className="text-sm text-muted-foreground">Active members</p>
              <p className="mt-1 text-2xl font-semibold">{data?.memberCounts.active ?? activeMembers.length}</p>
            </div>
            <div className="rounded-md border border-border/50 bg-muted/30 p-3">
              <p className="text-sm text-muted-foreground">Suspended members</p>
              <p className="mt-1 text-2xl font-semibold">{data?.memberCounts.suspended ?? suspendedMembers.length}</p>
            </div>
            <div className="rounded-md border border-border/50 bg-muted/30 p-3">
              <p className="text-sm text-muted-foreground">Pending invitations</p>
              <p className="mt-1 text-2xl font-semibold">{pendingInvitations.length}</p>
            </div>
            <div className="rounded-md border border-border/50 bg-muted/30 p-3">
              <p className="text-sm text-muted-foreground">Total capacity</p>
              <p className="mt-1 text-2xl font-semibold">{seatLimit === -1 ? "Unlimited" : seatLimit}</p>
            </div>
          </div>
          {seatsFull && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>All Business seats are currently used. Remove a member or revoke a pending invite before inviting another user.</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Members
          </CardTitle>
          <CardDescription>Active and suspended organization members</CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No members are visible for this organization yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Organization role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last active</TableHead>
                  <TableHead>MFA</TableHead>
                  {canManage && <TableHead className="w-[220px]">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => {
                  const isOwner = member.role === "OWNER"
                  return (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name || "Unnamed member"}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        {canManage && !isOwner && member.status === "ACTIVE" ? (
                          <Select
                            value={roleForMutation(member.role)}
                            onValueChange={(value: "ADMIN" | "MEMBER" | "VIEWER") =>
                              updateRole.mutate({ organizationId: data!.organization.id, userId: member.id, role: value })
                            }
                            disabled={updateRole.isPending}
                          >
                            <SelectTrigger className="h-9 w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="MEMBER">Member</SelectItem>
                              <SelectItem value="VIEWER">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          roleLabels[member.role]
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusStyles[member.status]}>
                          {member.status.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(member.joinedAt)}</TableCell>
                      <TableCell>{formatRelative(member.lastActive)}</TableCell>
                      <TableCell>
                        {member.totpEnabled ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" /> Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <XCircle className="h-4 w-4" /> Off
                          </span>
                        )}
                      </TableCell>
                      {canManage && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {member.status === "ACTIVE" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPendingAction({ kind: "suspend", userId: member.id, label: member.email })}
                                disabled={suspendMember.isPending}
                              >
                                <UserMinus className="h-4 w-4" />
                                <span className="sr-only">Suspend</span>
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPendingAction({ kind: "reactivate", userId: member.id, label: member.email })}
                                disabled={reactivateMember.isPending}
                              >
                                <UserRoundCheck className="h-4 w-4" />
                                <span className="sr-only">Reactivate</span>
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-destructive/30 text-destructive"
                              onClick={() => setPendingAction({ kind: "remove", userId: member.id, label: member.email })}
                              disabled={removeMember.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Pending Invitations
          </CardTitle>
          <CardDescription>Pending invitations reserve seats until accepted, expired, or revoked</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingInvitations.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              There are no pending invitations.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Invited</TableHead>
                  <TableHead>Expires</TableHead>
                  {canManage && <TableHead className="w-[180px]">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInvitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{invitation.email}</TableCell>
                    <TableCell>{roleLabels[invitation.organizationRole ?? "MEMBER"]}</TableCell>
                    <TableCell>{formatDate(invitation.createdAt)}</TableCell>
                    <TableCell>{formatRelative(invitation.expiresAt)}</TableCell>
                    {canManage && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resendInvitation.mutate({ invitationId: invitation.id, expiresInDays: 7 })}
                            disabled={resendInvitation.isPending}
                          >
                            <RotateCw className="h-4 w-4" />
                            <span className="sr-only">Resend</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive/30 text-destructive"
                            onClick={() => setPendingAction({ kind: "revoke-invite", invitationId: invitation.id, label: invitation.email })}
                            disabled={revokeInvitation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Revoke</span>
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {!canManage && (
        <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 p-4 text-sm text-muted-foreground">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>Your organization role can view team information but cannot manage members or invitations.</span>
        </div>
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Pending invitations count toward the {seatLimit === -1 ? "available" : seatLimit} Business seats.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="name@company.co.ke"
              />
            </div>
            <div className="space-y-2">
              <Label>Organization role</Label>
              <Select value={inviteRole} onValueChange={(value: "ADMIN" | "MEMBER" | "VIEWER") => setInviteRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="VIEWER">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createInvitation.mutate({ email: inviteEmail, role: inviteRole, expiresInDays: 7 })}
              disabled={!inviteEmail || createInvitation.isPending || seatsFull}
            >
              {createInvitation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailPlus className="mr-2 h-4 w-4" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(pendingAction)} onOpenChange={(open) => !open && setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.kind === "remove" && "Remove member?"}
              {pendingAction?.kind === "suspend" && "Suspend member?"}
              {pendingAction?.kind === "reactivate" && "Reactivate member?"}
              {pendingAction?.kind === "revoke-invite" && "Revoke invitation?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action applies to {pendingAction?.label}. The backend will block changes that would leave the organization without an active owner.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction} className={pendingAction?.kind === "reactivate" ? "" : "bg-destructive hover:bg-destructive/90"}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
