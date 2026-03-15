import type { Metadata } from 'next';
import { Fira_Code, Fira_Sans } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';

const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' });
const firaSans = Fira_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-fira-sans' });

export const metadata: Metadata = {
  title: 'OTA Dashboard | Expo Updates',
  description: 'Self-hosted OTA update management for React Native Expo apps.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${firaCode.variable} ${firaSans.variable} font-sans bg-slate-950 text-slate-50 antialiased min-h-screen`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}

