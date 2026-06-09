import pino from 'pino';
declare const productionLogger: pino.Logger<never, boolean>;
export { productionLogger };
/**
 * Create a child logger bound to a request context.
 */
export declare function createProductionRequestLogger(requestId: string, userId?: string): pino.Logger;
//# sourceMappingURL=logger.d.ts.map