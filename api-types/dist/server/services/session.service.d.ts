export declare function parseDeviceLabel(userAgent: string | undefined): string;
export declare function resolveSessionTimeoutSeconds(sessionTimeoutHours: unknown): number;
export interface IssueSessionParams {
    prisma: any;
    redis: any;
    user: any;
    req: {
        ip?: string;
        headers: Record<string, string | string[] | undefined>;
    };
    res?: any;
    reason: 'password' | 'password_totp' | 'backup_code' | 'passkey';
    supabaseTokens?: {
        accessToken: string;
        refreshToken: string | null;
        supabaseAuthId?: string;
    };
    sessionTtlSeconds?: number;
}
export interface SessionResponsePayload {
    mfaRequired: false;
    tempToken: null;
    accessToken: string;
    refreshToken: string | null;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
        mustChangePassword: boolean;
        organization: any;
        createdAt: Date;
    };
}
/**
 * Shared session issuance service for password, TOTP, backup code, and Passkey authentications.
 * Creates DB session, syncs Redis user cache and session fingerprints, updates user login timestamps,
 * and records audit logs consistently.
 */
export declare function issueSessionForUser(params: IssueSessionParams): Promise<SessionResponsePayload>;
//# sourceMappingURL=session.service.d.ts.map