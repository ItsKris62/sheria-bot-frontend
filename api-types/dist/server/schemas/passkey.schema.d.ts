import { z } from 'zod';
export declare const generateRegistrationOptionsSchema: z.ZodVoid;
export declare const verifyRegistrationSchema: z.ZodObject<{
    response: z.ZodObject<{
        id: z.ZodString;
        rawId: z.ZodString;
        response: z.ZodObject<{
            clientDataJSON: z.ZodString;
            attestationObject: z.ZodString;
            transports: z.ZodOptional<z.ZodArray<z.ZodString>>;
            authenticatorData: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        authenticatorAttachment: z.ZodOptional<z.ZodEnum<{
            platform: "platform";
            "cross-platform": "cross-platform";
        }>>;
        clientExtensionResults: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        type: z.ZodLiteral<"public-key">;
    }, z.core.$strip>;
    deviceName: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const generateAuthenticationOptionsSchema: z.ZodObject<{
    userHandle: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const verifyAuthenticationSchema: z.ZodObject<{
    challengeId: z.ZodString;
    response: z.ZodObject<{
        id: z.ZodString;
        rawId: z.ZodString;
        response: z.ZodObject<{
            clientDataJSON: z.ZodString;
            authenticatorData: z.ZodString;
            signature: z.ZodString;
            userHandle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>;
        authenticatorAttachment: z.ZodOptional<z.ZodEnum<{
            platform: "platform";
            "cross-platform": "cross-platform";
        }>>;
        clientExtensionResults: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        type: z.ZodLiteral<"public-key">;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const renamePasskeySchema: z.ZodObject<{
    id: z.ZodString;
    deviceName: z.ZodString;
}, z.core.$strip>;
export declare const deletePasskeySchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type VerifyRegistrationInput = z.infer<typeof verifyRegistrationSchema>;
export type GenerateAuthenticationOptionsInput = z.infer<typeof generateAuthenticationOptionsSchema>;
export type VerifyAuthenticationInput = z.infer<typeof verifyAuthenticationSchema>;
export type RenamePasskeyInput = z.infer<typeof renamePasskeySchema>;
export type DeletePasskeyInput = z.infer<typeof deletePasskeySchema>;
//# sourceMappingURL=passkey.schema.d.ts.map