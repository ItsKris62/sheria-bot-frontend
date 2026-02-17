"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, createTRPCClient, setAccessToken } from "@/lib/trpc";
import { useAuthStore } from "@/lib/auth-store";
import type { AuthUser, UserRole } from "@/lib/auth-store";
import { getRefreshToken } from "@/hooks/use-auth";

/** Access tokens expire in 7 days (backend JWT_EXPIRES_IN=7d) */
const ACCESS_TOKEN_LIFETIME_SEC = 7 * 24 * 60 * 60;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        retry: (failureCount, error) => {
          if (
            error &&
            "data" in (error as Record<string, unknown>) &&
            ((error as Record<string, unknown>).data as Record<string, unknown>)?.code === "UNAUTHORIZED"
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
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trpcClient = trpc.useUtils();

  const scheduleTokenRefresh = useCallback(
    (lifetimeSec: number) => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      // Refresh 60 seconds before expiry, minimum 30 seconds
      const refreshDelay = Math.max((lifetimeSec - 60) * 1000, 30_000);
      refreshTimerRef.current = setTimeout(async () => {
        const rt = getRefreshToken();
        if (!rt) return;

        try {
          const result = await trpcClient.auth.refreshToken.fetch({ refreshToken: rt });
          if (result.accessToken) {
            setAccessToken(result.accessToken);
            useAuthStore.getState().updateToken(result.accessToken);
            scheduleTokenRefresh(ACCESS_TOKEN_LIFETIME_SEC);
          }
        } catch {
          clearAuth();
        }
      }, refreshDelay);
    },
    [trpcClient, clearAuth],
  );

  useEffect(() => {
    if (isInitialized) return;

    async function initSession() {
      const rt = getRefreshToken();
      if (!rt) {
        clearAuth();
        setInitialized();
        return;
      }

      try {
        const result = await trpcClient.auth.refreshToken.fetch({ refreshToken: rt });
        if (result.accessToken) {
          setAccessToken(result.accessToken);
          const user = await trpcClient.auth.me.fetch();
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
            result.accessToken,
          );
          scheduleTokenRefresh(ACCESS_TOKEN_LIFETIME_SEC);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        setInitialized();
      }
    }

    initSession();

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [isInitialized, setAuth, clearAuth, setInitialized, scheduleTokenRefresh, trpcClient]);

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
