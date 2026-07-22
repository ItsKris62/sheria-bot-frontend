import type { ClassifiedSignalCore, PilotFintechImpact } from './types';
interface ActivePilotRow {
    id: string;
    email: string;
    pilotCohort: string | null;
    organization: {
        id: string;
        name: string;
        organizationType: string;
        industry: string | null;
        cbkLicenseNumber: string | null;
        website: string | null;
    } | null;
}
interface ImpactMatcherPrisma {
    user: {
        findMany(args: object): Promise<ActivePilotRow[]>;
    };
}
export interface ImpactMatcherDependencies {
    prisma?: ImpactMatcherPrisma;
    now?: () => Date;
}
export declare class ImpactMatcherService {
    private readonly prisma;
    private readonly now;
    constructor(dependencies?: ImpactMatcherDependencies);
    matchSignal(agentRunId: string, signal: ClassifiedSignalCore): Promise<PilotFintechImpact[]>;
}
export declare const impactMatcherService: ImpactMatcherService;
export {};
//# sourceMappingURL=impact-matcher.service.d.ts.map