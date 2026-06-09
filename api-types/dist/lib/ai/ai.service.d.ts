import { AICompletionResult } from './client';
import { PolicyGenerationParams } from './prompts/policy-generation';
import { ComplianceQueryParams } from './prompts/compliance-query';
import { ChecklistGenerationParams, GeneratedChecklist } from './prompts/checklist-generation';
import { GapAnalysisParams, GapAnalysisResult, PolicyChunk } from './prompts/gap-analysis';
/**
 * Policy generation result
 */
export interface PolicyGenerationResult extends AICompletionResult {
    sections: {
        executiveSummary: string;
        regulatoryLandscape: string;
        recommendations: string;
        complianceChecklist: string;
        riskAssessment: string;
        implementationRoadmap: string;
        citations: string[];
    };
    followUpQuestions?: string[];
}
/**
 * Compliance query result
 */
export interface ComplianceQueryResult extends AICompletionResult {
    sections: {
        directAnswer: string;
        legalBasis: string;
        requirements: string;
        guidance: string;
        timeline: string;
        consequences: string;
        relatedConsiderations: string;
        citations: string[];
    };
}
/**
 * Progress update emitted by executeChecklistStream() and published via
 * the in-process EventEmitter to any connected SSE client.
 */
export interface ChecklistProgressUpdate {
    type: 'started' | 'progress' | 'parsing' | 'complete' | 'error';
    message: string;
    /** How many JSON category objects have been detected so far in the stream */
    categoriesDetected?: number;
    /** Final item count (only present on 'complete') */
    itemCount?: number;
}
/**
 * AI Service
 * High-level service for policy generation and compliance queries
 */
export declare class AIService {
    /**
     * Generate policy framework
     * @param params Policy generation parameters
     * @param policyId Optional policy ID for progress tracking
     */
    generatePolicy(params: PolicyGenerationParams, policyId?: string): Promise<PolicyGenerationResult>;
    /**
     * Stream policy generation with real-time updates
     * @param params Policy generation parameters
     * @param policyId Policy ID for progress tracking
     * @param onChunk Callback for each chunk
     */
    streamPolicy(params: PolicyGenerationParams, policyId: string, onChunk: (chunk: string) => void): Promise<PolicyGenerationResult>;
    /**
     * Refine existing policy
     * @param originalPolicy Original policy content
     * @param refinementInstructions Instructions for refinement
     */
    refinePolicy(originalPolicy: string, refinementInstructions: string): Promise<PolicyGenerationResult>;
    /**
     * Verify citations in policy
     * @param citations Array of citations to verify
     */
    verifyCitations(citations: string[]): Promise<AICompletionResult>;
    /**
     * Answer compliance query
     * @param params Compliance query parameters
     */
    answerComplianceQuery(params: ComplianceQueryParams): Promise<ComplianceQueryResult>;
    /**
     * Answer follow-up compliance query
     * @param originalQuestion Original question
     * @param originalAnswer Original answer
     * @param followUpQuestion Follow-up question
     */
    answerFollowUpQuery(originalQuestion: string, originalAnswer: string, followUpQuestion: string, ragContext?: string): Promise<ComplianceQueryResult>;
    /**
     * Perform quick compliance check
     * @param scenario Scenario to check
     */
    quickComplianceCheck(scenario: string): Promise<AICompletionResult>;
    /**
     * Compare two regulatory requirements
     * @param requirement1 First requirement
     * @param requirement2 Second requirement
     */
    compareRequirements(requirement1: string, requirement2: string): Promise<AICompletionResult>;
    /**
     * Validate citations in compliance answer
     * @param answer Compliance answer
     * @param citations Citations to validate
     */
    validateAnswerCitations(answer: string, citations: string[]): Promise<AICompletionResult>;
    /**
     * Generate a RAG-grounded compliance checklist for a Kenyan fintech.
     * Used by the legacy complianceModule.generateChecklist() path (non-streaming).
     * The new async path (checklistService) uses executeChecklistStream() instead.
     */
    generateComplianceChecklist(params: ChecklistGenerationParams): Promise<{
        checklist: GeneratedChecklist;
        inputTokens: number;
        outputTokens: number;
    }>;
    /**
     * Perform AI-powered gap analysis comparing a policy document
     * against Kenyan regulatory requirements.
     * @param params Gap analysis parameters including policy text and frameworks
     */
    performGapAnalysis(params: GapAnalysisParams): Promise<{
        result: GapAnalysisResult;
        inputTokens: number;
        outputTokens: number;
    }>;
    /**
     * Perform multi-chunk gap analysis for large policy documents.
     *
     * Phase 1 (sequential): each chunk is analysed independently using a
     * condensed prompt that returns a flat JSON array of raw gap objects.
     * Phase 2 (merge): all raw gaps are consolidated into a full
     * GapAnalysisResult by a single merge call.
     *
     * Chunks must arrive pre-sanitised (sanitizePolicyText applied by the
     * caller before chunking).
     */
    performMultiChunkGapAnalysis(params: {
        chunks: PolicyChunk[];
        documentName: string;
        documentType: string;
        regulatoryFrameworks: string[];
        analysisDepth: 'quick' | 'standard' | 'deep';
        focusAreas?: string[];
        ragContext?: string;
    }): Promise<{
        result: GapAnalysisResult;
        chunksProcessed: number;
        totalInputTokens: number;
        totalOutputTokens: number;
        totalCost: number;
    }>;
    /**
     * Lean stream executor for the three-tier checklist generation pipeline.
     *
     * Accepts pre-built prompts + tier-specific configuration.
     * Streams the AI response and emits progress callbacks.
     * Returns raw content + token counts  -  parsing and validation are the
     * caller's (checklist.service.ts runTier) responsibility.
     *
     * Does NOT retry on failure  -  the tier system in checklist.service.ts
     * provides recovery by escalating to the next tier when this throws.
     *
     * Progress milestones:
     *   started   -  request sent to Anthropic
     *   progress  -  each new JSON category detected in the stream
     *   parsing   -  full response received, ready to validate
     */
    executeChecklistStream(params: {
        systemPrompt: string;
        userPrompt: string;
        maxTokens: number;
        overrideTimeoutMs: number;
        temperature?: number;
    }, onProgress: (update: ChecklistProgressUpdate) => void): Promise<{
        content: string;
        inputTokens: number;
        outputTokens: number;
        stopReason?: string | null;
    }>;
}
/**
 * Export singleton AI service instance
 */
export declare const aiService: AIService;
//# sourceMappingURL=ai.service.d.ts.map