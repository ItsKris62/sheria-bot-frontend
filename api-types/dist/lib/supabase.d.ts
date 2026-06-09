/**
 * Supabase admin client  -  uses the service role key.
 * Bypasses Row Level Security. NEVER expose this to the frontend.
 * Used for: creating users, admin auth operations, and backend-only queries.
 */
export declare const supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
/**
 * Supabase public client  -  uses the anon key.
 * Used for: proxying user sign-in / sign-up from the backend when we want
 * Supabase to issue the JWT directly.
 */
export declare const supabaseClient: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
/**
 * Create a per-request Supabase client that scopes operations to the
 * authenticated user by forwarding their Bearer token.
 */
export declare function createUserSupabaseClient(accessToken: string): import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
//# sourceMappingURL=supabase.d.ts.map