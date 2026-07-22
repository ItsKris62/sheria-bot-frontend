import { prisma as defaultPrisma } from '@/lib/prisma/client';
import type { GroundedMarketingSignal, MarketingContentType } from './types';
type SignalSelectorPrisma = Pick<typeof defaultPrisma, '$queryRaw'>;
export interface SignalSelectorDependencies {
    prisma?: SignalSelectorPrisma;
}
export interface SelectSignalsInput {
    contentType: MarketingContentType;
    limit?: number;
}
export declare function sourceFingerprintFor(signalIds: readonly string[]): string;
export declare class MarketingSignalSelectorService {
    private readonly prisma;
    constructor(dependencies?: SignalSelectorDependencies);
    selectSignals(input: SelectSignalsInput): Promise<GroundedMarketingSignal[]>;
}
export declare const marketingSignalSelectorService: MarketingSignalSelectorService;
export {};
//# sourceMappingURL=signal-selector.service.d.ts.map