export declare const VAULT_MIME_TYPES: readonly ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/vnd.ms-excel", "application/vnd.ms-powerpoint", "text/plain", "text/csv", "image/png", "image/jpeg", "image/webp"];
export declare const ALLOWED_VAULT_MIME_TYPES: Set<string>;
export type VaultMimeType = (typeof VAULT_MIME_TYPES)[number];
export declare const MIME_TO_EXTENSION: Record<VaultMimeType, string>;
//# sourceMappingURL=mime.d.ts.map