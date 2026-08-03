"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BlogError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 pt-28">
      <section className="max-w-xl rounded-lg border border-border/70 bg-card/80 p-8 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
        <h1 className="mt-5 text-2xl font-semibold text-foreground">Blog articles could not load</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The public Blog service is temporarily unavailable. Please try again in a moment.
        </p>
        <Button type="button" onClick={reset} className="mt-6">
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Retry
        </Button>
      </section>
    </main>
  )
}
