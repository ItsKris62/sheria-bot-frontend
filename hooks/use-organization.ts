"use client";

import { trpc } from "@/lib/trpc";

/** Hook for organization data */
export function useOrganization(id?: string) {
  const useQuery = trpc.organization.get.useQuery as unknown as (
    input: { id: string },
    opts: { enabled: boolean },
  ) => unknown;
  return useQuery(
    { id: id! },
    { enabled: !!id },
  );
}

/** Hook for organization mutations */
export function useOrganizationActions() {
  const utils = trpc.useUtils();
  const useMutation = trpc.organization.update.useMutation as unknown as (opts: {
    onSuccess: (_: unknown, variables: { id: string }) => void;
  }) => {
    mutateAsync: (input: unknown) => Promise<unknown>;
    isPending: boolean;
  };

  const updateMutation = useMutation({
    onSuccess: (_, variables) => {
      void utils.organization.get.invalidate({ id: variables.id });
    },
  });

  return {
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
