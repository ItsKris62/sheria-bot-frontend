/**
 * Destructive Test Database Safety Guard
 *
 * Ensures that destructive integration tests (purging users, scrubbing queries,
 * deleting vault documents) NEVER run against production databases, production
 * connection strings, or cloud replicas.
 */
export declare function isSafeTestDatabaseUrl(databaseUrl?: string): {
    safe: boolean;
    reason?: string;
};
export declare function assertSafeTestDatabase(databaseUrl?: string): void;
//# sourceMappingURL=destructive-test-safety.d.ts.map