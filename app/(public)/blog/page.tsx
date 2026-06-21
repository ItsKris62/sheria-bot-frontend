import { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowRight, Calendar, User } from "lucide-react"
import { BlogFilters } from "@/components/blog/blog-filters"

import { getSiteUrl, absoluteUrl } from "@/lib/site-url"

export function generateMetadata(): Metadata {
  const url = absoluteUrl('/blog');
  
  return {
    title: "Regulatory Insights & Compliance News | SheriaBot",
    description: "Source-backed regulatory updates, compliance guides, and fintech compliance insights for Kenya's financial services sector.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "Regulatory Insights & Compliance News | SheriaBot",
      description: "Source-backed regulatory updates, compliance guides, and fintech compliance insights for Kenya's financial services sector.",
      url,
      siteName: "SheriaBot",
      images: [
        {
          url: absoluteUrl('/og-image.png'),
          width: 1200,
          height: 630,
        }
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Regulatory Insights & Compliance News | SheriaBot",
      description: "Source-backed regulatory updates, compliance guides, and fintech compliance insights for Kenya's financial services sector.",
      images: [absoluteUrl('/og-image.png')],
    },
  };
}

async function getPosts(searchParams: { q?: string, category?: string, page?: string }) {
  const query = searchParams.q || ""
  const category = searchParams.category === "All" ? "" : (searchParams.category || "")
  const page = parseInt(searchParams.page || "1", 10)
  
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/trpc/blog.publicList`)
  const input = {
    search: query || undefined,
    category: category || undefined,
    page,
    limit: 20
  }
  url.searchParams.set("input", JSON.stringify(input))
  
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } })
    if (!res.ok) return { posts: [], pagination: { total: 0 } }
    const json = await res.json()
    return json.result.data
  } catch (error) {
    console.error("Failed to fetch blog posts", error)
    return { posts: [], pagination: { total: 0 } }
  }
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const resolvedSearchParams = await searchParams
  const data = await getPosts(resolvedSearchParams)
  
  const filteredPosts = data.posts || []
  const featuredPosts = filteredPosts.filter((post: any) => post.featured).slice(0, 2)
  const selectedCategory = resolvedSearchParams.category || "All"

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              Blog
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Regulatory Insights &{" "}
              <span className="text-primary">Compliance News</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Stay informed with the latest regulatory updates, compliance tips, 
              and industry news from Kenya&apos;s fintech sector.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-xl font-semibold text-foreground">Featured Articles</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {featuredPosts.map((post: any) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="group h-full border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-3 text-xs">
                        {post.category || "General"}
                      </Badge>
                      <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author?.name || "Editorial Team"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-KE", { 
                            month: "short", 
                            day: "numeric", 
                            year: "numeric" 
                          }) : "Recently"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filters */}
      <section className="border-y border-border bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlogFilters />
        </div>
      </section>

      {/* All Posts */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            {selectedCategory === "All" ? "All Articles" : selectedCategory}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({data.pagination?.total || 0} {(data.pagination?.total || 0) === 1 ? "article" : "articles"})
            </span>
          </h2>

          {filteredPosts.length === 0 ? (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4 bg-transparent"
                  asChild
                >
                  <Link href="/blog">Clear Filters</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post: any) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="group h-full border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-3 text-xs">
                        {post.category || "General"}
                      </Badge>
                      <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.author?.name || "Editorial Team"}</span>
                        <span>
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-KE") : "Recently"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Stay Updated
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Subscribe to our newsletter for weekly regulatory updates and compliance tips.
              </p>
              <div className="mx-auto mt-8 flex max-w-md flex-col gap-4 sm:flex-row">
                <Input 
                  placeholder="Enter your email" 
                  type="email"
                  className="flex-1"
                />
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
