import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Try secure cookie name first, then fall back to regular
  let token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: '__Secure-next-auth.session-token',
  });

  // Fallback for non-secure (localhost HTTP)
  if (!token) {
    token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
  }

  const isAuthPage = request.nextUrl.pathname === '/admin/login';
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // If user is on login page and already authenticated, redirect to admin
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // If user is trying to access admin routes without authentication
  if (isAdminRoute && !isAuthPage && !token) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
