import { LegalDocumentOverlay } from "@/components/legal/legal-document-overlay"

// Intercepting route: renders the Terms of Service as a slide-in overlay
// on top of whatever (public) page the user is currently viewing.
export default function TermsOverlayPage() {
  return <LegalDocumentOverlay type="terms" mode="overlay" />
}
