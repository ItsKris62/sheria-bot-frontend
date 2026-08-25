/**
 * SheriaBot SEO
 * File ID: SEO-S03-KE-REDIRECT-000
 * Route: /kenya
 * Purpose: Permanent redirect to the master Kenya FinTech Compliance Hub
 * Sprint: SEO Sprint 3
 */

import { permanentRedirect } from 'next/navigation'

export default function KenyaRedirectPage() {
  permanentRedirect('/kenya/fintech-compliance-requirements')
}
