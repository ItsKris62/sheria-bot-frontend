"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";

type KnowledgeBaseAnalyticsTrackerProps =
  | {
      type: "listing";
      hasSearch: boolean;
      category?: string;
      tag?: string;
      resultCount: number;
      page: number;
    }
  | {
      type: "article";
      slug: string;
      category?: string | null;
    };

export function KnowledgeBaseAnalyticsTracker(props: KnowledgeBaseAnalyticsTrackerProps) {
  const isListing = props.type === "listing";
  const hasSearch = isListing ? props.hasSearch : false;
  const category = isListing ? props.category : props.category || undefined;
  const tag = isListing ? props.tag : undefined;
  const resultCount = isListing ? props.resultCount : undefined;
  const page = isListing ? props.page : undefined;
  const slug = isListing ? undefined : props.slug;

  useEffect(() => {
    if (isListing) {
      trackEvent("knowledge_base_viewed", {
        has_search: hasSearch,
        kb_category: category,
        kb_tag: tag,
        result_count: resultCount,
        page,
      });
      return;
    }

    trackEvent("knowledge_base_article_opened", {
      kb_slug: slug,
      kb_category: category,
    });
  }, [category, hasSearch, isListing, page, resultCount, slug, tag]);

  return null;
}
