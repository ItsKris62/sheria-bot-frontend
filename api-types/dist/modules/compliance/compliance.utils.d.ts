/**
 * Compliance Module Utilities
 * Validation schemas and helper functions for compliance operations
 */
import { z } from 'zod';
import type { ComplianceScore, ComplianceGrade, ComplianceQueryResult, QueryCitation, Requirement, UpcomingDeadline, RegulatoryArea, GapPriority, GapSeverity, RiskLevel } from './compliance.types';
/**
 * Compliance query validation schema
 */
export declare const complianceQuerySchema: z.ZodObject<{
    query: z.ZodString;
    regulatoryAreas: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        CYBERSECURITY: "CYBERSECURITY";
        PAYMENT_SYSTEMS: "PAYMENT_SYSTEMS";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        CBK: "CBK";
        CMA: "CMA";
        IRA: "IRA";
        SASRA: "SASRA";
        DPA: "DPA";
        AML: "AML";
        CFT: "CFT";
        E_MONEY: "E_MONEY";
        CREDIT_REFERENCE: "CREDIT_REFERENCE";
        MICROFINANCE: "MICROFINANCE";
        DIGITAL_LENDING: "DIGITAL_LENDING";
    }>>>;
    context: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    includeRecommendations: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
/**
 * Quick check validation schema
 */
export declare const quickCheckSchema: z.ZodObject<{
    scenario: z.ZodString;
    regulatoryAreas: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        CYBERSECURITY: "CYBERSECURITY";
        PAYMENT_SYSTEMS: "PAYMENT_SYSTEMS";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        CBK: "CBK";
        CMA: "CMA";
        IRA: "IRA";
        SASRA: "SASRA";
        DPA: "DPA";
        AML: "AML";
        CFT: "CFT";
        E_MONEY: "E_MONEY";
        CREDIT_REFERENCE: "CREDIT_REFERENCE";
        MICROFINANCE: "MICROFINANCE";
        DIGITAL_LENDING: "DIGITAL_LENDING";
    }>>>;
}, z.core.$strip>;
/**
 * Query filters validation schema
 */
export declare const queryFiltersSchema: z.ZodObject<{
    regulatoryArea: z.ZodOptional<z.ZodEnum<{
        CYBERSECURITY: "CYBERSECURITY";
        PAYMENT_SYSTEMS: "PAYMENT_SYSTEMS";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        CBK: "CBK";
        CMA: "CMA";
        IRA: "IRA";
        SASRA: "SASRA";
        DPA: "DPA";
        AML: "AML";
        CFT: "CFT";
        E_MONEY: "E_MONEY";
        CREDIT_REFERENCE: "CREDIT_REFERENCE";
        MICROFINANCE: "MICROFINANCE";
        DIGITAL_LENDING: "DIGITAL_LENDING";
    }>>;
    startDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    endDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    searchTerm: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Requirement params validation schema
 */
export declare const requirementParamsSchema: z.ZodObject<{
    area: z.ZodEnum<{
        CYBERSECURITY: "CYBERSECURITY";
        PAYMENT_SYSTEMS: "PAYMENT_SYSTEMS";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        CBK: "CBK";
        CMA: "CMA";
        IRA: "IRA";
        SASRA: "SASRA";
        DPA: "DPA";
        AML: "AML";
        CFT: "CFT";
        E_MONEY: "E_MONEY";
        CREDIT_REFERENCE: "CREDIT_REFERENCE";
        MICROFINANCE: "MICROFINANCE";
        DIGITAL_LENDING: "DIGITAL_LENDING";
    }>;
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        URGENT: "URGENT";
    }>>>;
    dueDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    assignedTo: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Requirement status update schema
 */
export declare const requirementStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        COMPLETED: "COMPLETED";
        UNDER_REVIEW: "UNDER_REVIEW";
        IN_PROGRESS: "IN_PROGRESS";
        NOT_STARTED: "NOT_STARTED";
        OVERDUE: "OVERDUE";
        NOT_APPLICABLE: "NOT_APPLICABLE";
    }>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Requirement filters validation schema
 */
export declare const requirementFiltersSchema: z.ZodObject<{
    area: z.ZodOptional<z.ZodEnum<{
        CYBERSECURITY: "CYBERSECURITY";
        PAYMENT_SYSTEMS: "PAYMENT_SYSTEMS";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        CBK: "CBK";
        CMA: "CMA";
        IRA: "IRA";
        SASRA: "SASRA";
        DPA: "DPA";
        AML: "AML";
        CFT: "CFT";
        E_MONEY: "E_MONEY";
        CREDIT_REFERENCE: "CREDIT_REFERENCE";
        MICROFINANCE: "MICROFINANCE";
        DIGITAL_LENDING: "DIGITAL_LENDING";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        COMPLETED: "COMPLETED";
        UNDER_REVIEW: "UNDER_REVIEW";
        IN_PROGRESS: "IN_PROGRESS";
        NOT_STARTED: "NOT_STARTED";
        OVERDUE: "OVERDUE";
        NOT_APPLICABLE: "NOT_APPLICABLE";
    }>>;
    priority: z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        URGENT: "URGENT";
    }>>;
    assignedTo: z.ZodOptional<z.ZodString>;
    overdue: z.ZodOptional<z.ZodBoolean>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Evidence params validation schema
 */
export declare const evidenceParamsSchema: z.ZodObject<{
    type: z.ZodEnum<{
        OTHER: "OTHER";
        POLICY: "POLICY";
        DOCUMENT: "DOCUMENT";
        CERTIFICATE: "CERTIFICATE";
        AUDIT_REPORT: "AUDIT_REPORT";
        SCREENSHOT: "SCREENSHOT";
        EXTERNAL_LINK: "EXTERNAL_LINK";
    }>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    documentId: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Risk scenario validation schema
 */
export declare const riskScenarioSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    regulatoryAreas: z.ZodArray<z.ZodEnum<{
        CYBERSECURITY: "CYBERSECURITY";
        PAYMENT_SYSTEMS: "PAYMENT_SYSTEMS";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        CBK: "CBK";
        CMA: "CMA";
        IRA: "IRA";
        SASRA: "SASRA";
        DPA: "DPA";
        AML: "AML";
        CFT: "CFT";
        E_MONEY: "E_MONEY";
        CREDIT_REFERENCE: "CREDIT_REFERENCE";
        MICROFINANCE: "MICROFINANCE";
        DIGITAL_LENDING: "DIGITAL_LENDING";
    }>>;
    businessContext: z.ZodOptional<z.ZodString>;
    proposedActions: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
/**
 * Update subscription validation schema
 */
export declare const subscriptionSchema: z.ZodObject<{
    areas: z.ZodArray<z.ZodEnum<{
        CYBERSECURITY: "CYBERSECURITY";
        PAYMENT_SYSTEMS: "PAYMENT_SYSTEMS";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        CBK: "CBK";
        CMA: "CMA";
        IRA: "IRA";
        SASRA: "SASRA";
        DPA: "DPA";
        AML: "AML";
        CFT: "CFT";
        E_MONEY: "E_MONEY";
        CREDIT_REFERENCE: "CREDIT_REFERENCE";
        MICROFINANCE: "MICROFINANCE";
        DIGITAL_LENDING: "DIGITAL_LENDING";
    }>>;
    frequency: z.ZodDefault<z.ZodEnum<{
        DAILY: "DAILY";
        WEEKLY: "WEEKLY";
        IMMEDIATE: "IMMEDIATE";
    }>>;
    emailEnabled: z.ZodDefault<z.ZodBoolean>;
    inAppEnabled: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * Convert database query to ComplianceQueryResult
 */
export declare function toComplianceQueryResult(dbQuery: {
    id: string;
    query: string;
    response: string;
    citations?: any[];
    regulatoryAreas?: string[];
    confidence?: number;
    recommendations?: string[];
    processingTimeMs?: number;
    createdAt: Date;
}): ComplianceQueryResult;
/**
 * Convert to QueryCitation
 */
export declare function toQueryCitation(citation: any): QueryCitation;
/**
 * Convert database requirement to Requirement
 */
export declare function toRequirement(dbReq: {
    id: string;
    organizationId: string;
    regulatoryArea: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: Date | null;
    completedAt: Date | null;
    assignedTo: string | null;
    evidence?: any;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}): Requirement;
/**
 * Parse evidence from JSON
 */
export declare function parseEvidence(evidence: any): any[];
/**
 * Convert to UpcomingDeadline
 */
export declare function toUpcomingDeadline(req: Requirement): UpcomingDeadline;
/**
 * Calculate weighted average score
 */
export declare function calculateWeightedScore(scores: Array<{
    score: number;
    weight: number;
}>): number;
/**
 * Get area weight based on organization type
 */
export declare function getAreaWeight(area: RegulatoryArea, orgType: string): number;
/**
 * Calculate trend from score history
 */
export declare function calculateTrend(scores: Array<{
    date: Date;
    score: number;
}>, _periodDays?: number): {
    direction: 'IMPROVING' | 'STABLE' | 'DECLINING';
    changePercent: number;
};
/**
 * Calculate risk score from likelihood and impact
 */
export declare function calculateRiskScore(likelihood: string, impact: string): number;
/**
 * Get severity from gap priority
 */
export declare function getSeverityFromPriority(priority: GapPriority): GapSeverity;
/**
 * Generate deadline reminder email
 */
export declare function generateDeadlineReminderEmail(userName: string, deadline: UpcomingDeadline): {
    subject: string;
    text: string;
    html: string;
};
/**
 * Generate compliance score alert email
 */
export declare function generateScoreAlertEmail(userName: string, orgName: string, score: ComplianceScore, previousScore: number): {
    subject: string;
    text: string;
    html: string;
};
/**
 * Generate regulatory update notification email
 */
export declare function generateRegulatoryUpdateEmail(userName: string, update: {
    area: RegulatoryArea;
    title: string;
    summary: string;
    effectiveDate: Date;
    impact: string;
    actionRequired: boolean;
}): {
    subject: string;
    text: string;
    html: string;
};
/**
 * Format days remaining with appropriate urgency
 */
export declare function formatDaysRemaining(days: number): string;
/**
 * Get priority color
 */
export declare function getPriorityColor(priority: GapPriority): string;
/**
 * Get risk level color
 */
export declare function getRiskLevelColor(level: RiskLevel): string;
/**
 * Get grade color
 */
export declare function getGradeColor(grade: ComplianceGrade): string;
//# sourceMappingURL=compliance.utils.d.ts.map