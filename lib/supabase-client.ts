"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * sessionStorage-backed storage adapter for Supabase.
 *
 * Tokens survive page refreshes within the same browser tab but are NOT
 * shared across tabs and are wiped when the tab is closed.  This limits
 * the XSS blast radius: a script injected in tab A cannot read the token
 * from tab B, and tokens do not persist in localStorage indefinitely.
 *
 * Trade-off: opening a new tab requires re-authentication.  For a compliance
 * platform handling regulated data this is an acceptable UX cost.
 *
 * SSR guard: sessionStorage is not available in Node.js (Next.js server
 * components / API routes).  We return null on every call when running
 * server-side so Supabase skips persistence gracefully.
 */
const sessionStorageAdapter = {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    return window.sessionStorage.getItem(key);
  },
  setItem(key: string, value: string): void {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(key, value);
  },
  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(key);
  },
};

/**
 * Browser Supabase client.
 * Stores session tokens in sessionStorage (not localStorage) to reduce
 * the exposure window for XSS-based token theft.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: sessionStorageAdapter,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
