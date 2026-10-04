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
import { StepUpModal, requestStepUpChallenge } from "@/components/auth/step-up-modal";
import { clearAuthenticatedClientState } from "@/lib/auth-client-teardown";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

/** Clears local auth state when the backend returns UNAUTHORIZED.
 *  Called from both QueryCache and MutationCache onError handlers.
 *  Sets a sessionStorage flag so the login page can show the "session expired" banner.
 *  AuthGuard picks up the cleared isAuthenticated state and redirects to /login. */
function handleUnauthorized(queryClient: QueryClient) {
  const wasAuthenticated = useAuthStore.getState().isAuthenticated;

  clearAuthenticatedClientState(queryClient);

  if (wasAuthenticated && typeof window !== "undefined") {
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

function isMfaStepUpError(error: unknown): boolean {
  return (
    error instanceof TRPCClientError &&
    "data" in (error as unknown as Record<string, unknown>) &&
    ((error as unknown as Record<string, unknown>).data as Record<string, unknown> | undefined)?.code === "PRECONDITION_FAILED" &&
    Boolean(error.message?.includes("MFA_STEP_UP_REQUIRED"))
  );
}

function isMfaRequiredError(error: unknown): boolean {
  return (
    error instanceof TRPCClientError &&
    "data" in (error as unknown as Record<string, unknown>) &&
    ((error as unknown as Record<string, unknown>).data as Record<string, unknown> | undefined)?.code === "PRECONDITION_FAILED" &&
    !error.message?.includes("MFA_STEP_UP_REQUIRED") &&
    Boolean(
      error.message?.includes("MFA_ENROLLMENT_REQUIRED") ||
      error.message?.includes("MFA_REQUIRED_FOR_ADMIN") ||
      error.message?.includes("Multi-Factor Authentication")
    )
  );
}

function handleMfaRequired() {
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/settings/security")) {
    window.location.href = "/settings/security?enforce=true";
  }
}

const stepUpRetriesInFlight = new WeakSet<object>();

export function makeQueryClient() {
  let queryClient: QueryClient;

  queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (isUnauthorizedError(error)) {
          handleUnauthorized(queryClient);
          // AuthGuard handles redirect; toast shown on login page via sessionStorage flag
          return;
        }
        if (isMfaRequiredError(error)) {
          handleMfaRequired();
          return;
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (isUnauthorizedError(error)) {
          handleUnauthorized(queryClient);
          return;
        }
        if (isMfaStepUpError(error)) {
          if (stepUpRetriesInFlight.has(mutation)) {
            toast.error("Multi-factor step-up verification failed. Action cancelled.");
            return;
          }

          requestStepUpChallenge({
            onSuccess: async () => {
              stepUpRetriesInFlight.add(mutation);
              try {
                await mutation.execute(_variables);
              } catch (retryError) {
                // Avoid duplicate toast if retry failure was another MFA step-up error
                // already handled and toasted above during mutation.execute.
                if (!isMfaStepUpError(retryError)) {
                  toast.error("Action failed after step-up authentication.");
                }
              } finally {
                stepUpRetriesInFlight.delete(mutation);
              }
            },
            onCancel: () => {
              toast.error("Action cancelled: Fresh MFA verification required.");
            },
          });
          return;
        }
        if (isMfaRequiredError(error)) {
          handleMfaRequired();
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
            (((error as unknown as Record<string, unknown>).data as Record<string, unknown>)?.code === "UNAUTHORIZED" ||
             ((error as unknown as Record<string, unknown>).data as Record<string, unknown>)?.code === "PRECONDITION_FAILED")
          ) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  });

  return queryClient;
}

export function handleSupabaseAuthStateChange(
  queryClient: QueryClient,
  event: AuthChangeEvent,
  session: Session | null,
): void {
  if (event === "SIGNED_OUT") {
    clearAuthenticatedClientState(queryClient);
    return;
  }

  if (session?.access_token) {
    setAccessToken(session.access_token);
    useAuthStore.getState().updateToken(session.access_token);
    return;
  }

  if (event !== "INITIAL_SESSION") {
    clearAuthenticatedClientState(queryClient);
  }
}

function AuthInitializer({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  const { setAuth, clearAuth, setInitialized, isInitialized } = useAuthStore();
  const authClient = React.useMemo(() => createTRPCClient(), []);

  // Subscribe to Supabase auth state changes — handles automatic token refresh
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleSupabaseAuthStateChange(queryClient, event, session);
    });
    return () => subscription.unsubscribe();
  }, [queryClient]);

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

        const user = await authClient.auth.me.query();
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
        clearAuthenticatedClientState(queryClient);
      } finally {
        setInitialized();
      }
    }

    initSession();
  }, [isInitialized, setAuth, clearAuth, setInitialized, authClient, queryClient]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());
  const [trpcClient] = useState(() => createTRPCClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer queryClient={queryClient}>
          <PlanProvider>
            {children}
            <StepUpModal />
          </PlanProvider>
        </AuthInitializer>
        <Toaster position="top-right" closeButton />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
