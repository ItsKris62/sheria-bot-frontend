"use client";

import { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trackEvent } from "@/lib/analytics";

type KnowledgeBaseControlsProps = {
  query: string;
  category: string;
  tag: string;
  categories: string[];
  tags: string[];
  resultCount: number;
};

export function KnowledgeBaseControls({
  query,
  category,
  tag,
  categories,
  tags,
  resultCount,
}: KnowledgeBaseControlsProps) {
  const router = useRouter();

  function pushWithParams(nextValues: { q?: string; category?: string; tag?: string }) {
    const params = new URLSearchParams(window.location.search);

    if ("q" in nextValues) {
      const nextQuery = nextValues.q?.trim();
      if (nextQuery) params.set("q", nextQuery);
      else params.delete("q");
    }

    if ("category" in nextValues) {
      const nextCategory = nextValues.category;
      if (nextCategory) params.set("category", nextCategory);
      else params.delete("category");
    }

    if ("tag" in nextValues) {
      const nextTag = nextValues.tag;
      if (nextTag) params.set("tag", nextTag);
      else params.delete("tag");
    }

    params.delete("page");
    const queryString = params.toString();
    router.push(queryString ? `/knowledge-base?${queryString}` : "/knowledge-base");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get("q") || "");
    pushWithParams({ q: nextQuery });

    trackEvent("knowledge_base_searched", {
      has_search: Boolean(nextQuery.trim()),
      kb_category: category || undefined,
      kb_tag: tag || undefined,
      result_count: resultCount,
    });
  }

  function handleCategoryChange(value: string) {
    const nextCategory = value === "all" ? "" : value;
    pushWithParams({ category: nextCategory });

    if (nextCategory) {
      trackEvent("knowledge_base_category_selected", {
        kb_category: nextCategory,
        has_search: Boolean(query),
      });
    }
  }

  function handleTagChange(value: string) {
    pushWithParams({ tag: value === "all" ? "" : value });
  }

  return (
    <div className="rounded-[26px] border border-white/[0.1] bg-white/[0.045] p-4 shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-5">
      <form
        role="search"
        aria-label="Search Knowledge Base articles"
        onSubmit={handleSubmit}
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem_14rem_auto]"
      >
        <div className="space-y-2">
          <Label htmlFor="knowledge-base-search">Search guidance</Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="knowledge-base-search"
              name="q"
              defaultValue={query}
              placeholder="Search AML, licensing, data protection..."
              className="h-12 border-white/[0.1] bg-black/20 pl-10 text-white placeholder:text-white/35 focus-visible:border-[#1ED760]/50 focus-visible:ring-[#1ED760]/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label id="knowledge-base-category-label">Category</Label>
          <Select value={category || "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger
              className="h-12 border-white/[0.1] bg-black/20 text-white"
              aria-labelledby="knowledge-base-category-label"
            >
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label id="knowledge-base-tag-label">Tag</Label>
          <Select value={tag || "all"} onValueChange={handleTagChange}>
            <SelectTrigger className="h-12 border-white/[0.1] bg-black/20 text-white" aria-labelledby="knowledge-base-tag-label">
              <SelectValue placeholder="All tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              {tags.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2">
          <Button type="submit" className="h-11 w-full lg:w-auto">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Apply
          </Button>
          {(query || category || tag) && (
            <Button variant="outline" size="icon" className="h-11 w-11" asChild>
              <Link href="/knowledge-base" aria-label="Clear Knowledge Base filters">
                <X className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
