"use client";

import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { trpc, createTRPCClient, setAccessToken, getErrorMessage } from "@/lib/trpc";
import { SESSION_EXPIRED_FLAG } from "@/lib/session-timeouts";
import { TRPCClientError } from "@trpc/client";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import type { AuthUser, UserRole } from "@/lib/auth-store";
import { supabase } from "@/lib/supabase-client";
import { PlanProvider } from "@/lib/plan-context";

/** Clears local auth state when the backend returns UNAUTHORIZED.
 *  Called from both QueryCache and MutationCache onError handlers.
 *  Sets a sessionStorage flag so the login page can show the "session expired" banner.
 *  AuthGuard picks up the cleared isAuthenticated state and redirects to /login. */
function handleUnauthorized() {
  // Guard: don't fire if the user is already logged out
  if (!useAuthStore.getState().isAuthenticated) return;

  setAccessToken(null);
  useAuthStore.getState().clearAuth();

  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_EXPIRED_FLAG, "1");
  }
}

function isUnauthorizedError(error: unknown): boolean {
  return (
    error instanceof TRPCClientError &&
    "data" in (error as unknown as Record<string, unknown>) &&
    ((error as unknown as Record<string, unknown>).data as Record<string, unknown> | undefined)?.code === "UNAUTHORIZED"
  );
}

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (isUnauthorizedError(error)) {
          handleUnauthorized();
          // AuthGuard handles redirect; toast shown on login page via sessionStorage flag
          return;
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (isUnauthorizedError(error)) {
          handleUnauthorized();
          return;
        }
        // Only fire generic toast for mutations that have no onError handler of their own,
        // preventing duplicate toasts when a mutation already handles its errors.
        if (mutation.options.onError) return;
        const message = error instanceof TRPCClientError
          ? getErrorMessage(error)
          : "Something went wrong. Please try again.";
        toast.error(message);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        retry: (failureCount, error) => {
          if (
            error &&
            "data" in (error as unknown as Record<string, unknown>) &&
            ((error as unknown as Record<string, unknown>).data as Record<string, unknown>)?.code === "UNAUTHORIZED"
          ) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  });
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setAuth, clearAuth, setInitialized, isInitialized } = useAuthStore();
  const trpcClient = trpc.useUtils();

  // Subscribe to Supabase auth state changes — handles automatic token refresh
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        setAccessToken(session.access_token);
        useAuthStore.getState().updateToken(session.access_token);
      } else {
        // SIGNED_OUT or session expired externally (admin revocation, refresh token expired)
        setAccessToken(null);
        useAuthStore.getState().clearAuth();
      }
    });
    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Restore session on page load using Supabase's persisted session
  useEffect(() => {
    if (isInitialized) return;

    async function initSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
          clearAuth();
          setInitialized();
          return;
        }

        setAccessToken(session.access_token);

        const user = await (trpcClient.auth.me as any).fetch();
        setAuth(
          {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
            organizationId: user.organization?.id ?? null,
            emailVerified: user.emailVerified,
            createdAt: String(user.createdAt),
          } satisfies AuthUser,
          session.access_token,
        );
      } catch {
        clearAuth();
      } finally {
        setInitialized();
      }
    }

    initSession();
  }, [isInitialized, setAuth, clearAuth, setInitialized, trpcClient]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());
  const [trpcClient] = useState(() => createTRPCClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          <PlanProvider>{children}</PlanProvider>
        </AuthInitializer>
        <Toaster position="top-right" closeButton />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
