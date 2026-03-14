"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { trpc } from "@/lib/trpc"
import { getErrorMessage } from "@/lib/trpc"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Send, Loader2, MessageSquare } from "lucide-react"

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

export default function TicketDetailPage() {
  const params = useParams()
  const ticketNumber = params.ticketId as string
  const { toast } = useToast()
  const authUser = useAuthStore((s) => s.user)
  const utils = trpc.useUtils()

  const [replyText, setReplyText] = useState("")

  const { data: ticket, isLoading, error } = trpc.support.getByTicketNumber.useQuery(
    { ticketNumber },
    { enabled: !!ticketNumber }
  )

  const addComment = trpc.support.addComment.useMutation({
    onSuccess: () => {
      setReplyText("")
      utils.support.getByTicketNumber.invalidate({ ticketNumber })
      toast({ title: "Reply sent", description: "Your reply has been added." })
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Failed to send reply", description: getErrorMessage(err) })
    },
  })

  function handleReply() {
    if (!replyText.trim() || !(ticket as any)?.id) return
    addComment.mutate({ ticketId: (ticket as any).id, message: replyText.trim() })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-foreground">Ticket not found</p>
        <p className="mt-1 text-sm text-muted-foreground">This ticket doesn't exist or you don't have access to it.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/support">Back to Support</Link>
        </Button>
      </div>
    )
  }

  const t = ticket as any
  const isClosed = t.status === "CLOSED"

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
        <span>/</span>
        <span className="font-mono text-foreground">{ticketNumber}</span>
      </div>

      {/* Back button */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/support">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-foreground">{t.subject}</h1>
      </div>

      {/* Ticket header card */}
      <Card className="border-border/50 bg-card">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm font-semibold text-primary">{t.ticketNumber}</span>
            <Badge variant="outline" className={`${STATUS_STYLES[t.status as TicketStatus] ?? ""}`}>
              {STATUS_LABELS[t.status as TicketStatus] ?? t.status}
            </Badge>
            <Badge variant="outline" className={`${PRIORITY_STYLES[t.priority] ?? ""}`}>
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
          </div>
        </CardContent>
      </Card>

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
              No replies yet. Be the first to respond.
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
                      {isAdminComment ? "SheriaBot Support" : (comment.user?.fullName ?? "You")}
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

          {/* Reply input */}
          {isClosed ? (
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center text-sm text-muted-foreground">
              This ticket is closed. If you need further help, please{" "}
              <Link href="/support/new" className="text-primary underline underline-offset-2 hover:no-underline">
                open a new ticket
              </Link>
              .
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <Textarea
                placeholder="Type your reply…"
                className="min-h-[100px] bg-background"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleReply}
                  disabled={!replyText.trim() || addComment.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {addComment.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
