import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if this is an OLW route
  const isOLWRoute = pathname.startsWith('/operation-little-wiggles') || pathname.startsWith('/api/olw');
  
  // Check if this is an HQ route
  const isHQRoute = pathname.startsWith('/hq') || pathname.startsWith('/api/hq');
  
  // Handle OLW routes
  if (isOLWRoute) {
    // Allow login page and auth endpoint
    if (pathname === '/operation-little-wiggles/login' || pathname === '/api/olw/auth') {
      return NextResponse.next();
    }
    
    const olwAuthCookie = request.cookies.get('olw-auth');
    
    if (olwAuthCookie?.value === 'authenticated') {
      return NextResponse.next();
    }
    
    // Redirect to OLW login
    const loginUrl = new URL('/operation-little-wiggles/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Handle HQ routes
  if (isHQRoute) {
    const hqAuthCookie = request.cookies.get('hq-auth');

    // If this is a login attempt
    if (request.method === 'POST' && pathname === '/api/auth/login') {
      return NextResponse.next();
    }

    if (hqAuthCookie?.value !== 'authenticated') {
      // Redirect unauthenticated visitors to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated — serve the page but hard-block all crawlers at the HTTP level
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
    return response;
  }

  // Allow robots.txt
  if (pathname === '/robots.txt') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/hq/:path*',
    '/api/hq/:path*',
    '/operation-little-wiggles/:path*',
    '/api/olw/:path*',
  ],
};
