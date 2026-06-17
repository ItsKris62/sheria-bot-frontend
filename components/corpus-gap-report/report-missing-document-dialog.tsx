"use client"

import React, { useEffect, useState } from "react"
import { AlertCircle, FileQuestion, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getErrorMessage, trpc } from "@/lib/trpc"
import { trackEvent } from "@/lib/analytics"

type CorpusGapDocumentType =
  | "LEGISLATION"
  | "REGULATION"
  | "CIRCULAR"
  | "GUIDELINE"
  | "POLICY"
  | "STANDARD"
  | "OTHER"

type CorpusGapJurisdiction =
  | "KENYA"
  | "MALAWI"
  | "NIGERIA"
  | "RWANDA"
  | "OTHER"

type FormState = {
  documentName: string
  issuingAuthority: string
  documentType: CorpusGapDocumentType | ""
  jurisdiction: CorpusGapJurisdiction | ""
  description: string
  sourceUrl: string
}

type ReportMissingDocumentDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

const DOCUMENT_TYPES: Array<{ value: CorpusGapDocumentType; label: string }> = [
  { value: "LEGISLATION", label: "Legislation" },
  { value: "REGULATION", label: "Regulation" },
  { value: "CIRCULAR", label: "Circular" },
  { value: "GUIDELINE", label: "Guideline" },
  { value: "POLICY", label: "Policy" },
  { value: "STANDARD", label: "Standard" },
  { value: "OTHER", label: "Other" },
]

const JURISDICTIONS: Array<{ value: CorpusGapJurisdiction; label: string }> = [
  { value: "KENYA", label: "Kenya" },
  { value: "MALAWI", label: "Malawi" },
  { value: "NIGERIA", label: "Nigeria" },
  { value: "RWANDA", label: "Rwanda" },
  { value: "OTHER", label: "Other" },
]

const INITIAL_FORM: FormState = {
  documentName: "",
  issuingAuthority: "",
  documentType: "",
  jurisdiction: "KENYA",
  description: "",
  sourceUrl: "",
}

const SUBMITTED_TOAST =
  "Report submitted \u2014 thank you for helping improve SheriaBot's corpus"

function validateSourceUrl(sourceUrl: string): boolean {
  if (!sourceUrl) return true

  try {
    const parsed = new URL(sourceUrl)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

export function ReportMissingDocumentDialog({
  open,
  onOpenChange,
  trigger,
}: ReportMissingDocumentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [duplicateReportId, setDuplicateReportId] = useState<string | null>(null)

  const isControlled = open !== undefined
  const actualOpen = open ?? internalOpen

  const submitReport = trpc.corpusGapReport.submitReport.useMutation({
    onSuccess: (result) => {
      if (result.outcome === "DUPLICATE") {
        setDuplicateReportId(result.reportId)
        setFormError(null)
        return
      }

      setDialogOpen(false)
      trackEvent("corpus_gap_report_submitted", { 
        document_type: form.documentType,
        jurisdiction: form.jurisdiction
      })
      toast.success(SUBMITTED_TOAST)
    },
    onError: (error) => {
      toast.error("Could not submit report", {
        description: getErrorMessage(error),
      })
    },
  })

  function setDialogOpen(nextOpen: boolean) {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  function resetForm() {
    setForm(INITIAL_FORM)
    setFormError(null)
    setDuplicateReportId(null)
  }

  useEffect(() => {
    if (!actualOpen) {
      resetForm()
    } else {
      trackEvent("corpus_gap_report_opened")
    }
  }, [actualOpen])

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
    setFormError(null)
    setDuplicateReportId(null)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const documentName = form.documentName.trim()
    const issuingAuthority = form.issuingAuthority.trim()
    const description = form.description.trim()
    const sourceUrl = form.sourceUrl.trim()

    if (!documentName || !issuingAuthority || !form.documentType || !form.jurisdiction) {
      setFormError("Document name, issuing authority, document type, and jurisdiction are required.")
      return
    }

    if (!validateSourceUrl(sourceUrl)) {
      setFormError("Source URL must start with http:// or https://.")
      return
    }

    submitReport.mutate({
      documentName,
      issuingAuthority,
      documentType: form.documentType,
      jurisdiction: form.jurisdiction,
      description: description || undefined,
      sourceUrl: sourceUrl || undefined,
    })
  }

  return (
    <Dialog open={actualOpen} onOpenChange={setDialogOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileQuestion data-icon="inline-start" />
            Report Missing Document
          </DialogTitle>
          <DialogDescription className="sr-only">
            Submit a missing corpus document report.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}

          {duplicateReportId ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                We already have this document flagged for review. Report ID:{" "}
                <span className="font-mono">{duplicateReportId}</span>
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="corpus-gap-document-name">Document Name</Label>
              <Input
                id="corpus-gap-document-name"
                value={form.documentName}
                onChange={(event) => updateField("documentName", event.target.value)}
                aria-invalid={formError !== null && !form.documentName.trim()}
                maxLength={200}
                disabled={submitReport.isPending}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="corpus-gap-issuing-authority">Issuing Authority</Label>
              <Input
                id="corpus-gap-issuing-authority"
                value={form.issuingAuthority}
                onChange={(event) => updateField("issuingAuthority", event.target.value)}
                aria-invalid={formError !== null && !form.issuingAuthority.trim()}
                maxLength={160}
                disabled={submitReport.isPending}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="corpus-gap-document-type">Document Type</Label>
              <Select
                value={form.documentType}
                onValueChange={(value) => updateField("documentType", value as CorpusGapDocumentType)}
                disabled={submitReport.isPending}
              >
                <SelectTrigger id="corpus-gap-document-type" aria-invalid={formError !== null && !form.documentType}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DOCUMENT_TYPES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="corpus-gap-jurisdiction">Jurisdiction</Label>
              <Select
                value={form.jurisdiction}
                onValueChange={(value) => updateField("jurisdiction", value as CorpusGapJurisdiction)}
                disabled={submitReport.isPending}
              >
                <SelectTrigger id="corpus-gap-jurisdiction" aria-invalid={formError !== null && !form.jurisdiction}>
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {JURISDICTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="corpus-gap-description">Description optional</Label>
            <Textarea
              id="corpus-gap-description"
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              maxLength={1000}
              disabled={submitReport.isPending}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="corpus-gap-source-url">Source URL optional</Label>
            <Input
              id="corpus-gap-source-url"
              type="url"
              value={form.sourceUrl}
              onChange={(event) => updateField("sourceUrl", event.target.value)}
              aria-invalid={formError !== null && !validateSourceUrl(form.sourceUrl.trim())}
              maxLength={500}
              disabled={submitReport.isPending}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={submitReport.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitReport.isPending}>
              {submitReport.isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : null}
              Submit Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
