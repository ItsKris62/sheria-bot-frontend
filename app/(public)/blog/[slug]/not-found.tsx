import Link from "next/link"
import { ArrowLeft, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BlogArticleNotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 pt-28">
      <section className="max-w-xl rounded-lg border border-border/70 bg-card/80 p-8 text-center">
        <SearchX className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
        <h1 className="mt-5 text-2xl font-semibold text-foreground">Article not found</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This article may have moved, been archived, or never been published publicly.
        </p>
        <Button asChild className="mt-6">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to Blog
          </Link>
        </Button>
      </section>
    </main>
  )
}
