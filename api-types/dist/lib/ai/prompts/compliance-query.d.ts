/**
 * Compliance Query Prompt Templates
 * Answers specific regulatory compliance questions with citations
 */
/**
 * Compliance query request parameters
/**
 * Compliance Query Prompt Templates
 * Answers specific regulatory compliance questions with citations
 */
/**
 * Compliance query request parameters
 */
export interface ComplianceQueryParams {
    question: string;
    organizationType?: string;
    industry?: string;
    context?: string;
    urgency?: 'LOW' | 'MEDIUM' | 'HIGH';
    ragContext?: string;
    answerDetail?: 'standard' | 'detailed';
}
/**
 * Generate system prompt for compliance queries
 */
export declare function generateComplianceSystemPrompt(answerDetail?: 'standard' | 'detailed'): string;
/**
 * Generate user prompt for compliance query
 */
export declare function generateComplianceUserPrompt(params: ComplianceQueryParams): string;
/**
 * Generate prompt for follow-up query
 */
export declare function generateFollowUpQueryPrompt(originalQuestion: string, originalAnswer: string, followUpQuestion: string, ragContext?: string): string;
/**
 * Generate prompt for quick compliance check
 */
export declare function generateQuickCheckPrompt(scenario: string): string;
/**
 * Generate prompt for regulatory comparison
 */
export declare function generateRegulatoryComparisonPrompt(requirement1: string, requirement2: string): string;
/**
 * Generate prompt for regulatory update summary
 */
export declare function generateRegulatoryUpdatePrompt(regulatoryArea: string, timeframe: string): string;
/**
 * Generate prompt for industry-specific guidance
 */
export declare function generateIndustryGuidancePrompt(industry: string, topic: string): string;
/**
 * Extract answer sections from AI response.
 *
 * Supports both the new ## heading format (primary) and the legacy
 * **BOLD HEADER** format (fallback) so old stored responses still parse.
 */
export declare function extractAnswerSections(response: string): {
    directAnswer: string;
    legalBasis: string;
    requirements: string;
    guidance: string;
    timeline: string;
    consequences: string;
    relatedConsiderations: string;
    citations: string[];
};
/**
 * Generate prompt for citation validation
 */
export declare function generateCitationValidationPrompt(answer: string, citations: string[]): string;
//# sourceMappingURL=compliance-query.d.ts.map