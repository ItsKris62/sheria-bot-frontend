export type AppRuntimeMode = 'standard' | 'preview';
export type DatabaseEnvironment = 'unknown' | 'preview' | 'development-uat' | 'production';
export type SafeDatabaseClassification = 'Unknown' | 'Preview' | 'Development-UAT' | 'Production';
export interface PreviewDatabaseGuardInput {
    runtimeMode: AppRuntimeMode;
    databaseEnvironment: DatabaseEnvironment;
}
export interface DatabaseUatRecordCounts {
    blogPosts: number;
    publishedBlogPosts: number;
    draftBlogPosts: number;
    archivedBlogPosts: number;
    futureDatedPublishedBlogPosts: number;
    softDeletedBlogPosts: number;
    feedbackRows: number;
    topicRequestRows: number;
}
export interface SafeDatabaseIdentityReport {
    applicationEnvironment: string;
    runtimeMode: AppRuntimeMode;
    databaseClassification: SafeDatabaseClassification;
    databaseName: string | null;
    migrationCount: number | null;
    uatRecordMarker: string;
    uatRecordCounts: DatabaseUatRecordCounts | null;
    previewIsolationMetadataPresent: boolean;
}
export interface DatabaseIdentityQueryRunner {
    getDatabaseName(): Promise<string>;
    getMigrationCount(): Promise<number>;
    getUatRecordCounts(marker: string): Promise<DatabaseUatRecordCounts>;
}
export declare const DEFAULT_UAT_RECORD_MARKER = "phase-2-7-uat";
export declare function classifyDatabaseEnvironment(databaseEnvironment: DatabaseEnvironment): SafeDatabaseClassification;
export declare function isPreviewDatabaseClassificationAllowed(databaseEnvironment: DatabaseEnvironment): boolean;
export declare function assertPreviewDatabaseIsolation(input: PreviewDatabaseGuardInput): void;
export declare function createUnqueriedDatabaseIdentityReport(args: {
    applicationEnvironment: string;
    runtimeMode: AppRuntimeMode;
    databaseEnvironment: DatabaseEnvironment;
    marker?: string;
}): SafeDatabaseIdentityReport;
export declare function collectSafeDatabaseIdentityReport(args: {
    applicationEnvironment: string;
    runtimeMode: AppRuntimeMode;
    databaseEnvironment: DatabaseEnvironment;
    queryRunner: DatabaseIdentityQueryRunner;
    marker?: string;
}): Promise<SafeDatabaseIdentityReport>;
//# sourceMappingURL=database-identity.d.ts.map