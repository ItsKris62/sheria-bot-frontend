/**
 * Policy Exporter
 * Handles export of policies to PDF, DOCX, JSON, and Markdown formats
 */
import { type PolicyWithDetails, type ExportFormat, type ExportResult, type ExportOptions } from './policy.types';
/**
 * Policy Exporter Class
 * Handles conversion of policies to various export formats
 */
export declare class PolicyExporter {
    /**
     * Export policy to specified format
     */
    export(policy: PolicyWithDetails, format: ExportFormat, options?: ExportOptions): Promise<ExportResult>;
    /**
     * Export to PDF format
     * Uses HTML -> PDF conversion
     */
    exportToPDF(policy: PolicyWithDetails, options: ExportOptions): Promise<Buffer>;
    /**
     * Export to DOCX format
     * Uses docx library for proper Word document structure
     */
    exportToDOCX(policy: PolicyWithDetails, options: ExportOptions): Promise<Buffer>;
    /**
     * Export to JSON format
     */
    exportToJSON(policy: PolicyWithDetails, options: ExportOptions): Promise<Buffer>;
    /**
     * Export to Markdown format
     */
    exportToMarkdown(policy: PolicyWithDetails, options: ExportOptions): Promise<Buffer>;
    /**
     * Generate shareable link for export
     */
    generateShareLink(policy: PolicyWithDetails, format: ExportFormat, _expiresInHours?: number): Promise<string>;
    /**
     * Generate HTML for PDF conversion
     */
    private generateHTML;
    /**
     * Simple markdown to HTML conversion
     */
    private markdownToHTML;
    /**
     * Generate PDF-compatible content
     * In production, use a proper PDF library like pdfkit
     */
    private generatePDFContent;
    /**
     * Generate DOCX-compatible content
     * In production, use the 'docx' npm package
     */
    private generateDOCXContent;
}
export declare const policyExporter: PolicyExporter;
//# sourceMappingURL=policy-exporter.d.ts.map