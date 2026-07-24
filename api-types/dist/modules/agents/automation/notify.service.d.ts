export interface ShouldNotifyInput {
    dedupeKey: string;
    ttlSeconds: number;
}
type NotificationDedupeFn = (dedupeKey: string, ttlSeconds: number) => Promise<boolean>;
export interface AutomationNotifyServiceDependencies {
    notificationDedupe?: NotificationDedupeFn;
}
export declare class AutomationNotifyService {
    private readonly notificationDedupe;
    constructor(dependencies?: AutomationNotifyServiceDependencies);
    /**
     * This gate is mechanically correct and reusable by any workflow key - it
     * only dedupes on whatever boolean the caller passes in, regardless of
     * where that boolean comes from. hasCriticalIssue in
     * agents.automation.getMetrics(scope: 'security') is now a real Sentry
     * check (see SentryQueryService in src/lib/sentry-query.service.ts) rather
     * than a hardcoded false, but that change alone doesn't touch this dedup
     * gate's behavior. W-SEC-01/W-SEC-03's n8n workflows still need updating
     * to branch on dataAvailable, not just hasCriticalIssue - that's separate,
     * unbuilt work this gate can't address on its own.
     */
    shouldNotify(input: ShouldNotifyInput): Promise<{
        shouldNotify: boolean;
    }>;
}
export declare const automationNotifyService: AutomationNotifyService;
export {};
//# sourceMappingURL=notify.service.d.ts.map