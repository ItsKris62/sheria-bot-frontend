"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { trpc } from "@/lib/trpc"
import { getErrorMessage } from "@/lib/trpc"
import { KENYAN_REGULATIONS } from "@/lib/calendar-config"

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddEventModalProps {
  open:    boolean
  onClose: () => void
}

interface FormState {
  title:       string
  description: string
  dueDate:     string
  priority:    string
  category:    string
  regulation:  string
  recurrence:  string
  assigneeId:  string
}

const INITIAL_FORM: FormState = {
  title:       "",
  description: "",
  dueDate:     "",
  priority:    "MEDIUM",
  category:    "CUSTOM",
  regulation:  "",
  recurrence:  "NONE",
  assigneeId:  "",
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddEventModal({ open, onClose }: AddEventModalProps) {
  const [form, setForm]     = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const utils = trpc.useUtils()

  const createEvent = trpc.calendar.create.useMutation({
    onSuccess: () => {
      void utils.calendar.list.invalidate()
      void utils.calendar.upcoming.invalidate()
      toast({ title: "Event created", description: `"${form.title}" has been added to your compliance calendar.` })
      handleClose()
    },
    onError: (error) => {
      toast({
        title:       "Failed to create event",
        description: getErrorMessage(error),
        variant:     "destructive",
      })
    },
  })

  function handleClose() {
    setForm(INITIAL_FORM)
    setErrors({})
    onClose()
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    // Clear inline error on change
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}

    if (!form.title.trim()) {
      next.title = "Title is required."
    } else if (form.title.length > 200) {
      next.title = "Title must be 200 characters or fewer."
    }

    if (!form.dueDate) {
      next.dueDate = "Due date is required."
    }

    if (form.description.length > 2000) {
      next.description = "Description must be 2000 characters or fewer."
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validate()) return

    // Convert the date input value (YYYY-MM-DD) to a full ISO-8601 datetime string
    const dueDateISO = new Date(form.dueDate + "T00:00:00.000Z").toISOString()

    createEvent.mutate({
      title:       form.title.trim(),
      description: form.description.trim() || undefined,
      dueDate:     dueDateISO,
      priority:    form.priority as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      category:    form.category as "CUSTOM" | "FILING" | "AUDIT" | "RENEWAL" | "REVIEW",
      regulation:  form.regulation && form.regulation !== "__none__" ? form.regulation : undefined,
      recurrence:  form.recurrence as "NONE" | "MONTHLY" | "QUARTERLY" | "ANNUALLY",
      assigneeId:  undefined, // assignee dropdown omitted for now — org members query is separate
    })
  }

  const isLoading = createEvent.isPending

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Compliance Event</DialogTitle>
          <DialogDescription>
            Create a new deadline, audit, filing, or milestone for your compliance calendar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="ce-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ce-title"
              placeholder="e.g. Submit Quarterly AML Report"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              disabled={isLoading}
              maxLength={200}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="ce-description">Description</Label>
            <Textarea
              id="ce-description"
              placeholder="Optional details about this event..."
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              disabled={isLoading}
              rows={3}
              maxLength={2000}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <Label htmlFor="ce-dueDate">
              Due Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ce-dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => setField("dueDate", e.target.value)}
              disabled={isLoading}
            />
            {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
          </div>

          {/* Priority + Category — side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ce-priority">Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setField("priority", v)}
                disabled={isLoading}
              >
                <SelectTrigger id="ce-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ce-category">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setField("category", v)}
                disabled={isLoading}
              >
                <SelectTrigger id="ce-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                  <SelectItem value="FILING">Filing</SelectItem>
                  <SelectItem value="AUDIT">Audit</SelectItem>
                  <SelectItem value="RENEWAL">Renewal</SelectItem>
                  <SelectItem value="REVIEW">Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Linked Regulation */}
          <div className="space-y-1.5">
            <Label htmlFor="ce-regulation">Linked Regulation</Label>
            <Select
              value={form.regulation || "__none__"}
              onValueChange={(v) => setField("regulation", v === "__none__" ? "" : v)}
              disabled={isLoading}
            >
              <SelectTrigger id="ce-regulation">
                <SelectValue placeholder="Select a regulation (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {KENYAN_REGULATIONS.map((reg) => (
                  <SelectItem key={reg} value={reg}>
                    {reg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recurrence */}
          <div className="space-y-1.5">
            <Label htmlFor="ce-recurrence">Recurrence</Label>
            <Select
              value={form.recurrence}
              onValueChange={(v) => setField("recurrence", v)}
              disabled={isLoading}
            >
              <SelectTrigger id="ce-recurrence">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">Does not repeat</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                <SelectItem value="ANNUALLY">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isLoading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
