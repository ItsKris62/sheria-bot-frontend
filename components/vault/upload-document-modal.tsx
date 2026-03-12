"use client"

import { useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { trpc } from "@/lib/trpc"
import { getErrorMessage } from "@/lib/trpc"
import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
  FileSpreadsheet,
} from "lucide-react"

// ─── Constants ────────────────────────────────────────────────────────────────

const VAULT_MAX_FILE_SIZE = 25 * 1024 * 1024 // 25 MB

const VAULT_ALLOWED_MIME_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "text/csv": "CSV",
  "image/png": "PNG",
  "image/jpeg": "JPG",
}

const DOCUMENT_CATEGORIES = [
  { value: "CORPORATE", label: "Corporate Documents" },
  { value: "COMPLIANCE", label: "Compliance Policies" },
  { value: "FINANCIAL", label: "Financial Reports" },
  { value: "LICENSE", label: "License Applications" },
  { value: "OPERATIONS", label: "Operations" },
  { value: "TAX", label: "Tax Documents" },
  { value: "OTHER", label: "Other" },
] as const

type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number]["value"]

// ─── File icon helper ─────────────────────────────────────────────────────────

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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface UploadDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UploadDocumentModal({ open, onOpenChange, onSuccess }: UploadDocumentModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  // Selected file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  // Form fields
  const [name, setName] = useState("")
  const [category, setCategory] = useState<DocumentCategory | "">("")
  const [description, setDescription] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [tagsInput, setTagsInput] = useState("")

  // Upload state
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStage, setUploadStage] = useState<"idle" | "requesting" | "uploading" | "saving" | "done" | "error">("idle")

  const utils = trpc.useUtils()
  const getUploadUrl = trpc.vault.getUploadUrl.useMutation()
  const confirmUpload = trpc.vault.confirmUpload.useMutation()

  // ── File validation ──────────────────────────────────────────────────────

  function validateFile(file: File): string | null {
    if (!VAULT_ALLOWED_MIME_TYPES[file.type]) {
      return `File type "${file.type || file.name.split(".").pop()}" is not allowed. Accepted: PDF, DOCX, XLSX, CSV, PNG, JPG.`
    }
    if (file.size > VAULT_MAX_FILE_SIZE) {
      return `File is too large (${formatBytes(file.size)}). Maximum size is 25 MB.`
    }
    if (file.size < 1024) {
      return "File is too small (minimum 1 KB)."
    }
    return null
  }

  function handleFileSelect(file: File) {
    const error = validateFile(file)
    if (error) {
      setFileError(error)
      setSelectedFile(null)
      return
    }
    setFileError(null)
    setSelectedFile(file)
    // Auto-populate name from filename
    const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")
    setName(baseName)
  }

  // ── Drag and drop ────────────────────────────────────────────────────────

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragging(false)
  }, [])

  // ── Upload to R2 via presigned URL with XHR progress ────────────────────

  function uploadToR2(url: string, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100))
        }
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          reject(new Error(`R2 upload failed with status ${xhr.status}`))
        }
      }
      xhr.onerror = () => reject(new Error("Network error during upload."))
      xhr.open("PUT", url)
      xhr.setRequestHeader("Content-Type", file.type)
      xhr.send(file)
    })
  }

  // ── Submit ───────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedFile || !category || !name.trim()) return

    const ext = "." + selectedFile.name.split(".").pop()!.toLowerCase()
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 20)

    try {
      // Step 1: Get presigned URL
      setUploadStage("requesting")
      const { uploadUrl, storageKey, documentId } = await getUploadUrl.mutateAsync({
        filename: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
      })

      // Step 2: Upload file to R2
      setUploadStage("uploading")
      setUploadProgress(0)
      await uploadToR2(uploadUrl, selectedFile)

      // Step 3: Create DB record
      setUploadStage("saving")
      await confirmUpload.mutateAsync({
        documentId,
        storageKey,
        name: name.trim(),
        description: description.trim() || undefined,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileExtension: ext,
        fileSize: selectedFile.size,
        category: category as DocumentCategory,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
        tags: tags.length > 0 ? tags : undefined,
      })

      setUploadStage("done")
      toast({ title: "Document uploaded", description: `"${name.trim()}" was saved to your vault.` })

      // Step 4: Invalidate cache + close
      await utils.vault.list.invalidate()
      await utils.vault.getStats.invalidate()
      onSuccess()
      handleClose()
    } catch (err) {
      setUploadStage("error")
      toast({
        title: "Upload failed",
        description: getErrorMessage(err),
        variant: "destructive",
      })
    }
  }

  // ── Reset + close ────────────────────────────────────────────────────────

  function handleClose() {
    if (uploadStage === "uploading" || uploadStage === "requesting" || uploadStage === "saving") return
    setSelectedFile(null)
    setFileError(null)
    setName("")
    setCategory("")
    setDescription("")
    setExpiryDate("")
    setTagsInput("")
    setUploadProgress(0)
    setUploadStage("idle")
    onOpenChange(false)
  }

  const isUploading = uploadStage === "requesting" || uploadStage === "uploading" || uploadStage === "saving"
  const canSubmit = !!selectedFile && !!category && name.trim().length > 0 && !isUploading

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else onOpenChange(v) }}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-semibold">Upload Document</DialogTitle>
          <DialogDescription>
            Add a compliance document to your vault. Max 25 MB. Accepted: PDF, DOCX, XLSX, CSV, PNG, JPG.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* ── Drop zone ── */}
          <div
            role="button"
            tabIndex={0}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer select-none
              ${dragging ? "border-primary bg-primary/5" : "border-border/60 bg-muted/30 hover:border-primary/50 hover:bg-muted/50"}
              ${fileError ? "border-destructive/60 bg-destructive/5" : ""}
              ${selectedFile ? "border-primary/60 bg-primary/5" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click() }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xlsx,.csv,.png,.jpg,.jpeg"
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }}
            />

            {selectedFile ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <FileTypeIcon mimeType={selectedFile.type} className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatBytes(selectedFile.size)}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFile(null)
                    setFileError(null)
                    setName("")
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Drop file here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX, CSV, PNG, JPG — max 25 MB</p>
                </div>
              </>
            )}
          </div>

          {fileError && (
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {fileError}
            </p>
          )}

          {/* ── Document name ── */}
          <div className="space-y-1.5">
            <Label htmlFor="vault-name">Document Name <span className="text-destructive">*</span></Label>
            <Input
              id="vault-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Certificate of Incorporation"
              maxLength={255}
              required
            />
          </div>

          {/* ── Category ── */}
          <div className="space-y-1.5">
            <Label htmlFor="vault-category">Category <span className="text-destructive">*</span></Label>
            <Select value={category} onValueChange={(v) => setCategory(v as DocumentCategory)}>
              <SelectTrigger id="vault-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ── Description ── */}
          <div className="space-y-1.5">
            <Label htmlFor="vault-description">Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea
              id="vault-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this document..."
              maxLength={1000}
              rows={2}
              className="resize-none"
            />
          </div>

          {/* ── Expiry date ── */}
          <div className="space-y-1.5">
            <Label htmlFor="vault-expiry">Expiry Date <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input
              id="vault-expiry"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* ── Tags ── */}
          <div className="space-y-1.5">
            <Label htmlFor="vault-tags">Tags <span className="text-muted-foreground text-xs">(optional, comma-separated)</span></Label>
            <Input
              id="vault-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. 2025, KYC, CBK"
            />
          </div>

          {/* ── Upload progress ── */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {uploadStage === "requesting" && "Preparing upload…"}
                  {uploadStage === "uploading" && "Uploading to secure storage…"}
                  {uploadStage === "saving" && "Saving document record…"}
                </span>
                {uploadStage === "uploading" && (
                  <span className="font-medium tabular-nums">{uploadProgress}%</span>
                )}
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{
                    width:
                      uploadStage === "requesting"
                        ? "15%"
                        : uploadStage === "uploading"
                        ? `${uploadProgress}%`
                        : "90%",
                  }}
                />
              </div>
            </div>
          )}

          {uploadStage === "done" && (
            <p className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Upload complete!
            </p>
          )}

          {uploadStage === "error" && (
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              Upload failed. Please try again.
            </p>
          )}

          {/* ── Actions ── */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground"
              disabled={!canSubmit}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
