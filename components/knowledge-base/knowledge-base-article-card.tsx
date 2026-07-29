import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { KnowledgeBaseArticle } from "@/components/knowledge-base/types";
import {
  formatKnowledgeBaseDate,
  getArticleExcerpt,
  getAuthorName,
} from "@/components/knowledge-base/knowledge-base-utils";
import { cn } from "@/lib/utils";

type KnowledgeBaseArticleCardProps = {
  article: KnowledgeBaseArticle;
  variant?: "default" | "featured";
};

export function KnowledgeBaseArticleCard({
  article,
  variant = "default",
}: KnowledgeBaseArticleCardProps) {
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/knowledge-base/${article.slug}`}
      className="group block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card
        className={cn(
          "h-full overflow-hidden border-border/70 bg-card/70 transition-colors hover:border-primary/60",
          isFeatured && "border-primary/40 bg-primary/5"
        )}
      >
        <CardContent className={cn("flex h-full flex-col p-5", isFeatured && "p-6 sm:p-8")}>
          <div className="flex flex-wrap items-center gap-2">
            {isFeatured && (
              <Badge className="border-transparent bg-primary text-primary-foreground">
                Latest guidance
              </Badge>
            )}
            <Badge variant="outline" className="max-w-full">
              <span className="truncate">{article.category || "Guidance"}</span>
            </Badge>
            {article.subcategory && (
              <Badge variant="secondary" className="max-w-full">
                <span className="truncate">{article.subcategory}</span>
              </Badge>
            )}
          </div>

          <h3
            className={cn(
              "mt-4 text-balance font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary",
              isFeatured ? "text-2xl sm:text-3xl" : "text-lg"
            )}
          >
            {article.title}
          </h3>

          <p
            className={cn(
              "mt-3 text-muted-foreground",
              isFeatured ? "line-clamp-4 text-base leading-relaxed" : "line-clamp-3 text-sm leading-6"
            )}
          >
            {getArticleExcerpt(article)}
          </p>

          {article.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2" aria-label="Article tags">
              {article.tags.slice(0, isFeatured ? 5 : 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border/80 bg-muted/50 px-2 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto pt-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                {getAuthorName(article)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                {formatKnowledgeBaseDate(article.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {article.readingTime || 1} min read
              </span>
            </div>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
              Read guidance
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
