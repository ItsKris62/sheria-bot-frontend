/**
 * Policy Module Utilities
 * Helper functions and validation schemas for policy operations
 */
import { z } from 'zod';
import type { Policy, PolicyWithDetails, Citation, PolicyVersion, PolicySection, RegulatoryArea, PolicyStatus, ExportFormat } from './policy.types';
/**
 * Policy generation input validation
 */
export declare const policyGenerationSchema: z.ZodObject<{
    scenario: z.ZodString;
    organizationType: z.ZodString;
    regulatoryAreas: z.ZodArray<z.ZodEnum<{
        OTHER: "OTHER";
        DATA_PROTECTION: "DATA_PROTECTION";
        CYBERSECURITY: "CYBERSECURITY";
        AML_CFT: "AML_CFT";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        INSURANCE: "INSURANCE";
        MICROFINANCE: "MICROFINANCE";
        DIGITAL_LENDING: "DIGITAL_LENDING";
        SACCO: "SACCO";
        CAPITAL_MARKETS: "CAPITAL_MARKETS";
        PAYMENT_SERVICES: "PAYMENT_SERVICES";
        BANKING: "BANKING";
        TAX_COMPLIANCE: "TAX_COMPLIANCE";
        CORPORATE_GOVERNANCE: "CORPORATE_GOVERNANCE";
        EMPLOYMENT: "EMPLOYMENT";
        ENVIRONMENTAL: "ENVIRONMENTAL";
    }>>;
    additionalContext: z.ZodOptional<z.ZodString>;
    includeRecommendations: z.ZodDefault<z.ZodBoolean>;
    detailLevel: z.ZodDefault<z.ZodEnum<{
        brief: "brief";
        standard: "standard";
        comprehensive: "comprehensive";
    }>>;
    targetAudience: z.ZodDefault<z.ZodEnum<{
        executive: "executive";
        technical: "technical";
        legal: "legal";
    }>>;
}, z.core.$strip>;
/**
 * Policy update validation
 */
export declare const policyUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    content: z.ZodOptional<z.ZodString>;
    regulatoryAreas: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        OTHER: "OTHER";
        DATA_PROTECTION: "DATA_PROTECTION";
        CYBERSECURITY: "CYBERSECURITY";
        AML_CFT: "AML_CFT";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        INSURANCE: "INSURANCE";
        MICROFINANCE: "MICROFINANCE";
        DIGITAL_LENDING: "DIGITAL_LENDING";
        SACCO: "SACCO";
        CAPITAL_MARKETS: "CAPITAL_MARKETS";
        PAYMENT_SERVICES: "PAYMENT_SERVICES";
        BANKING: "BANKING";
        TAX_COMPLIANCE: "TAX_COMPLIANCE";
        CORPORATE_GOVERNANCE: "CORPORATE_GOVERNANCE";
        EMPLOYMENT: "EMPLOYMENT";
        ENVIRONMENTAL: "ENVIRONMENTAL";
    }>>>;
}, z.core.$strip>;
/**
 * Policy refinement validation
 */
export declare const policyRefinementSchema: z.ZodObject<{
    instructions: z.ZodString;
    focusAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    preserveSections: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
/**
 * Export options validation
 */
export declare const exportOptionsSchema: z.ZodObject<{
    format: z.ZodEnum<{
        PDF: "PDF";
        DOCX: "DOCX";
        JSON: "JSON";
        MARKDOWN: "MARKDOWN";
    }>;
    includeMetadata: z.ZodDefault<z.ZodBoolean>;
    includeCitations: z.ZodDefault<z.ZodBoolean>;
    includeVersionHistory: z.ZodDefault<z.ZodBoolean>;
    watermark: z.ZodOptional<z.ZodString>;
    headerLogo: z.ZodOptional<z.ZodString>;
    footerText: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Policy filters validation
 */
export declare const policyFiltersSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        GENERATING: "GENERATING";
        COMPLETED: "COMPLETED";
        FAILED: "FAILED";
        ARCHIVED: "ARCHIVED";
        PUBLISHED: "PUBLISHED";
    }>>;
    regulatoryAreas: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        OTHER: "OTHER";
        DATA_PROTECTION: "DATA_PROTECTION";
        CYBERSECURITY: "CYBERSECURITY";
        AML_CFT: "AML_CFT";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        INSURANCE: "INSURANCE";
        MICROFINANCE: "MICROFINANCE";
        DIGITAL_LENDING: "DIGITAL_LENDING";
        SACCO: "SACCO";
        CAPITAL_MARKETS: "CAPITAL_MARKETS";
        PAYMENT_SERVICES: "PAYMENT_SERVICES";
        BANKING: "BANKING";
        TAX_COMPLIANCE: "TAX_COMPLIANCE";
        CORPORATE_GOVERNANCE: "CORPORATE_GOVERNANCE";
        EMPLOYMENT: "EMPLOYMENT";
        ENVIRONMENTAL: "ENVIRONMENTAL";
    }>>>;
    organizationType: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        title: "title";
        createdAt: "createdAt";
        updatedAt: "updatedAt";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
/**
 * Comment validation
 */
export declare const commentSchema: z.ZodObject<{
    content: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Convert database policy to Policy type
 */
export declare function toPolicy(dbPolicy: any): Policy;
/**
 * Convert database policy with relations to PolicyWithDetails
 */
export declare function toPolicyWithDetails(dbPolicy: any): PolicyWithDetails;
/**
 * Convert database citation to Citation type
 */
export declare function toCitation(dbCitation: any): Citation;
/**
 * Convert database version to PolicyVersion type
 */
export declare function toVersion(dbVersion: any): PolicyVersion;
/**
 * Extract sections from markdown content
 */
export declare function extractSections(content: string): PolicySection[];
/**
 * Count words in content
 */
export declare function countWords(content: string): number;
/**
 * Estimate reading time in minutes
 */
export declare function estimateReadingTime(content: string): number;
/**
 * Generate policy title from scenario
 */
export declare function generateTitle(scenario: string, organizationType: string): string;
/**
 * Truncate text with ellipsis
 */
export declare function truncate(text: string, maxLength: number): string;
/**
 * Extract citations from AI-generated content
 * Looks for patterns like [Source: ...] or (Source: ...)
 */
export declare function extractCitationsFromContent(content: string): Array<{
    source: string;
    title: string;
    section: string | null;
    content: string;
}>;
/**
 * Format citation for display
 */
export declare function formatCitation(citation: Citation): string;
/**
 * Check if policy can be edited
 */
export declare function canEditPolicy(status: PolicyStatus): boolean;
/**
 * Check if policy can be published
 */
export declare function canPublishPolicy(status: PolicyStatus): boolean;
/**
 * Check if policy can be deleted
 */
export declare function canDeletePolicy(status: PolicyStatus): boolean;
/**
 * Get status display info
 */
export declare function getStatusInfo(status: PolicyStatus): {
    label: string;
    color: string;
    description: string;
};
/**
 * Get display name for regulatory area
 */
export declare function getRegulatoryAreaName(area: RegulatoryArea): string;
/**
 * Get regulatory authority for area
 */
export declare function getRegulatoryAuthority(area: RegulatoryArea): string;
/**
 * Generate policy ready notification email
 */
export declare function generatePolicyReadyEmail(userName: string, policyTitle: string, policyUrl: string): {
    subject: string;
    text: string;
    html: string;
};
/**
 * Generate policy failed notification email
 */
export declare function generatePolicyFailedEmail(userName: string, policyTitle: string, errorMessage: string, retryUrl: string): {
    subject: string;
    text: string;
    html: string;
};
/**
 * Generate export filename
 */
export declare function generateExportFilename(policyTitle: string, format: ExportFormat): string;
/**
 * Get MIME type for export format
 */
export declare function getExportMimeType(format: ExportFormat): string;
//# sourceMappingURL=policy.utils.d.ts.map