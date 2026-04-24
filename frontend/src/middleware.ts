import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';
import { NextRequest } from 'next/server';

const i18nMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,
  
  // If true, the default locale will be used for the root path
  // without a prefix. If false, it will always prefix.
  localePrefix: 'always'
});

export default function middleware(req: NextRequest) {
  // Authentication is now handled client-side in AuthProvider 
  // because pure JWT/localStorage is not accessible in server-side middleware.
  
  return i18nMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|fr)/:path*', '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|og-image.png|favicon.svg).*)']
};

