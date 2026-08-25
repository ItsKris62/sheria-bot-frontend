/**
 * SheriaBot SEO
 * File ID: SEO-S01-CORE-CONTACT-008
 * Route: /contact
 * Purpose: Contact & enterprise sales route layout with self-canonical metadata
 * Sprint: SEO Sprint 1
 */

import type { Metadata } from "next"
import { absoluteUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "Contact Us & Enterprise Sales | SheriaBot",
  description:
    "Get in touch with SheriaBot for enterprise compliance inquiries, product demonstrations, regulatory partnerships, or customer support.",
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
  openGraph: {
    title: "Contact Us & Enterprise Sales | SheriaBot",
    description:
      "Get in touch with SheriaBot for enterprise compliance inquiries, product demonstrations, regulatory partnerships, or customer support.",
    url: absoluteUrl("/contact"),
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
