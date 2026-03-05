import type { Metadata } from "next"
import { LegalDocumentOverlay } from "@/components/legal/legal-document-overlay"

export const metadata: Metadata = {
  title: "Privacy Policy | SheriaBot",
  description:
    "SheriaBot's Privacy Policy — how we collect, process, and protect your personal data in compliance with the Kenya Data Protection Act, 2019.",
}

// Full-page render for users who navigate directly to /privacy via a shared link
// or bookmark. When navigated to from within the (public) group via the footer,
// the (.)privacy intercepting route in @modal takes precedence and shows the
// overlay instead.
export default function PrivacyPage() {
  return <LegalDocumentOverlay type="privacy" mode="page" />
}
