import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CalendarDays, Clock, UserRound } from "lucide-react";

import { KnowledgeBaseAnalyticsTracker } from "@/components/knowledge-base/knowledge-base-analytics-tracker";
import { KnowledgeBaseJsonLd } from "@/components/knowledge-base/knowledge-base-json-ld";
import type { KnowledgeBaseArticleDetail } from "@/components/knowledge-base/types";
import {
  deriveReadingTime,
  formatKnowledgeBaseDate,
  getArticleExcerpt,
  getAuthorName,
} from "@/components/knowledge-base/knowledge-base-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { absoluteUrl } from "@/lib/site-url";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type RawContentArticle = Omit<KnowledgeBaseArticleDetail, "author"> & {
  author: {
    id: string;
    fullName?: string | null;
    name?: string | null;
    avatar: string | null;
  } | null;
};

function getTrpcUrl(procedure: string) {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");
  const trpcBase = apiUrl.endsWith("/trpc") ? apiUrl : `${apiUrl}/trpc`;
  return new URL(`${trpcBase}/${procedure}`);
}

function normalizeArticle(article: RawContentArticle): KnowledgeBaseArticleDetail | null {
  if (article.contentType !== "KNOWLEDGE_BASE_ARTICLE" || !article.slug) {
    return null;
  }

  return {
    ...article,
    author: article.author
      ? {
          id: article.author.id,
          name: article.author.fullName || article.author.name || null,
          avatar: article.author.avatar,
        }
      : null,
  };
}

const getKnowledgeBaseArticle = cache(async (slug: string) => {
  const url = getTrpcUrl("content.getBySlug");
  url.searchParams.set("input", JSON.stringify({ slug }));

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error("Knowledge Base article could not be loaded.");
  }

  const json = await response.json();
  return normalizeArticle(json.result.data);
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getKnowledgeBaseArticle(slug);

  if (!article) {
    return {
      title: "Knowledge Base Article Not Found | SheriaBot",
      description: "The requested Knowledge Base article could not be found.",
      robots: { index: false, follow: true },
    };
  }

  const url = absoluteUrl(`/knowledge-base/${article.slug}`);
  const description = article.seoDescription || article.excerpt || undefined;

  return {
    title: article.seoTitle || `${article.title} | SheriaBot Knowledge Base`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: article.seoTitle || article.title,
      description,
      publishedTime: article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : undefined,
      modifiedTime: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
      authors: [getAuthorName(article)],
      section: article.category || undefined,
      tags: article.tags,
      images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle || article.title,
      description,
      images: [absoluteUrl("/og-image.png")],
    },
  };
}

export default async function KnowledgeBaseArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getKnowledgeBaseArticle(slug);

  if (!article) {
    notFound();
  }

  const readingTime = deriveReadingTime(article.content, article.readingTime);
  const authorName = getAuthorName(article);

  return (
    <div className="flex flex-col">
      <KnowledgeBaseJsonLd
        slug={article.slug}
        title={article.title}
        description={article.seoDescription || getArticleExcerpt(article)}
        author={authorName}
        datePublished={article.publishedAt}
        dateModified={article.updatedAt}
        category={article.category}
        tags={article.tags}
      />
      <KnowledgeBaseAnalyticsTracker
        type="article"
        slug={article.slug}
        category={article.category}
      />

      <section className="border-b border-border bg-background py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" className="-ml-3" asChild>
            <Link href="/knowledge-base">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Knowledge Base
            </Link>
          </Button>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary/50 text-primary">
              {article.category || "Guidance"}
            </Badge>
            {article.subcategory && <Badge variant="secondary">{article.subcategory}</Badge>}
          </div>

          <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {article.title}
          </h1>

          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {getArticleExcerpt(article)}
          </p>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              {authorName}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Published {formatKnowledgeBaseDate(article.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Updated {formatKnowledgeBaseDate(article.updatedAt)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {readingTime} min read
            </span>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:px-8">
          <article className="prose prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-primary prose-strong:text-foreground">
            {article.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
            ) : (
              <Card className="border-border/70 bg-card/70" role="status">
                <CardContent className="p-6 text-sm text-muted-foreground">
                  This article does not have body content yet.
                </CardContent>
              </Card>
            )}
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start" aria-label="Article details">
            <Card className="border-border/70 bg-card/70">
              <CardContent className="space-y-4 p-5 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Category</p>
                  <p>{article.category || "Guidance"}</p>
                </div>
                {article.tags.length > 0 && (
                  <div>
                    <p className="font-medium text-foreground">Tags</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {article.tags.map((item) => (
                        <Badge key={item} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/knowledge-base">
                    Browse all guidance
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}
