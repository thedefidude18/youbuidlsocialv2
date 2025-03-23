import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get auth session from cookie
  const authSession = request.cookies.get('auth-session');

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
  matcher: '/api/:path*',
};