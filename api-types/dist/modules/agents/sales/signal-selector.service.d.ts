import { prisma as defaultPrisma } from '@/lib/prisma/client';
import type { GroundedSalesProspect } from './types';
import { sourceFingerprintFor } from './types';
type SignalSelectorPrisma = Pick<typeof defaultPrisma, '$queryRaw'>;
export interface SignalSelectorDependencies {
    prisma?: SignalSelectorPrisma;
}
export interface SelectProspectsInput {
    limit?: number;
}
/**
 * Sales prospects are individual (RegulatorySignal, Organization) pairs
 * expanded from RegulatorySignal.pilotFintechsAffected - the same data B3
 * used to build recommendedActions.sales, queried directly rather than
 * re-parsing the write-once AgentReport.recommendedActions JSON blob.
 * Dedup mirrors B4's sourceFingerprint pattern: signalId|organizationId.
 */
export declare class SalesSignalSelectorService {
    private readonly prisma;
    constructor(dependencies?: SignalSelectorDependencies);
    selectProspects(input?: SelectProspectsInput): Promise<GroundedSalesProspect[]>;
}
export declare const salesSignalSelectorService: SalesSignalSelectorService;
export { sourceFingerprintFor };
//# sourceMappingURL=signal-selector.service.d.ts.map