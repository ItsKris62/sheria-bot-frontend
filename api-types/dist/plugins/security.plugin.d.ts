import type { FastifyInstance } from 'fastify';
/**
 * Security plugin  -  production-hardened Helmet configuration.
 *
 * Registers Helmet with strict CSP, HSTS, and other headers
 * tuned for a JSON API (no inline scripts, no frames).
 */
declare function securityPlugin(app: FastifyInstance): Promise<void>;
declare const _default: typeof securityPlugin;
export default _default;
//# sourceMappingURL=security.plugin.d.ts.map