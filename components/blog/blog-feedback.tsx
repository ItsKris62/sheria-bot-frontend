"use client"

import { useState } from "react"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { trpc } from "@/lib/trpc"
import {
  BLOG_ANALYTICS_EVENTS,
  getBlogReadingSessionId,
  trackBlogEvent,
} from "@/lib/analytics/blog-events"
import { cn } from "@/lib/utils"

interface BlogFeedbackProps {
  postId: string
  slug: string
  category?: string
}

export function BlogFeedback({ postId, slug, category }: BlogFeedbackProps) {
  const [selected, setSelected] = useState<"HELPFUL" | "NOT_HELPFUL" | null>(null)
  const [message, setMessage] = useState("")
  const submitFeedback = trpc.blog.submitFeedback.useMutation()

  async function submit(value: "HELPFUL" | "NOT_HELPFUL") {
    setMessage("")
    try {
      await submitFeedback.mutateAsync({
        postId,
        value,
        readerSessionId: getBlogReadingSessionId(),
      })
      setSelected(value)
      setMessage("Thanks. Your feedback helps improve SheriaBot articles.")
      trackBlogEvent(BLOG_ANALYTICS_EVENTS.feedbackSubmitted, {
        postId,
        slug,
        category,
        feedbackValue: value,
      })
    } catch {
      setMessage("We could not save your feedback right now. Please try again in a moment.")
    }
  }

  return (
    <section aria-labelledby="article-feedback-heading" className="rounded-lg border border-border/70 bg-card/80 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="article-feedback-heading" className="text-base font-semibold text-foreground">
            Was this article helpful?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your response is private and helps editors improve future guidance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={selected === "HELPFUL" ? "default" : "outline"}
            disabled={submitFeedback.isPending}
            onClick={() => submit("HELPFUL")}
            className={cn(selected !== "HELPFUL" && "bg-transparent")}
          >
            <ThumbsUp className="mr-2 h-4 w-4" aria-hidden="true" />
            Yes
          </Button>
          <Button
            type="button"
            variant={selected === "NOT_HELPFUL" ? "default" : "outline"}
            disabled={submitFeedback.isPending}
            onClick={() => submit("NOT_HELPFUL")}
            className={cn(selected !== "NOT_HELPFUL" && "bg-transparent")}
          >
            <ThumbsDown className="mr-2 h-4 w-4" aria-hidden="true" />
            Not really
          </Button>
        </div>
      </div>
      <p role="status" aria-live="polite" className={cn("mt-3 text-sm", submitFeedback.isError ? "text-destructive" : "text-primary")}>
        {message}
      </p>
    </section>
  )
}
