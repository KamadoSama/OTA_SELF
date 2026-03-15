import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'ota_admin_session';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = pathname.startsWith('/login');
  const session = req.cookies.get(SESSION_COOKIE)?.value;

  // Protect all non-public routes
  if (!isPublic && !session) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already-authenticated users away from login
  if (isPublic && session) {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = '/';
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
