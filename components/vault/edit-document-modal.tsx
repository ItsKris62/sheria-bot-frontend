"use client"

import { useEffect, useState } from "react"
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
import { Loader2, Save } from "lucide-react"

// ─── Constants ────────────────────────────────────────────────────────────────

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

// ─── Minimal document shape this modal needs ──────────────────────────────────

interface DocumentForEdit {
  id: string
  name: string
  description: string | null
  category: DocumentCategory
  expiryDate: Date | null
  tags: string[]
  notes: string | null
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface EditDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: DocumentForEdit | null
  onSuccess: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditDocumentModal({ open, onOpenChange, document, onSuccess }: EditDocumentModalProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState<DocumentCategory>("OTHER")
  const [description, setDescription] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const [notes, setNotes] = useState("")

  const utils = trpc.useUtils()
  const updateMutation = trpc.vault.update.useMutation()

  // Pre-fill fields whenever the document changes
  useEffect(() => {
    if (!document) return
    setName(document.name)
    setCategory(document.category)
    setDescription(document.description ?? "")
    setExpiryDate(
      document.expiryDate
        ? new Date(document.expiryDate).toISOString().split("T")[0]
        : ""
    )
    setTagsInput(document.tags.join(", "))
    setNotes(document.notes ?? "")
  }, [document])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!document) return

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 20)

    try {
      await updateMutation.mutateAsync({
        id: document.id,
        name: name.trim(),
        description: description.trim() || null,
        category,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
        tags,
        notes: notes.trim() || null,
      })

      toast({ title: "Document updated", description: `"${name.trim()}" has been updated.` })
      await utils.vault.list.invalidate()
      await utils.vault.getStats.invalidate()
      onSuccess()
      onOpenChange(false)
    } catch (err) {
      toast({
        title: "Update failed",
        description: getErrorMessage(err),
        variant: "destructive",
      })
    }
  }

  const isSaving = updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-semibold">Edit Document</DialogTitle>
          <DialogDescription>Update the metadata for this document.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Document Name <span className="text-destructive">*</span></Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={255}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-category">Category <span className="text-destructive">*</span></Label>
            <Select value={category} onValueChange={(v) => setCategory(v as DocumentCategory)}>
              <SelectTrigger id="edit-category">
                <SelectValue />
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

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-description">Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Expiry date */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-expiry">Expiry Date <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input
              id="edit-expiry"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-tags">Tags <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
            <Input
              id="edit-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. 2025, KYC, CBK"
            />
          </div>

          {/* Internal notes */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-notes">Internal Notes <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={2000}
              rows={2}
              className="resize-none"
              placeholder="Notes visible only to your team…"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground" disabled={isSaving || !name.trim()}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
