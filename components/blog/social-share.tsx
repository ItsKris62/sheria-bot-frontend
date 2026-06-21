"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Copy, Linkedin, Twitter, MessageCircle, Share2 } from "lucide-react"
import { useEffect, useState } from "react"
import { trackEvent } from "@/lib/analytics"

interface SocialShareProps {
  title: string
  url: string
  excerpt?: string | null
  slug: string
  category: string
}

export function SocialShare({ title, url, excerpt, slug, category }: SocialShareProps) {
  const [hasNativeShare, setHasNativeShare] = useState(false)
  const fullUrl = typeof window !== 'undefined' ? window.location.href : url

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.share) {
      setHasNativeShare(true)
    }
  }, [])

  const logShare = (platform: string) => {
    trackEvent("blog_post_shared", {
      blog_slug: slug,
      blog_category: category,
      share_platform: platform
    })
  }

  const handleCopyLink = () => {
    logShare("copy")
    navigator.clipboard.writeText(fullUrl)
    toast.success("Link copied to clipboard")
  }

  const handleNativeShare = async () => {
    try {
      logShare("native")
      await navigator.share({
        title,
        text: excerpt || title,
        url: fullUrl,
      })
    } catch (error) {
      // User cancelled share or it failed
    }
  }

  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedExcerpt = excerpt ? encodeURIComponent(excerpt) : ''

  const xUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
  const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedExcerpt}`
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle} - ${encodedUrl}`

  return (
    <div className="flex gap-2">
      {hasNativeShare && (
        <Button variant="outline" size="icon" onClick={handleNativeShare} aria-label="Share via device">
          <Share2 className="w-4 h-4" />
        </Button>
      )}
      <Button variant="outline" size="icon" asChild>
        <a href={xUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
          <Twitter className="w-4 h-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
          <Linkedin className="w-4 h-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
          <MessageCircle className="w-4 h-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" onClick={handleCopyLink} aria-label="Copy link">
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  )
}
