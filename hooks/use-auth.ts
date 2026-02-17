"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { trpc, getErrorMessage, setAccessToken } from "@/lib/trpc";
import { useAuthStore } from "@/lib/auth-store";
import type { AuthUser, UserRole } from "@/lib/auth-store";

const REFRESH_TOKEN_KEY = "sb_rt";

/** Persist refresh token in a secure cookie */
function persistRefreshToken(token: string) {
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  document.cookie = `${REFRESH_TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; SameSite=Strict; Secure`;
}

/** Read refresh token from cookie */
export function getRefreshToken(): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${REFRESH_TOKEN_KEY}=([^;]*)`));
  return match ? match[1] : "";
}

/** Clear refresh token cookie */
function clearRefreshToken() {
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; max-age=0`;
}

/** Map backend role to dashboard path */
function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "REGULATOR":
      return "/regulator";
    case "ADMIN":
      return "/admin";
    case "ENTERPRISE":
      return "/startup"; // Enterprise uses same dashboard for now
    case "STARTUP":
    case "FINTECH_USER":
    default:
      return "/startup";
  }
}

export function useAuth() {
  const router = useRouter();
  const { setAuth, clearAuth, isAuthenticated, user, isLoading, isInitialized } = useAuthStore();

  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const refreshMutation = trpc.auth.refreshToken.useMutation();

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

      setAuth(authUser, result.accessToken);
      persistRefreshToken(result.refreshToken);

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
      phone?: string;
    }) => {
      const result = await registerMutation.mutateAsync(data);
      // Registration returns success + userId, not tokens
      // User needs to verify email then login
      return result;
    },
    [registerMutation],
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Even if the server call fails, clear local state
    }
    clearAuth();
    clearRefreshToken();
    router.push("/login");
  }, [logoutMutation, clearAuth, router]);

  const refreshSession = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const result = await refreshMutation.mutateAsync({ refreshToken });
      if (result.accessToken) {
        setAccessToken(result.accessToken);
        useAuthStore.getState().updateToken(result.accessToken);
        return true;
      }
    } catch {
      clearAuth();
      clearRefreshToken();
    }
    return false;
  }, [refreshMutation, clearAuth]);

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
