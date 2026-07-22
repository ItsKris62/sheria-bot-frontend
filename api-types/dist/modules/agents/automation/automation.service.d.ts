import { type AgentRunService } from '@/modules/agents/agent-run.service';
import type { LLMCompletionRequest, LLMCompletionResult } from '@/lib/ai/gateway/types';
interface GatewayLike {
    complete(req: LLMCompletionRequest): Promise<LLMCompletionResult>;
}
export interface LogAutomationEventInput {
    workflowKey: string;
    event: string;
    payload: Record<string, unknown>;
    executionId: string;
}
export interface GenerateAutomationContentInput {
    workflowKey: string;
    taskType: string;
    systemPrompt: string;
    userPrompt: string;
    maxTokens: number;
}
export interface GenerateAutomationContentResult {
    result: string;
    providerUsed: string;
    modelUsed: string;
}
export interface AutomationServiceDependencies {
    agentRuns?: AgentRunService;
    llmGateway?: GatewayLike;
}
export declare class AutomationService {
    private readonly agentRuns;
    private readonly llmGateway;
    constructor(dependencies?: AutomationServiceDependencies);
    /**
     * Writes exactly one structured log line for n8n automation activity.
     *
     * This does NOT call agentRunService or llmGateway in any form: it is a
     * log write only, not an LLM-invoking capability, so it never goes through
     * AGENTS_ENABLED or the agent budget/iteration guards that gate beginRun().
     */
    logEvent(input: LogAutomationEventInput): {
        received: true;
    };
    generate(input: GenerateAutomationContentInput): Promise<GenerateAutomationContentResult>;
    /**
     * A duplicate beginRun() result means an identical request already exists.
     * This branch never calls llmGateway  -  a completed run replays its stored
     * result; any other status is rejected so a second generation is never
     * triggered for the same idempotency key.
     */
    private resolveDuplicate;
}
export declare const automationService: AutomationService;
export {};
//# sourceMappingURL=automation.service.d.ts.map