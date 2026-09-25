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

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (isUnauthorizedError(error)) {
          handleUnauthorized();
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
          handleUnauthorized();
          return;
        }
        if (isMfaStepUpError(error)) {
          const meta = (mutation.meta as Record<string, unknown>) || {};
          if (meta.stepUpRetried) {
            toast.error("Multi-factor step-up verification failed. Action cancelled.");
            return;
          }

          mutation.meta = { ...meta, stepUpRetried: true };

          requestStepUpChallenge({
            onSuccess: async () => {
              try {
                await mutation.execute(_variables);
              } catch {
                toast.error("Action failed after step-up authentication.");
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
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setAuth, clearAuth, setInitialized, isInitialized } = useAuthStore();
  const authClient = React.useMemo(() => createTRPCClient(), []);

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
  }, []);

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
        clearAuth();
      } finally {
        setInitialized();
      }
    }

    initSession();
  }, [isInitialized, setAuth, clearAuth, setInitialized, authClient]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());
  const [trpcClient] = useState(() => createTRPCClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
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
