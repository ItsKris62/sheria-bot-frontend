import { LegalDocumentOverlay } from "@/components/legal/legal-document-overlay"

// Intercepting route: renders the Security Policy as a slide-in overlay
// on top of whatever (public) page the user is currently viewing.
export default function SecurityOverlayPage() {
  return <LegalDocumentOverlay type="security" mode="overlay" />
}
