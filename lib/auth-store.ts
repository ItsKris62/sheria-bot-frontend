"use client";

import { create } from "zustand";
import { setAccessToken } from "./trpc";

export type UserRole = "ADMIN" | "REGULATOR" | "STARTUP" | "ENTERPRISE" | "FINTECH_USER";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string | null;
  emailVerified: boolean;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  /** Set auth state after login/register */
  setAuth: (user: AuthUser, accessToken: string) => void;

  /** Clear auth state on logout */
  clearAuth: () => void;

  /** Update access token (after silent refresh) */
  updateToken: (accessToken: string) => void;

  /** Update user data */
  updateUser: (user: Partial<AuthUser>) => void;

  /** Set loading state */
  setLoading: (loading: boolean) => void;

  /** Mark initialization complete */
  setInitialized: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,

  setAuth: (user, accessToken) => {
    setAccessToken(accessToken);
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearAuth: () => {
    setAccessToken(null);
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  updateToken: (accessToken) => {
    setAccessToken(accessToken);
    set({ accessToken });
  },

  updateUser: (updates) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, ...updates } });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  setInitialized: () => set({ isInitialized: true, isLoading: false }),
}));

/** Helper to get current user role */
export function useUserRole(): UserRole | null {
  return useAuthStore((state) => state.user?.role ?? null);
}

/** Helper to check if user has a specific role */
export function useHasRole(role: UserRole): boolean {
  return useAuthStore((state) => state.user?.role === role);
}
