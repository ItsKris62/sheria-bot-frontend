import { type LLMCompletionRequest, type LLMCompletionResult } from '../gateway/types';
import type { CompleteStructuredInput, StructuredCompletionResult } from './types';
export type { AIUseCase, StructuredCompletionResult, CompleteStructuredInput } from './types';
export { AIStructuredOutputError } from './errors';
export interface StructuredCompletionGateway {
    complete(req: LLMCompletionRequest, cacheTTL?: number): Promise<LLMCompletionResult>;
}
export interface CompleteStructuredDependencies {
    llmGateway?: StructuredCompletionGateway;
}
/**
 * Schema-validated structured completion, layered strictly on top of the
 * existing LLMGateway — never bypasses its cost tracking, budget checks,
 * retry/timeout, or fallback logic. See
 * docs/editorial-intelligence/phase-b-structured-ai-design.md for the full
 * design rationale.
 */
export declare function completeStructured<T>(input: CompleteStructuredInput<T>, deps?: CompleteStructuredDependencies): Promise<StructuredCompletionResult<T>>;
//# sourceMappingURL=completeStructured.d.ts.map