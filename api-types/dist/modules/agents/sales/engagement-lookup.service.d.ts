import type { EngagementContext } from './types';
type FetchLike = typeof fetch;
export interface PostHogQueryConfig {
    personalApiKey?: string;
    host?: string;
    projectId?: string;
}
export interface EngagementLookupDependencies {
    fetchImpl?: FetchLike;
    configProvider?: () => PostHogQueryConfig;
}
/**
 * Read-only HogQL query against PostHog's Query API. Never calls capture,
 * identify, or any write/tracking endpoint. Degrades to { available: false }
 * on missing config, missing contact email, non-2xx response, or any
 * network/parse failure - the sales agent must never fail a run because
 * engagement data is unreachable.
 */
export declare class SalesEngagementLookupService {
    private readonly fetchImpl;
    private readonly configProvider;
    constructor(dependencies?: EngagementLookupDependencies);
    lookup(organizationId: string, contactEmail: string | null): Promise<EngagementContext>;
}
export declare const salesEngagementLookupService: SalesEngagementLookupService;
export {};
//# sourceMappingURL=engagement-lookup.service.d.ts.map