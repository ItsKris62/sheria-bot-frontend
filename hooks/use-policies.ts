"use client";

import { trpc, getErrorMessage } from "@/lib/trpc";

/** Hook for policy list with pagination */
export function usePolicies(options?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return trpc.policy.list.useQuery({
    page: options?.page ?? 1,
    limit: options?.limit ?? 10,
    status: options?.status,
    search: options?.search,
  });
}

/** Hook for a single policy */
export function usePolicy(id: string) {
  return trpc.policy.get.useQuery(
    { id },
    { enabled: !!id },
  );
}

/** Hook for policy generation and mutations */
export function usePolicyActions() {
  const utils = trpc.useUtils();

  const generateMutation = trpc.policy.generate.useMutation({
    onSuccess: () => {
      utils.policy.list.invalidate();
    },
  });

  const updateMutation = trpc.policy.update.useMutation({
    onSuccess: (_, variables) => {
      utils.policy.list.invalidate();
      utils.policy.get.invalidate({ id: variables.id });
    },
  });

  const deleteMutation = trpc.policy.delete.useMutation({
    onSuccess: () => {
      utils.policy.list.invalidate();
    },
  });

  const exportMutation = trpc.policy.export.useMutation();

  const refineMutation = trpc.policy.refine.useMutation({
    onSuccess: (_, variables) => {
      utils.policy.get.invalidate({ id: variables.id });
    },
  });

  return {
    /** Generate a policy with AI */
    generate: generateMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
    generateError: generateMutation.error ? getErrorMessage(generateMutation.error) : null,
    generateResult: generateMutation.data,

    /** Update a policy */
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    /** Delete a policy */
    remove: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    /** Export a policy */
    exportPolicy: exportMutation.mutateAsync,
    isExporting: exportMutation.isPending,

    /** Refine a policy with AI */
    refine: refineMutation.mutateAsync,
    isRefining: refineMutation.isPending,
  };
}
