import { FastifyInstance, FastifyServerOptions } from 'fastify';
type TrustProxyValue = NonNullable<FastifyServerOptions['trustProxy']>;
export declare function parseTrustProxy(rawValue: string | undefined): TrustProxyValue;
/**
 * Build and configure the Fastify application.
 *
 * Returns a fully-initialised FastifyInstance with all plugins registered.
 * Using an async factory function (rather than top-level await) keeps this
 * file compatible with CommonJS output from esbuild/tsx and avoids the
 * "Top-level await is not supported with the 'cjs' output format" error.
 *
 * Call this once from src/index.ts inside the start() bootstrap function.
 */
export declare function buildApp(): Promise<FastifyInstance>;
export {};
//# sourceMappingURL=app.d.ts.map