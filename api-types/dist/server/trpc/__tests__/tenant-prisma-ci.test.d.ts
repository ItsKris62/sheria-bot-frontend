export interface AstViolation {
    file: string;
    line: number;
    type: 'direct_prisma_import' | 'destructured_prisma' | 'raw_prisma_model_access';
    detail: string;
}
export declare function scanRouterAst(filePath: string, code: string, tenantModels: Set<string>): AstViolation[];
//# sourceMappingURL=tenant-prisma-ci.test.d.ts.map