export type AuthenticatorTransportFuture = 'ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb';
export declare const passkeyRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc/context").Context;
    meta: object;
    errorShape: {
        message: string;
        data: {
            stack: string | undefined;
            fieldErrors: Record<string, string> | null;
            code: import("@trpc/server").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
        };
        code: import("@trpc/server").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    /**
     * 1. Generate Passkey Registration Options
     */
    generateRegistrationOptions: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: import("@simplewebauthn/types").PublicKeyCredentialCreationOptionsJSON;
        meta: object;
    }>;
    /**
     * 2. Verify Passkey Registration Response
     */
    verifyRegistration: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            response: {
                id: string;
                rawId: string;
                response: {
                    clientDataJSON: string;
                    attestationObject: string;
                    transports?: string[] | undefined;
                    authenticatorData?: string | undefined;
                };
                type: "public-key";
                authenticatorAttachment?: "platform" | "cross-platform" | undefined;
                clientExtensionResults?: Record<string, any> | undefined;
            };
            deviceName?: string | undefined;
        };
        output: {
            id: string;
            createdAt: Date;
            deviceName: string | null;
        };
        meta: object;
    }>;
    /**
     * 3. Generate Passkey Authentication Options
     */
    generateAuthenticationOptions: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userHandle?: string | undefined;
        };
        output: {
            options: import("@simplewebauthn/types").PublicKeyCredentialRequestOptionsJSON;
            challengeId: string;
        };
        meta: object;
    }>;
    /**
     * 4. Verify Passkey Authentication
     */
    verifyAuthentication: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            challengeId: string;
            response: {
                id: string;
                rawId: string;
                response: {
                    clientDataJSON: string;
                    authenticatorData: string;
                    signature: string;
                    userHandle?: string | null | undefined;
                };
                type: "public-key";
                authenticatorAttachment?: "platform" | "cross-platform" | undefined;
                clientExtensionResults?: Record<string, any> | undefined;
            };
        };
        output: import("@/server/services/session.service").SessionResponsePayload;
        meta: object;
    }>;
    /**
     * 5. List Current User Passkeys
     */
    listUserPasskeys: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            createdAt: Date;
            deviceName: string | null;
            transports: string[];
            backedUp: boolean;
            lastUsedAt: Date | null;
        }[];
        meta: object;
    }>;
    /**
     * 6. Rename Passkey
     */
    renamePasskey: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            deviceName: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    /**
     * 7. Delete / Revoke Passkey
     */
    deletePasskey: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
            remainingPasskeyCount: number;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=passkey.router.d.ts.map