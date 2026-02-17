"use client";

import { trpc, getErrorMessage } from "@/lib/trpc";

/** Hook for compliance query operations */
export function useComplianceQuery() {
  const utils = trpc.useUtils();

  const queryMutation = trpc.compliance.query.useMutation({
    onSuccess: () => {
      utils.compliance.history.invalidate();
    },
  });

  const followUpMutation = trpc.compliance.followUp.useMutation({
    onSuccess: () => {
      utils.compliance.history.invalidate();
    },
  });

  const quickCheckMutation = trpc.compliance.quickCheck.useMutation();

  return {
    /** Submit a compliance query (RAG-powered) */
    submitQuery: queryMutation.mutateAsync,
    isQuerying: queryMutation.isPending,
    queryError: queryMutation.error ? getErrorMessage(queryMutation.error) : null,
    queryResult: queryMutation.data,

    /** Submit a follow-up question */
    submitFollowUp: followUpMutation.mutateAsync,
    isFollowingUp: followUpMutation.isPending,

    /** Quick compliance check */
    quickCheck: quickCheckMutation.mutateAsync,
    isQuickChecking: quickCheckMutation.isPending,

    /** Reset query state */
    reset: () => {
      queryMutation.reset();
      followUpMutation.reset();
    },
  };
}

/** Hook for compliance search */
export function useComplianceSearch(query: string, options?: { limit?: number; enabled?: boolean }) {
  return trpc.compliance.search.useQuery(
    { query, limit: options?.limit ?? 10 },
    {
      enabled: (options?.enabled ?? true) && query.length >= 3,
    },
  );
}

/** Hook for compliance query history */
export function useComplianceHistory(page = 1, limit = 10) {
  return trpc.compliance.history.useQuery({ page, limit });
}

/** Hook for a single compliance query */
export function useComplianceGet(id: string) {
  return trpc.compliance.get.useQuery(
    { id },
    { enabled: !!id },
  );
}
