import { Prisma } from '@prisma/client';
export type EnqueueAiJobInput = {
    type: string;
    idempotencyKey: string;
    targetEntityType: string;
    targetEntityId: string;
    userId?: string;
    organizationId?: string;
    payload: Prisma.InputJsonValue;
    maxAttempts?: number;
    priority?: number;
    runAfter?: Date;
};
declare class AiJobRunner {
    private timer;
    private running;
    private stopped;
    enqueue(input: EnqueueAiJobInput): Promise<{
        id: string;
        status: string;
        progress: number;
        attempts: number;
    }>;
    start(): void;
    stop(): Promise<void>;
    private schedule;
    private tick;
    private claimNextJob;
    private execute;
    private updateProgress;
    private recordEvent;
    private requeueStaleLocks;
}
export declare const aiJobRunner: AiJobRunner;
/**
 * Scrubs raw document bytes and base64 from an AiJob payload once it reaches a terminal state.
 */
export declare function scrubAiJobPayload(jobId: string): Promise<void>;
/**
 * Scrubs all AiJob payloads associated with a specific entity (e.g. upon GapAnalysis deletion).
 */
export declare function scrubAiJobPayloadForEntity(entityType: string, entityId: string): Promise<void>;
export {};
//# sourceMappingURL=ai-job-runner.d.ts.map