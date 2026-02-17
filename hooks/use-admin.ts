"use client";

import { trpc, getErrorMessage } from "@/lib/trpc";

/** Hook for admin dashboard stats */
export function useAdminStats() {
  return trpc.admin.getStats.useQuery();
}

/** Hook for admin user list */
export function useAdminUsers(options?: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}) {
  return trpc.admin.listUsers.useQuery({
    page: options?.page ?? 1,
    limit: options?.limit ?? 20,
    role: options?.role,
    search: options?.search,
  });
}

/** Hook for admin user actions */
export function useAdminActions() {
  const utils = trpc.useUtils();

  const disableUserMutation = trpc.admin.disableUser.useMutation({
    onSuccess: () => {
      utils.admin.listUsers.invalidate();
      utils.admin.getStats.invalidate();
    },
  });

  const enableUserMutation = trpc.admin.enableUser.useMutation({
    onSuccess: () => {
      utils.admin.listUsers.invalidate();
    },
  });

  return {
    disableUser: disableUserMutation.mutateAsync,
    isDisabling: disableUserMutation.isPending,

    enableUser: enableUserMutation.mutateAsync,
    isEnabling: enableUserMutation.isPending,
  };
}

/** Hook for audit logs */
export function useAuditLogs(options?: { page?: number; limit?: number }) {
  return trpc.admin.getAuditLogs.useQuery({
    page: options?.page ?? 1,
    limit: options?.limit ?? 20,
  });
}
