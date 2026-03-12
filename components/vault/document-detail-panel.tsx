"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { toast } from "@/hooks/use-toast"
import { trpc } from "@/lib/trpc"
import { getErrorMessage } from "@/lib/trpc"
import {
  Download,
  FileText,
  ImageIcon,
  FileSpreadsheet,
  Calendar,
  Tag,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Trash2,
  Layers,
  StickyNote,
  User,
  Loader2,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type DocumentCategory =
  | "CORPORATE"
  | "COMPLIANCE"
  | "FINANCIAL"
  | "LICENSE"
  | "OPERATIONS"
  | "TAX"
  | "OTHER"

type VaultDocumentStatus = "PENDING" | "VERIFIED" | "EXPIRED"

interface VaultDocument {
  id: string
  name: string
  description: string | null
  fileName: string
  fileType: string
  fileExtension: string
  fileSize: number
  storageKey: string
  category: DocumentCategory
  status: VaultDocumentStatus
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
  uploadedBy: {
    id: string
    fullName: string
    email: string
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DocumentDetailPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: VaultDocument | null
  userRole: string
  currentUserId: string
  onEdit: (doc: VaultDocument) => void
  onDelete: (doc: VaultDocument) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  CORPORATE: "Corporate",
  COMPLIANCE: "Compliance",
  FINANCIAL: "Financial",
  LICENSE: "License",
  OPERATIONS: "Operations",
  TAX: "Tax",
  OTHER: "Other",
}

function StatusBadge({ status }: { status: VaultDocumentStatus }) {
  if (status === "VERIFIED") {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Verified
      </Badge>
    )
  }
  if (status === "EXPIRED") {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 gap-1">
        <AlertTriangle className="h-3 w-3" />
        Expired
      </Badge>
    )
  }
  return (
    <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 gap-1">
      <Clock className="h-3 w-3" />
      Pending
    </Badge>
  )
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

function isExpiringSoon(expiryDate: Date | null, status: VaultDocumentStatus): boolean {
  if (!expiryDate || status === "EXPIRED") return false
  const thirtyDays = 30 * 24 * 60 * 60 * 1000
  return new Date(expiryDate).getTime() - Date.now() <= thirtyDays && new Date(expiryDate).getTime() > Date.now()
}

// ─── Meta row ─────────────────────────────────────────────────────────────────

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 flex items-start pt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground leading-none mb-1">{label}</p>
        <div className="text-sm text-foreground break-words">{value}</div>
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DocumentDetailPanel({
  open,
  onOpenChange,
  document,
  userRole,
  currentUserId,
  onEdit,
  onDelete,
}: DocumentDetailPanelProps) {
  const getDownloadUrl = trpc.vault.getDownloadUrl.useMutation()

  async function handleDownload() {
    if (!document) return
    try {
      const { downloadUrl } = await getDownloadUrl.mutateAsync({ id: document.id })
      window.open(downloadUrl, "_blank", "noopener,noreferrer")
    } catch (err) {
      toast({ title: "Download failed", description: getErrorMessage(err), variant: "destructive" })
    }
  }

  if (!document) return null

  const canEdit = userRole === "ADMIN" || document.uploadedById === currentUserId
  const expiringSoon = isExpiringSoon(document.expiryDate, document.status)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/50 flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FileTypeIcon mimeType={document.fileType} className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-base font-semibold leading-snug break-words">
                {document.name}
              </SheetTitle>
              <SheetDescription className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="text-xs">{document.fileExtension.toUpperCase()}</span>
                <span className="text-xs text-muted-foreground/50">·</span>
                <span className="text-xs">{formatBytes(document.fileSize)}</span>
                {document.version > 1 && (
                  <>
                    <span className="text-xs text-muted-foreground/50">·</span>
                    <span className="text-xs">v{document.version}</span>
                  </>
                )}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable body */}
        <ScrollArea className="flex-1 overflow-auto">
          <div className="px-6 py-5 space-y-5">
            {/* Status + expiry warning */}
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={document.status} />
              {expiringSoon && (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 gap-1 text-xs">
                  <AlertTriangle className="h-3 w-3" />
                  Expiring soon
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {CATEGORY_LABELS[document.category]}
              </Badge>
            </div>

            {document.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {document.description}
              </p>
            )}

            <Separator />

            {/* Metadata grid */}
            <div className="space-y-4">
              <MetaRow
                icon={User}
                label="Uploaded by"
                value={`${document.uploadedBy.fullName} (${document.uploadedBy.email})`}
              />
              <MetaRow
                icon={Calendar}
                label="Upload date"
                value={formatDate(document.createdAt)}
              />
              {document.expiryDate && (
                <MetaRow
                  icon={Calendar}
                  label="Expiry date"
                  value={
                    <span className={expiringSoon ? "text-amber-600 font-medium" : ""}>
                      {formatDate(document.expiryDate)}
                    </span>
                  }
                />
              )}
              {document.verifiedAt && (
                <MetaRow
                  icon={CheckCircle2}
                  label="Verified on"
                  value={formatDate(document.verifiedAt)}
                />
              )}
              <MetaRow
                icon={Building2}
                label="Category"
                value={CATEGORY_LABELS[document.category]}
              />
              <MetaRow
                icon={Layers}
                label="Version"
                value={`v${document.version}`}
              />
              <MetaRow
                icon={FileText}
                label="File name"
                value={<span className="font-mono text-xs">{document.fileName}</span>}
              />
              {document.tags.length > 0 && (
                <MetaRow
                  icon={Tag}
                  label="Tags"
                  value={
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {document.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  }
                />
              )}
              {document.notes && (
                <MetaRow
                  icon={StickyNote}
                  label="Internal notes"
                  value={
                    <span className="text-muted-foreground italic">{document.notes}</span>
                  }
                />
              )}
            </div>

            {/* Status timeline */}
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Status Timeline
              </p>
              <ol className="relative border-l border-border/50 ml-2 space-y-4">
                <li className="ml-4">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                  <p className="text-sm font-medium">Uploaded</p>
                  <p className="text-xs text-muted-foreground">{formatDate(document.createdAt)}</p>
                </li>
                {document.status === "VERIFIED" && document.verifiedAt && (
                  <li className="ml-4">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-green-500" />
                    <p className="text-sm font-medium text-green-600">Verified</p>
                    <p className="text-xs text-muted-foreground">{formatDate(document.verifiedAt)}</p>
                  </li>
                )}
                {document.status === "EXPIRED" && (
                  <li className="ml-4">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-red-500" />
                    <p className="text-sm font-medium text-red-600">Expired</p>
                    {document.expiryDate && (
                      <p className="text-xs text-muted-foreground">{formatDate(document.expiryDate)}</p>
                    )}
                  </li>
                )}
              </ol>
            </div>
          </div>
        </ScrollArea>

        {/* Footer actions */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-border/50 space-y-2">
          <Button
            className="w-full bg-primary text-primary-foreground"
            onClick={handleDownload}
            disabled={getDownloadUrl.isPending}
          >
            {getDownloadUrl.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download
          </Button>
          {canEdit && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { onEdit(document); onOpenChange(false) }}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
                onClick={() => { onDelete(document); onOpenChange(false) }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
