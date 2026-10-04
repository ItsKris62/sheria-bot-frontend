import { Skeleton } from "@/components/ui/skeleton"

export default function PublicLoading() {
  return (
    <section aria-busy="true" aria-label="Loading page content" className="mx-auto w-full max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <span className="sr-only" role="status">Loading page content</span>
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <Skeleton className="mx-auto h-5 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="mx-auto h-5 w-4/5" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </section>
  )
}
