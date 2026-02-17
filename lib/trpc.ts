"use client";

import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import type { AppRouter } from "../../fintech-regulatory-backend/src/server/trpc/router";

export const trpc = createTRPCReact<AppRouter>();

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/trpc",
        headers() {
          const token = getAccessToken();
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
      }),
    ],
  });
}

/** Map tRPC error codes to user-friendly messages */
export function getErrorMessage(error: unknown): string {
  if (error instanceof TRPCClientError) {
    const code = error.data?.code;
    switch (code) {
      case "UNAUTHORIZED":
        return "Please sign in to continue.";
      case "FORBIDDEN":
        return "You don't have permission to perform this action.";
      case "NOT_FOUND":
        return "The requested resource was not found.";
      case "TOO_MANY_REQUESTS":
        return "Too many requests. Please try again later.";
      case "BAD_REQUEST":
        return error.message || "Invalid request. Please check your input.";
      case "CONFLICT":
        return error.message || "A conflict occurred. The resource may already exist.";
      case "INTERNAL_SERVER_ERROR":
        return "Something went wrong on our end. Please try again.";
      default:
        return error.message || "An unexpected error occurred.";
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred.";
}
