/**
 * Secondary-Country Replacement Lifecycle Service
 *
 * Rules:
 * - Free / Starter / Growth: Home country only (maxEnabledCountries: 1)
 * - Business: Home plus 1 enabled country (maxEnabledCountries: 2)
 * - Enterprise: Up to 4 explicitly enabled countries (maxEnabledCountries: 4)
 *
 * Initial selection into an unused entitled country slot is immediate.
 * Replacement of an existing secondary country is scheduled for the next monthly
 * entitlement renewal boundary for both monthly and annual subscribers.
 * The home country can never be replaced via this mechanism.
 */
export interface ScheduledCountryReplacement {
    fromJurisdiction: string;
    toJurisdiction: string;
    effectiveAt: string;
    scheduledAt: string;
    scheduledByUserId: string;
}
export interface ScheduleCountryReplacementInput {
    organizationId: string;
    userId: string;
    fromJurisdiction: string;
    toJurisdiction: string;
    ipAddress?: string | null;
    userAgent?: string | null;
}
declare class CountryReplacementService {
    /**
     * Schedules replacement of an existing secondary country for the next monthly entitlement boundary.
     */
    scheduleReplacement(input: ScheduleCountryReplacementInput): Promise<{
        scheduled: boolean;
        effectiveAt: string;
        fromJurisdiction: string;
        toJurisdiction: string;
    }>;
    /**
     * Retrieves pending scheduled country replacement if one exists.
     */
    getScheduledReplacement(organizationId: string): Promise<ScheduledCountryReplacement | null>;
    /**
     * Cancels a pending scheduled country replacement.
     */
    cancelScheduledReplacement(organizationId: string, userId: string): Promise<boolean>;
    /**
     * Atomically executes any due scheduled country replacement.
     * Can be called by a periodic worker or on-demand at entitlement evaluation.
     */
    applyDueScheduledReplacement(organizationId: string): Promise<boolean>;
}
export declare const countryReplacementService: CountryReplacementService;
export {};
//# sourceMappingURL=country-replacement.service.d.ts.map