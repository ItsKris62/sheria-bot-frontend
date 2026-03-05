import type { Metadata } from "next"
import { LegalDocumentOverlay } from "@/components/legal/legal-document-overlay"

export const metadata: Metadata = {
  title: "Security Policy | SheriaBot",
  description:
    "SheriaBot's Security Policy — an overview of the technical and organisational security measures protecting your compliance data.",
}

export default function SecurityPage() {
  return <LegalDocumentOverlay type="security" mode="page" />
}
