"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { trpc } from "@/lib/trpc"
import { getErrorMessage } from "@/lib/trpc"
import { FeatureGate } from "@/components/plan/feature-gate"
import { useAuthStore } from "@/lib/auth-store"
import { UploadDocumentModal } from "@/components/vault/upload-document-modal"
import { EditDocumentModal } from "@/components/vault/edit-document-modal"
import { DocumentDetailPanel } from "@/components/vault/document-detail-panel"
import {
  Upload,
  Search,
  FileText,
  Folder,
  Download,
  Eye,
  Trash2,
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Grid,
  List,
  Edit2,
  RefreshCw,
  ShieldCheck,
  XCircle,
  Loader2,
  ImageIcon,
  FileSpreadsheet,
  ChevronDown,
  AlertCircle,
} from "lucide-react"

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  CORPORATE: { label: "Corporate", icon: Folder, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20" },
  COMPLIANCE: { label: "Compliance", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
  FINANCIAL: { label: "Financial", icon: FileText, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
  LICENSE: { label: "License", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20" },
  OPERATIONS: { label: "Operations", icon: Folder, color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/20" },
  TAX: { label: "Tax", icon: FileText, color: "text-rose-600", bg: "bg-rose-100 dark:bg-rose-900/20" },
  OTHER: { label: "Other", icon: Folder, color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-900/20" },
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  VERIFIED: { label: "Verified", icon: CheckCircle2, className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400" },
  PENDING: { label: "Pending", icon: Clock, className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400" },
  EXPIRED: { label: "Expired", icon: AlertTriangle, className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400" },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function isExpiringSoon(expiryDate: Date | null | undefined, status: string): boolean {
  if (!expiryDate || status === "EXPIRED") return false
  const thirtyDays = 30 * 24 * 60 * 60 * 1000
  const t = new Date(expiryDate).getTime()
  return t - Date.now() <= thirtyDays && t > Date.now()
}

function FileTypeIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  if (mimeType.startsWith("image/")) return <ImageIcon className={className} />
  if (
    mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType === "text/csv"
  ) {
    return <FileSpreadsheet className={className} />
  }
  return <FileText className={className} />
}

// ─── Inferred document type from tRPC ─────────────────────────────────────────

type VaultDoc = {
  id: string
  name: string
  description: string | null
  fileName: string
  fileType: string
  fileExtension: string
  fileSize: number
  storageKey: string
  category: "CORPORATE" | "COMPLIANCE" | "FINANCIAL" | "LICENSE" | "OPERATIONS" | "TAX" | "OTHER"
  status: "PENDING" | "VERIFIED" | "EXPIRED"
  expiryDate: Date | null
  verifiedAt: Date | null
  verifiedBy: string | null
  uploadedById: string
  organizationId: string
  tags: string[]
  version: number
  isArchived: boolean
  notes: string | null
  createdAt: Date
  updatedAt: Date
  uploadedBy: { id: string; fullName: string; email: string }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DocumentRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <Skeleton className="h-4 w-48 max-w-full" />
          <Skeleton className="h-3 w-32 max-w-full" />
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  const user = useAuthStore((s) => s.user)

  // ── Filter / sort state ──────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "fileSize" | "expiryDate">("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  // Debounce search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearch(value), 300)
  }, [])

  // ── Pagination ──────────────────────────────────────────────────────────
  const [page, setPage] = useState(1)
  const LIMIT = 20

  // ── Modal / panel state ─────────────────────────────────────────────────
  const [uploadOpen, setUploadOpen] = useState(false)
  const [editDoc, setEditDoc] = useState<VaultDoc | null>(null)
  const [detailDoc, setDetailDoc] = useState<VaultDoc | null>(null)
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<VaultDoc | null>(null)
  const [verifyConfirmDoc, setVerifyConfirmDoc] = useState<VaultDoc | null>(null)
  const [expireConfirmDoc, setExpireConfirmDoc] = useState<VaultDoc | null>(null)

  // ── tRPC queries ─────────────────────────────────────────────────────────
  const utils = trpc.useUtils()

  const statsQuery = trpc.vault.getStats.useQuery(undefined, {
    enabled: !!user,
    staleTime: 30_000,
  })

  const listQuery = trpc.vault.list.useQuery(
    {
      page,
      limit: LIMIT,
      category: categoryFilter !== "ALL" ? (categoryFilter as VaultDoc["category"]) : undefined,
      status: statusFilter !== "ALL" ? (statusFilter as VaultDoc["status"]) : undefined,
      search: search || undefined,
      sortBy,
      sortOrder,
    },
    {
      enabled: !!user,
      keepPreviousData: true,
    }
  )

  // ── Mutations ────────────────────────────────────────────────────────────
  const getDownloadUrl = trpc.vault.getDownloadUrl.useMutation()
  const updateStatus = trpc.vault.updateStatus.useMutation()
  const deleteMutation = trpc.vault.delete.useMutation()

  function invalidateAll() {
    utils.vault.list.invalidate()
    utils.vault.getStats.invalidate()
  }

  // ── Action handlers ──────────────────────────────────────────────────────

  async function handleDownload(doc: VaultDoc) {
    try {
      const { downloadUrl } = await getDownloadUrl.mutateAsync({ id: doc.id })
      window.open(downloadUrl, "_blank", "noopener,noreferrer")
    } catch (err) {
      toast({ title: "Download failed", description: getErrorMessage(err), variant: "destructive" })
    }
  }

  async function handleVerify(doc: VaultDoc) {
    try {
      await updateStatus.mutateAsync({ id: doc.id, status: "VERIFIED" })
      toast({ title: "Document verified", description: `"${doc.name}" has been marked as verified.` })
      invalidateAll()
    } catch (err) {
      toast({ title: "Verification failed", description: getErrorMessage(err), variant: "destructive" })
    } finally {
      setVerifyConfirmDoc(null)
    }
  }

  async function handleMarkExpired(doc: VaultDoc) {
    try {
      await updateStatus.mutateAsync({ id: doc.id, status: "EXPIRED" })
      toast({ title: "Document marked expired", description: `"${doc.name}" has been marked as expired.` })
      invalidateAll()
    } catch (err) {
      toast({ title: "Update failed", description: getErrorMessage(err), variant: "destructive" })
    } finally {
      setExpireConfirmDoc(null)
    }
  }

  async function handleDelete(doc: VaultDoc) {
    try {
      await deleteMutation.mutateAsync({ id: doc.id })
      toast({ title: "Document deleted", description: `"${doc.name}" has been removed from your vault.` })
      invalidateAll()
    } catch (err) {
      toast({ title: "Delete failed", description: getErrorMessage(err), variant: "destructive" })
    } finally {
      setDeleteConfirmDoc(null)
    }
  }

  // ── Category card click (filter list below) ──────────────────────────────
  function handleCategoryCardClick(cat: string) {
    setCategoryFilter((prev) => (prev === cat ? "ALL" : cat))
    setPage(1)
  }

  // ── Derived ──────────────────────────────────────────────────────────────
  const canChangeStatus =
    user?.role === "ADMIN" || user?.role === "REGULATOR"

  const documents = (listQuery.data?.documents ?? []) as VaultDoc[]
  const pagination = listQuery.data?.pagination
  const stats = statsQuery.data

  const displayedCategoryCards = [
    { key: "CORPORATE", label: "Corporate Documents" },
    { key: "COMPLIANCE", label: "Compliance Policies" },
    { key: "FINANCIAL", label: "Financial Reports" },
    { key: "LICENSE", label: "License Applications" },
  ]

  // ── Action menu for a document ────────────────────────────────────────────
  function DocActionMenu({ doc }: { doc: VaultDoc }) {
    const isOwner = doc.uploadedById === user?.id
    const canEdit = user?.role === "ADMIN" || isOwner

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 min-w-[44px] min-h-[44px]">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => setDetailDoc(doc)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDownload(doc)}
            className="gap-2"
          >
            <Download className="h-4 w-4" /> Download
          </DropdownMenuItem>
          {canEdit && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setEditDoc(doc)}
                className="gap-2"
              >
                <Edit2 className="h-4 w-4" /> Edit Details
              </DropdownMenuItem>
            </>
          )}
          {canChangeStatus && (
            <>
              <DropdownMenuSeparator />
              {doc.status !== "VERIFIED" && (
                <DropdownMenuItem
                  onClick={() => setVerifyConfirmDoc(doc)}
                  className="gap-2 text-green-600"
                >
                  <ShieldCheck className="h-4 w-4" /> Verify
                </DropdownMenuItem>
              )}
              {doc.status !== "EXPIRED" && (
                <DropdownMenuItem
                  onClick={() => setExpireConfirmDoc(doc)}
                  className="gap-2 text-amber-600"
                >
                  <XCircle className="h-4 w-4" /> Mark as Expired
                </DropdownMenuItem>
              )}
            </>
          )}
          {canEdit && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteConfirmDoc(doc)}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <FeatureGate feature="documentRepository">
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Document Vault</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Securely store and manage your compliance documents
          </p>
        </div>
        <Button
          className="bg-primary text-primary-foreground self-start sm:self-auto min-h-[44px]"
          onClick={() => setUploadOpen(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* ── Category summary cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statsQuery.isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : displayedCategoryCards.map(({ key, label }) => {
              const cfg = CATEGORY_CONFIG[key]
              const Icon = cfg.icon
              const count = stats?.byCategory?.[key as keyof typeof stats.byCategory] ?? 0
              const isActive = categoryFilter === key
              return (
                <Card
                  key={key}
                  className={`border-border/50 bg-card/50 backdrop-blur cursor-pointer transition-colors select-none
                    ${isActive ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"}`}
                  onClick={() => handleCategoryCardClick(key)}
                >
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${cfg.bg}`}>
                        <Icon className={`h-5 w-5 ${cfg.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm leading-snug">{label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{count} document{count !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
      </div>

      {/* ── Document list ── */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-base">All Documents</CardTitle>
                <CardDescription className="text-sm mt-0.5">
                  {pagination
                    ? `${pagination.total} document${pagination.total !== 1 ? "s" : ""}`
                    : "Loading…"}
                </CardDescription>
              </div>
              {/* View toggle */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none h-9 w-9"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none h-9 w-9"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filters row */}
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-0 sm:min-w-[200px] sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search documents…"
                  value={searchInput}
                  onChange={(e) => { handleSearchChange(e.target.value); setPage(1) }}
                  className="pl-9 bg-muted/50 w-full"
                />
              </div>

              {/* Category filter */}
              <Select
                value={categoryFilter}
                onValueChange={(v) => { setCategoryFilter(v); setPage(1) }}
              >
                <SelectTrigger className="bg-muted/50 w-full sm:w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status filter */}
              <Select
                value={statusFilter}
                onValueChange={(v) => { setStatusFilter(v); setPage(1) }}
              >
                <SelectTrigger className="bg-muted/50 w-full sm:w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="VERIFIED">Verified</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select
                value={`${sortBy}:${sortOrder}`}
                onValueChange={(v) => {
                  const [by, order] = v.split(":") as [typeof sortBy, typeof sortOrder]
                  setSortBy(by); setSortOrder(order); setPage(1)
                }}
              >
                <SelectTrigger className="bg-muted/50 w-full sm:w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt:desc">Newest first</SelectItem>
                  <SelectItem value="createdAt:asc">Oldest first</SelectItem>
                  <SelectItem value="name:asc">Name A–Z</SelectItem>
                  <SelectItem value="name:desc">Name Z–A</SelectItem>
                  <SelectItem value="fileSize:desc">Largest first</SelectItem>
                  <SelectItem value="fileSize:asc">Smallest first</SelectItem>
                  <SelectItem value="expiryDate:asc">Expiry (soonest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Loading */}
          {listQuery.isLoading && (
            viewMode === "list" ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => <DocumentRowSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            )
          )}

          {/* Error */}
          {listQuery.isError && !listQuery.isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <AlertCircle className="h-10 w-10 text-destructive/60" />
              <p className="font-medium text-foreground">Failed to load documents</p>
              <p className="text-sm text-muted-foreground">{getErrorMessage(listQuery.error)}</p>
              <Button variant="outline" onClick={() => listQuery.refetch()} className="gap-2 mt-1">
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!listQuery.isLoading && !listQuery.isError && documents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">No documents yet</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                {search || categoryFilter !== "ALL" || statusFilter !== "ALL"
                  ? "No documents match your current filters. Try adjusting the search or filters."
                  : "Upload your first compliance document to get started."}
              </p>
              {!search && categoryFilter === "ALL" && statusFilter === "ALL" && (
                <Button
                  className="bg-primary text-primary-foreground mt-1 gap-2"
                  onClick={() => setUploadOpen(true)}
                >
                  <Upload className="h-4 w-4" /> Upload Document
                </Button>
              )}
            </div>
          )}

          {/* List view */}
          {!listQuery.isLoading && !listQuery.isError && documents.length > 0 && viewMode === "list" && (
            <div className="space-y-2">
              {documents.map((doc) => {
                const statusCfg = STATUS_CONFIG[doc.status]
                const StatusIcon = statusCfg.icon
                const expiringSoon = isExpiringSoon(doc.expiryDate, doc.status)

                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setDetailDoc(doc)}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                        <FileTypeIcon mimeType={doc.fileType} className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{doc.name}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>{CATEGORY_CONFIG[doc.category]?.label ?? doc.category}</span>
                          <span className="hidden sm:inline">·</span>
                          <span className="hidden sm:inline">{doc.fileExtension.toUpperCase()}</span>
                          <span className="hidden sm:inline">·</span>
                          <span className="hidden sm:inline">{formatBytes(doc.fileSize)}</span>
                          <span className="hidden md:inline">·</span>
                          <span className="hidden md:inline">{formatDate(doc.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2 flex-shrink-0 ml-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {expiringSoon && (
                        <span className="hidden sm:flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          Expiring
                        </span>
                      )}
                      <Badge className={`${statusCfg.className} gap-1 hidden sm:flex`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusCfg.label}
                      </Badge>
                      {/* Mobile status dot */}
                      <div className={`sm:hidden h-2 w-2 rounded-full flex-shrink-0 ${
                        doc.status === "VERIFIED" ? "bg-green-500" :
                        doc.status === "EXPIRED" ? "bg-red-500" : "bg-amber-500"
                      }`} />
                      <DocActionMenu doc={doc} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Grid view */}
          {!listQuery.isLoading && !listQuery.isError && documents.length > 0 && viewMode === "grid" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {documents.map((doc) => {
                const statusCfg = STATUS_CONFIG[doc.status]
                const StatusIcon = statusCfg.icon
                const expiringSoon = isExpiringSoon(doc.expiryDate, doc.status)

                return (
                  <div
                    key={doc.id}
                    className="relative p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => setDetailDoc(doc)}
                  >
                    {/* Action menu */}
                    <div
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DocActionMenu doc={doc} />
                    </div>

                    <div className="flex items-center justify-center p-4 rounded-lg bg-primary/10 mb-3">
                      <FileTypeIcon mimeType={doc.fileType} className="h-9 w-9 text-primary" />
                    </div>
                    <p className="font-medium text-sm text-foreground truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatBytes(doc.fileSize)}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge className={`${statusCfg.className} gap-1 text-xs`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusCfg.label}
                      </Badge>
                      {expiringSoon && (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1 text-xs">
                          <AlertTriangle className="h-3 w-3" />
                          Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Load more */}
          {pagination && pagination.page < pagination.totalPages && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={listQuery.isFetching}
                className="gap-2 min-h-[44px]"
              >
                {listQuery.isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Upload modal ── */}
      <UploadDocumentModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={invalidateAll}
      />

      {/* ── Edit modal ── */}
      <EditDocumentModal
        open={!!editDoc}
        onOpenChange={(v) => { if (!v) setEditDoc(null) }}
        document={editDoc}
        onSuccess={invalidateAll}
      />

      {/* ── Document detail panel ── */}
      <DocumentDetailPanel
        open={!!detailDoc}
        onOpenChange={(v) => { if (!v) setDetailDoc(null) }}
        document={detailDoc}
        userRole={user?.role ?? ""}
        currentUserId={user?.id ?? ""}
        onEdit={(doc) => setEditDoc(doc as VaultDoc)}
        onDelete={(doc) => setDeleteConfirmDoc(doc as VaultDoc)}
      />

      {/* ── Delete confirmation dialog ── */}
      <Dialog
        open={!!deleteConfirmDoc}
        onOpenChange={(v) => { if (!v) setDeleteConfirmDoc(null) }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteConfirmDoc?.name}&rdquo;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmDoc(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmDoc && handleDelete(deleteConfirmDoc)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Verify confirmation dialog ── */}
      <Dialog
        open={!!verifyConfirmDoc}
        onOpenChange={(v) => { if (!v) setVerifyConfirmDoc(null) }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Document</DialogTitle>
            <DialogDescription>
              Mark &ldquo;{verifyConfirmDoc?.name}&rdquo; as verified? This indicates the document
              has been reviewed and approved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setVerifyConfirmDoc(null)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => verifyConfirmDoc && handleVerify(verifyConfirmDoc)}
              disabled={updateStatus.isPending}
            >
              {updateStatus.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4 mr-2" />
              )}
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Expire confirmation dialog ── */}
      <Dialog
        open={!!expireConfirmDoc}
        onOpenChange={(v) => { if (!v) setExpireConfirmDoc(null) }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Expired</DialogTitle>
            <DialogDescription>
              Mark &ldquo;{expireConfirmDoc?.name}&rdquo; as expired? The document will remain in
              the vault but flagged as no longer valid.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setExpireConfirmDoc(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => expireConfirmDoc && handleMarkExpired(expireConfirmDoc)}
              disabled={updateStatus.isPending}
            >
              {updateStatus.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Mark Expired
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </FeatureGate>
  )
}
