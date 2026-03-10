"use client";

import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, createTRPCClient, setAccessToken } from "@/lib/trpc";
import { useAuthStore } from "@/lib/auth-store";
import type { AuthUser, UserRole } from "@/lib/auth-store";
import { supabase } from "@/lib/supabase-client";

function makeQueryClient() {
  return new QueryClient({
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
        <AuthInitializer>{children}</AuthInitializer>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
