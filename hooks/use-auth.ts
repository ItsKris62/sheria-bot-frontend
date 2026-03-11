"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { trpc, getErrorMessage, setAccessToken } from "@/lib/trpc";
import { useAuthStore } from "@/lib/auth-store";
import type { AuthUser, UserRole } from "@/lib/auth-store";
import { supabase } from "@/lib/supabase-client";

/** Map backend role to dashboard path */
function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "REGULATOR":
      return "/regulator";
    case "ADMIN":
      return "/admin";
    case "ENTERPRISE":
      return "/startup";
    case "STARTUP":
    case "FINTECH_USER":
    default:
      return "/startup";
  }
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth, clearAuth, isAuthenticated, user, isLoading, isInitialized } = useAuthStore();

  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginMutation.mutateAsync({ email, password });

      const authUser: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role as UserRole,
        organizationId: result.user.organization?.id ?? null,
        emailVerified: result.user.emailVerified,
        createdAt: String(result.user.createdAt),
      };

      // Register the session with the Supabase client so it handles auto-refresh
      await supabase.auth.setSession({
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
      });

      setAuth(authUser, result.accessToken);
      router.push(getDashboardPath(authUser.role));
      return result;
    },
    [loginMutation, setAuth, router],
  );

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      name: string;
      role: "REGULATOR" | "STARTUP" | "ENTERPRISE";
      companyName?: string;
      phone?: string;
    }) => {
      const result = await registerMutation.mutateAsync(data);
      // Registration returns success + userId — user must verify email then login
      return result;
    },
    [registerMutation],
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      await supabase.auth.signOut();
    } catch {
      // Even if server calls fail, clear local state
    }
    queryClient.clear();
    clearAuth();
    setAccessToken(null);
    router.push("/login");
  }, [logoutMutation, queryClient, clearAuth, router]);

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (session?.access_token && !error) {
        setAccessToken(session.access_token);
        useAuthStore.getState().updateToken(session.access_token);
        return true;
      }
    } catch {
      // fall through
    }
    clearAuth();
    return false;
  }, [clearAuth]);

  return {
    login,
    register,
    logout,
    refreshSession,
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    loginError: loginMutation.error ? getErrorMessage(loginMutation.error) : null,
    registerError: registerMutation.error ? getErrorMessage(registerMutation.error) : null,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}
