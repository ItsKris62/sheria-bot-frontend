import type { AIStructuredOutputErrorCode } from './types';
export declare class AIStructuredOutputError extends Error {
    readonly code: AIStructuredOutputErrorCode;
    readonly meta?: Record<string, unknown> | undefined;
    constructor(code: AIStructuredOutputErrorCode, message: string, meta?: Record<string, unknown> | undefined);
}
//# sourceMappingURL=errors.d.ts.map