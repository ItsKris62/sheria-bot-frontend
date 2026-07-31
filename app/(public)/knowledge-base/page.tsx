import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  FileText,
  MessageSquareText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { KnowledgeBaseAnalyticsTracker } from "@/components/knowledge-base/knowledge-base-analytics-tracker";
import { KnowledgeBaseArticleCard } from "@/components/knowledge-base/knowledge-base-article-card";
import { KnowledgeBaseControls } from "@/components/knowledge-base/knowledge-base-controls";
import type { PublishedKnowledgeBaseResponse } from "@/components/knowledge-base/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { absoluteUrl } from "@/lib/site-url";

const PAGE_SIZE = 9;

type SearchParamValue = string | string[] | undefined;
type PageSearchParams = Record<string, SearchParamValue>;

type FetchResult =
  | { data: PublishedKnowledgeBaseResponse; error: null }
  | { data: null; error: string };

function getTrpcUrl(procedure: string) {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");
  const trpcBase = apiUrl.endsWith("/trpc") ? apiUrl : `${apiUrl}/trpc`;
  return new URL(`${trpcBase}/${procedure}`);
}

function firstParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

function cleanParam(value: SearchParamValue) {
  return firstParam(value)?.trim() || "";
}

function parsePage(value: SearchParamValue) {
  const page = Number.parseInt(firstParam(value) || "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function buildPageHref(params: {
  query: string;
  category: string;
  tag: string;
  page: number;
}) {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set("q", params.query);
  if (params.category) searchParams.set("category", params.category);
  if (params.tag) searchParams.set("tag", params.tag);
  if (params.page > 1) searchParams.set("page", String(params.page));

  const queryString = searchParams.toString();
  return queryString ? `/knowledge-base?${queryString}` : "/knowledge-base";
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function uniqueSorted(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) =>
    a.localeCompare(b)
  );
}

async function getPublishedKnowledgeBase(input: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
}): Promise<FetchResult> {
  const url = getTrpcUrl("content.listPublishedKnowledgeBase");
  url.searchParams.set("input", JSON.stringify(input));

  try {
    const response = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!response.ok) {
      return { data: null, error: "Knowledge Base articles could not be loaded." };
    }

    const json = await response.json();
    return { data: json.result.data, error: null };
  } catch (error) {
    console.error("Failed to fetch Knowledge Base articles", error);
    return { data: null, error: "Knowledge Base articles could not be loaded." };
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const hasFilterState = Boolean(
    cleanParam(params.q) || cleanParam(params.category) || cleanParam(params.tag) || parsePage(params.page) > 1
  );
  const url = absoluteUrl("/knowledge-base");

  return {
    title: "Knowledge Base | SheriaBot",
    description:
      "Practical Kenyan fintech compliance guidance from SheriaBot, covering regulatory obligations, reporting, licensing and operating controls.",
    alternates: {
      canonical: url,
    },
    robots: hasFilterState ? { index: false, follow: true } : undefined,
    openGraph: {
      title: "Knowledge Base | SheriaBot",
      description:
        "Practical Kenyan fintech compliance guidance from SheriaBot, covering regulatory obligations, reporting, licensing and operating controls.",
      url,
      siteName: "SheriaBot",
      type: "website",
      images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Knowledge Base | SheriaBot",
      description:
        "Practical Kenyan fintech compliance guidance from SheriaBot, covering regulatory obligations, reporting, licensing and operating controls.",
      images: [absoluteUrl("/og-image.png")],
    },
  };
}

export default async function KnowledgeBasePage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const params = await searchParams;
  const query = cleanParam(params.q);
  const category = cleanParam(params.category);
  const tag = cleanParam(params.tag);
  const page = parsePage(params.page);

  const [listingResult, facetResult] = await Promise.all([
    getPublishedKnowledgeBase({
      page,
      limit: PAGE_SIZE,
      search: query || undefined,
      category: category || undefined,
      tag: tag || undefined,
    }),
    getPublishedKnowledgeBase({ page: 1, limit: 50 }),
  ]);

  const articles = listingResult.data?.items || [];
  const pagination = listingResult.data?.pagination || {
    page,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  };
  const facetArticles = facetResult.data?.items || [];
  const categories = uniqueSorted([...facetArticles.map((article) => article.category), category]);
  const tags = uniqueSorted([
    ...facetArticles.flatMap((article) => article.tags || []),
    tag,
  ]);
  const hasActiveFilters = Boolean(query || category || tag);
  const latestArticle = page === 1 ? articles[0] : undefined;
  const gridArticles = latestArticle ? articles.slice(1) : articles;
  const totalPages = Math.max(1, pagination.totalPages || 1);

  return (
    <div className="flex flex-col">
      <KnowledgeBaseAnalyticsTracker
        type="listing"
        hasSearch={Boolean(query)}
        category={category || undefined}
        tag={tag || undefined}
        resultCount={pagination.total}
        page={page}
      />

      <section className="border-b border-border bg-background py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Kenyan fintech compliance guidance, ready when you need it
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Search published SheriaBot guidance across licensing, AML, reporting,
              data protection and regulatory operations.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-5xl">
            <KnowledgeBaseControls
              query={query}
              category={category}
              tag={tag}
              categories={categories}
              tags={tags}
              resultCount={pagination.total}
            />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
          <main className="min-w-0 space-y-8" aria-labelledby="knowledge-base-results">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-primary">
                  {hasActiveFilters ? "Filtered guidance" : "Published guidance"}
                </p>
                <h2 id="knowledge-base-results" className="mt-2 text-2xl font-semibold text-foreground">
                  {pagination.total} {pagination.total === 1 ? "article" : "articles"}
                </h2>
              </div>
              {hasActiveFilters && (
                <Button variant="outline" asChild>
                  <Link href="/knowledge-base">Clear filters</Link>
                </Button>
              )}
            </div>

            {listingResult.error && (
              <Alert role="alert" variant="destructive">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <AlertTitle>Knowledge Base unavailable</AlertTitle>
                <AlertDescription>{listingResult.error}</AlertDescription>
              </Alert>
            )}

            {!listingResult.error && articles.length === 0 && (
              <Card className="border-border/70 bg-card/70" role="status" aria-live="polite">
                <CardContent className="p-8 text-center sm:p-12">
                  <BookOpenCheck className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {hasActiveFilters ? "No matching guidance found" : "No published guidance yet"}
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    {hasActiveFilters
                      ? "Try a broader search, remove a filter, or browse all published Knowledge Base articles."
                      : "Published admin Knowledge Base articles will appear here automatically."}
                  </p>
                  {hasActiveFilters && (
                    <Button className="mt-6" asChild>
                      <Link href="/knowledge-base">Browse all guidance</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {latestArticle && (
              <section aria-labelledby="latest-guidance-heading">
                <h2 id="latest-guidance-heading" className="sr-only">
                  Latest guidance
                </h2>
                <KnowledgeBaseArticleCard article={latestArticle} variant="featured" />
              </section>
            )}

            {gridArticles.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {gridArticles.map((article) => (
                  <KnowledgeBaseArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {!listingResult.error && pagination.totalPages > 1 && (
              <Pagination aria-label="Knowledge Base pagination">
                <PaginationContent className="flex-wrap">
                  <PaginationItem>
                    <PaginationPrevious
                      href={buildPageHref({
                        query,
                        category,
                        tag,
                        page: Math.max(1, page - 1),
                      })}
                      aria-disabled={page <= 1}
                      className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>

                  {getVisiblePages(page, totalPages).map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href={buildPageHref({ query, category, tag, page: pageNumber })}
                        isActive={pageNumber === page}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href={buildPageHref({
                        query,
                        category,
                        tag,
                        page: Math.min(totalPages, page + 1),
                      })}
                      aria-disabled={page >= totalPages}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </main>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start" aria-label="Knowledge Base resources">
            <Card className="border-border/70 bg-card/70">
              <CardHeader>
                <CardTitle className="text-lg">Useful resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ResourceLink
                  href="/blog"
                  icon={FileText}
                  title="Regulatory insights"
                  description="Source-backed updates and compliance explainers."
                />
                <ResourceLink
                  href="/contact"
                  icon={MessageSquareText}
                  title="Contact SheriaBot"
                  description="Speak with the team about your compliance workflow."
                />
                <ResourceLink
                  href="/pilot/apply"
                  icon={ShieldCheck}
                  title="Apply for pilot access"
                  description="Explore SheriaBot with a guided onboarding path."
                />
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}

function ResourceLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex gap-3 rounded-lg border border-border/70 bg-background/60 p-4 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {title}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
        <span className="mt-1 block text-sm leading-5 text-muted-foreground">{description}</span>
      </span>
    </Link>
  );
}
