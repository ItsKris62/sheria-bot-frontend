/**
 * Circuit Breaker Service for Outbound Integrations
 *
 * Wraps external providers with cockatiel Circuit Breaker policies:
 * - 50% failure rate over 30s sliding window trips the breaker to OPEN.
 * - Cooldown of 60s before transitioning to HALF_OPEN to test recovery.
 * - Exposes state, trip_count, and rejection_count for Prometheus scraping on /metrics.
 * - Global bypass available via CIRCUIT_BREAKERS_ENABLED=false.
 */
export declare const SUPPORTED_PROVIDERS: readonly ["stripe", "intasend", "resend", "pinecone", "anthropic", "openai", "gemini", "cohere"];
export type CircuitBreakerProvider = (typeof SUPPORTED_PROVIDERS)[number];
export declare class CircuitBreakerOpenError extends Error {
    readonly provider: CircuitBreakerProvider;
    readonly code = "CIRCUIT_BREAKER_OPEN";
    readonly status = 503;
    constructor(provider: CircuitBreakerProvider);
}
export interface CircuitBreakerMetrics {
    provider: CircuitBreakerProvider;
    state: number;
    tripCount: number;
    rejectionCount: number;
}
export interface CircuitBreakerInstance {
    provider: CircuitBreakerProvider;
    execute<T>(fn: () => Promise<T>): Promise<T>;
    trip(): void;
    reset(): void;
    getMetrics(): CircuitBreakerMetrics;
}
declare class ProviderCircuitBreaker implements CircuitBreakerInstance {
    readonly provider: CircuitBreakerProvider;
    private breakerPolicy;
    private tripCount;
    private rejectionCount;
    private forceOpen;
    constructor(provider: CircuitBreakerProvider);
    private createPolicy;
    execute<T>(fn: () => Promise<T>): Promise<T>;
    trip(): void;
    reset(): void;
    getMetrics(): CircuitBreakerMetrics;
}
declare class CircuitBreakerRegistry {
    private instances;
    constructor();
    get(provider: CircuitBreakerProvider): ProviderCircuitBreaker;
    resetAll(): void;
    getAllMetrics(): CircuitBreakerMetrics[];
}
export declare const circuitBreakerRegistry: CircuitBreakerRegistry;
/**
 * Execute an outbound call protected by the corresponding provider's circuit breaker.
 */
export declare function executeWithBreaker<T>(provider: CircuitBreakerProvider, fn: () => Promise<T>): Promise<T>;
/**
 * Retrieve snapshot of all provider circuit breaker metrics.
 */
export declare function getCircuitBreakerMetrics(): CircuitBreakerMetrics[];
/**
 * Formats circuit breaker telemetry as standard Prometheus exposition format.
 */
export declare function formatCircuitBreakerPrometheusMetrics(): string;
export {};
//# sourceMappingURL=circuit-breaker.service.d.ts.map