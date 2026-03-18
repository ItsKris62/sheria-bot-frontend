/**
 * Frontend password utilities.
 *
 * generateStrongPassword uses the Web Crypto API (crypto.getRandomValues),
 * which is available in all modern browsers and in the Next.js runtime.
 * The rules enforced here mirror the backend passwordSchema in
 * fintech-regulatory-backend/src/shared/validation/password.schema.ts.
 */

const PASSWORD_MIN_LENGTH = 10;

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
/** Subset of allowed special chars that avoids shell/HTML metacharacter issues. */
const SPECIAL = "!@#$%^&*_+-=|;:,.?";
const ALL = UPPER + LOWER + DIGITS + SPECIAL;

const SPECIAL_CHAR_RE = /[!@#$%^&*()\-_+=[\]{}|;:'",.<>?/~`\\]/;

/** Check structural validity without a network call or Node import. */
function isStructurallyValid(password: string): boolean {
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    password.length <= 128 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    SPECIAL_CHAR_RE.test(password)
  );
}

/** Pick one character from charset using cryptographic randomness. */
function secureRandomChar(charset: string): string {
  const buf = new Uint8Array(1);
  crypto.getRandomValues(buf);
  return charset[buf[0]! % charset.length]!;
}

/**
 * Generate a cryptographically random password that satisfies all structural
 * password policy rules.
 *
 * Note: the common-password check is NOT performed on the frontend — the
 * backend always validates server-side. Generated passwords are random enough
 * that hitting a common-password match is astronomically unlikely.
 *
 * @param length Target length. Defaults to 16. Minimum is 10.
 * @throws If all 5 generation attempts fail (should never happen in practice).
 */
export function generateStrongPassword(length: number = 16): string {
  const targetLength = Math.max(length, PASSWORD_MIN_LENGTH);
  const MAX_RETRIES = 5;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    // Guarantee at least one of each required character type.
    const required: string[] = [
      secureRandomChar(UPPER),
      secureRandomChar(LOWER),
      secureRandomChar(DIGITS),
      secureRandomChar(SPECIAL),
    ];

    // Fill remaining slots from the full character set.
    const rest: string[] = [];
    for (let i = required.length; i < targetLength; i++) {
      rest.push(secureRandomChar(ALL));
    }

    // Fisher-Yates shuffle using one secure random byte per swap.
    const chars = [...required, ...rest];
    for (let i = chars.length - 1; i > 0; i--) {
      const buf = new Uint8Array(1);
      crypto.getRandomValues(buf);
      const j = buf[0]! % (i + 1);
      const temp = chars[i]!;
      chars[i] = chars[j]!;
      chars[j] = temp;
    }

    const password = chars.join("");
    if (isStructurallyValid(password)) return password;
  }

  throw new Error(
    "generateStrongPassword: failed to produce a valid password after 5 attempts."
  );
}
