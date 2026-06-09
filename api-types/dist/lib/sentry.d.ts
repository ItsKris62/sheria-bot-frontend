/**
 * Checks whether an error is client-driven or expected, in which case we do NOT
 * want to report it to Sentry (saves Sentry free tier quota).
 */
export declare function isClientOrExpectedError(error: unknown): boolean;
export declare function sanitizeHeadersForSentry(headers: Record<string, unknown>): Record<string, unknown>;
/**
 * Initialize Sentry for the Fastify/Node backend server.
 * Should be imported and invoked at the absolute top of index.ts (immediately after dotenv/config).
 */
export declare function initSentry(): void;
//# sourceMappingURL=sentry.d.ts.map