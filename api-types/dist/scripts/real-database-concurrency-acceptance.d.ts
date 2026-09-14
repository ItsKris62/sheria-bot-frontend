import 'dotenv/config';
export interface AcceptanceTestResult {
    name: string;
    boundary: string;
    result: 'PASSED' | 'FAILED';
    evidence: string;
    mocksUsed: string;
}
//# sourceMappingURL=real-database-concurrency-acceptance.d.ts.map