type FetchLike = typeof fetch;
export interface PostHogQueryConfig {
    personalApiKey?: string;
    host?: string;
    projectId?: string;
}
export interface QueryClientDependencies {
    fetchImpl?: FetchLike;
    configProvider?: () => PostHogQueryConfig;
}
export type HogQLQueryResult = {
    available: true;
    results: unknown[][];
} | {
    available: false;
    reason: string;
};
/**
 * Generic read-only HogQL query client, pattern-matched to
 * src/modules/agents/sales/engagement-lookup.service.ts (same config shape,
 * same auth/timeout/degradation contract). Never calls capture, identify, or
 * any write/tracking endpoint. Degrades to { available: false } on missing
 * config, non-2xx response, or any network/parse failure - callers must never
 * fail a run because PostHog is unreachable.
 */
export declare class PostHogQueryClient {
    private readonly fetchImpl;
    private readonly configProvider;
    constructor(dependencies?: QueryClientDependencies);
    runHogQLQuery(query: string, values?: Record<string, unknown>): Promise<HogQLQueryResult>;
}
export declare const postHogQueryClient: PostHogQueryClient;
export {};
//# sourceMappingURL=query-client.d.ts.map