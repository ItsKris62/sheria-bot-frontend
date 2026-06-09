import pino from 'pino';
/**
 * Main logger instance
 */
export declare const logger: pino.Logger<never, boolean>;
/**
 * Create child logger with request context
 * @param requestId Unique request ID
 * @param userId Optional user ID
 * @returns Child logger instance
 */
export declare function createRequestLogger(requestId: string, userId?: string): pino.Logger<never, boolean>;
/**
 * Log performance timing
 * @param label Operation label
 * @param startTime Start time in milliseconds
 * @param metadata Additional metadata
 */
export declare function logPerformance(label: string, startTime: number, metadata?: Record<string, unknown>): void;
/**
 * Log API call (external service)
 * @param service Service name
 * @param method HTTP method or operation
 * @param duration Duration in milliseconds
 * @param success Whether call was successful
 * @param metadata Additional metadata
 */
export declare function logApiCall(service: string, method: string, duration: number, success: boolean, metadata?: Record<string, unknown>): void;
/**
 * Log database query (slow queries only in production)
 * @param operation Database operation
 * @param model Prisma model
 * @param duration Duration in milliseconds
 * @param metadata Additional metadata
 */
export declare function logDatabaseQuery(operation: string, model: string, duration: number, metadata?: Record<string, unknown>): void;
/**
 * Log authentication event
 * @param event Event type (login, logout, etc.)
 * @param userId User ID
 * @param success Whether auth was successful
 * @param metadata Additional metadata
 */
export declare function logAuth(event: string, userId?: string, success?: boolean, metadata?: Record<string, unknown>): void;
/**
 * Log business event (policy generated, document uploaded, etc.)
 * @param event Event type
 * @param userId User ID
 * @param metadata Additional metadata
 */
export declare function logBusinessEvent(event: string, userId: string, metadata?: Record<string, unknown>): void;
/**
 * Log error with context
 * @param error Error object or message
 * @param context Error context
 * @param userId Optional user ID
 */
export declare function logError(error: Error | string, context?: Record<string, unknown>, userId?: string): void;
/**
 * Log security event (suspicious activity, rate limit, etc.)
 * @param event Event type
 * @param severity Severity level
 * @param metadata Additional metadata
 */
export declare function logSecurity(event: string, severity: 'low' | 'medium' | 'high' | 'critical', metadata?: Record<string, unknown>): void;
/**
 * Performance timer utility
 * @param label Operation label
 * @returns Stop function to end timer
 *
 * @example
 * const stop = performanceTimer('policy-generation');
 * // ... do work ...
 * stop({ policyId: '123' }); // Logs performance
 */
export declare function performanceTimer(label: string): (metadata?: Record<string, unknown>) => void;
/**
 * Log startup information
 */
export declare function logStartup(): void;
/**
 * Log shutdown information
 */
export declare function logShutdown(signal: string): void;
/**
 * Export logger types
 */
export type Logger = typeof logger;
export type RequestLogger = ReturnType<typeof createRequestLogger>;
//# sourceMappingURL=logger.d.ts.map