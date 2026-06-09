/**
 * Common Passwords List
 *
 * Source: https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10-million-password-list-top-10000.txt
 * Supplemented with Kenya-specific and regional patterns.
 *
 * For production: replace/supplement with the full SecLists 10,000-entry list.
 * Check is case-insensitive  -  normalize input with .toLowerCase() before lookup.
 */
export declare const COMMON_PASSWORDS: Set<string>;
/**
 * Returns true if the password appears in the common passwords list.
 * Case-insensitive.
 */
export declare function isCommonPassword(password: string): boolean;
//# sourceMappingURL=common-passwords.d.ts.map