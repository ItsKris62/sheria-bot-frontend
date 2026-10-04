import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/auth-store";

const mocks = vi.hoisted(() => ({
  logout: vi.fn(),
  routerPush: vi.fn(),
  signOut: vi.fn(),
  setAccessToken: vi.fn(),
  clearAnalyticsUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.routerPush }),
}));

vi.mock("@/lib/supabase-client", () => ({
  supabase: {
    auth: {
      setSession: vi.fn(),
      signOut: mocks.signOut,
      refreshSession: vi.fn(),
    },
  },
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
  clearAnalyticsUser: mocks.clearAnalyticsUser,
}));

vi.mock("@/lib/trpc", () => {
  const idleMutation = { mutateAsync: vi.fn(), isPending: false, error: null };
  return {
    setAccessToken: mocks.setAccessToken,
    trpc: {
      auth: {
        login: { useMutation: () => idleMutation },
        verifyTotpLogin: { useMutation: () => idleMutation },
        register: { useMutation: () => idleMutation },
        logout: {
          useMutation: () => ({ ...idleMutation, mutateAsync: mocks.logout }),
        },
      },
      passkey: {
        generateAuthenticationOptions: { useMutation: () => idleMutation },
        verifyAuthentication: { useMutation: () => idleMutation },
      },
    },
  };
});

describe("useAuth logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.logout.mockResolvedValue(undefined);
    mocks.signOut.mockResolvedValue(undefined);
    useAuthStore.setState({
      user: {
        id: "user-a",
        email: "user-a@example.test",
        name: "User A",
        role: "STARTUP",
        organizationId: "org-a",
        emailVerified: true,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
      accessToken: "token-a",
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
    });
  });

  it("clears query and mutation caches during explicit logout", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(["sensitive-example"], { organization: "Org A" });
    queryClient.getMutationCache().build(queryClient, {
      mutationKey: ["sensitive-mutation"],
      mutationFn: async () => ({ organization: "Org A" }),
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(mocks.logout).toHaveBeenCalledTimes(1);
    expect(mocks.signOut).toHaveBeenCalledTimes(1);
    expect(mocks.clearAnalyticsUser).toHaveBeenCalledTimes(1);
    expect(mocks.setAccessToken).toHaveBeenCalledWith(null);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(queryClient.getMutationCache().getAll()).toHaveLength(0);
    expect(mocks.routerPush).toHaveBeenCalledWith("/login");
  });

  it("still signs out of Supabase and clears caches when backend logout fails", async () => {
    mocks.logout.mockRejectedValueOnce(new Error("Backend unavailable"));
    const queryClient = new QueryClient();
    queryClient.setQueryData(["sensitive-example"], { organization: "Org A" });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(mocks.signOut).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(mocks.routerPush).toHaveBeenCalledWith("/login");
  });
});
