"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { TRPCClientError } from "@trpc/client"
import { toast } from "sonner"
import { AlertCircle, FileSpreadsheet, FileText, ImageIcon, Loader2, Plus, Upload, X } from "lucide-react"
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
import { trpc } from "@/lib/trpc"

const ALLOWED_VAULT_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "text/plain",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/webp",
] as const

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
type UploadStage = "idle" | "presigning" | "uploading" | "confirming"

interface UploadFormState {
  file: File | null
  name: string
  category: DocumentCategory | ""
  description: string
  tags: string[]
  tagInput: string
  expiryDate: string
}

interface FormErrors {
  file?: string
  name?: string
  category?: string
  description?: string
  tags?: string
  expiryDate?: string
}

interface UploadDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface UploadFailure {
  status: number
}

class UploadAbortError extends Error {
  constructor() {
    super("Upload cancelled.")
    this.name = "UploadAbortError"
  }
}

const EMPTY_FORM: UploadFormState = {
  file: null,
  name: "",
  category: "",
  description: "",
  tags: [],
  tagInput: "",
  expiryDate: "",
}

const TAG_PATTERN = /^[A-Za-z0-9_-]+$/
const MIME_ACCEPT = ALLOWED_VAULT_MIME_TYPES.join(",")
const ALLOWED_MIME_SET = new Set<string>(ALLOWED_VAULT_MIME_TYPES)
type AllowedVaultMimeType = (typeof ALLOWED_VAULT_MIME_TYPES)[number]

function isAllowedVaultMimeType(value: string): value is AllowedVaultMimeType {
  return ALLOWED_MIME_SET.has(value)
}

function FileTypeIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  if (mimeType.startsWith("image/")) return <ImageIcon className={className} />
  if (
    mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType === "application/vnd.ms-excel" ||
    mimeType === "text/csv"
  ) {
    return <FileSpreadsheet className={className} />
  }
  return <FileText className={className} />
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
}

function getTomorrowInputDate(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().slice(0, 10)
}

function getExpiryIso(dateInput: string): string | undefined {
  if (!dateInput) return undefined
  return new Date(`${dateInput}T23:59:59.999Z`).toISOString()
}

function getTrpcCode(error: unknown): string | undefined {
  if (error instanceof TRPCClientError) {
    return error.data?.code as string | undefined
  }
  return undefined
}

function getErrorText(error: unknown): string {
  if (error instanceof Error) return error.message
  return "Unexpected upload error."
}

function validateTags(tags: string[]): string | undefined {
  if (tags.length > 20) return "Use 20 tags or fewer."
  const invalid = tags.find((tag) => tag.length < 1 || tag.length > 50 || !TAG_PATTERN.test(tag))
  if (invalid) return "Tags must be 1-50 characters and use letters, numbers, hyphens, or underscores only."
  return undefined
}

function validateForm(form: UploadFormState, maxFileSizeBytes: number): FormErrors {
  const errors: FormErrors = {}

  if (!form.file) {
    errors.file = "Choose one file to upload."
  } else if (!isAllowedVaultMimeType(form.file.type)) {
    errors.file = "This file type is not supported."
  } else if (form.file.size < 1024) {
    errors.file = "File must be at least 1 KB."
  } else if (maxFileSizeBytes === 0) {
    errors.file = "Document Vault is not available on your current plan."
  } else if (maxFileSizeBytes > 0 && form.file.size > maxFileSizeBytes) {
    errors.file = `File exceeds your plan limit of ${formatBytes(maxFileSizeBytes)}.`
  }

  const trimmedName = form.name.trim()
  if (!trimmedName) errors.name = "Document name is required."
  if (trimmedName.length > 255) errors.name = "Document name must be 255 characters or fewer."

  if (!form.category) errors.category = "Select a category."
  if (form.description.length > 1000) errors.description = "Description must be 1000 characters or fewer."

  const tagError = validateTags(form.tags)
  if (tagError) errors.tags = tagError

  if (form.expiryDate) {
    const expiry = new Date(`${form.expiryDate}T23:59:59.999Z`)
    if (Number.isNaN(expiry.getTime()) || expiry.getTime() <= Date.now()) {
      errors.expiryDate = "Expiry date must be in the future."
    }
  }

  return errors
}

function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some(Boolean)
}

function withPendingTags(form: UploadFormState): UploadFormState {
  if (!form.tagInput.trim()) return form
  return {
    ...form,
    tags: Array.from(new Set([
      ...form.tags,
      ...form.tagInput
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    ])).slice(0, 20),
    tagInput: "",
  }
}

export function UploadDocumentModal({ open, onOpenChange, onSuccess }: UploadDocumentModalProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const firstFieldRef = useRef<HTMLButtonElement>(null)
  const xhrRef = useRef<XMLHttpRequest | null>(null)
  const utils = trpc.useUtils()

  const [form, setForm] = useState<UploadFormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [dragging, setDragging] = useState(false)
  const [stage, setStage] = useState<UploadStage>("idle")
  const [uploadProgress, setUploadProgress] = useState(0)

  const getUploadUrl = trpc.vault.getUploadUrl.useMutation()
  const confirmUpload = trpc.vault.confirmUpload.useMutation()
  const { data: uploadLimits } = trpc.vault.getUploadLimits.useQuery(undefined, {
    enabled: open,
    staleTime: 60_000,
  })

  const maxFileSizeBytes = uploadLimits?.maxFileSizeMB === undefined
    ? -1
    : uploadLimits.maxFileSizeMB === -1
      ? -1
      : uploadLimits.maxFileSizeMB * 1024 * 1024
  const isBusy = stage !== "idle"
  const currentErrors = validateForm(withPendingTags(form), maxFileSizeBytes)
  const canSubmit = !isBusy && !hasErrors(currentErrors)

  useEffect(() => {
    if (!open) return
    window.setTimeout(() => firstFieldRef.current?.focus(), 0)
  }, [open])

  function setField<K extends keyof UploadFormState>(key: K, value: UploadFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function resetForm() {
    xhrRef.current = null
    setForm(EMPTY_FORM)
    setErrors({})
    setDragging(false)
    setStage("idle")
    setUploadProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleClose(nextOpen = false) {
    if (isBusy) return
    if (!nextOpen) resetForm()
    onOpenChange(nextOpen)
  }

  function selectFile(file: File) {
    const nextForm = {
      ...form,
      file,
      name: form.name.trim() ? form.name : file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
    }
    setForm(nextForm)
    setErrors((current) => ({ ...current, file: validateForm(nextForm, maxFileSizeBytes).file }))
  }

  function addTag(rawValue: string) {
    const values = rawValue
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)

    if (values.length === 0) return

    const nextTags = Array.from(new Set([...form.tags, ...values])).slice(0, 20)
    const tagError = validateTags(nextTags)
    setForm((current) => ({ ...current, tags: nextTags, tagInput: "" }))
    setErrors((current) => ({ ...current, tags: tagError }))
  }

  function removeTag(tag: string) {
    setForm((current) => ({
      ...current,
      tags: current.tags.filter((item) => item !== tag),
    }))
    setErrors((current) => ({ ...current, tags: undefined }))
  }

  function handlePresignError(error: unknown) {
    const code = getTrpcCode(error)
    const message = getErrorText(error)

    if (code === "FORBIDDEN" && message.toLowerCase().includes("quota")) {
      toast.error("Storage quota exceeded for your plan. Upgrade or delete documents to continue.", {
        action: { label: "Billing", onClick: () => router.push("/settings/billing") },
      })
      return
    }
    if (code === "FORBIDDEN" && message.toLowerCase().includes("not available")) {
      toast.error("Document Vault is not available on your current plan.", {
        action: { label: "Billing", onClick: () => router.push("/settings/billing") },
      })
      return
    }
    if (code === "BAD_REQUEST") {
      toast.error(message)
      return
    }

    console.error("Vault presign failed", error)
    toast.error("Upload preparation failed. Please try again.")
  }

  function handlePutError(error: UploadFailure) {
    if (error.status === 0) {
      toast.error("Upload failed: connection issue. Please check your internet and try again.")
    } else if (error.status === 403) {
      toast.error("Upload session expired. Please try again.")
    } else if (error.status === 413) {
      toast.error("File too large for upload.")
    } else if (error.status >= 500) {
      toast.error("Upload service unavailable. Please try again in a moment.")
    } else {
      toast.error(`Upload failed (status ${error.status}). Please try again.`)
    }
  }

  function handleConfirmError(error: unknown) {
    const code = getTrpcCode(error)
    const message = getErrorText(error).toLowerCase()

    if (code === "NOT_FOUND" || code === "GONE") {
      toast.error("Upload session expired before completion. Please try again.")
    } else if (code === "BAD_REQUEST" && message.includes("metadata")) {
      toast.error("Upload verification failed. Please try again.")
    } else if (code === "FORBIDDEN") {
      toast.error("You don't have permission to complete this upload.")
    } else {
      console.error("Vault confirm failed", error)
      toast.error("Could not finalize upload. Please contact support if this persists.")
    }
  }

  function uploadToR2(uploadUrl: string, file: File, requiredHeaders: Record<string, string>): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhrRef.current = xhr
      xhr.open("PUT", uploadUrl, true)

      for (const [headerName, headerValue] of Object.entries(requiredHeaders)) {
        xhr.setRequestHeader(headerName, headerValue)
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100))
        }
      }

      xhr.onload = () => {
        xhrRef.current = null
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
          return
        }
        reject({ status: xhr.status } satisfies UploadFailure)
      }

      xhr.onerror = () => {
        xhrRef.current = null
        reject({ status: 0 } satisfies UploadFailure)
      }

      xhr.onabort = () => {
        xhrRef.current = null
        reject(new UploadAbortError())
      }

      xhr.send(file)
    })
  }

  function cancelUpload() {
    if (xhrRef.current) {
      xhrRef.current.abort()
    }
    resetForm()
    toast.message("Upload cancelled.")
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const submitForm = withPendingTags(form)

    if (form.tagInput.trim()) {
      setForm(submitForm)
    }

    const nextErrors = validateForm(submitForm, maxFileSizeBytes)
    setErrors(nextErrors)
    if (hasErrors(nextErrors) || !submitForm.file || !submitForm.category) return

    let failureStage: UploadStage = "presigning"
    try {
      setStage("presigning")
      const presign = await getUploadUrl.mutateAsync({
        declaredFilename: submitForm.file.name,
        declaredMimeType: submitForm.file.type as AllowedVaultMimeType,
        declaredSize: submitForm.file.size,
        category: submitForm.category,
        tags: submitForm.tags,
        name: submitForm.name.trim(),
        description: submitForm.description.trim() || undefined,
        expiryDate: getExpiryIso(submitForm.expiryDate),
      })

      failureStage = "uploading"
      setStage("uploading")
      setUploadProgress(0)
      await uploadToR2(presign.uploadUrl, submitForm.file, presign.requiredHeaders)

      failureStage = "confirming"
      setStage("confirming")
      await confirmUpload.mutateAsync({ documentId: presign.documentId })

      toast.success("Document uploaded successfully.")
      await utils.vault.list.invalidate()
      await utils.vault.getStats.invalidate()
      await utils.vault.getUploadLimits.invalidate()
      onSuccess()
      resetForm()
      onOpenChange(false)
    } catch (error) {
      if (error instanceof UploadAbortError) return
      if (failureStage === "presigning") {
        handlePresignError(error)
      } else if (failureStage === "uploading" && typeof error === "object" && error !== null && "status" in error) {
        handlePutError(error as UploadFailure)
      } else {
        handleConfirmError(error)
      }
      setStage("idle")
    }
  }

  const fileErrorId = errors.file ? "vault-file-error" : undefined
  const nameErrorId = errors.name ? "vault-name-error" : undefined
  const categoryErrorId = errors.category ? "vault-category-error" : undefined
  const descriptionErrorId = errors.description ? "vault-description-error" : undefined
  const tagsErrorId = errors.tags ? "vault-tags-error" : undefined
  const expiryErrorId = errors.expiryDate ? "vault-expiry-error" : undefined

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => handleClose(nextOpen)}>
      <DialogContent className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-gray-800 bg-neutral-900 p-0 text-white">
        <DialogHeader className="border-b border-gray-800 px-6 pb-4 pt-6">
          <DialogTitle className="text-xl font-semibold text-white">Upload Document</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a compliance document to your secure vault.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="vault-file" className="text-white">File</Label>
            <button
              ref={firstFieldRef}
              type="button"
              disabled={isBusy}
              aria-describedby={fileErrorId}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault()
                if (!isBusy) setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault()
                setDragging(false)
                const file = event.dataTransfer.files?.[0]
                if (file && !isBusy) selectFile(file)
              }}
              className={`flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6 text-center transition-colors ${
                dragging ? "border-green-500 bg-black" : "border-gray-800 bg-neutral-950"
              } ${isBusy ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-green-500"}`}
            >
              {form.file ? (
                <>
                  <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-800">
                    <FileTypeIcon mimeType={form.file.type} className="h-7 w-7 text-green-500" />
                  </span>
                  <span className="max-w-full truncate text-sm font-medium text-white">{form.file.name}</span>
                  <span className="text-xs text-gray-400">{formatBytes(form.file.size)}</span>
                </>
              ) : (
                <>
                  <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-800">
                    <Upload className="h-6 w-6 text-green-500" />
                  </span>
                  <span className="text-sm font-medium text-white">Drop a file here or browse</span>
                  <span className="text-xs text-gray-400">PDF, Office, text, CSV, PNG, JPEG, or WebP</span>
                </>
              )}
            </button>
            <Input
              ref={fileInputRef}
              id="vault-file"
              type="file"
              accept={MIME_ACCEPT}
              disabled={isBusy}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) selectFile(file)
              }}
            />
            {errors.file && <p id="vault-file-error" className="text-sm text-red-400">{errors.file}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vault-name" className="text-white">Name</Label>
            <Input
              id="vault-name"
              value={form.name}
              disabled={isBusy}
              maxLength={255}
              aria-describedby={nameErrorId}
              onChange={(event) => setField("name", event.target.value)}
              placeholder="Certificate of Incorporation"
              className="border-gray-800 bg-neutral-950 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed"
            />
            {errors.name && <p id="vault-name-error" className="text-sm text-red-400">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vault-category" className="text-white">Category</Label>
            <Select
              value={form.category}
              disabled={isBusy}
              onValueChange={(value) => setField("category", value as DocumentCategory)}
            >
              <SelectTrigger
                id="vault-category"
                aria-describedby={categoryErrorId}
                className="border-gray-800 bg-neutral-950 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="border-gray-800 bg-neutral-950 text-white">
                {DOCUMENT_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p id="vault-category-error" className="text-sm text-red-400">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vault-description" className="text-white">Description</Label>
            <Textarea
              id="vault-description"
              value={form.description}
              disabled={isBusy}
              maxLength={1000}
              rows={3}
              aria-describedby={descriptionErrorId}
              onChange={(event) => setField("description", event.target.value)}
              placeholder="Optional notes for your team"
              className="resize-none border-gray-800 bg-neutral-950 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed"
            />
            {errors.description && (
              <p id="vault-description-error" className="text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vault-expiry" className="text-white">Expiry Date</Label>
            <Input
              id="vault-expiry"
              type="date"
              value={form.expiryDate}
              disabled={isBusy}
              min={getTomorrowInputDate()}
              aria-describedby={expiryErrorId}
              onChange={(event) => setField("expiryDate", event.target.value)}
              className="border-gray-800 bg-neutral-950 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed"
            />
            {errors.expiryDate && <p id="vault-expiry-error" className="text-sm text-red-400">{errors.expiryDate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vault-tags" className="text-white">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="vault-tags"
                value={form.tagInput}
                disabled={isBusy || form.tags.length >= 20}
                aria-describedby={tagsErrorId}
                onChange={(event) => setField("tagInput", event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault()
                    addTag(form.tagInput)
                  }
                }}
                onBlur={() => addTag(form.tagInput)}
                placeholder="kyc"
                className="border-gray-800 bg-neutral-950 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed"
              />
              <Button
                type="button"
                disabled={isBusy || !form.tagInput.trim() || form.tags.length >= 20}
                onClick={() => addTag(form.tagInput)}
                className="bg-gray-800 text-white hover:bg-gray-700 disabled:cursor-not-allowed"
                aria-label="Add tag"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded border border-gray-800 bg-black px-2 py-1 text-xs text-white"
                  >
                    {tag}
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => removeTag(tag)}
                      className="text-gray-400 hover:text-white disabled:cursor-not-allowed"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.tags && <p id="vault-tags-error" className="text-sm text-red-400">{errors.tags}</p>}
          </div>

          {isBusy && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  {stage === "presigning" && "Preparing upload"}
                  {stage === "uploading" && "Uploading"}
                  {stage === "confirming" && "Finalizing"}
                </span>
                <span className="font-medium tabular-nums text-white">
                  {stage === "uploading" ? `${uploadProgress}%` : ""}
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded bg-gray-800"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={stage === "uploading" ? uploadProgress : stage === "confirming" ? 95 : 10}
              >
                <div
                  className="h-full bg-green-500 transition-all duration-200"
                  style={{ width: `${stage === "uploading" ? uploadProgress : stage === "confirming" ? 95 : 10}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={stage === "uploading" ? cancelUpload : () => handleClose(false)}
              disabled={stage === "presigning" || stage === "confirming"}
              className={stage === "uploading"
                ? "flex-1 bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed"
                : "flex-1 bg-gray-800 text-white hover:bg-gray-700 disabled:cursor-not-allowed"}
            >
              {stage === "uploading" ? "Cancel Upload" : "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 bg-green-500 text-white hover:bg-green-600 disabled:cursor-not-allowed"
            >
              {stage === "presigning" || stage === "confirming" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload Document
            </Button>
          </div>

          {hasErrors(errors) && (
            <p className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" />
              Check the highlighted fields before uploading.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
