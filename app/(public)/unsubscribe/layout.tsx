/**
 * SheriaBot SEO
 * File ID: SEO-S01-CORE-UNSUB-009
 * Route: /unsubscribe
 * Purpose: Email unsubscribe layout with noindex, nofollow metadata
 * Sprint: SEO Sprint 1
 */

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Unsubscribe | SheriaBot",
  description: "Manage your email preferences and unsubscribe from SheriaBot marketing communications.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
