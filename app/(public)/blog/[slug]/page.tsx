import type { Metadata } from 'next'
import { BlogPostJsonLd } from '@/components/seo/blog-post-json-ld'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, User, ArrowRight } from "lucide-react"
import { SocialShare } from '@/components/blog/social-share'
import { SourceList } from '@/components/blog/source-list'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert, BookOpen } from "lucide-react"
import { BlogAnalyticsTracker } from '@/components/blog/blog-analytics-tracker'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPostBySlug(slug: string) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/trpc/blog.publicGetBySlug`)
  const input = { slug }
  url.searchParams.set("input", JSON.stringify(input))
  
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } })
    if (!res.ok) return null
    const json = await res.json()
    return json.result.data
  } catch (error) {
    console.error("Failed to fetch blog post", error)
    return null
  }
}

async function getRelatedPosts(category: string, currentSlug: string) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/trpc/blog.publicList`)
  const input = { category, limit: 4 }
  url.searchParams.set("input", JSON.stringify(input))
  
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } })
    if (!res.ok) return []
    const json = await res.json()
    return (json.result.data.posts || []).filter((p: any) => p.slug !== currentSlug).slice(0, 3)
  } catch (error) {
    console.error("Failed to fetch related posts", error)
    return []
  }
}

import { absoluteUrl } from '@/lib/site-url'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Article Not Found',
      description: 'The article you are looking for does not exist.',
    }
  }

  const url = post.canonicalUrl || absoluteUrl(`/blog/${slug}`)
  const imageUrl = post.ogImageUrl || post.coverImageUrl || absoluteUrl('/og-image.png')

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      authors: [post.author?.fullName || post.author?.name || 'SheriaBot'],
      section: post.category,
      tags: [...(post.tags || []), post.category, 'Kenya fintech', 'compliance'].filter(Boolean) as string[],
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: [imageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-foreground">Article Not Found</h1>
        <p className="mt-2 text-muted-foreground">The article you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild className="mt-6 bg-primary text-primary-foreground">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>
    )
  }

  const url = post.canonicalUrl || absoluteUrl(`/blog/${slug}`)
  const relatedPosts = await getRelatedPosts(post.category, post.slug)

  return (
    <div className="flex flex-col">
      {/* Per-post structured data */}
      <BlogPostJsonLd
        slug={slug}
        title={post.title}
        excerpt={post.excerpt}
        author={post.author?.fullName || post.author?.name || 'Editorial Team'}
        authorRole={post.author?.role || 'Expert'}
        datePublished={post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString()}
        dateModified={post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString()}
        readTime={`${post.readingTime} min read`}
        category={post.category}
        sources={post.sources || []}
      />

      <BlogAnalyticsTracker 
        slug={post.slug} 
        category={post.category} 
        readingTime={post.readingTime} 
      />

      {/* Header */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>

          <Badge variant="outline" className="mt-6 block w-fit">
            {post.category || "General"}
          </Badge>

          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary uppercase">
                {(post.author?.fullName || post.author?.name || "E")[0]}
              </div>
              <div>
                <p className="font-medium text-foreground">{post.author?.fullName || post.author?.name || "Editorial Team"}</p>
              </div>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Published: {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-KE", { 
                month: "long", 
                day: "numeric", 
                year: "numeric" 
              }) : "Recently"}
            </span>
            {post.lastReviewedAt && (
              <span className="flex items-center gap-1">
                <ShieldAlert className="h-4 w-4" />
                Reviewed: {new Date(post.lastReviewedAt).toLocaleDateString("en-KE", { 
                  month: "long", 
                  day: "numeric", 
                  year: "numeric" 
                })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {post.readingTime} min read
            </span>
            <span className="flex items-center gap-1">
              Sources: {post.sources?.length || 0}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_200px]">
            <article className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>

              {/* Source attribution list */}
              <SourceList sources={post.sources || []} />

              <div className="mt-12 mb-8">
                <Alert variant="default" className="bg-muted/50 border-muted text-muted-foreground">
                  <AlertTitle className="text-foreground">Disclaimer</AlertTitle>
                  <AlertDescription className="text-xs sm:text-sm">
                    This article is for general informational purposes only and does not constitute legal advice. For advice specific to your organization, consult a qualified legal or compliance professional.
                  </AlertDescription>
                </Alert>
              </div>
            </article>

            {/* Sidebar */}
            <div className="sticky top-24 space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Share this article</h3>
                  <SocialShare 
                    title={post.title} 
                    url={url} 
                    excerpt={post.excerpt}
                    slug={post.slug}
                    category={post.category}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-12 bg-muted/30 border-t border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost: any) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                  <Card className="group h-full border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-3 text-xs">
                        {relatedPost.category || "General"}
                      </Badge>
                      <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                        {relatedPost.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {relatedPost.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Need Help with Compliance?
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
                SheriaBot can help you navigate these regulations with AI-powered compliance tools.
              </p>
              <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
