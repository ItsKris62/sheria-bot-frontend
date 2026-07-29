import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function KnowledgeBaseLoading() {
  return (
    <div className="flex flex-col" aria-busy="true" aria-label="Loading Knowledge Base">
      <section className="border-b border-border bg-background py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-5 text-center">
            <Skeleton className="mx-auto h-6 w-32" />
            <Skeleton className="mx-auto h-12 w-full max-w-3xl" />
            <Skeleton className="mx-auto h-6 w-full max-w-2xl" />
          </div>
          <Card className="mx-auto mt-10 max-w-5xl border-border bg-card">
            <CardContent className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_14rem_14rem_auto]">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full lg:w-24" />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
          <main className="space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Card className="border-border/70 bg-card/70">
              <CardContent className="space-y-4 p-6 sm:p-8">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </CardContent>
            </Card>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="border-border/70 bg-card/70">
                  <CardContent className="space-y-4 p-5">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-7 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>

          <aside className="space-y-5">
            <Card className="border-border/70 bg-card/70">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}
