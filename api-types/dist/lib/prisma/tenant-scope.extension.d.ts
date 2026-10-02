/**
 * Enumeration of all models in schema.prisma that have a tenant-isolation field
 * (orgId or organizationId). Total: 39 models.
 */
export declare const TENANT_MODEL_FIELD_MAP: Record<string, 'orgId' | 'organizationId'>;
export interface TenantScopedPrismaOptions {
    bypassRls?: boolean;
}
/**
 * Executes a callback within a Prisma interactive transaction where
 * app.current_org_id is configured with SET LOCAL (is_local = true)
 * to enforce native PostgreSQL Row-Level Security without connection pool leakage.
 */
export declare function withTenantRlsTransaction<T>(prisma: any, orgId: string, callback: (tx: any) => Promise<T>): Promise<T>;
/**
 * Executes a callback within a Prisma interactive transaction where
 * app.bypass_rls = 'true' is configured with SET LOCAL (is_local = true)
 * for privileged background workers, migrations, and cron tasks.
 */
export declare function withBypassRlsTransaction<T>(prisma: any, callback: (tx: any) => Promise<T>): Promise<T>;
export type TenantScopedPrismaClient = ReturnType<typeof createTenantScopedPrisma>;
/**
 * Creates a tenant-scoped Prisma client extension.
 * Opt-in per-request wrapper that enforces tenant isolation by injecting orgId
 * into all read, write, update, and delete queries for tenant-scoped models.
 */
export declare function createTenantScopedPrisma(basePrisma?: any, orgId?: string | null, options?: TenantScopedPrismaOptions): any;
//# sourceMappingURL=tenant-scope.extension.d.ts.map