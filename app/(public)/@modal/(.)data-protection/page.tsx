import { LegalDocumentOverlay } from "@/components/legal/legal-document-overlay"

// Intercepting route: renders the Data Protection Policy as a slide-in overlay
// on top of whatever (public) page the user is currently viewing.
export default function DataProtectionOverlayPage() {
  return <LegalDocumentOverlay type="data-protection" mode="overlay" />
}
