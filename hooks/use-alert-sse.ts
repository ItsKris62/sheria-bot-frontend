"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { trpc } from "@/lib/trpc";

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
 * EventSource cannot set custom request headers, so this hook first asks the
 * authenticated tRPC API for a short-lived stream token. Only that scoped token
 * goes into the URL, never the user's Supabase access token.
 *
 * Call this hook only inside a single, long-lived client component
 * (AlertSSEProvider) - not inside every component that needs alert data.
 */
export function useAlertSSE(onEvent: (event: AlertSSEEvent) => void): void {
  const accessToken = useAuthStore((state) => state.accessToken);
  const createStreamToken = trpc.alert.createStreamToken.useMutation();

  // Keep the callback ref current so token-change reconnects don't fire
  // just because the callback identity changed between renders.
  const onEventRef = useRef(onEvent);
  const createStreamTokenRef = useRef(createStreamToken.mutateAsync);

  useEffect(() => {
    onEventRef.current = onEvent;
    createStreamTokenRef.current = createStreamToken.mutateAsync;
  });

  useEffect(() => {
    if (!accessToken) return;

    let es: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const connect = async () => {
      try {
        const { token } = await createStreamTokenRef.current();
        if (cancelled) return;

        const url = `${BACKEND_BASE}/api/alerts/stream?token=${encodeURIComponent(token)}`;
        es = new EventSource(url);

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

        es.onerror = () => {
          es?.close();
          es = null;
          if (!cancelled) {
            reconnectTimer = setTimeout(connect, 5000);
          }
        };
      } catch {
        if (!cancelled) {
          reconnectTimer = setTimeout(connect, 5000);
        }
      }
    };

    void connect();

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      es?.close();
    };
  }, [accessToken]);
}
