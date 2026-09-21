import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from './middleware';
import * as jose from 'jose';

const mockGetSession = vi.fn();
const mockGetUser = vi.fn();

vi.mock('@/lib/supabase/middleware', () => ({
  createSupabaseMiddlewareClient: vi.fn(() => ({
    supabase: {
      auth: {
        getSession: mockGetSession,
        getUser: mockGetUser,
      },
    },
    response: { status: 200, headers: new Headers({ 'x-middleware-pass': 'true' }) },
  })),
}));

describe('Frontend Edge Middleware Navigation & Auth Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const generateMockJwt = (expInSecondsFromNow: number) => {
    const exp = Math.floor(Date.now() / 1000) + expInSecondsFromNow;
    const header = Buffer.from(JSON.stringify({ alg: 'ES256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ sub: 'user-uuid-1234', exp })).toString('base64url');
    return `${header}.${payload}.mockSignature`;
  };

  it('1. Allows authenticated navigation across 5+ protected routes with zero blocking I/O', async () => {
    const validToken = generateMockJwt(3600);
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: validToken } },
      error: null,
    });

    const protectedRoutes = [
      '/dashboard',
      '/compliance',
      '/vault',
      '/settings/organization',
      '/settings/security',
      '/analytics',
    ];

    for (const route of protectedRoutes) {
      const req = new NextRequest(`https://app.sheriabot.com${route}`);
      const res = await middleware(req);

      expect(res.status).toBe(200);
      expect(mockGetSession).toHaveBeenCalled();
      // External getUser network call must be bypassed on valid token
      expect(mockGetUser).not.toHaveBeenCalled();
    }
  });

  it('2. Deep route refresh (/settings/organization) renders with valid token without login bounce', async () => {
    const validToken = generateMockJwt(1800);
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: validToken } },
      error: null,
    });

    const req = new NextRequest('https://app.sheriabot.com/settings/organization');
    const res = await middleware(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it('3. Force token expiry invokes getUser() refresh without redirect loop', async () => {
    // Token expiring in 10s (inside the 45s clock-skew buffer)
    const expiringToken = generateMockJwt(10);
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: expiringToken } },
      error: null,
    });

    // Supabase auth.getUser() refreshes session successfully
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-uuid-1234' } },
      error: null,
    });

    const req = new NextRequest('https://app.sheriabot.com/compliance/queries');
    const res = await middleware(req);

    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('4. Logged out / unauthenticated user immediately redirects to /login with redirect param', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const req = new NextRequest('https://app.sheriabot.com/settings/organization');
    const res = await middleware(req);

    expect(res.status).toBe(307);
    const redirectUrl = res.headers.get('location');
    expect(redirectUrl).toContain('/login?redirect=%2Fsettings%2Forganization');
  });
});
