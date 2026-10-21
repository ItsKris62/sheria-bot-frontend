export declare const AUDIT_LOG_MAX_LIMIT = 200;
export declare const AUDIT_LOG_DEFAULT_LIMIT = 50;
export declare const AUDIT_LOG_ORDER_BY: readonly [{
    readonly createdAt: "desc";
}, {
    readonly id: "desc";
}];
export interface AuditLogPage {
    page: number;
    limit: number;
    skip: number;
    totalPages: number;
}
export declare function resolveAuditLogPage(requestedPage: number | undefined, requestedLimit: number | undefined, total: number): AuditLogPage;
//# sourceMappingURL=audit-log-pagination.d.ts.map