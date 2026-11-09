import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';
import { NextRequest, NextResponse } from 'next/server';

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
  const host = req.headers.get('host') || '';
  const pathname = req.nextUrl.pathname;

  // Si la requête provient de get-zenota.* (ex: get-zenota.diesestudio.com)
  if (host.startsWith('get-zenota.')) {
    const url = req.nextUrl.clone();
    url.pathname = '/install.sh';
    return NextResponse.rewrite(url);
  }

  // Ne pas rediriger ou réécrire /install.sh
  if (pathname === '/install.sh') {
    return NextResponse.next();
  }

  const isSelfHosted =
    process.env.NEXT_PUBLIC_SELF_HOSTED === 'false' || process.env.SELF_HOSTED === 'false'
      ? false
      : (process.env.SELF_HOSTED === 'true' || process.env.NEXT_PUBLIC_SELF_HOSTED === 'true' || process.env.SELF_HOSTED !== 'false');

  // En mode self-hosted, la landing page commerciale n'a pas de sens : rediriger directement vers le login / setup
  if (isSelfHosted) {
    if (pathname === '/' || pathname === '/en' || pathname === '/fr' || pathname === '/en/' || pathname === '/fr/') {
      const locale = pathname.startsWith('/fr') ? 'fr' : 'en';
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = `/${locale}/login`;
      return NextResponse.redirect(loginUrl);
    }
  }

  return i18nMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames, en excluant install.sh
  matcher: [
    '/',
    '/(en|fr)/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|og-image.png|favicon.svg|install\\.sh).*)'
  ]
};

