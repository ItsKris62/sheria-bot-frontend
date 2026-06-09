/**
 * Compliance Query DOCX Export Service
 *
 * Generates a professional Word document containing a compliance query
 * question and its AI-generated response. Mirrors the pattern established
 * in checklist-export.service.ts and gap-analysis-export.service.ts.
 *
 * Critical docx rules (same as sibling services):
 *   - WidthType.DXA everywhere (never PERCENTAGE - breaks Google Docs)
 *   - ShadingType.CLEAR (never SOLID - causes black cell backgrounds)
 *   - No \n inside TextRun - use separate Paragraphs
 *   - PageBreak must be inside a Paragraph
 *   - A4 page size (width: 11906, height: 16838 DXA); 1-inch margins
 *   - Content width: 9026 DXA (11906 - 2 * 1440)
 */
export interface ComplianceQueryExportParams {
    queryId: string;
    question: string;
    response: string;
    createdAt: Date;
    organizationName?: string;
    userName?: string;
    citations?: unknown[];
}
declare class ComplianceQueryExportService {
    /**
     * Generate a DOCX buffer for a compliance query Q&A.
     */
    generateComplianceQueryDocx(params: ComplianceQueryExportParams): Promise<Buffer>;
    /**
     * Sanitise a string for use as a filename component.
     * Matches the pattern used in checklist-export.service.ts.
     */
    sanitiseFilename(name: string): string;
}
export declare const complianceQueryExportService: ComplianceQueryExportService;
export { ComplianceQueryExportService };
//# sourceMappingURL=complianceQueryExport.service.d.ts.map