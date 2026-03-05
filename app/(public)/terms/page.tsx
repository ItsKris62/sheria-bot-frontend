import type { Metadata } from "next"
import { LegalDocumentOverlay } from "@/components/legal/legal-document-overlay"

export const metadata: Metadata = {
  title: "Terms of Service | SheriaBot",
  description:
    "SheriaBot's Terms of Service — the legally binding agreement governing use of the SheriaBot AI-powered regulatory compliance platform.",
}

export default function TermsPage() {
  return <LegalDocumentOverlay type="terms" mode="page" />
}
