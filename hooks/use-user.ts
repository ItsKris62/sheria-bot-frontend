"use client";

import { trpc, getErrorMessage } from "@/lib/trpc";
import { useAuthStore } from "@/lib/auth-store";

export interface SessionInfo {
  id: string;
  device: string;
  ipAddress: string;
  createdAt: Date | string;
  expiresAt: Date | string;
  isCurrent: boolean;
}

/** Hook for current user profile — loads full profile data from DB */
export function useProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return trpc.user.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}

/** Hook for updating profile and preferences */
export function useUserActions() {
  const utils = trpc.useUtils();
  const { updateUser } = useAuthStore();

  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.getProfile.invalidate();
    },
  });

  const updatePreferencesMutation = trpc.user.updatePreferences.useMutation({
    onSuccess: () => {
      utils.user.getProfile.invalidate();
    },
  });

  const changePasswordMutation = trpc.user.changePassword.useMutation();

  return {
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error
      ? getErrorMessage(updateProfileMutation.error)
      : null,

    updatePreferences: updatePreferencesMutation.mutateAsync,
    isUpdatingPreferences: updatePreferencesMutation.isPending,
    updatePreferencesError: updatePreferencesMutation.error
      ? getErrorMessage(updatePreferencesMutation.error)
      : null,

    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error
      ? getErrorMessage(changePasswordMutation.error)
      : null,
  };
}

/** Hook for session management */
export function useSessions() {
  const utils = trpc.useUtils();

  const sessionsQuery = trpc.user.getSessions.useQuery(undefined, {
    enabled: useAuthStore.getState().isAuthenticated,
  });

  const revokeSessionMutation = trpc.user.revokeSession.useMutation({
    onSuccess: () => utils.user.getSessions.invalidate(),
  });

  const revokeOthersMutation = trpc.user.revokeOtherSessions.useMutation({
    onSuccess: () => utils.user.getSessions.invalidate(),
  });

  const revokeAllMutation = trpc.user.revokeAllSessions.useMutation({
    onSuccess: () => utils.user.getSessions.invalidate(),
  });

  return {
    sessions: (sessionsQuery.data ?? []) as SessionInfo[],
    isLoadingSessions: sessionsQuery.isLoading,
    refetchSessions: sessionsQuery.refetch,

    revokeSession: revokeSessionMutation.mutateAsync,
    isRevokingSession: revokeSessionMutation.isPending,

    revokeOtherSessions: revokeOthersMutation.mutateAsync,
    isRevokingOthers: revokeOthersMutation.isPending,

    revokeAllSessions: revokeAllMutation.mutateAsync,
    isRevokingAll: revokeAllMutation.isPending,
  };
}

/** Hook for TOTP / 2FA management */
export function useTotp() {
  const utils = trpc.useUtils();

  const statusQuery = trpc.user.getTotpStatus.useQuery(undefined, {
    enabled: useAuthStore.getState().isAuthenticated,
  });

  const setupMutation = trpc.user.setupTotp.useMutation();

  const confirmMutation = trpc.user.confirmTotpSetup.useMutation({
    onSuccess: () => {
      utils.user.getTotpStatus.invalidate();
      utils.user.getProfile.invalidate();
    },
  });

  const disableMutation = trpc.user.disableTotp.useMutation({
    onSuccess: () => {
      utils.user.getTotpStatus.invalidate();
      utils.user.getProfile.invalidate();
    },
  });

  return {
    totpEnabled: statusQuery.data?.enabled ?? false,
    isLoadingStatus: statusQuery.isLoading,

    setupTotp: setupMutation.mutateAsync,
    isSettingUp: setupMutation.isPending,
    setupData: setupMutation.data,
    setupError: setupMutation.error ? getErrorMessage(setupMutation.error) : null,

    confirmTotpSetup: confirmMutation.mutateAsync,
    isConfirming: confirmMutation.isPending,
    confirmError: confirmMutation.error ? getErrorMessage(confirmMutation.error) : null,

    disableTotp: disableMutation.mutateAsync,
    isDisabling: disableMutation.isPending,
    disableError: disableMutation.error ? getErrorMessage(disableMutation.error) : null,
  };
}
