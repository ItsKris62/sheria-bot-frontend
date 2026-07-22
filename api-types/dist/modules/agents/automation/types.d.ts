import type { Prisma } from '@prisma/client';
import type { LLMCompletionRequest } from '@/lib/ai/gateway/types';
export declare const AUTOMATION_AGENT_TYPE: "automation";
type AutomationUseCase = NonNullable<LLMCompletionRequest['useCase']>;
export declare const TASK_TYPE_USE_CASE_MAP: Readonly<Record<string, AutomationUseCase>>;
export declare const DEFAULT_USE_CASE: AutomationUseCase;
export declare function mapTaskTypeToUseCase(taskType: string): AutomationUseCase;
export declare function toJsonValue(value: unknown): Prisma.InputJsonValue;
export {};
//# sourceMappingURL=types.d.ts.map