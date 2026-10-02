import { FastifyInstance } from 'fastify';
import { resolveTrustProxy, parseTrustProxy, type TrustProxyValue, type TrustProxyMode, type ResolvedTrustProxy } from './server/lib/trust-proxy';
export { resolveTrustProxy, parseTrustProxy, type TrustProxyValue, type TrustProxyMode, type ResolvedTrustProxy, };
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
//# sourceMappingURL=app.d.ts.map