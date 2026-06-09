export declare function createAlertStreamToken(userId: string): Promise<{
    token: string;
    expiresInSeconds: number;
}>;
export declare function consumeAlertStreamToken(token: string): Promise<string | null>;
//# sourceMappingURL=stream-token.d.ts.map