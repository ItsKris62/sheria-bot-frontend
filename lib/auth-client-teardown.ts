"use client";

import type { QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/auth-store";

export function clearAuthenticatedClientState(queryClient: QueryClient): void {
  useAuthStore.getState().clearAuth();
  queryClient.clear();
}
