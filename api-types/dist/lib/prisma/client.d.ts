import { Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
/**
 * Extended Prisma Client with custom types
 */
declare global {
    var prisma: ExtendedPrismaClient | undefined;
}
/**
 * Models that support soft delete via deletedAt column
 */
declare const SOFT_DELETE_MODELS: readonly ["User", "Policy", "LegalDocument"];
type SoftDeleteModel = (typeof SOFT_DELETE_MODELS)[number];
export declare function isSoftDeleteModel(model?: string): model is SoftDeleteModel;
/**
 * Create base Prisma Client then extend with query middleware.
 *
 * Prisma v7 removed $use()  -  all middleware is now done via $extends().
 * The datasource URL is read from prisma.config.ts / schema.prisma
 * (no more `datasources` constructor property).
 */
declare function createPrismaClient(): import("@prisma/client/runtime/client").DynamicClientExtensionThis<Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
    result: {};
    model: {};
    query: {};
    client: {};
}, {}>, Prisma.TypeMapCb<{
    adapter: PrismaPg;
    log: (Prisma.LogLevel | Prisma.LogDefinition)[];
    errorFormat: "pretty";
}>, {
    result: {};
    model: {};
    query: {};
    client: {};
}>;
/** Type of the extended client */
type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;
/**
 * Singleton Prisma Client
 * Reuses connection in development (hot reload)
 */
export declare const prisma: import("@prisma/client/runtime/client").DynamicClientExtensionThis<Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
    result: {};
    model: {};
    query: {};
    client: {};
}, {}>, Prisma.TypeMapCb<{
    adapter: PrismaPg;
    log: (Prisma.LogLevel | Prisma.LogDefinition)[];
    errorFormat: "pretty";
}>, {
    result: {};
    model: {};
    query: {};
    client: {};
}>;
/**
 * Connect to database with retry logic
 */
export declare function connectDatabase(maxRetries?: number): Promise<void>;
/**
 * Disconnect from database  -  called during graceful shutdown
 */
export declare function disconnectDatabase(): Promise<void>;
/**
 * Check database health
 */
export declare function checkDatabaseHealth(): Promise<boolean>;
/**
 * Get database connection stats.
 * Prisma v7 removed $metrics  -  we use a connectivity check instead.
 */
export declare function getDatabaseStats(): Promise<{
    connected: boolean;
    poolSize: number;
}>;
/**
 * Transaction helper with automatic retry on serialization errors
 */
export declare function transaction<T>(callback: (tx: Omit<ExtendedPrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>) => Promise<T>, maxRetries?: number): Promise<T>;
/**
 * Batch operation helper  -  splits large operations to avoid timeouts
 */
export declare function batchOperation<T, R>(items: T[], batchSize: number, callback: (batch: T[]) => Promise<R[]>): Promise<R[]>;
/**
 * Soft delete helper (manual  -  bypasses middleware)
 */
export declare function softDelete(model: keyof typeof prisma, where: any): Promise<number>;
/**
 * Restore soft deleted records
 */
export declare function restoreSoftDeleted(model: keyof typeof prisma, where: any): Promise<number>;
/**
 * Count records with optional filters
 */
export declare function countRecords(model: keyof typeof prisma, where?: any): Promise<number>;
/**
 * Paginated query helper
 */
export declare function findPaginated<T>(model: keyof typeof prisma, page?: number, limit?: number, where?: any, orderBy?: any, include?: any): Promise<{
    data: T[];
    total: number;
    page: number;
    pages: number;
}>;
export type { ExtendedPrismaClient };
export type TransactionClient = Omit<ExtendedPrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>;
//# sourceMappingURL=client.d.ts.map