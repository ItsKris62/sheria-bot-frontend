/**
 * Policy Generator
 * Orchestrates AI-powered policy generation with progress tracking
 */
import { type PolicyGenerationParams, type AIGenerationResult, type GenerationProgress } from './policy.types';
/**
 * Policy Generator Class
 * Handles the multi-step AI policy generation process
 */
export declare class PolicyGenerator {
    /**
     * Generate a complete policy
     * This is an async operation that publishes progress events
     */
    generate(params: PolicyGenerationParams, policyId: string, userId: string): Promise<AIGenerationResult>;
    /**
     * Refine an existing policy with new instructions
     */
    refine(existingContent: string, instructions: string, focusAreas?: string[]): Promise<{
        content: string;
        tokensUsed: number;
    }>;
    /**
     * Stream policy generation with real-time updates
     */
    streamGenerate(params: PolicyGenerationParams, policyId: string, onProgress: (progress: GenerationProgress) => void): Promise<AIGenerationResult>;
    /**
     * Search for relevant regulations using RAG
     */
    private searchRegulations;
    /**
     * Analyze context and requirements
     */
    private analyzeContext;
    /**
     * Generate policy outline
     */
    private generateOutline;
    /**
     * Generate full policy content
     */
    private generateContent;
    /**
     * Extract citations from generated content
     */
    private extractCitations;
    /**
     * Calculate confidence score for a citation
     */
    private calculateCitationConfidence;
    /**
     * Find additional citations using AI
     */
    private findAdditionalCitations;
    /**
     * Verify citations against regulatory database
     */
    private verifyCitations;
    /**
     * Finalize the policy generation result
     */
    private finalize;
    /**
     * Build refinement prompt
     */
    private buildRefinementPrompt;
    /**
     * Publish progress update
     */
    private publishProgress;
}
export declare const policyGenerator: PolicyGenerator;
//# sourceMappingURL=policy-generator.d.ts.map