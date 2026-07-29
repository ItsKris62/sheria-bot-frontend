export type VerifierMode = 'pre' | 'post';
export type VerificationStatus = 'PRESENT' | 'MISSING_EXPECTED' | 'MISSING_UNEXPECTED' | 'CONFLICT' | 'WARN';
export type ObjectCategory = 'TABLE' | 'COLUMN' | 'ENUM' | 'ENUM_VALUE' | 'INDEX' | 'FOREIGN_KEY';
export interface ExpectedColumn {
    name: string;
    dataType: string;
    isNullable: boolean;
    isPrimaryKey?: boolean;
}
export interface ExpectedTable {
    tableName: string;
    isPrerequisite?: boolean;
    columns: ExpectedColumn[];
}
export interface ExpectedEnum {
    enumName: string;
    isPrerequisite?: boolean;
    requiredValues: string[];
}
export interface ExpectedIndex {
    name: string;
    tableName: string;
    columns: string[];
    isUnique: boolean;
    isPrimaryKey?: boolean;
}
export interface ExpectedForeignKey {
    name: string;
    sourceTable: string;
    sourceColumns: string[];
    targetTable: string;
    targetColumns: string[];
    onDelete: string;
    onUpdate: string;
}
export interface VerificationItemResult {
    category: ObjectCategory;
    objectName: string;
    status: VerificationStatus;
    reason: string;
    requiredPostMigration: boolean;
}
export interface EnvironmentIdentity {
    appEnv?: string;
    databaseEnv?: string;
    databaseUrl?: string;
}
export interface EnvironmentSafetyResult {
    safe: boolean;
    environmentName: string;
    redactedUrl: string;
    reason?: string;
}
export interface SchemaVerificationResult {
    mode: VerifierMode;
    success: boolean;
    gateStatus: 'PASSED' | 'FAILED' | 'BLOCKED_ENVIRONMENT_SAFETY';
    environment: {
        appEnv: string;
        databaseEnv: string;
        redactedUrl: string;
    };
    summaryCounts: {
        totalChecked: number;
        present: number;
        missingExpected: number;
        missingUnexpected: number;
        conflict: number;
        warn: number;
    };
    results: VerificationItemResult[];
}
export interface QueryRunner {
    queryRaw<T = unknown>(query: string, ...params: unknown[]): Promise<T[]>;
}
export interface InformationSchemaTableRaw {
    table_name: string;
}
export interface InformationSchemaColumnRaw {
    table_name: string;
    column_name: string;
    data_type: string;
    is_nullable: string;
}
export interface PgEnumRaw {
    enum_name: string;
    enum_value: string;
}
export interface PgIndexRaw {
    indexname: string;
    tablename: string;
    indexdef: string;
}
export interface PgConstraintRaw {
    constraint_name: string;
    source_table: string;
    source_column: string;
    target_table: string;
    target_column: string;
    on_delete: string;
    on_update: string;
}
/**
 * Utility to safely redact database connection string secrets (passwords, credentials).
 */
export declare function redactDatabaseUrl(url?: string): string;
/**
 * Validates environment configuration and prevents execution against production or ambiguous targets.
 */
export declare function validateEnvironmentSafety(identity: EnvironmentIdentity): EnvironmentSafetyResult;
/**
 * Phase 0 Inventory Specification (All 27 Tables, Enums, Indexes, FKs)
 */
export declare const COMPLETE_PHASE0_INVENTORY: {
    tables: ExpectedTable[];
    enums: ExpectedEnum[];
    indexes: ExpectedIndex[];
    foreignKeys: ExpectedForeignKey[];
};
/**
 * SheriaBot Pack 1 — Editorial Intelligence Inventory
 * Governing spec: docs/editorial-intelligence/phase-b-*.md (Phase B.1 approved).
 * Additive to COMPLETE_PHASE0_INVENTORY above — see ALL_EXPECTED_SCHEMA_INVENTORY,
 * which is what verifyCompleteSchema actually checks against.
 *
 * NOTE: "ContentOpsAlert_dedupe_key" (a raw SQL COALESCE expression unique index —
 * see prisma/migrations/20260727020000_content_ops_alert/migration.sql) is
 * intentionally NOT listed in `indexes` below. This engine's index-column parser
 * (a naive first-paren-group regex) cannot correctly parse an expression index
 * containing its own nested parentheses — attempting to check it here would
 * produce false CONFLICT results, not a genuine gap. That index must be verified
 * manually (e.g. `\d "ContentOpsAlert"` in psql) until a dedicated
 * expression-index-aware check is added. See docs/editorial-intelligence/
 * phase-c-schema-verification.md.
 */
export declare const PACK1_EDITORIAL_INTELLIGENCE_INVENTORY: {
    tables: ExpectedTable[];
    enums: ExpectedEnum[];
    indexes: ExpectedIndex[];
    foreignKeys: ExpectedForeignKey[];
};
/**
 * Union of the Phase 0 baseline and Pack 1's additions — this is what
 * verifyCompleteSchema actually iterates. Kept as a separate merged constant
 * (rather than mutating COMPLETE_PHASE0_INVENTORY in place) so the Phase 0
 * baseline stays independently readable/importable.
 */
export declare const ALL_EXPECTED_SCHEMA_INVENTORY: {
    tables: ExpectedTable[];
    enums: ExpectedEnum[];
    indexes: ExpectedIndex[];
    foreignKeys: ExpectedForeignKey[];
};
/**
 * Main verification engine for Content, Blog, Agent & Marketing Schema.
 */
export declare function verifyCompleteSchema(mode: VerifierMode, identity: EnvironmentIdentity, queryRunner?: QueryRunner): Promise<SchemaVerificationResult>;
//# sourceMappingURL=schema-verifier.d.ts.map