/**
 * WebAuthn (FIDO2 / Passkeys) browser feature detection and error translation helpers.
 * SSR-safe: handles execution in non-browser environments gracefully.
 */

export function isWebAuthnSupported(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return Boolean(
    window.PublicKeyCredential &&
    navigator.credentials &&
    typeof navigator.credentials.create === 'function' &&
    typeof navigator.credentials.get === 'function'
  );
}

export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) {
    return false;
  }
  try {
    const pk = window.PublicKeyCredential;
    if (pk && typeof pk.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      return await pk.isUserVerifyingPlatformAuthenticatorAvailable();
    }
    return false;
  } catch {
    return false;
  }
}

export async function isConditionalMediationAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) {
    return false;
  }
  try {
    const pk = window.PublicKeyCredential;
    if (pk && typeof pk.isConditionalMediationAvailable === 'function') {
      return await pk.isConditionalMediationAvailable();
    }
    return false;
  } catch {
    return false;
  }
}

export interface WebAuthnErrorDetails {
  message: string;
  isCancellation: boolean;
  code?: string;
}

/**
 * Maps browser DOMExceptions and tRPC backend errors into user-friendly messages.
 */
export function translateWebAuthnError(error: any, context: 'registration' | 'authentication' = 'registration'): WebAuthnErrorDetails {
  if (!error) {
    return {
      message: `${context === 'registration' ? 'Passkey setup' : 'Passkey sign-in'} failed. Please try again.`,
      isCancellation: false,
    };
  }

  const name = error.name || error.code || '';
  const message = (error.message || '').toString();

  // 1. User cancellation or timeout
  if (name === 'NotAllowedError' || message.includes('cancelled') || message.includes('canceled') || message.includes('not allowed')) {
    return {
      message: `${context === 'registration' ? 'Passkey setup' : 'Passkey sign-in'} was cancelled.`,
      isCancellation: true,
      code: 'CANCELLED',
    };
  }

  // 2. AbortError (internal cancellation e.g. unmount)
  if (name === 'AbortError') {
    return {
      message: 'Operation aborted.',
      isCancellation: true,
      code: 'ABORTED',
    };
  }

  // 3. Not supported / invalid state
  if (name === 'NotSupportedError' || name === 'InvalidStateError') {
    return {
      message: "This device can't create a passkey for this account or it is already registered.",
      isCancellation: false,
      code: 'NOT_SUPPORTED',
    };
  }

  // 4. Security Error
  if (name === 'SecurityError') {
    return {
      message: 'Passkey setup failed for security reasons. Please contact support.',
      isCancellation: false,
      code: 'SECURITY_ERROR',
    };
  }

  // 5. Backend Rate limit
  if (message.includes('PASSKEY_RATE_LIMITED') || message.includes('TOO_MANY_REQUESTS') || name === 'TOO_MANY_REQUESTS') {
    return {
      message: 'Too many passkey attempts. Please wait a few minutes.',
      isCancellation: false,
      code: 'RATE_LIMITED',
    };
  }

  // 6. Backend Conflict (Duplicate passkey or concurrent race)
  if (message.includes('already registered') || message.includes('CONFLICT') || name === 'CONFLICT') {
    return {
      message: 'This passkey is already registered.',
      isCancellation: false,
      code: 'CONFLICT',
    };
  }

  // 7. Expired / Timed out challenge
  if (message.includes('expired') || message.includes('Passkey authentication expired') || message.includes('Passkey registration session expired')) {
    return {
      message: 'Passkey session timed out. Please try again.',
      isCancellation: false,
      code: 'EXPIRED',
    };
  }

  // Default fallback
  return {
    message: context === 'registration'
      ? 'Passkey setup failed. Please try again.'
      : 'Passkey sign-in failed. Use your password instead.',
    isCancellation: false,
    code: 'UNKNOWN',
  };
}
