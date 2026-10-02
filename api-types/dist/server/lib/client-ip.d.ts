import type { FastifyRequest } from 'fastify';
/**
 * Normalize an IP address string:
 * - Strips whitespace
 * - Normalizes IPv6-mapped IPv4 addresses (e.g. ::ffff:192.168.1.1 -> 192.168.1.1)
 * - Strips IPv6 zone index if present (e.g. fe80::1%eth0 -> fe80::1)
 * - Validates using net.isIP (returns 4 for IPv4, 6 for IPv6, 0 for invalid)
 * - Returns null for missing, malformed, 'unknown', or invalid IPs.
 */
export declare function normalizeIp(raw: string | undefined | null): string | null;
export type FastifyOrReq = FastifyRequest | {
    ip?: string;
    headers?: Record<string, string | string[] | undefined>;
    raw?: unknown;
    socket?: unknown;
};
/**
 * Safely extracts and validates the client IP address from a request.
 *
 * Fastify handles reverse proxy traversal and trust validation when `trustProxy`
 * is configured on the Fastify instance. Therefore, `req.ip` is the authoritative source.
 *
 * This function:
 * 1. Takes `req.ip` (populated by Fastify's trusted proxy resolver).
 * 2. Normalizes IPv6-mapped IPv4 representations.
 * 3. Validates with net.isIP.
 * 4. Never trusts unverified raw X-Forwarded-For headers when trustProxy is disabled.
 * 5. Returns null if missing, malformed, or invalid.
 */
export declare function getClientIp(req: FastifyOrReq | undefined | null): string | null;
//# sourceMappingURL=client-ip.d.ts.map