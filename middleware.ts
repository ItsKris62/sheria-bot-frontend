import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';

/**
 * Routes that must remain accessible without authentication.
 * Includes all (auth) group pages, (public) marketing pages, the root landing
 * page, and the Supabase OAuth/email-verification callback.
 *
 * Note: /verify-email is public so unauthenticated users can land on it from
 * a verification email link. GuestGuard (client-side) handles redirecting
 * already-authenticated users away from auth pages.
 */
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
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
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
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

  // getUser() validates the JWT with Supabase Auth — more secure than getSession()
  // which only reads the local cookie without server-side verification.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth ✓ — authorization (role checks) stays in tRPC adminProcedure / protected procedures.
  // Keeping those concerns separate avoids a DB call in middleware on every request.
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
