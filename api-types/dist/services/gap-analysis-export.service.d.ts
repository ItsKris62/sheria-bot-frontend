/**
 * Gap Analysis DOCX Export Service
 *
 * Generates a professional Word document from a validated GapAnalysisResult.
 * Uses the `docx` npm package (v9). All text is passed through TextRun which
 * escapes content natively  -  never use raw HTML or markdown injection.
 *
 * Critical docx rules observed:
 *   - WidthType.DXA everywhere (never PERCENTAGE  -  breaks Google Docs)
 *   - ShadingType.CLEAR (never SOLID  -  causes black cell backgrounds)
 *   - LevelFormat.BULLET for bullet lists (no raw unicode bullets in TextRun)
 *   - No \n inside TextRun  -  use separate Paragraphs
 *   - PageBreak must be inside a Paragraph
 *   - Tables never used in headers/footers  -  use tab stops instead
 *   - A4 page size (width: 11906, height: 16838 DXA); 1-inch margins
 *   - Content width: 9026 DXA (11906 - 2 * 1440)
 */
import type { GapAnalysisResult } from '@/lib/ai/prompts/gap-analysis';
export interface DocxExportParams {
    result: GapAnalysisResult;
    analysisId: string;
    documentName: string;
    regulatoryFrameworks: string[];
    analysisDepth: string;
    ragGrounded: boolean;
    chunksProcessed: number;
    createdAt: Date;
    organizationName?: string;
    userName?: string;
    selectedBenchmarkDocuments?: Array<{
        id: string;
        title: string;
        documentType?: string | null;
        regulatoryBody?: string | null;
    }>;
}
declare class GapAnalysisExportService {
    /**
     * Generate a DOCX report buffer from a validated GapAnalysisResult.
     * The buffer can be uploaded directly to R2 or streamed to the client.
     */
    generateGapAnalysisDocx(params: DocxExportParams): Promise<Buffer>;
    /**
     * Sanitise a string for use in a filename.
     * Replaces spaces and special characters, collapses repeated underscores.
     */
    sanitiseFilename(name: string): string;
}
export declare const gapAnalysisExportService: GapAnalysisExportService;
export { GapAnalysisExportService };
//# sourceMappingURL=gap-analysis-export.service.d.ts.map