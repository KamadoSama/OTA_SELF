import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'ota_admin_session';

export function middleware(req: NextRequest) {
  // Authentication is now handled client-side in AuthProvider 
  // because pure JWT/localStorage is not accessible in server-side middleware.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
