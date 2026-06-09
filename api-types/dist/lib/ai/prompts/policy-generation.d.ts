/**
 * Policy Generation Prompt Templates
 * Generates comprehensive policy frameworks based on Kenyan regulations
 */
/**
 * Policy generation request parameters
 */
export interface PolicyGenerationParams {
    scenario: string;
    organizationType: 'FINTECH' | 'BANK' | 'TELECOM' | 'INSURANCE' | 'OTHER';
    regulatoryAreas: string[];
    specificRequirements?: string;
    targetAudience?: string;
    existingPolicies?: string;
}
/**
 * Generate system prompt for policy generation
 */
export declare function generatePolicySystemPrompt(): string;
/**
 * Generate user prompt for policy generation
 */
export declare function generatePolicyUserPrompt(params: PolicyGenerationParams): string;
/**
 * Generate prompt for policy refinement
 */
export declare function generatePolicyRefinementPrompt(originalPolicy: string, refinementInstructions: string): string;
/**
 * Generate prompt for citation verification
 */
export declare function generateCitationVerificationPrompt(citations: string[]): string;
/**
 * Extract policy sections from AI response
 */
export declare function extractPolicySections(response: string): {
    executiveSummary: string;
    regulatoryLandscape: string;
    recommendations: string;
    complianceChecklist: string;
    riskAssessment: string;
    implementationRoadmap: string;
    citations: string[];
};
/**
 * Generate follow-up questions prompt
 */
export declare function generateFollowUpQuestionsPrompt(policyContent: string): string;
//# sourceMappingURL=policy-generation.d.ts.map