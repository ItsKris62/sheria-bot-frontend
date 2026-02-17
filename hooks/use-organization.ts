"use client";

import { trpc } from "@/lib/trpc";

/** Hook for organization data */
export function useOrganization(id?: string) {
  return trpc.organization.get.useQuery(
    { id: id! },
    { enabled: !!id },
  );
}

/** Hook for organization mutations */
export function useOrganizationActions() {
  const utils = trpc.useUtils();

  const updateMutation = trpc.organization.update.useMutation({
    onSuccess: (_, variables) => {
      utils.organization.get.invalidate({ id: variables.id });
    },
  });

  return {
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
