"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { trpc } from "@/lib/trpc"
import { getErrorMessage } from "@/lib/trpc"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Send, Loader2 } from "lucide-react"

// ─── Schema (mirrors backend Zod schema) ─────────────────────────────────────

const createTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  description: z.string().min(20, "Please provide more detail (at least 20 characters)").max(5000),
  category: z.enum(["BILLING", "TECHNICAL", "COMPLIANCE_QUERY", "ACCOUNT", "FEATURE_REQUEST", "OTHER"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
})

type CreateTicketForm = z.infer<typeof createTicketSchema>

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewTicketPage() {
  const router = useRouter()

  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<CreateTicketForm["category"] | "">("")
  const [priority, setPriority] = useState<CreateTicketForm["priority"]>("MEDIUM")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createTicket = trpc.support.create.useMutation({
    onSuccess: (ticket: any) => {
      toast.success("Ticket submitted", {
        description: `Your ticket ${ticket.ticketNumber} has been received.`,
      })
      router.push(`/support/${ticket.ticketNumber}`)
    },
    onError: (err) => {
      toast.error("Failed to submit ticket", { description: getErrorMessage(err) })
    },
  })

  function handleSubmit() {
    const result = createTicketSchema.safeParse({ subject, description, category, priority })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[String(err.path[0])] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    createTicket.mutate(result.data)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/support" className="hover:text-foreground transition-colors">
          Support
        </Link>
        <span>/</span>
        <span className="text-foreground">New Ticket</span>
      </div>

      {/* Back + Title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/support">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Support</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Submit a Support Ticket</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Our team typically responds within 24 hours</p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Ticket Details</CardTitle>
          <CardDescription>
            Please provide as much detail as possible so we can help you efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {/* Subject */}
            <div className="space-y-1.5">
              <Label htmlFor="subject">
                Subject <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="Brief summary of your issue"
                className="bg-background"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value)
                  if (errors.subject) setErrors((prev) => ({ ...prev, subject: "" }))
                }}
              />
              {errors.subject && (
                <p className="text-xs text-destructive">{errors.subject}</p>
              )}
            </div>

            {/* Category + Priority */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(v) => {
                    setCategory(v as CreateTicketForm["category"])
                    if (errors.category) setErrors((prev) => ({ ...prev, category: "" }))
                  }}
                >
                  <SelectTrigger id="category" className="bg-background">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BILLING">Billing</SelectItem>
                    <SelectItem value="TECHNICAL">Technical</SelectItem>
                    <SelectItem value="COMPLIANCE_QUERY">Compliance Query</SelectItem>
                    <SelectItem value="ACCOUNT">Account</SelectItem>
                    <SelectItem value="FEATURE_REQUEST">Feature Request</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  defaultValue="MEDIUM"
                  onValueChange={(v) => setPriority(v as CreateTicketForm["priority"])}
                >
                  <SelectTrigger id="priority" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Select Urgent only for issues blocking your operations.
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your issue in detail. Include any error messages, steps to reproduce, or relevant context."
                className="min-h-[200px] bg-background resize-y"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (errors.description) setErrors((prev) => ({ ...prev, description: "" }))
                }}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={createTicket.isPending}
                onClick={handleSubmit}
              >
                {createTicket.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Ticket
                  </>
                )}
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/support">Cancel</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
