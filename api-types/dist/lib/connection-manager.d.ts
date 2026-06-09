export interface ConnectionStatus {
    database: boolean;
    redis: boolean;
    overall: 'ok' | 'degraded' | 'down';
}
/**
 * Centralized connection lifecycle manager.
 * Connects / disconnects all external services and reports aggregate health.
 */
declare class ConnectionManager {
    private started;
    /**
     * Connect to all external services.
     * Throws if the database cannot be reached (critical).
     * Redis failure degrades but does not block startup.
     */
    connectAll(): Promise<ConnectionStatus>;
    /**
     * Gracefully disconnect from all services.
     * Call from shutdown handler.
     */
    disconnectAll(): Promise<void>;
    /**
     * Probe current health of each service (used by health check endpoints).
     */
    healthCheck(): Promise<ConnectionStatus>;
}
export declare const connectionManager: ConnectionManager;
export { ConnectionManager };
//# sourceMappingURL=connection-manager.d.ts.map