"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { trpc } from "@/lib/trpc"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Send,
  XCircle,
  Megaphone,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BarChart2,
  Mail,
  Loader2,
  Ban,
  Copy,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "SENDING"
  | "SENT"
  | "PARTIALLY_SENT"
  | "FAILED"
  | "CANCELLED"

type SendStatus =
  | "SENT"
  | "FAILED"
  | "SUPPRESSED_SKIPPED"
  | "NO_CONSENT_SKIPPED"

type DuplicateCampaignResult = { id: string }
type MutationError = { message?: string }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ASYNC_THRESHOLD = 25

function statusBadge(status: CampaignStatus) {
  const map: Record<CampaignStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    DRAFT:          { label: "Draft",          variant: "secondary" },
    SCHEDULED:      { label: "Scheduled",      variant: "outline" },
    SENDING:        { label: "Sending…",       variant: "default" },
    SENT:           { label: "Sent",           variant: "default" },
    PARTIALLY_SENT: { label: "Partially Sent", variant: "outline" },
    FAILED:         { label: "Failed",         variant: "destructive" },
    CANCELLED:      { label: "Cancelled",      variant: "secondary" },
  }
  const { label, variant } = map[status] ?? { label: status, variant: "secondary" }
  return <Badge variant={variant}>{label}</Badge>
}

function sendStatusBadge(status: SendStatus) {
  const map: Record<SendStatus, { label: string; className: string }> = {
    SENT:               { label: "Sent",           className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    FAILED:             { label: "Failed",         className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    SUPPRESSED_SKIPPED: { label: "Suppressed",     className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    NO_CONSENT_SKIPPED: { label: "No Consent",     className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
  }
  const { label, className } = map[status] ?? { label: status, className: "" }
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>{label}</span>
}

function formatDate(d: string | Date | null | undefined): string {
  if (!d) return "—"
  return new Date(d).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

// ---------------------------------------------------------------------------
// Send Confirmation Dialog
// ---------------------------------------------------------------------------

interface SendDialogProps {
  open:       boolean
  onClose:    () => void
  campaignId: string
  onSuccess:  () => void
}

function SendConfirmationDialog({ open, onClose, campaignId, onSuccess }: SendDialogProps) {
  // Step 1: preview; Step 2: final confirm
  const [step, setStep] = useState<1 | 2>(1)
  const [confirmationToken, setConfirmationToken] = useState<string | null>(null)
  const [recipientCount, setRecipientCount]       = useState<number>(0)
  const [estimatedSecs, setEstimatedSecs]         = useState<number>(0)
  const [expiresAt, setExpiresAt]                 = useState<Date | null>(null)

  const utils = trpc.useUtils()

  const requestConfirm = trpc.adminMarketing.campaigns.requestSendConfirmation.useMutation({
    onSuccess: (data) => {
      if (!data) return
      setConfirmationToken(data.confirmationToken)
      setRecipientCount(data.recipientCount)
      setEstimatedSecs(data.estimatedDurationSeconds)
      setExpiresAt(new Date(data.expiresAt))
      setStep(2)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const executeSend = trpc.adminMarketing.campaigns.executeSend.useMutation({
    onSuccess: (data) => {
      if (!data) return
      toast.success(
        `Campaign sent. ${data.sent} sent, ${data.skipped} skipped, ${data.failed} failed.`
      )
      utils.adminMarketing.campaigns.getById.invalidate({ id: campaignId })
      utils.adminMarketing.campaigns.getStats.invalidate({ campaignId })
      utils.adminMarketing.campaigns.getRecentSends.invalidate({ campaignId })
      onSuccess()
      handleClose()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  function handleClose() {
    setStep(1)
    setConfirmationToken(null)
    setRecipientCount(0)
    onClose()
  }

  const isAsync   = recipientCount > ASYNC_THRESHOLD
  const overLimit = false // B3: no hard cap — async handles large lists

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="sm:max-w-md">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Send Campaign
              </DialogTitle>
              <DialogDescription>
                This will resolve the recipient list and show you a preview before sending.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleClose} disabled={requestConfirm.isPending}>
                Cancel
              </Button>
              <Button
                onClick={() => requestConfirm.mutate({ campaignId })}
                disabled={requestConfirm.isPending}
              >
                {requestConfirm.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Resolving…</>
                ) : (
                  "Continue"
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Confirm Send
              </DialogTitle>
              <DialogDescription>
                Review the details below before sending. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 my-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recipients</span>
                <span className="font-medium">{recipientCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated time</span>
                <span className="font-medium">~{estimatedSecs}s</span>
              </div>
              {expiresAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confirmation expires</span>
                  <span className="font-medium">{formatDate(expiresAt)}</span>
                </div>
              )}
            </div>

            {isAsync && (
              <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  This campaign will be sent asynchronously to {recipientCount} contacts. Sends will be processed in batches over the next few minutes. You can monitor progress on this page.
                </span>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={executeSend.isPending}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!confirmationToken) return
                  executeSend.mutate({
                    campaignId,
                    confirmationToken,
                    confirmedRecipientCount: recipientCount,
                  })
                }}
                disabled={executeSend.isPending || overLimit || !confirmationToken}
                className="bg-primary"
              >
                {executeSend.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending…</>
                ) : (
                  `Send ${recipientCount} email${recipientCount !== 1 ? "s" : ""} now`
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Async Progress Card (B3-7)
// ---------------------------------------------------------------------------

type JobStatus = "QUEUED" | "RUNNING" | "COMPLETED" | "PARTIALLY_COMPLETED" | "FAILED" | "CANCELLED"

const TERMINAL_JOB_STATUSES: JobStatus[] = ["COMPLETED", "PARTIALLY_COMPLETED", "FAILED", "CANCELLED"]

function AsyncProgressCard({ campaignId }: { campaignId: string }) {
  const utils = trpc.useUtils()

  const { data: job } = trpc.adminMarketing.campaigns.getJobStatus.useQuery(
    { campaignId },
    {
      refetchInterval: (query) => {
        const status = query.state.data?.status as JobStatus | undefined
        if (status && TERMINAL_JOB_STATUSES.includes(status)) return false
        return 5000
      },
    },
  )

  // When job reaches terminal state, refresh campaign data
  if (job && TERMINAL_JOB_STATUSES.includes(job.status as JobStatus)) {
    void utils.adminMarketing.campaigns.getById.invalidate({ id: campaignId })
    void utils.adminMarketing.campaigns.getStats.invalidate({ campaignId })
  }

  if (!job) return null

  const pct = job.totalContacts > 0
    ? Math.round((job.processed / job.totalContacts) * 100)
    : 0

  const isTerminal = TERMINAL_JOB_STATUSES.includes(job.status as JobStatus)

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {isTerminal ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          )}
          Async Send Progress
          <span className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            job.status === "COMPLETED" ? "bg-green-100 text-green-700" :
            job.status === "PARTIALLY_COMPLETED" ? "bg-orange-100 text-orange-700" :
            job.status === "FAILED" ? "bg-red-100 text-red-700" :
            "bg-blue-100 text-blue-700"
          }`}>{job.status.replace("_", " ")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{job.processed} / {job.totalContacts} processed</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-blue-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        {/* Counts */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">{job.succeeded}</p>
            <p className="text-xs text-muted-foreground">Succeeded</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-orange-500">{job.skipped}</p>
            <p className="text-xs text-muted-foreground">Skipped</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-500">{job.failed}</p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
        </div>
        {job.errorMessage && (
          <p className="text-xs text-red-600 bg-red-50 rounded p-2">{job.errorMessage}</p>
        )}
        {!isTerminal && (
          <p className="text-xs text-muted-foreground">Refreshing every 5 seconds…</p>
        )}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function CampaignDetailPage() {
  const params   = useParams<{ id: string }>()
  const router   = useRouter()
  const id       = params.id
  const utils    = trpc.useUtils()

  const [sendDialogOpen, setSendDialogOpen] = useState(false)

  // ── Duplicate mutation ────────────────────────────────────────────────────
  const duplicateMutation = (trpc.adminMarketing.campaigns.duplicate.useMutation as unknown as (options: {
    onSuccess: (data: DuplicateCampaignResult) => void
    onError: (err: MutationError) => void
  }) => { mutate: (input: { campaignId: string }) => void; isPending: boolean })({
    onSuccess: (data) => {
      toast.success("Campaign duplicated as DRAFT")
      router.push(`/admin/marketing/campaigns/${data.id}`)
    },
    onError: (err) => toast.error(err.message ?? "Failed to duplicate campaign."),
  })

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data: campaign, isLoading: campaignLoading } =
    trpc.adminMarketing.campaigns.getById.useQuery({ id })

  const { data: stats, isLoading: statsLoading } =
    trpc.adminMarketing.campaigns.getStats.useQuery(
      { campaignId: id },
      { enabled: !!campaign },
    )

  const { data: recentSends, isLoading: sendsLoading } =
    trpc.adminMarketing.campaigns.getRecentSends.useQuery(
      { campaignId: id, take: 50 },
      { enabled: !!campaign },
    )

  // ── Mutations ─────────────────────────────────────────────────────────────
  const cancelMutation = trpc.adminMarketing.campaigns.cancel.useMutation({
    onSuccess: () => {
      toast.success("Campaign cancelled.")
      utils.adminMarketing.campaigns.getById.invalidate({ id })
    },
    onError: (err) => toast.error(err.message),
  })

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (campaignLoading) {
    return (
      <div className="container py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Campaign not found.</p>
        <Button variant="link" onClick={() => router.push("/admin/marketing/campaigns")}>
          ← Back to campaigns
        </Button>
      </div>
    )
  }

  const canSend   = campaign.status === "DRAFT" || campaign.status === "SCHEDULED"
  const canCancel = campaign.status === "DRAFT" || campaign.status === "SCHEDULED"

  return (
    <div className="container py-8 space-y-6">
      {/* ── Header row ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/marketing/campaigns"
            className="mt-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-semibold">{campaign.name}</h1>
              {statusBadge(campaign.status as CampaignStatus)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{campaign.subject}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => duplicateMutation.mutate({ campaignId: id })}
            disabled={duplicateMutation.isPending}
          >
            {duplicateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <><Copy className="h-4 w-4 mr-1.5" />Duplicate</>
            )}
          </Button>
          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => cancelMutation.mutate({ campaignId: id })}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <><XCircle className="h-4 w-4 mr-1.5" />Cancel</>
              )}
            </Button>
          )}
          {canSend && (
            <Button
              size="sm"
              onClick={() => setSendDialogOpen(true)}
              className="bg-primary"
            >
              <Send className="h-4 w-4 mr-1.5" />
              Send Campaign
            </Button>
          )}
        </div>
      </div>

      {/* ── Stats grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Recipients</p>
                {statsLoading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.totalRecipients ?? 0}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Sent</p>
                {statsLoading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.totalSent ?? 0}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BarChart2 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Open Rate</p>
                {statsLoading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">
                    {stats && stats.totalSent > 0
                      ? `${Math.round((stats.totalOpened / stats.totalSent) * 100)}%`
                      : "—"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Async send progress card (shown when SENDING) ──────────────── */}
      {campaign.status === "SENDING" && (
        <AsyncProgressCard campaignId={id} />
      )}

      {/* ── Two-column layout ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Campaign metadata */}
        <Card className="border-border/50 bg-card/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Template</span>
              <span className="font-medium font-mono text-xs">{campaign.templateKey}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">List ID</span>
              <span className="font-medium font-mono text-xs truncate max-w-[140px]">{campaign.listId ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">{formatDate(campaign.createdAt)}</span>
            </div>
            {campaign.sentAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sent at</span>
                <span className="font-medium">{formatDate(campaign.sentAt)}</span>
              </div>
            )}
            {campaign.scheduledFor && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scheduled for</span>
                <span className="font-medium">{formatDate(campaign.scheduledFor)}</span>
              </div>
            )}
            {campaign.errorMessage && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
                {campaign.errorMessage}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="stats">
            <TabsList className="mb-4">
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="sends">Recent Sends</TabsTrigger>
            </TabsList>

            {/* Stats tab */}
            <TabsContent value="stats">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base">Delivery Stats</CardTitle>
                  <CardDescription>Aggregated from Resend webhook events</CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="space-y-2">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-5 w-full" />
                      ))}
                    </div>
                  ) : stats ? (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                      {[
                        { label: "Delivered",        value: stats.totalDelivered },
                        { label: "Opened",           value: stats.totalOpened },
                        { label: "Clicked",          value: stats.totalClicked },
                        { label: "Bounced",          value: stats.totalBounced },
                        { label: "Unsubscribed",     value: stats.totalUnsubscribed },
                        { label: "Complained",       value: stats.totalComplained },
                        { label: "Suppressed skip",  value: stats.totalSuppressedSkip },
                        { label: "No consent skip",  value: stats.totalNoConsentSkip },
                        { label: "Failed",           value: stats.totalFailed },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between border-b border-border/30 pb-1">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No stats available yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recent Sends tab */}
            <TabsContent value="sends">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base">Recent Sends</CardTitle>
                  <CardDescription>Last 50 individual send records</CardDescription>
                </CardHeader>
                <CardContent>
                  {sendsLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))}
                    </div>
                  ) : recentSends && recentSends.length > 0 ? (
                    <div className="space-y-2">
                      {recentSends.map((send: NonNullable<typeof recentSends>[number]) => (
                        <div
                          key={send.id}
                          className="flex items-center justify-between rounded-lg border border-border/30 px-3 py-2 text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {send.contact?.firstName
                                  ? `${send.contact.firstName} ${send.contact.lastName ?? ""}`.trim()
                                  : send.contactId}
                              </p>
                              {send.errorMessage && (
                                <p className="text-xs text-destructive truncate">{send.errorMessage}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 ml-2">
                            {send.sentAt && (
                              <span className="text-xs text-muted-foreground hidden sm:block">
                                {formatDate(send.sentAt)}
                              </span>
                            )}
                            {sendStatusBadge(send.status as SendStatus)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No sends recorded yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ── Send confirmation dialog ────────────────────────────────────── */}
      <SendConfirmationDialog
        open={sendDialogOpen}
        onClose={() => setSendDialogOpen(false)}
        campaignId={id}
        onSuccess={() => setSendDialogOpen(false)}
      />
    </div>
  )
}
