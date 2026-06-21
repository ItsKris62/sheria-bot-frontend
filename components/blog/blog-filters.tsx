"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const categories = [
  "All",
  "Regulatory Updates",
  "Compliance Tips",
  "Industry News",
  "Product Updates",
  "Case Studies",
]

export function BlogFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentCategory = searchParams.get("category") || "All"
  const currentQ = searchParams.get("q") || ""
  
  const [q, setQ] = useState(currentQ)

  const updateFilters = (newCategory: string, newQ: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newCategory && newCategory !== "All") {
      params.set("category", newCategory)
    } else {
      params.delete("category")
    }
    
    if (newQ) {
      params.set("q", newQ)
    } else {
      params.delete("q")
    }
    
    // Reset to page 1 on filter change
    params.delete("page")
    
    router.push(`/blog?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters(currentCategory, q)
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <form onSubmit={handleSearch} className="relative max-w-sm flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-9"
        />
      </form>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={currentCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilters(category, q)}
            className={currentCategory === category 
              ? "bg-primary text-primary-foreground" 
              : "bg-transparent"
            }
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}
