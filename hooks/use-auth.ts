"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { trpc, setAccessToken } from "@/lib/trpc";
import { getAuthErrorMessage } from "@/lib/auth-error-messages";
import { useAuthStore } from "@/lib/auth-store";
import type { AuthUser, UserRole } from "@/lib/auth-store";
import { supabase } from "@/lib/supabase-client";
import { trackEvent, clearAnalyticsUser } from "@/lib/analytics";
import { startAuthentication } from "@simplewebauthn/browser";

type AuthenticationResponseJSON = Awaited<ReturnType<typeof startAuthentication>>;

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
    default:
      return "/startup";
  }
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth, clearAuth, isAuthenticated, user, isLoading, isInitialized } = useAuthStore();

  const loginMutation = trpc.auth.login.useMutation();
  const verifyTotpLoginMutation = (trpc.auth as any).verifyTotpLogin.useMutation();
  const generateAuthOptionsMutation = trpc.passkey.generateAuthenticationOptions.useMutation();
  const verifyAuthMutation = trpc.passkey.verifyAuthentication.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginMutation.mutateAsync({ email, password });

      if (result.mfaRequired && result.tempToken) {
        return {
          mfaRequired: true as const,
          tempToken: result.tempToken,
        };
      }

      if (!result.user || !result.accessToken || !result.refreshToken) {
        throw new Error("Invalid response from authentication server");
      }

      const authUser: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role as UserRole,
        organizationId: result.user.organization?.id ?? null,
        emailVerified: result.user.emailVerified,
        mustChangePassword: result.user.mustChangePassword,
        createdAt: String(result.user.createdAt),
      };

      // Register the session with the Supabase client so it handles auto-refresh
      await supabase.auth.setSession({
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
      });

      setAuth(authUser, result.accessToken);
      trackEvent("login", {
        method: "credentials",
        role: authUser.role,
      });

      if (result.user.mustChangePassword) {
        router.push("/change-password");
        return result;
      }
      router.push(getDashboardPath(authUser.role));
      return result;
    },
    [loginMutation, setAuth, router],
  );

  const verifyTotpLogin = useCallback(
    async (tempToken: string, code: string, isBackupCode = false) => {
      const result = await verifyTotpLoginMutation.mutateAsync({
        tempToken,
        code,
        isBackupCode,
      });

      if (!result.user || !result.accessToken || !result.refreshToken) {
        throw new Error("Invalid response from MFA verification server");
      }

      const authUser: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role as UserRole,
        organizationId: result.user.organization?.id ?? null,
        emailVerified: result.user.emailVerified,
        mustChangePassword: result.user.mustChangePassword,
        createdAt: String(result.user.createdAt),
      };

      await supabase.auth.setSession({
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
      });

      setAuth(authUser, result.accessToken);
      trackEvent("login", {
        method: isBackupCode ? "mfa_backup_code" : "mfa_totp",
        role: authUser.role,
      });

      if (result.user.mustChangePassword) {
        router.push("/change-password");
        return result;
      }
      router.push(getDashboardPath(authUser.role));
      return result;
    },
    [verifyTotpLoginMutation, setAuth, router],
  );

  const loginWithPasskey = useCallback(
    async (options?: { useBrowserAutofill?: boolean }) => {
      // 1. Generate authentication options
      const { options: authOptions, challengeId } = await generateAuthOptionsMutation.mutateAsync({});

      // 2. Start browser authentication ceremony
      const authResponse: AuthenticationResponseJSON = await startAuthentication({
        optionsJSON: authOptions as any,
        useBrowserAutofill: options?.useBrowserAutofill ?? false,
      });

      // 3. Verify on backend
      const result = await verifyAuthMutation.mutateAsync({
        challengeId,
        response: authResponse,
      });

      if (!result.user || !result.accessToken || !result.refreshToken) {
        throw new Error("Invalid response from passkey authentication server");
      }

      const authUser: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role as UserRole,
        organizationId: result.user.organization?.id ?? null,
        emailVerified: result.user.emailVerified,
        mustChangePassword: result.user.mustChangePassword,
        createdAt: String(result.user.createdAt),
      };

      await supabase.auth.setSession({
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
      });

      setAuth(authUser, result.accessToken);
      trackEvent("login", {
        method: "passkey",
        role: authUser.role,
      });

      if (result.user.mustChangePassword) {
        router.push("/change-password");
        return result;
      }
      router.push(getDashboardPath(authUser.role));
      return result;
    },
    [generateAuthOptionsMutation, verifyAuthMutation, setAuth, router],
  );

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      name: string;
      role: "REGULATOR" | "STARTUP" | "ENTERPRISE";
      companyName?: string;
      homeJurisdictionCode?: "KE" | "RW" | "MW" | "NG";
      invitationToken?: string;
      phone?: string;
    }) => {
      const result = await registerMutation.mutateAsync(data);
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
    clearAnalyticsUser();
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
    verifyTotpLogin,
    loginWithPasskey,
    register,
    logout,
    refreshSession,
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    loginError: loginMutation.error ? getAuthErrorMessage(loginMutation.error) : null,
    verifyTotpError: verifyTotpLoginMutation.error ? getAuthErrorMessage(verifyTotpLoginMutation.error) : null,
    passkeyError: verifyAuthMutation.error
      ? getAuthErrorMessage(verifyAuthMutation.error)
      : generateAuthOptionsMutation.error
        ? getAuthErrorMessage(generateAuthOptionsMutation.error)
        : null,
    registerError: registerMutation.error ? getAuthErrorMessage(registerMutation.error) : null,
    isLoginLoading: loginMutation.isPending,
    isVerifyTotpLoading: verifyTotpLoginMutation.isPending,
    isPasskeyLoading: generateAuthOptionsMutation.isPending || verifyAuthMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}
