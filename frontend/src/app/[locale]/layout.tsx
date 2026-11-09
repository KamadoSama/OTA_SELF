import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { AuthSessionProvider } from '@/providers/session-provider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zenota.diesestudio.com'),
  title: 'ZenOTA | Premium Expo Updates',
  description: 'Pro-grade OTA update management for React Native Expo apps.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'ZenOTA | Premium Expo Updates',
    description: 'Pro-grade OTA update management for React Native Expo apps.',
    url: 'https://zenota.diesestudio.com',
    siteName: 'ZenOTA',
    images: [
      {
        url: '/og-image.png',
        width: 1024,
        height: 1024,
        alt: 'ZenOTA - Premium Expo Updates',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZenOTA | Premium Expo Updates',
    description: 'Pro-grade OTA update management for React Native Expo apps.',
    images: ['/og-image.png'],
  },
};


export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const isSelfHosted = process.env.SELF_HOSTED !== 'false';

  return (
    <html lang={locale} className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ZENOTA_SELF_HOSTED__ = ${JSON.stringify(isSelfHosted)};`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#000000] text-slate-50 antialiased min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AuthSessionProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </AuthSessionProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


