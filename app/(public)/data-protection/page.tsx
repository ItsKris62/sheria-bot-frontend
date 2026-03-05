import type { Metadata } from "next"
import { LegalDocumentOverlay } from "@/components/legal/legal-document-overlay"

export const metadata: Metadata = {
  title: "Data Protection Policy | SheriaBot",
  description:
    "SheriaBot's Data Protection Policy — our organisational framework for processing personal data in compliance with the Kenya Data Protection Act, 2019.",
}

export default function DataProtectionPage() {
  return <LegalDocumentOverlay type="data-protection" mode="page" />
}
