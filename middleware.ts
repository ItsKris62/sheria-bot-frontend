import { NextRequest, NextResponse } from 'next/server';
import { decodeJwt } from 'jose';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';

/**
 * CRITICAL SECURITY NOTE:
 * Signature verification and token authorization remain strictly in the backend
 * (tRPC createContext / protected procedures) and MUST NOT be removed or bypassed.
 *
 * Edge Middleware only inspects the decoded token for structural validity, expiration,
 * and clock-skew tolerance (45 seconds) to eliminate blocking external Supabase Auth
 * HTTPS network roundtrips on routine client route navigation transitions.
 */
const CLOCK_SKEW_SECONDS = 45;

/**
 * Routes that must remain accessible without authentication.
 * Includes all (auth) group pages, (public) marketing pages, the root landing
 * page, and the Supabase OAuth/email-verification callback.
 */
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/change-password',
  '/auth/callback',
  // Marketing / (public) group
  '/about',
  '/blog',
  '/careers',
  '/contact',
  '/data-protection',
  '/knowledge-base',
  '/pricing',
  '/privacy',
  '/security',
  '/solutions',
  '/terms',
  '/pilot',
  '/unsubscribe',
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function parseJwtExp(token: string): number | null {
  try {
    const claims = decodeJwt(token);
    return typeof claims.exp === 'number' ? claims.exp : null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass through static assets and Next.js internals immediately
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(?:ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // All remaining routes require an authenticated session
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  // Fast-path: read the session from cookies without an external network roundtrip
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const exp = parseJwtExp(session.access_token);
  const now = Math.floor(Date.now() / 1000);

  // If token is missing, expired, or nearing expiry (with clock skew), invoke getUser() to refresh session
  if (!exp || exp <= (now + CLOCK_SKEW_SECONDS)) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Auth OK - authorization (role checks) stays in tRPC adminProcedure / protected procedures.
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js static files and images.
     * Static asset extensions are also skipped inside the middleware body above,
     * but the matcher here keeps the middleware off the hot path for obvious assets.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
