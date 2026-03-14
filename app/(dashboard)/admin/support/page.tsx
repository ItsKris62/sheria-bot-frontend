"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Ticket,
  Search,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Clock,
  CheckCircle2,
  MessageSquare,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type TicketStatus = "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED"
type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  AWAITING_USER: "Awaiting Response",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
}

const STATUS_STYLES: Record<TicketStatus, string> = {
  OPEN: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  AWAITING_USER: "bg-amber-50 text-amber-700 border-amber-200",
  RESOLVED: "bg-slate-50 text-slate-600 border-slate-200",
  CLOSED: "bg-gray-50 text-gray-500 border-gray-200",
}

const PRIORITY_STYLES: Record<TicketPriority, string> = {
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

export default function AdminSupportPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL")
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "ALL">("ALL")
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)

  const { data: statsData, isLoading: statsLoading } = trpc.adminSupport.stats.useQuery()
  const stats = statsData as any

  const { data, isLoading } = trpc.adminSupport.list.useQuery({
    status: statusFilter === "ALL" ? undefined : (statusFilter as TicketStatus),
    priority: priorityFilter === "ALL" ? undefined : (priorityFilter as TicketPriority),
    category: categoryFilter === "ALL" ? undefined : (categoryFilter as any),
    search: debouncedSearch || undefined,
    page,
    limit: 20,
  })

  const tickets = (data as any)?.tickets ?? []
  const total = (data as any)?.total ?? 0
  const totalPages = (data as any)?.totalPages ?? 1

  function handleSearchChange(val: string) {
    setSearch(val)
    clearTimeout((handleSearchChange as any)._t)
    ;(handleSearchChange as any)._t = setTimeout(() => {
      setDebouncedSearch(val)
      setPage(1)
    }, 400)
  }

  const statCards = [
    {
      label: "Open",
      value: stats?.open ?? 0,
      icon: <Ticket className="h-5 w-5 text-blue-500" />,
      color: "text-blue-700",
    },
    {
      label: "In Progress",
      value: stats?.inProgress ?? 0,
      icon: <Clock className="h-5 w-5 text-emerald-500" />,
      color: "text-emerald-700",
    },
    {
      label: "Urgent",
      value: stats?.urgent ?? 0,
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      color: "text-red-700",
    },
    {
      label: "Total",
      value: (stats?.open ?? 0) + (stats?.inProgress ?? 0) + (stats?.awaitingUser ?? 0) + (stats?.resolved ?? 0) + (stats?.closed ?? 0),
      icon: <CheckCircle2 className="h-5 w-5 text-muted-foreground" />,
      color: "text-foreground",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
        <p className="mt-1 text-muted-foreground">Manage and respond to user support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label} className="border-border/50 bg-card">
            <CardContent className="flex items-center gap-3 p-4">
              {statsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {card.icon}
                  </div>
                  <div>
                    <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ticket #, subject, user…"
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => { setStatusFilter(v as TicketStatus | "ALL"); setPage(1) }}
        >
          <SelectTrigger className="w-44 bg-card">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="AWAITING_USER">Awaiting Response</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={priorityFilter}
          onValueChange={(v) => { setPriorityFilter(v as TicketPriority | "ALL"); setPage(1) }}
        >
          <SelectTrigger className="w-36 bg-card">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Priorities</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={categoryFilter}
          onValueChange={(v) => { setCategoryFilter(v); setPage(1) }}
        >
          <SelectTrigger className="w-44 bg-card">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="TECHNICAL">Technical</SelectItem>
            <SelectItem value="BILLING">Billing</SelectItem>
            <SelectItem value="COMPLIANCE_QUERY">Compliance Query</SelectItem>
            <SelectItem value="ACCOUNT">Account</SelectItem>
            <SelectItem value="FEATURE_REQUEST">Feature Request</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
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
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-4 w-72" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Ticket className="h-12 w-12 text-muted-foreground/40" />
              <p className="mt-3 font-medium text-foreground">No tickets found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {statusFilter !== "ALL" || priorityFilter !== "ALL" || categoryFilter !== "ALL" || debouncedSearch
                  ? "Try adjusting your filters."
                  : "No support tickets have been submitted yet."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {tickets.map((ticket: any) => (
                <button
                  key={ticket.id}
                  className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/30"
                  onClick={() => router.push(`/admin/support/${ticket.ticketNumber}`)}
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
                        className={`h-4 px-1.5 py-0 text-[10px] ${PRIORITY_STYLES[ticket.priority as TicketPriority] ?? ""}`}
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate font-medium text-foreground">{ticket.subject}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {ticket.user?.fullName && (
                        <span className="font-medium text-foreground/70">{ticket.user.fullName}</span>
                      )}
                      {ticket.user?.email && (
                        <>
                          <span>·</span>
                          <span>{ticket.user.email}</span>
                        </>
                      )}
                      <span>·</span>
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
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
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
