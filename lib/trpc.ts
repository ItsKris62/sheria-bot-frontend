"use client";

import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import type { AppRouter } from "@sheriabot/api-types";

export const trpc = createTRPCReact<AppRouter>();

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

let activeIdempotencyKey: string | null = null;

export function setIdempotencyKey(key: string | null) {
  activeIdempotencyKey = key;
}

export function getActiveIdempotencyKey(): string | null {
  return activeIdempotencyKey;
}

export function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/trpc",
        headers() {
          const headers: Record<string, string> = {};
          const token = getAccessToken();
          if (token) {
            headers.Authorization = `Bearer ${token}`;
          }
          const idempotencyKey = getActiveIdempotencyKey();
          if (idempotencyKey) {
            headers["Idempotency-Key"] = idempotencyKey;
          }
          return headers;
        },
        fetch(url, options) {
          const urlStr = typeof url === "string" ? url : url.toString();
          const isPaymentMutation =
            urlStr.includes("billing.createCheckoutSession") ||
            urlStr.includes("billing.initiateMpesaPayment");

          const headers = new Headers(options?.headers);
          if (!isPaymentMutation && headers.has("Idempotency-Key")) {
            headers.delete("Idempotency-Key");
          }

          return fetch(url, {
            ...options,
            headers,
            credentials: "include",
          });
        },
      }),
    ],
  });
}

/**
 * Generic tRPC error mapper for non-auth routes.
 * For auth routes (login, register, reset-password) use `getAuthErrorMessage`
 * from `@/lib/auth-error-messages` instead — it has security-conscious mappings.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof TRPCClientError) {
    const code = error.data?.code as string | undefined;

    // Surface Zod validation errors with their specific messages
    const zodError = error.data?.zodError;
    if (zodError) {
      const fieldErrors = zodError.fieldErrors as Record<string, string[]> | undefined;
      if (fieldErrors) {
        const firstField = Object.values(fieldErrors)[0];
        if (firstField?.[0]) return firstField[0];
      }
      const formErrors = zodError.formErrors as string[] | undefined;
      if (formErrors?.[0]) return formErrors[0];
    }

    switch (code) {
      case "UNAUTHORIZED":
        return "Please sign in to continue.";
      case "FORBIDDEN":
        return "You don't have permission to perform this action.";
      case "NOT_FOUND":
        return "The requested resource was not found.";
      case "TOO_MANY_REQUESTS":
        // Preserve backend retryAfter message if present
        return error.message || "Too many requests. Please wait a moment and try again.";
      case "BAD_REQUEST":
        return error.message || "Invalid request. Please check your input.";
      case "CONFLICT":
        return error.message || "A conflict occurred. The resource may already exist.";
      case "INTERNAL_SERVER_ERROR":
        return "Something went wrong on our end. Please try again.";
      default:
        if (error.message?.toLowerCase().includes("network") || error.message?.toLowerCase().includes("fetch")) {
          return "We couldn't reach our servers. Please check your internet connection and try again.";
        }
        return error.message || "An unexpected error occurred.";
    }
  }
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes("network") || error.message.toLowerCase().includes("fetch")) {
      return "We couldn't reach our servers. Please check your internet connection and try again.";
    }
    return error.message;
  }
  return "An unexpected error occurred.";
}
