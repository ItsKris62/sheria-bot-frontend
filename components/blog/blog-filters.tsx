"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  BLOG_ANALYTICS_EVENTS,
  normalizedSearchLength,
  trackBlogEvent,
  trackBlogEventOnce,
} from "@/lib/analytics/blog-events"
import type { BlogTaxonomyItem } from "@/lib/blog/api"

interface BlogFiltersProps {
  resultCount: number
  page?: number
  categories: BlogTaxonomyItem[]
  tags: BlogTaxonomyItem[]
}

export function BlogFilters({ resultCount, page = 1, categories, tags }: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentCategory = searchParams.get("category") || "All"
  const currentQ = searchParams.get("q") || ""
  const currentTag = searchParams.get("tag") || ""
  
  const [searchDraft, setSearchDraft] = useState({ source: currentQ, value: currentQ })
  const q = searchDraft.source === currentQ ? searchDraft.value : currentQ

  const categoryItems = useMemo(() => [{ name: "All", count: resultCount }, ...categories], [categories, resultCount])

  useEffect(() => {
    trackBlogEventOnce(BLOG_ANALYTICS_EVENTS.listingViewed, `blog:${currentCategory}:${currentTag}:${page}:${resultCount}:${normalizedSearchLength(currentQ)}`, {
      category: currentCategory === "All" ? undefined : currentCategory,
      resultCount,
      page,
      queryLength: normalizedSearchLength(currentQ),
      hasResults: resultCount > 0,
    })
    if (currentTag) {
      trackBlogEvent(BLOG_ANALYTICS_EVENTS.tagSelected, {
        category: currentCategory === "All" ? undefined : currentCategory,
        tags: [currentTag],
        resultCount,
        page,
      })
    }
  }, [currentCategory, currentQ, currentTag, page, resultCount])

  useEffect(() => {
    if (!currentQ.trim()) return

    let cancelled = false
    function trackCommittedSearch() {
      const queryLength = normalizedSearchLength(currentQ)
      if (cancelled) return

      trackBlogEventOnce(BLOG_ANALYTICS_EVENTS.searchPerformed, `search:${queryLength}:${currentCategory}:${page}:${resultCount}`, {
        queryLength,
        resultCount,
        hasResults: resultCount > 0,
        category: currentCategory === "All" ? undefined : currentCategory,
        page,
      })

      if (resultCount === 0) {
        trackBlogEventOnce(BLOG_ANALYTICS_EVENTS.searchNoResults, `search-empty:${queryLength}:${currentCategory}:${page}`, {
          queryLength,
          resultCount,
          hasResults: false,
          category: currentCategory === "All" ? undefined : currentCategory,
          page,
        })
      }
    }

    trackCommittedSearch()
    return () => {
      cancelled = true
    }
  }, [currentCategory, currentQ, page, resultCount])

  const updateFilters = (newCategory: string, newQ: string, newTag = currentTag) => {
    const params = new URLSearchParams(searchParams.toString())
    const nextQ = newQ.trim().replace(/\s+/g, " ")
    const nextTag = newTag.trim()
    if (newCategory && newCategory !== "All") {
      params.set("category", newCategory)
    } else {
      params.delete("category")
    }
    
    if (nextQ) {
      params.set("q", nextQ)
    } else {
      params.delete("q")
    }

    if (nextTag) {
      params.set("tag", nextTag)
    } else {
      params.delete("tag")
    }
    
    // Reset to page 1 on filter change
    params.delete("page")
    
    const queryString = params.toString()
    router.push(queryString ? `/blog?${queryString}` : "/blog")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters(currentCategory, q)
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative max-w-xl flex-1 space-y-2">
          <Label htmlFor="blog-search">Search SheriaBot articles</Label>
          <Search className="absolute left-3 top-[2.65rem] h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            id="blog-search"
            placeholder="Search licensing, AML, data protection..."
            value={q}
            onChange={(e) => setSearchDraft({ source: currentQ, value: e.target.value })}
            className="h-11 pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="h-11">
            Search
          </Button>
          {(currentQ || currentCategory !== "All" || currentTag) && (
            <Button type="button" variant="outline" className="h-11 bg-transparent" onClick={() => router.push("/blog#articles")}>
              <X className="mr-2 h-4 w-4" aria-hidden="true" />
              Clear
            </Button>
          )}
        </div>
      </form>

      <div aria-label="Blog categories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {categoryItems.map((category) => (
          <Button
            key={category.name}
            type="button"
            variant={currentCategory === category.name ? "default" : "outline"}
            size="sm"
            aria-current={currentCategory === category.name ? "page" : undefined}
            onClick={() => {
              if (category.name !== currentCategory) {
                trackBlogEvent(BLOG_ANALYTICS_EVENTS.categorySelected, {
                  category: category.name === "All" ? undefined : category.name,
                  queryLength: normalizedSearchLength(q),
                  resultCount,
                  hasResults: resultCount > 0,
                  page,
                })
              }
              updateFilters(category.name, q, currentTag)
            }}
            className={currentCategory === category.name ? "shrink-0 bg-primary text-primary-foreground" : "shrink-0 bg-transparent"}
          >
            {category.name}
            {category.name !== "All" ? <span className="ml-2 text-xs opacity-70">{category.count}</span> : null}
          </Button>
        ))}
      </div>

      {tags.length > 0 && (
        <div aria-label="Blog tags" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {tags.map((tag) => (
            <Button
              key={tag.name}
              type="button"
              variant={currentTag === tag.name ? "default" : "outline"}
              size="sm"
              aria-current={currentTag === tag.name ? "page" : undefined}
              onClick={() => updateFilters(currentCategory, q, currentTag === tag.name ? "" : tag.name)}
              className={currentTag === tag.name ? "shrink-0 bg-primary text-primary-foreground" : "shrink-0 bg-transparent text-muted-foreground"}
            >
              #{tag.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
