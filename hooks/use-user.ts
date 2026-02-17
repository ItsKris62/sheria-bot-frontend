"use client";

import { trpc, getErrorMessage } from "@/lib/trpc";
import { useAuthStore } from "@/lib/auth-store";
import type { AuthUser } from "@/lib/auth-store";

/** Hook for current user profile */
export function useProfile() {
  return trpc.auth.me.useQuery(undefined, {
    enabled: useAuthStore.getState().isAuthenticated,
  });
}

/** Hook for user profile mutations */
export function useUserActions() {
  const utils = trpc.useUtils();

  const changePasswordMutation = trpc.auth.changePassword.useMutation();

  return {
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error
      ? getErrorMessage(changePasswordMutation.error)
      : null,
  };
}

/** Hook for session management */
export function useSessions() {
  const getSessionsQuery = trpc.auth.getActiveSessions.useQuery(undefined, {
    enabled: false, // only fetch on demand
  });

  const revokeAllMutation = trpc.auth.revokeAllSessions.useMutation();
  const revokeOthersMutation = trpc.auth.revokeOtherSessions.useMutation();

  return {
    getSessions: getSessionsQuery.refetch,
    sessions: getSessionsQuery.data,
    isLoadingSessions: getSessionsQuery.isLoading,

    revokeAll: revokeAllMutation.mutateAsync,
    revokeOthers: revokeOthersMutation.mutateAsync,
  };
}
