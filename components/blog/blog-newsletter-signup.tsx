"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { trpc } from "@/lib/trpc"
import {
  BLOG_ANALYTICS_EVENTS,
  getBlogReadingSessionId,
  trackBlogEvent,
  trackBlogEventOnce,
} from "@/lib/analytics/blog-events"

interface BlogNewsletterSignupProps {
  sourcePage: string
  category?: string
  postId?: string
  slug?: string
}

export function BlogNewsletterSignup({ sourcePage, category, postId, slug }: BlogNewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState("")
  const ref = useRef<HTMLDivElement | null>(null)
  const honeypotRef = useRef<HTMLInputElement | null>(null)
  const subscribe = trpc.publicMarketing.subscribeBlogNewsletter.useMutation()

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined") return

    let timer: ReturnType<typeof setTimeout> | null = null
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        timer = setTimeout(() => {
          trackBlogEventOnce(BLOG_ANALYTICS_EVENTS.newsletterCtaViewed, sourcePage, {
            postId,
            slug,
            category,
          })
          observer.unobserve(node)
        }, 500)
      } else if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }, { threshold: [0, 0.5, 1] })

    observer.observe(node)
    return () => {
      if (timer) clearTimeout(timer)
      observer.disconnect()
    }
  }, [category, postId, slug, sourcePage])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return
    setMessage("")

    try {
      await subscribe.mutateAsync({
        email,
        sourcePage,
        readerSessionId: getBlogReadingSessionId(),
        privacyPolicyVersion: "current",
        spamTrap: honeypotRef.current?.value || undefined,
      })

      setSubmitted(true)
      setEmail("")
      setMessage("Thanks. If the address is eligible, it will receive the SheriaBot compliance brief.")
      trackBlogEvent(BLOG_ANALYTICS_EVENTS.newsletterSubscriptionCompleted, {
        postId,
        slug,
        category,
      })
    } catch {
      setSubmitted(false)
      setMessage("We could not complete the subscription right now. Please try again in a moment.")
    }
  }

  return (
    <div ref={ref}>
      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 space-y-2 text-left">
            <Label htmlFor={`blog-newsletter-${sourcePage.replace(/[^a-z0-9]/gi, "-")}`}>Email address</Label>
            <Input
              id={`blog-newsletter-${sourcePage.replace(/[^a-z0-9]/gi, "-")}`}
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-describedby="blog-newsletter-consent"
              autoComplete="email"
              required
            />
          </div>
          <Button className="mt-auto bg-primary text-primary-foreground hover:bg-primary/90" disabled={subscribe.isPending}>
            {subscribe.isPending ? "Subscribing..." : submitted ? "Subscribed" : "Subscribe"}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <input
          ref={honeypotRef}
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <p id="blog-newsletter-consent" className="mt-3 text-left text-xs leading-5 text-muted-foreground">
          By subscribing, you agree to receive SheriaBot editorial updates. You can unsubscribe at any time. See our{" "}
          <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
        {message ? (
          <p
            role="status"
            aria-live="polite"
            className={subscribe.isError ? "mt-3 text-left text-sm text-destructive" : "mt-3 text-left text-sm text-primary"}
          >
            {message}
          </p>
        ) : null}
      </form>
    </div>
  )
}
