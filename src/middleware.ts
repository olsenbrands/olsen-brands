import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('hq-auth');
  
  // If already authenticated, pass through
  if (authCookie?.value === 'authenticated') {
    return NextResponse.next();
  }

  // If this is a login attempt
  if (request.method === 'POST' && request.nextUrl.pathname === '/api/auth/login') {
    return NextResponse.next();
  }

  // Allow robots.txt
  if (request.nextUrl.pathname === '/robots.txt') {
    return NextResponse.next();
  }

  // Redirect to login page
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/hq/:path*',
    '/api/hq/:path*',
  ],
};
