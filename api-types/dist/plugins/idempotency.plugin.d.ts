import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
export declare const IDEMPOTENCY_TTL_SECONDS = 86400;
export declare const MAX_IDEMPOTENCY_KEY_LENGTH = 255;
export declare function isIdempotencyRequiredRoute(url: string): boolean;
export declare function resolveOrgIdFromSession(request: FastifyRequest): Promise<string | null>;
declare module 'fastify' {
    interface FastifyRequest {
        idempotencyKey?: string;
        isIdempotencyHit?: boolean;
    }
}
export declare const idempotencyPlugin: FastifyPluginAsync;
export default idempotencyPlugin;
//# sourceMappingURL=idempotency.plugin.d.ts.map