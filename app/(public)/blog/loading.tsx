import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="pt-28">
      <section className="border-b border-border pb-10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="mt-6 h-14 w-full max-w-3xl" />
            <Skeleton className="mt-4 h-14 w-full max-w-2xl" />
          </div>
          <Skeleton className="h-56 rounded-lg" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-56" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-72 rounded-lg" />
          ))}
        </div>
      </section>
    </main>
  )
}
