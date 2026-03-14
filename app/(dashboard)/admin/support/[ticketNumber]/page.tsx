"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { trpc } from "@/lib/trpc"
import { getErrorMessage } from "@/lib/trpc"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Send, Loader2, MessageSquare, User, Building2 } from "lucide-react"

// ─── Helpers ──────────────────────────────────────────────────────────────────

type TicketStatus = "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED"

const STATUS_STYLES: Record<TicketStatus, string> = {
  OPEN: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  AWAITING_USER: "bg-amber-50 text-amber-700 border-amber-200",
  RESOLVED: "bg-slate-50 text-slate-600 border-slate-200",
  CLOSED: "bg-gray-50 text-gray-500 border-gray-200",
}

const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  AWAITING_USER: "Awaiting Response",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
}

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-slate-50 text-slate-500 border-slate-200",
  MEDIUM: "bg-amber-50 text-amber-600 border-amber-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  URGENT: "bg-red-50 text-red-700 border-red-200",
}

function formatDate(dateStr: string | Date): string {
  return new Date(dateStr).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminTicketDetailPage() {
  const params = useParams()
  const ticketNumber = params.ticketNumber as string
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const [responseText, setResponseText] = useState("")
  const [setAwaitingUser, setSetAwaitingUser] = useState(true)
  const [newStatus, setNewStatus] = useState<TicketStatus | "">("")

  const { data: ticket, isLoading, error } = trpc.adminSupport.getByTicketNumber.useQuery(
    { ticketNumber },
    { enabled: !!ticketNumber }
  )

  const updateStatus = trpc.adminSupport.updateStatus.useMutation({
    onSuccess: () => {
      setNewStatus("")
      utils.adminSupport.getByTicketNumber.invalidate({ ticketNumber })
      toast({ title: "Status updated", description: "Ticket status has been updated." })
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Failed to update status", description: getErrorMessage(err) })
    },
  })

  const addResponse = trpc.adminSupport.addResponse.useMutation({
    onSuccess: () => {
      setResponseText("")
      utils.adminSupport.getByTicketNumber.invalidate({ ticketNumber })
      toast({ title: "Response sent", description: "Your response has been sent to the user." })
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Failed to send response", description: getErrorMessage(err) })
    },
  })

  function handleUpdateStatus() {
    if (!newStatus || !(ticket as any)?.id) return
    updateStatus.mutate({ ticketId: (ticket as any).id, status: newStatus })
  }

  function handleSendResponse() {
    if (!responseText.trim() || !(ticket as any)?.id) return
    addResponse.mutate({
      ticketId: (ticket as any).id,
      message: responseText.trim(),
      updateStatusTo: setAwaitingUser ? "AWAITING_USER" : undefined,
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-foreground">Ticket not found</p>
        <p className="mt-1 text-sm text-muted-foreground">This ticket doesn't exist.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/admin/support">Back to Support</Link>
        </Button>
      </div>
    )
  }

  const t = ticket as any

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/support" className="hover:text-foreground transition-colors">Support</Link>
        <span>/</span>
        <span className="font-mono text-foreground">{ticketNumber}</span>
      </div>

      {/* Back + title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/support">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-foreground">{t.subject}</h1>
      </div>

      {/* Ticket header */}
      <Card className="border-border/50 bg-card">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm font-semibold text-primary">{t.ticketNumber}</span>
            <Badge variant="outline" className={STATUS_STYLES[t.status as TicketStatus] ?? ""}>
              {STATUS_LABELS[t.status as TicketStatus] ?? t.status}
            </Badge>
            <Badge variant="outline" className={PRIORITY_STYLES[t.priority] ?? ""}>
              {t.priority}
            </Badge>
            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
              {String(t.category).replace(/_/g, " ")}
            </Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Opened {formatDate(t.createdAt)}</span>
            <span>·</span>
            <span>Updated {formatDate(t.updatedAt)}</span>
            {t.closedAt && (
              <>
                <span>·</span>
                <span>Closed {formatDate(t.closedAt)}</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — Description + Conversation + Response */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Description */}
          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-foreground">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">{t.description}</p>
            </CardContent>
          </Card>

          {/* Conversation */}
          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-foreground">
                <MessageSquare className="h-4 w-4" />
                Conversation
                {t.comments?.length > 0 && (
                  <span className="text-xs text-muted-foreground font-normal ml-1">
                    ({t.comments.length} comment{t.comments.length !== 1 ? "s" : ""})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {t.comments?.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No replies yet.
                </p>
              )}

              {t.comments?.map((comment: any) => {
                const isAdminComment = comment.isAdmin
                return (
                  <div
                    key={comment.id}
                    className={`rounded-lg p-4 ${
                      isAdminComment
                        ? "border-l-4 border-emerald-500 bg-emerald-50/60"
                        : "bg-muted/30 border border-border/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary uppercase">
                          {comment.user?.fullName?.split(" ").map((n: string) => n[0]).join("") ?? "?"}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {isAdminComment ? "SheriaBot Support" : (comment.user?.fullName ?? "User")}
                        </span>
                        {isAdminComment && (
                          <Badge variant="outline" className="h-4 px-1.5 py-0 text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                            Support Team
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                      {comment.message}
                    </p>
                  </div>
                )
              })}

              {/* Admin response form */}
              {t.status !== "CLOSED" && (
                <div className="space-y-3 pt-2 border-t border-border/50 mt-4">
                  <p className="text-sm font-medium text-foreground">Send Response</p>
                  <Textarea
                    placeholder="Type your response to the user…"
                    className="min-h-[120px] bg-background"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={setAwaitingUser}
                        onChange={(e) => setSetAwaitingUser(e.target.checked)}
                        className="rounded border-border"
                      />
                      Set status to &ldquo;Awaiting Response&rdquo;
                    </label>
                    <Button
                      onClick={handleSendResponse}
                      disabled={!responseText.trim() || addResponse.isPending}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {addResponse.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Response
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right — Sidebar */}
        <div className="flex flex-col gap-4">
          {/* User Info */}
          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-foreground">
                <User className="h-4 w-4" />
                Submitted By
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium text-foreground">{t.user?.fullName ?? "—"}</p>
              <p className="text-muted-foreground">{t.user?.email ?? "—"}</p>
              {t.user?.role && (
                <Badge variant="outline" className="text-[10px]">
                  {t.user.role}
                </Badge>
              )}
              {t.user?.organization?.name && (
                <div className="flex items-center gap-1.5 pt-1 text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{t.user.organization.name}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ticket Actions */}
          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-foreground">Ticket Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Update Status
                </p>
                <Select
                  value={newStatus}
                  onValueChange={(v) => setNewStatus(v as TicketStatus)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={STATUS_LABELS[t.status as TicketStatus] ?? t.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="AWAITING_USER">Awaiting Response</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                variant="outline"
                disabled={!newStatus || newStatus === t.status || updateStatus.isPending}
                onClick={handleUpdateStatus}
              >
                {updateStatus.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating…
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-foreground">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium text-foreground">{String(t.category).replace(/_/g, " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority</span>
                <Badge variant="outline" className={`text-[10px] ${PRIORITY_STYLES[t.priority] ?? ""}`}>
                  {t.priority}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Replies</span>
                <span className="font-medium text-foreground">{t.comments?.length ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Opened</span>
                <span className="text-foreground">{formatDate(t.createdAt)}</span>
              </div>
              {t.closedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Closed</span>
                  <span className="text-foreground">{formatDate(t.closedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
