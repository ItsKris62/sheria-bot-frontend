"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client.
 *
 * Uses @supabase/ssr's createBrowserClient, which stores the refreshable
 * browser session in first-party cookies so middleware can validate it. These
 * cookies are JavaScript-accessible by design; XSS prevention remains a
 * critical control. Production cookies are explicitly Secure.
 *
 * Cookie-based storage also enables server-side session verification in
 * Next.js middleware without any additional token passing.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
);
