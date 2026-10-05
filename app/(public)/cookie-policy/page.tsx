import type { Metadata } from "next"
import Link from "next/link"
import { CookieSettingsButton } from "@/components/privacy/cookie-settings-button"
import { LEGAL_REVISIONS, formatLegalDate } from "@/lib/legal-revisions"
import { absoluteUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "Cookie Policy | SheriaBot",
  description: "How SheriaBot uses cookies and browser storage, including authentication, preferences, and optional analytics.",
  alternates: { canonical: absoluteUrl("/cookie-policy") },
}

const inventory = [
  ["sb-<project-ref>-auth-token*", "Supabase Auth", "Strictly Necessary", "Maintains and refreshes the signed-in browser session.", "Session lifecycle; library maximum 400 days", "First party"],
  ["sheriabot:cookie-consent", "SheriaBot", "Strictly Necessary", "Stores the versioned consent choice without personal data.", "180 days", "First party"],
  ["sheriabot:logout_signal", "SheriaBot", "Strictly Necessary", "Signals logout to other open SheriaBot tabs.", "Until cleared or overwritten", "First party"],
  ["sheriabot:session_expired", "SheriaBot", "Strictly Necessary", "Shows the session-expired notice after redirecting to sign-in.", "Browser tab session", "First party"],
  ["sidebar:state / sheriabot_sidebar_collapsed", "SheriaBot", "Functional", "Remembers sidebar display preferences.", "7 days / until revoked", "First party"],
  ["sheria-recent-searches", "SheriaBot", "Functional", "Remembers up to five recent in-app searches.", "Until revoked or cleared", "First party"],
  ["sheriabot:compliance-query:selected-jurisdiction", "SheriaBot", "Functional", "Remembers the selected compliance-query jurisdiction.", "Until revoked or cleared", "First party"],
  ["admin-alert-draft", "SheriaBot", "Functional", "Preserves an administrator's unsent alert draft.", "Until submitted, revoked, or cleared", "First party"],
  ["sheriabot_passkey_nudge_dismissed_<user-id>", "SheriaBot", "Functional", "Remembers dismissal of the passkey reminder.", "Until revoked or cleared", "First party"],
  ["ph_* / ph_*_posthog", "PostHog", "Analytics", "Stores pseudonymous product-analytics state after opt-in.", "Provider-managed; removed on withdrawal where accessible", "First party"],
  ["_ga / _ga_*", "Google Analytics", "Analytics", "Distinguishes pseudonymous browsers and sessions after opt-in.", "Provider-managed; commonly up to 2 years", "First party"],
  ["sheriabot:analytics:*", "SheriaBot", "Analytics", "Prevents duplicate lifecycle and purchase analytics events.", "Until consent withdrawal or browser clearing", "First party"],
  ["sheriabot.blog.readingSessionId", "SheriaBot", "Analytics", "Groups reading events within one browser-tab session.", "Browser tab session", "First party"],
] as const

export default function CookiePolicyPage() {
  const revision = LEGAL_REVISIONS["cookie-policy"]
  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Legal &amp; Privacy</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">Cookie Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Effective: <time dateTime={revision.effective}>{formatLegalDate(revision.effective)}</time>
          <span aria-hidden="true"> · </span>
          Last updated: <time dateTime={revision.updated}>{formatLegalDate(revision.updated)}</time>
        </p>
      </header>

      <div className="prose prose-slate mt-8 max-w-none dark:prose-invert">
        <h2>What cookies and browser storage are</h2>
        <p>Cookies are small records stored by a browser and sent with applicable requests. Local storage and session storage are browser-only mechanisms. This policy describes SheriaBot&apos;s verified use of all three; it does not assign a legal basis beyond the technical controls implemented by the service.</p>

        <h2>Why SheriaBot uses them</h2>
        <p>SheriaBot uses strictly necessary storage for authentication, security, consent, and session coordination. Optional functional storage remembers interface choices. Optional analytics helps us understand product use and performance. SheriaBot does not currently use marketing or advertising cookies.</p>

        <h2>Categories and choices</h2>
        <ul>
          <li><strong>Strictly Necessary:</strong> always active because secure sign-in and essential session behavior depend on it.</li>
          <li><strong>Functional:</strong> optional browser preferences. Disabling it does not prevent sign-in, but preferences and drafts will not persist.</li>
          <li><strong>Analytics:</strong> optional PostHog, Google Analytics, Vercel Analytics, and Speed Insights processing. These tools initialize only after opt-in. PostHog session replay is disabled.</li>
        </ul>
        <p>Rejecting or withdrawing optional consent removes known first-party optional storage where the browser permits it. It does not delete Supabase authentication cookies or sign you out.</p>

        <h2>Verified inventory</h2>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-muted/60 text-foreground"><tr>{["Cookie / Storage Key", "Provider", "Category", "Purpose", "Duration", "Party"].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}</tr></thead>
          <tbody className="divide-y divide-border">{inventory.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} className="px-4 py-3 align-top text-muted-foreground">{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>

      <div className="prose prose-slate mt-8 max-w-none dark:prose-invert">
        <h2>Cookie attributes and access</h2>
        <p>Supabase authentication cookies use Path=/ and SameSite=Lax, are marked Secure in production, and are JavaScript-accessible because the browser client refreshes the session. The sidebar preference cookie uses Path=/, SameSite=Lax, Secure on HTTPS, and a seven-day maximum age. Local and session storage do not have cookie Domain, Path, SameSite, Secure, or HttpOnly attributes.</p>

        <h2>Managing or withdrawing consent</h2>
        <p>You can reopen Cookie Settings at any time. The consent record expires after 180 days, and a material policy-version change requires a new choice. Browser settings may also block or delete storage; blocking strictly necessary authentication cookies will prevent sign-in or end the session.</p>
        <CookieSettingsButton />

        <h2>Third-party providers</h2>
        <p>When enabled, analytics may be processed by PostHog, Google Analytics, Vercel Analytics, and Vercel Speed Insights. Authentication is provided by Supabase. See the <Link href="/privacy">Privacy Policy</Link> for broader processing and subprocessor information.</p>

        <h2>Contact</h2>
        <p>Questions about privacy or these controls can be sent through the <Link href="/contact">contact page</Link>.</p>
      </div>
    </article>
  )
}
