type FetchLike = typeof fetch;
export interface SentryQueryConfig {
    apiToken?: string;
    org?: string;
    project?: string;
}
export interface SentryCriticalIssueCheck {
    hasCriticalIssue: boolean;
    dataAvailable: boolean;
}
export interface SentryQueryServiceDependencies {
    fetchImpl?: FetchLike;
    configProvider?: () => SentryQueryConfig;
}
/**
 * Read-only query against Sentry's Issues API to check for unresolved
 * fatal/error-level issues. Never calls any write endpoint.
 *
 * hasCriticalIssue: false with dataAvailable: false means "we could not
 * reliably check" (missing config, timeout, non-2xx, network/parse error).
 * This must never be presented the same as a confirmed-clean check
 * (dataAvailable: true) - callers must branch on dataAvailable, not just
 * hasCriticalIssue.
 */
export declare class SentryQueryService {
    private readonly fetchImpl;
    private readonly configProvider;
    constructor(dependencies?: SentryQueryServiceDependencies);
    checkCriticalIssues(): Promise<SentryCriticalIssueCheck>;
    private fetchCriticalIssueState;
}
export declare const sentryQueryService: SentryQueryService;
export {};
//# sourceMappingURL=sentry-query.service.d.ts.map