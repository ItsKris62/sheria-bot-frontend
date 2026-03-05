import { LegalDocumentOverlay } from "@/components/legal/legal-document-overlay"

// Intercepting route: renders the Privacy Policy as a slide-in overlay
// on top of whatever (public) page the user is currently viewing.
export default function PrivacyOverlayPage() {
  return <LegalDocumentOverlay type="privacy" mode="overlay" />
}
