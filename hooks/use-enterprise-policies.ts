"use client";

import { trpc, getErrorMessage } from "@/lib/trpc";

export type EnterprisePolicyStatus =
  | "INITIALIZING"
  | "OUTLINING"
  | "DRAFTING"
  | "REVIEWING"
  | "COMPLETED"
  | "FAILED"
  | "ARCHIVED";

export type EnterprisePolicyType =
  | "DATA_PROTECTION"
  | "AML_CFT"
  | "IT_SECURITY"
  | "CONSUMER_PROTECTION"
  | "CYBERSECURITY"
  | "CUSTOM";

export function useEnterprisePolicies(options?: {
  limit?: number;
  cursor?: string;
  status?: EnterprisePolicyStatus;
  policyType?: EnterprisePolicyType;
}) {
  return trpc.enterprisePolicy.listPolicies.useQuery({
    limit: options?.limit ?? 20,
    cursor: options?.cursor,
    status: options?.status,
    policyType: options?.policyType,
  });
}

export function useEnterprisePolicy(policyId: string) {
  return trpc.enterprisePolicy.getPolicy.useQuery(
    { policyId },
    { enabled: !!policyId },
  );
}

export function useEnterprisePolicyStatus(policyId: string, enabled = true) {
  return trpc.enterprisePolicy.getStatus.useQuery(
    { policyId },
    {
      enabled: enabled && !!policyId,
      refetchInterval: (query) => {
        const data = query.state.data;
        return data && !data.isComplete && !data.isFailed ? 2000 : false;
      },
    },
  );
}

export function useEnterprisePolicyActions() {
  const utils = trpc.useUtils();

  const createMutation = trpc.enterprisePolicy.createDraft.useMutation({
    onSuccess: () => {
      utils.enterprisePolicy.listPolicies.invalidate();
    },
  });

  const deleteMutation = trpc.enterprisePolicy.deletePolicy.useMutation({
    onSuccess: () => {
      utils.enterprisePolicy.listPolicies.invalidate();
    },
  });

  return {
    createDraft: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error ? getErrorMessage(createMutation.error) : null,
    createResult: createMutation.data,
    deletePolicy: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
