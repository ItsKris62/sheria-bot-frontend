"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { trpc, getErrorMessage } from "@/lib/trpc";
import { useAuthStore } from "@/lib/auth-store";
import { playNotificationSound } from "@/lib/notification-sounds";

// ── Shared response types ─────────────────────────────────────────────────────

export interface CitationItem {
  documentId:    string | null;
  documentTitle: string;
  section:       string;
  textSnippet:   string;
  score:         number;
  citation:      string | null;
  authorityStatus?: "DRAFT" | "IN_FORCE" | "SUPERSEDED" | "CONSULTATION" | string;
  isBinding?: boolean;
  source?: string | null;
  version?: string | null;
}

/** Full orchestrated-path shape returned by both tRPC and SSE paths. */
export interface ComplianceQueryResponse {
  queryId: string;
  answer: string;
  citations: CitationItem[];
  confidence: number | null;
  suggestedFollowUps: string[];
  /** null on legacy shadow path (ORCHESTRATOR_ENABLED=false) */
  route: string | null;
  grounded: boolean;
  /** true when route=abstain, acceptedChunkIds=[],  or verifierVerdict=FAIL_ABSTAIN */
  abstained: boolean;
  /** null on legacy path or double-failure edge case; disables reportGap button */
  runId: string | null;
}

// ── useComplianceStream types ─────────────────────────────────────────────────

export type StreamPhase =
  | "idle"
  | "connecting"
  | "streaming"
  | "verifying"
  | "complete"
  | "error";

export interface StreamState {
  phase: StreamPhase;
  queryId: string | null;
  ragSources: number;
  /** Accumulated text — grows during streaming phase */
  content: string;
  /** Populated when phase transitions to 'complete' */
  result: ComplianceQueryResponse | null;
  errorMessage: string | null;
}

export interface ComplianceStreamInput {
  question: string;
  organizationType?: string;
  industry?: string;
  context?: string;
}

// Discriminated union — one type per SSE event the backend emits
type SSEEvent =
  | { type: "connected"; queryId: string; ragSources: number }
  | { type: "chunk"; text: string }
  | { type: "synthesis_complete" }
  | { type: "done"; queryId: string; route: string; grounded: boolean; abstained: boolean; runId: string | null; citations: CitationItem[]; confidence: number | null }
  | { type: "error"; message: string };

// ── Constants ─────────────────────────────────────────────────────────────────

const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/trpc").replace(/\/trpc\/?$/, "");

const INITIAL_STATE: StreamState = {
  phase: "idle",
  queryId: null,
  ragSources: 0,
  content: "",
  result: null,
  errorMessage: null,
};

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * SSE-backed compliance stream hook.
 * State machine: idle → connecting → streaming → verifying → complete | error
 * Keeps useComplianceQuery (tRPC) alive — both coexist in this file.
 */
export function useComplianceStream() {
  const [state, setState] = useState<StreamState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);

  // Abort in-flight stream on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState(INITIAL_STATE);
  }, []);

  /**
   * @param input.question 1–5,000 characters. This hook enforces the same bounds
   *   defensively, but the caller is responsible for upstream UX validation.
   */
  const submit = useCallback((input: ComplianceStreamInput) => {
    // Abort any previously running stream before starting a new one
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Pull token at call time — never cache in hook state (token may rotate)
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      setState((prev) => ({ ...prev, phase: "error", errorMessage: "Not authenticated" }));
      return;
    }
    if (input.question.trim().length === 0) {
      setState((prev) => ({ ...prev, phase: "error", errorMessage: "Question is required" }));
      return;
    }
    if (input.question.length > 5000) {
      setState((prev) => ({ ...prev, phase: "error", errorMessage: "Question must be 5,000 characters or fewer" }));
      return;
    }

    setState({ ...INITIAL_STATE, phase: "connecting" });

    // Run async stream logic inside a fire-and-forget IIFE
    void (async () => {
      let buffer = "";
      let accumulatedContent = "";
      let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

      try {
        const response = await fetch(`${BACKEND_BASE}/api/compliance/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(input),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          const message = (errBody as { error?: string })?.error ?? `Request failed (${response.status})`;
          setState((prev) => ({ ...prev, phase: "error", errorMessage: message }));
          return;
        }

        if (!response.body) {
          setState((prev) => ({ ...prev, phase: "error", errorMessage: "No response body" }));
          return;
        }

        reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE events are separated by double newline
          const parts = buffer.split("\n\n");
          // Keep the trailing incomplete chunk in the buffer
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            const line = part.trim();
            // Ignore comment lines (heartbeats arrive as ": heartbeat")
            if (!line || line.startsWith(":")) continue;

            const DATA_PREFIX = "data: ";
            if (!line.startsWith(DATA_PREFIX)) continue;

            let event: SSEEvent;
            try {
              event = JSON.parse(line.slice(DATA_PREFIX.length)) as SSEEvent;
            } catch {
              continue;
            }

            // Exhaustive discriminated union — TypeScript enforces all branches
            switch (event.type) {
              case "connected":
                setState((prev) => ({
                  ...prev,
                  phase: "streaming",
                  queryId: event.queryId,
                  ragSources: event.ragSources,
                }));
                break;

              case "chunk":
                accumulatedContent += event.text;
                setState((prev) => ({ ...prev, content: accumulatedContent }));
                break;

              case "synthesis_complete":
                setState((prev) => ({ ...prev, phase: "verifying" }));
                break;

              case "done":
                playNotificationSound("chat-complete");
                setState((prev) => ({
                  ...prev,
                  phase: "complete",
                  result: {
                    queryId: event.queryId,
                    answer: accumulatedContent,
                    citations: event.citations,
                    confidence: event.confidence,
                    suggestedFollowUps: [],
                    route: event.route,
                    grounded: event.grounded,
                    abstained: event.abstained,
                    runId: event.runId,
                  },
                }));
                break;

              case "error":
                setState((prev) => ({ ...prev, phase: "error", errorMessage: event.message }));
                break;

              default: {
                // Compile-time exhaustiveness check
                const _exhaustive: never = event;
                void _exhaustive;
                break;
              }
            }
          }
        }
      } catch (err: unknown) {
        // Ignore abort errors — caused by reset() or unmount, not a real failure
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Stream failed";
        setState((prev) => ({ ...prev, phase: "error", errorMessage: message }));
      } finally {
        reader?.releaseLock();
      }
    })();
  }, []);

  return { submit, state, reset };
}

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
