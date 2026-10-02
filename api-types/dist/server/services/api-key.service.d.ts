export interface CreateApiKeyInput {
    userId: string;
    organizationId: string;
    name: string;
    expiresAt?: Date | null;
}
export interface RevokeApiKeyInput {
    keyId: string;
    userId: string;
    organizationId: string;
}
export declare class ApiKeyService {
    /**
     * Creates a new API key for the user, hashing the secret and logging a SecurityAuditEvent.
     */
    createApiKey(input: CreateApiKeyInput): Promise<{
        id: string;
        rawKey: string;
        name: string;
    }>;
    /**
     * Revokes an existing API key, marking active: false and logging a SecurityAuditEvent.
     */
    revokeApiKey(input: RevokeApiKeyInput): Promise<{
        success: boolean;
    }>;
}
export declare const apiKeyService: ApiKeyService;
//# sourceMappingURL=api-key.service.d.ts.map