"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client.
 *
 * Uses @supabase/ssr's createBrowserClient which stores session tokens in
 * httpOnly cookies instead of sessionStorage. This is strictly more secure:
 * httpOnly cookies are completely inaccessible to JavaScript (including XSS
 * payloads), whereas sessionStorage can be read by any script on the page.
 *
 * Cookie-based storage also enables server-side session verification in
 * Next.js middleware without any additional token passing.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
