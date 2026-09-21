/**
 * WebAuthn (FIDO2 / Passkeys) Server Configuration
 */
export interface WebAuthnConfig {
    rpID: string;
    rpName: string;
    expectedOrigin: string;
}
export declare function getWebAuthnConfig(): WebAuthnConfig;
export declare const webauthnConfig: WebAuthnConfig;
//# sourceMappingURL=webauthn.d.ts.map