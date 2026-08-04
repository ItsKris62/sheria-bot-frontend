"use client"

import { useId, useRef, useState } from "react"
import { Lightbulb, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { trpc } from "@/lib/trpc"
import {
  BLOG_ANALYTICS_EVENTS,
  getBlogReadingSessionId,
  trackBlogEvent,
} from "@/lib/analytics/blog-events"

interface BlogTopicRequestProps {
  sourcePage: string
  category?: string
  jurisdiction?: string
  compact?: boolean
}

export function BlogTopicRequest({ sourcePage, category, jurisdiction = "Kenya", compact = false }: BlogTopicRequestProps) {
  const formId = useId()
  const [topic, setTopic] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const honeypotRef = useRef<HTMLInputElement | null>(null)
  const submitTopic = trpc.blog.submitTopicRequest.useMutation()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("idle")
    setMessage("")

    try {
      await submitTopic.mutateAsync({
        topic,
        category,
        jurisdiction,
        sourcePage,
        contactEmail: contactEmail.trim() || undefined,
        readerSessionId: getBlogReadingSessionId(),
        spamTrap: honeypotRef.current?.value || undefined,
      })

      trackBlogEvent(BLOG_ANALYTICS_EVENTS.topicRequestSubmitted, {
        category,
        topicCategory: category,
      })
      setStatus("success")
      setMessage("Thanks. Our editorial team will review the request.")
      setTopic("")
      setContactEmail("")
    } catch {
      setStatus("error")
      setMessage("We could not submit the request right now. Please try again in a moment.")
    }
  }

  const topicId = `${formId}-topic`
  const emailId = `${formId}-email`
  const topicHelpId = `${formId}-topic-help`
  const statusId = `${formId}-status`

  return (
    <div className={compact ? "rounded-lg border border-border/70 bg-card/70 p-5" : "rounded-lg border border-primary/20 bg-primary/5 p-6"}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Lightbulb className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <h2 className={compact ? "text-base font-semibold text-foreground" : "text-xl font-semibold text-foreground"}>
            Request a topic
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Tell us what regulatory question or compliance topic you want SheriaBot editors to cover next.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor={topicId}>Topic</Label>
          <Textarea
            id={topicId}
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Example: CBK licensing expectations for payment service providers"
            maxLength={300}
            aria-describedby={topicHelpId}
            required
          />
          <p id={topicHelpId} className="text-xs text-muted-foreground">
            {topic.length}/300 characters. Requests enter editorial review only.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={emailId}>Email address <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            id={emailId}
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <input
          ref={honeypotRef}
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-muted-foreground">
            Requests enter editorial review only. They do not create automated drafts.
          </p>
          <Button
            type="submit"
            disabled={submitTopic.isPending || topic.trim().length < 5}
            aria-describedby={message ? statusId : undefined}
          >
            {submitTopic.isPending ? "Sending..." : "Send request"}
            <Send className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {message ? (
          <p
            id={statusId}
            role="status"
            aria-live="polite"
            className={status === "error" ? "text-sm text-destructive" : "text-sm text-primary"}
          >
            {message}
          </p>
        ) : null}
      </form>
    </div>
  )
}
