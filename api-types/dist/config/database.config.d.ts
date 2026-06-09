/**
 * Database configuration for Prisma
 * Optimized for Railway PostgreSQL deployment
 */
export declare const databaseConfig: {
    /**
     * Database connection URL
     */
    readonly url: string;
    /**
     * Connection pool settings for Railway
     * Railway free tier has connection limits, so we optimize pool size
     */
    readonly pool: {
        readonly connectionLimit: 5;
        readonly poolTimeout: 20;
        readonly idleTimeout: 30;
        readonly connectionTimeout: 10;
    };
    /**
     * Query logging configuration
     * Enable detailed logging in development for debugging
     */
    readonly logging: {
        readonly queries: boolean;
        readonly slowQueries: boolean;
        readonly slowQueryThreshold: 1000;
        readonly errors: true;
    };
    /**
     * Retry logic for connection failures
     * Useful for handling temporary network issues
     */
    readonly retry: {
        readonly maxRetries: 3;
        readonly initialDelay: 1000;
        readonly maxDelay: 5000;
        readonly backoffMultiplier: 2;
    };
    /**
     * Migration settings
     */
    readonly migrations: {
        readonly autoApply: boolean;
        readonly tableName: "_prisma_migrations";
    };
    /**
     * Performance optimizations
     */
    readonly performance: {
        readonly pooling: true;
        readonly batching: false;
        readonly statementCaching: true;
    };
};
/**
 * Generate Prisma datasource URL with connection pool parameters
 * Adds connection pool settings as query parameters
 */
export declare function getDatasourceUrl(): string;
/**
 * Get retry delay with exponential backoff
 * @param attemptNumber Current attempt number (1-indexed)
 * @returns Delay in milliseconds
 */
export declare function getRetryDelay(attemptNumber: number): number;
/**
 * Database health check query
 * Simple query to verify database connectivity
 */
export declare const healthCheckQuery = "SELECT 1 as health";
/**
 * Export type
 */
export type DatabaseConfig = typeof databaseConfig;
//# sourceMappingURL=database.config.d.ts.map