import { prisma as defaultPrisma } from '@/lib/prisma/client';
type PilotVendorPrisma = Pick<typeof defaultPrisma, 'user' | 'complianceQuery'>;
export interface AutomationPilotVendorServiceDependencies {
    prisma?: PilotVendorPrisma;
    now?: () => Date;
}
export interface PilotCohortOrgStatus {
    orgId: string;
    status: string;
    daysSinceLastQuery: number;
}
export interface DpaVendorStatus {
    name: string;
    status: string;
}
export declare class AutomationPilotVendorService {
    private readonly prisma;
    private readonly now;
    constructor(dependencies?: AutomationPilotVendorServiceDependencies);
    /**
     * jurisdiction has no backing field on Organization (same finding as Phase
     * 1's sales metrics) - every org defaults to 'Kenya'; a filter excluding it
     * short-circuits to an empty list rather than guessing per-org values.
     *
     * daysSinceLastQuery: when an org's pilot users have never run a
     * ComplianceQuery, there is no real "last query" event to report. Rather
     * than fabricate 0 (which would misleadingly read as "queried today"),
     * this falls back to days-since-pilot-user-created as an honest, clearly-
     * labeled proxy for "how long this org has been idle since it had any
     * account activity we can measure" - flagged here and in the Phase 3 report.
     */
    getPilotCohortStatus(input: {
        cohort: string;
        jurisdictions: string;
    }): Promise<{
        orgs: PilotCohortOrgStatus[];
    }>;
    /**
     * No DPA/vendor-tracking model or document exists anywhere in this
     * codebase (confirmed by repo-wide search) - returning fabricated vendor
     * names would be worse than an honest empty state. Deviates from the
     * brief's exact `{ vendors: [...] }` shape by adding `dataAvailable`, same
     * pattern as Phase 1's security.dataAvailable.
     */
    getDpaVendorStatus(): Promise<{
        vendors: DpaVendorStatus[];
        dataAvailable: boolean;
    }>;
}
export declare const automationPilotVendorService: AutomationPilotVendorService;
export {};
//# sourceMappingURL=pilot-vendor.service.d.ts.map