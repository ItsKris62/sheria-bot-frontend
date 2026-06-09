/**
 * Checklist DOCX Export Service
 *
 * Generates a professional Word document from a normalized ComplianceChecklist
 * with all its ChecklistItem rows. Uses the `docx` npm package (v9).
 *
 * Critical docx rules (same as gap-analysis-export.service.ts):
 *   - WidthType.DXA everywhere (never PERCENTAGE  -  breaks Google Docs)
 *   - ShadingType.CLEAR (never SOLID  -  causes black cell backgrounds)
 *   - No \n inside TextRun  -  use separate Paragraphs
 *   - PageBreak must be inside a Paragraph
 *   - A4 page size (width: 11906, height: 16838 DXA); 1-inch margins
 *   - Content width: 9026 DXA (11906 - 2 * 1440)
 */
export interface ChecklistItemExport {
    id: string;
    itemCode: string | null;
    category: string;
    title: string;
    description: string;
    guidance: string | null;
    regulatoryReference: string;
    actionItems: string[];
    deadline: string | null;
    penalty: string | null;
    priority: string;
    status: string;
    notes: string | null;
    completedAt: Date | null;
}
export interface ChecklistExportParams {
    checklistId: string;
    title: string;
    productType: string | null;
    businessStage: string | null;
    progress: number;
    completedItems: number;
    totalItems: number;
    generatedAt: Date | null;
    createdAt: Date;
    summary: {
        criticalItems?: number;
        highItems?: number;
        estimatedCompletionDays?: number;
    } | null;
    categories: Array<{
        name: string;
        items: ChecklistItemExport[];
        completedCount: number;
        totalCount: number;
    }>;
    organizationName?: string;
    userName?: string;
}
declare class ChecklistExportService {
    /**
     * Generate a DOCX buffer from a normalized compliance checklist.
     */
    generateChecklistDocx(params: ChecklistExportParams): Promise<Buffer>;
    /**
     * Sanitise a string for use as a filename component.
     * Matches the pattern used in gap-analysis-export.service.ts.
     */
    sanitiseFilename(name: string): string;
}
export declare const checklistExportService: ChecklistExportService;
export { ChecklistExportService };
//# sourceMappingURL=checklist-export.service.d.ts.map