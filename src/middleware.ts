import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get auth session from cookie
  const authSession = request.cookies.get('auth-session');

  // Redirect root to /feed
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  // Protect API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!authSession) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/api/:path*']
};
