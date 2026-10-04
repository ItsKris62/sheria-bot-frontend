import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Session } from "@supabase/supabase-js";
import { TRPCClientError } from "@trpc/client";
import {
  handleSupabaseAuthStateChange,
  makeQueryClient,
} from "@/components/providers";
import { clearAuthenticatedClientState } from "@/lib/auth-client-teardown";
import { useAuthStore } from "@/lib/auth-store";
import { getAccessToken, setAccessToken } from "@/lib/trpc";
import { SESSION_EXPIRED_FLAG } from "@/lib/session-timeouts";

vi.mock("@/lib/supabase-client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
  },
}));

const sensitiveQueryKey = ["sensitive-example"] as const;

function authenticate(): void {
  useAuthStore.getState().setAuth(
    {
      id: "user-a",
      email: "user-a@example.test",
      name: "User A",
      role: "STARTUP",
      organizationId: "org-a",
      emailVerified: true,
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    "token-a",
  );
}

function seedSensitiveState(queryClient: ReturnType<typeof makeQueryClient>) {
  queryClient.setQueryData(sensitiveQueryKey, { organization: "Org A" });
  const mutation = queryClient.getMutationCache().build(queryClient, {
    mutationKey: ["sensitive-mutation"],
    mutationFn: async () => ({ organization: "Org A" }),
  });
  return mutation;
}

function createTRPCError(message: string, code: string) {
  return new TRPCClientError(message, {
    result: {
      error: {
        message,
        data: { code },
      },
    },
  });
}

describe("authenticated cache isolation", () => {
  beforeEach(() => {
    sessionStorage.clear();
    useAuthStore.getState().clearAuth();
  });

  afterEach(() => {
    setAccessToken(null);
    useAuthStore.getState().clearAuth();
  });

  it.each(["query", "mutation"] as const)(
    "clears authenticated state and both caches after an UNAUTHORIZED %s error",
    (source) => {
      const queryClient = makeQueryClient();
      authenticate();
      const mutation = seedSensitiveState(queryClient);
      const query = queryClient.getQueryCache().find({ queryKey: sensitiveQueryKey });
      const error = createTRPCError("Session expired", "UNAUTHORIZED");

      if (source === "query") {
        queryClient.getQueryCache().config.onError?.(error, query as never);
      } else {
        queryClient.getMutationCache().config.onError?.(
          error,
          undefined,
          undefined,
          mutation as never,
          { client: queryClient, meta: undefined, mutationKey: ["sensitive-mutation"] },
        );
      }

      expect(getAccessToken()).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
      expect(queryClient.getMutationCache().getAll()).toHaveLength(0);
      expect(sessionStorage.getItem(SESSION_EXPIRED_FLAG)).toBe("1");
    },
  );

  it("clears authenticated state and both caches on Supabase SIGNED_OUT", () => {
    const queryClient = makeQueryClient();
    authenticate();
    seedSensitiveState(queryClient);

    handleSupabaseAuthStateChange(queryClient, "SIGNED_OUT", null);

    expect(getAccessToken()).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(queryClient.getMutationCache().getAll()).toHaveLength(0);
  });

  it("preserves authenticated caches on same-session TOKEN_REFRESHED", () => {
    const queryClient = makeQueryClient();
    authenticate();
    seedSensitiveState(queryClient);
    const refreshedSession = {
      access_token: "token-refreshed",
    } as Session;

    handleSupabaseAuthStateChange(queryClient, "TOKEN_REFRESHED", refreshedSession);

    expect(getAccessToken()).toBe("token-refreshed");
    expect(useAuthStore.getState().accessToken).toBe("token-refreshed");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(queryClient.getQueryData(sensitiveQueryKey)).toEqual({ organization: "Org A" });
    expect(queryClient.getMutationCache().getAll()).toHaveLength(1);
  });

  it("does not repopulate cache when an in-flight query resolves after teardown", async () => {
    const queryClient = makeQueryClient();
    authenticate();
    let resolveQuery!: (value: { organization: string }) => void;
    const deferred = new Promise<{ organization: string }>((resolve) => {
      resolveQuery = resolve;
    });
    const request = queryClient.fetchQuery({
      queryKey: sensitiveQueryKey,
      queryFn: () => deferred,
    }).catch((error: unknown) => error);

    expect(queryClient.isFetching()).toBe(1);
    clearAuthenticatedClientState(queryClient);
    resolveQuery({ organization: "Org A" });
    await request;

    expect(queryClient.getQueryData(sensitiveQueryKey)).toBeUndefined();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(queryClient.getMutationCache().getAll()).toHaveLength(0);
  });
});
