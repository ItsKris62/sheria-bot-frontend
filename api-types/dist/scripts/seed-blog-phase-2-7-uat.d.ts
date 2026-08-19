import 'dotenv/config';
import { type AppRuntimeMode, type DatabaseEnvironment, type DatabaseUatRecordCounts } from '@/utils/database-identity';
type SeedMode = 'seed' | 'cleanup';
export interface Phase27UatSeedOptions {
    mode: SeedMode;
    write: boolean;
}
export interface Phase27UatSeedSafety {
    runtimeMode: AppRuntimeMode;
    databaseEnvironment: DatabaseEnvironment;
}
export declare const PHASE_27_UAT_EXPECTED_COUNTS: DatabaseUatRecordCounts;
export declare function assertPhase27UatSeedSafety(env: NodeJS.ProcessEnv): Phase27UatSeedSafety;
export declare function parsePhase27UatSeedOptions(argv: string[]): Phase27UatSeedOptions;
export declare function createPhase27UatSeedSummary(options: Phase27UatSeedOptions): {
    marker: string;
    mode: SeedMode;
    write: boolean;
    expectedIdentityCounts: DatabaseUatRecordCounts;
    fixtureShape: {
        posts: number;
        categories: number;
        tags: number;
        publicSourceRows: number;
        internalSourceRows: number;
    };
};
export {};
//# sourceMappingURL=seed-blog-phase-2-7-uat.d.ts.map