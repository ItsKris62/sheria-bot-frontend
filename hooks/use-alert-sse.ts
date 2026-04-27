"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/auth-store";

export type AlertSSEEvent = {
  type: "NEW_ALERT";
  alertId: string;
  title: string;
  severity: string;
  regulatoryBody: string;
  publishedAt: string;
  timestamp: number;
};

// NEXT_PUBLIC_API_URL points at the tRPC endpoint (e.g. https://api.sheriabot.com/trpc).
// Strip the trailing /trpc segment to get the Fastify base URL for the SSE route.
const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/trpc")
  .replace(/\/trpc\/?$/, "");

/**
 * Opens a Server-Sent Events connection to /api/alerts/stream for the
 * currently authenticated user.
 *
 * The Supabase access token is passed as ?token= because EventSource cannot
 * set custom request headers. The connection is torn down and re-established
 * whenever the access token changes (e.g. after a silent refresh).
 *
 * Call this hook only inside a single, long-lived client component
 * (AlertSSEProvider) - not inside every component that needs alert data.
 */
export function useAlertSSE(onEvent: (event: AlertSSEEvent) => void): void {
  const accessToken = useAuthStore((state) => state.accessToken);

  // Keep the callback ref current so token-change reconnects don't fire
  // just because the callback identity changed between renders.
  const onEventRef = useRef(onEvent);
  useEffect(() => {
    onEventRef.current = onEvent;
  });

  useEffect(() => {
    if (!accessToken) return;

    const url = `${BACKEND_BASE}/api/alerts/stream?token=${encodeURIComponent(accessToken)}`;
    const es = new EventSource(url);

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as { type: string };
        if (data.type !== "CONNECTED") {
          onEventRef.current(data as AlertSSEEvent);
        }
      } catch {
        // ignore malformed JSON frames
      }
    };

    return () => es.close();
  }, [accessToken]);
}
