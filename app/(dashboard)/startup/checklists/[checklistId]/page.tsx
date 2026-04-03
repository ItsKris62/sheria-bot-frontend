/**
 * /startup/checklists/[checklistId]
 *
 * Redirects to the main checklists page which renders the detail view inline.
 * The checklist detail is displayed as an in-page panel in page.tsx (not as a
 * separate route) so that React Query state and the polling infrastructure are
 * shared with the list view.
 *
 * Deep-linking to a specific checklist is not yet supported — users arriving
 * via a direct URL are redirected to the checklists list where they can select
 * the checklist manually.
 */
import { redirect } from "next/navigation"

export default function ChecklistDetailPage() {
  redirect("/startup/checklists")
}
