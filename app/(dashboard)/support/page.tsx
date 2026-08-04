"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  MessageSquare,
  ChevronRight,
  HelpCircle,
  ChevronLeft,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type TicketStatus = "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED"

const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  AWAITING_USER: "Awaiting Response",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
}

const STATUS_STYLES: Record<TicketStatus, string> = {
  OPEN: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30",
  AWAITING_USER: "bg-amber-50 text-amber-700 border-amber-200",
  RESOLVED: "bg-slate-50 text-slate-600 border-slate-200",
  CLOSED: "bg-gray-50 text-gray-500 border-gray-200",
}

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-slate-50 text-slate-500 border-slate-200",
  MEDIUM: "bg-amber-50 text-amber-600 border-amber-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  URGENT: "bg-red-50 text-red-700 border-red-200",
}

function relativeTime(dateStr: string | Date): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SupportPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL")
  const [page, setPage] = useState(1)

  const { data, isLoading } = trpc.support.list.useQuery({
    status: statusFilter === "ALL" ? undefined : (statusFilter as TicketStatus),
    page,
    limit: 10,
  })

  const tickets = (data as any)?.tickets ?? []
  const total = (data as any)?.total ?? 0
  const totalPages = (data as any)?.totalPages ?? 1

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
          <p className="mt-1 text-muted-foreground">Submit and track your support requests</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/support/new">
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => { setStatusFilter(v as TicketStatus | "ALL"); setPage(1) }}
        >
          <SelectTrigger className="w-48 bg-card">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Tickets</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="AWAITING_USER">Awaiting Response</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
        {total > 0 && (
          <span className="text-sm text-muted-foreground">
            {total} ticket{total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Ticket List */}
      <Card className="border-border/50 bg-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y divide-border/50">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-4 w-72" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <HelpCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="mt-3 font-medium text-foreground">No support tickets yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Need help? Submit a ticket and our team will get back to you.
              </p>
              <Button asChild className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/support/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Submit a Ticket
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {tickets.map((ticket: any) => (
                <button
                  key={ticket.id}
                  className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/30"
                  onClick={() => router.push(`/support/${ticket.ticketNumber}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {ticket.ticketNumber}
                      </span>
                      <Badge
                        variant="outline"
                        className={`h-4 px-1.5 py-0 text-[10px] ${STATUS_STYLES[ticket.status as TicketStatus] ?? ""}`}
                      >
                        {STATUS_LABELS[ticket.status as TicketStatus] ?? ticket.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`h-4 px-1.5 py-0 text-[10px] ${PRIORITY_STYLES[ticket.priority] ?? ""}`}
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate font-medium text-foreground">{ticket.subject}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{String(ticket.category).replace(/_/g, " ")}</span>
                      <span>·</span>
                      <span>{relativeTime(ticket.updatedAt)}</span>
                      {(ticket._count?.comments ?? 0) > 0 && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {ticket._count.comments}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
