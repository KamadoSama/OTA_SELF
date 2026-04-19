import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { AuthSessionProvider } from '@/providers/session-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ZenOTA | Premium Expo Updates',
  description: 'Pro-grade OTA update management for React Native Expo apps.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#000000] text-slate-50 antialiased min-h-screen`}>
        <QueryProvider>
          <AuthSessionProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </AuthSessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

