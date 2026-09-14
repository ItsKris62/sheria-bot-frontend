/**
 * Versioned Production AI Prompt Definitions for Kenya Lead Discovery (P1)
 *
 * All prompts strictly enforce:
 * - Zero hallucination of licence numbers, emails, contacts, or employee figures.
 * - Strict JSON structured output only.
 * - Untrusted web content isolation (<untrusted_source_content>).
 */
export interface VersionedPrompt {
    version: string;
    taskType: string;
    systemPrompt: string;
    userPromptTemplate: (context: Record<string, string>) => string;
}
export declare const LEAD_SOURCE_EXTRACT_KE_V1: VersionedPrompt;
export declare const LEAD_COMPANY_RESEARCH_KE_V1: VersionedPrompt;
export declare const LEAD_PRODUCT_FIT_KE_V1: VersionedPrompt;
export declare const LEAD_EVIDENCE_VERIFY_KE_V1: VersionedPrompt;
export declare const PROMPT_REGISTRY: {
    readonly lead_source_extract_ke_v1: VersionedPrompt;
    readonly lead_company_research_ke_v1: VersionedPrompt;
    readonly lead_product_fit_ke_v1: VersionedPrompt;
    readonly lead_evidence_verify_ke_v1: VersionedPrompt;
};
//# sourceMappingURL=lead-discovery-prompts.d.ts.map