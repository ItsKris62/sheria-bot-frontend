import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  isConditionalMediationAvailable,
  translateWebAuthnError,
} from './webauthn';

describe('WebAuthn Client Helper Module', () => {
  const originalWindow = global.window;
  const originalNavigator = global.navigator;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.window = originalWindow;
    global.navigator = originalNavigator;
  });

  it('handles SSR path safely when window/navigator is undefined', async () => {
    // Simulate SSR environment
    const tempWindow = global.window;
    // @ts-ignore
    delete global.window;

    expect(isWebAuthnSupported()).toBe(false);
    expect(await isPlatformAuthenticatorAvailable()).toBe(false);
    expect(await isConditionalMediationAvailable()).toBe(false);

    global.window = tempWindow;
  });

  it('returns false when browser lacks WebAuthn APIs', async () => {
    // Missing PublicKeyCredential
    (global as any).window = { ...originalWindow };
    delete (global as any).window.PublicKeyCredential;
    (global as any).navigator = { credentials: undefined } as any;

    expect(isWebAuthnSupported()).toBe(false);
    expect(await isPlatformAuthenticatorAvailable()).toBe(false);
    expect(await isConditionalMediationAvailable()).toBe(false);
  });

  it('returns true when browser supports WebAuthn APIs', async () => {
    const isUserVerifyingPlatformAuthenticatorAvailable = vi.fn().mockResolvedValue(true);
    const isConditionalMediationAvailableFn = vi.fn().mockResolvedValue(true);

    (global as any).window = {
      ...originalWindow,
      PublicKeyCredential: {
        isUserVerifyingPlatformAuthenticatorAvailable,
        isConditionalMediationAvailable: isConditionalMediationAvailableFn,
      } as any,
    };
    (global as any).navigator = {
      credentials: {
        create: vi.fn(),
        get: vi.fn(),
      } as any,
    };

    expect(isWebAuthnSupported()).toBe(true);
    expect(await isPlatformAuthenticatorAvailable()).toBe(true);
    expect(await isConditionalMediationAvailable()).toBe(true);
  });

  it('swallows errors and returns false from platform authenticator checks', async () => {
    (global as any).window = {
      ...originalWindow,
      PublicKeyCredential: {
        isUserVerifyingPlatformAuthenticatorAvailable: vi.fn().mockRejectedValue(new Error('Device error')),
        isConditionalMediationAvailable: vi.fn().mockRejectedValue(new Error('Autofill error')),
      } as any,
    };
    (global as any).navigator = {
      credentials: {
        create: vi.fn(),
        get: vi.fn(),
      } as any,
    };

    expect(await isPlatformAuthenticatorAvailable()).toBe(false);
    expect(await isConditionalMediationAvailable()).toBe(false);
  });

  describe('translateWebAuthnError', () => {
    it('identifies cancellation (NotAllowedError)', () => {
      const err = new Error('The operation either timed out or was not allowed.');
      err.name = 'NotAllowedError';

      const result = translateWebAuthnError(err, 'registration');
      expect(result.isCancellation).toBe(true);
      expect(result.code).toBe('CANCELLED');
    });

    it('identifies unsupported / invalid state', () => {
      const err = new Error('Not supported');
      err.name = 'NotSupportedError';

      const result = translateWebAuthnError(err, 'registration');
      expect(result.isCancellation).toBe(false);
      expect(result.code).toBe('NOT_SUPPORTED');
    });

    it('identifies security error', () => {
      const err = new Error('RP ID mismatch');
      err.name = 'SecurityError';

      const result = translateWebAuthnError(err, 'registration');
      expect(result.code).toBe('SECURITY_ERROR');
    });

    it('identifies backend rate limit', () => {
      const err = new Error('PASSKEY_RATE_LIMITED');
      const result = translateWebAuthnError(err, 'authentication');
      expect(result.code).toBe('RATE_LIMITED');
      expect(result.message).toContain('Too many passkey attempts');
    });

    it('identifies duplicate registration conflict', () => {
      const err = new Error('This passkey is already registered');
      const result = translateWebAuthnError(err, 'registration');
      expect(result.code).toBe('CONFLICT');
      expect(result.message).toContain('already registered');
    });

    it('identifies expired session', () => {
      const err = new Error('Passkey authentication expired');
      const result = translateWebAuthnError(err, 'authentication');
      expect(result.code).toBe('EXPIRED');
      expect(result.message).toContain('timed out');
    });
  });
});
