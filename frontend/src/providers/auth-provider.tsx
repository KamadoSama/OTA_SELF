'use client';

import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { AdminUser } from '@/services/auth.service';

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, plan?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_PREFIXES = ['/docs','/en/docs','/fr/docs'];
const PUBLIC_EXACT = ['/', '/en', '/fr', '/en/login', '/fr/login', '/en/register', '/fr/register', '/setup', '/en/setup', '/fr/setup'];
const GUEST_ONLY_ROUTES = ['/login', '/register', '/en/login', '/fr/login', '/en/register', '/fr/register'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const loading = status === 'loading';
  const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === 'true';

  const user: AdminUser | null = useMemo(() => {
    if (!session?.user) return null;
    const sessionUser = session.user as { id?: string; email?: string | null; tier?: string };
    return {
      id: sessionUser.id || '',
      email: sessionUser.email || '',
      subscriptionTier: (sessionUser.tier as any) || 'free',
      createdAt: '',
    };
  }, [session]);

  const isPublicRoute = useCallback((path: string) => {
    if (isSelfHosted) {
      if (path === '/' || path === '/en' || path === '/fr') {
        return false;
      }
    }
    return (
      PUBLIC_EXACT.includes(path) ||
      PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix)) ||
      path === '/docs' ||
      /^\/[a-z]{2}\/docs(\/.*)?$/.test(path)
    );
  }, [isSelfHosted]);

  useEffect(() => {
    if (session?.user) {
      if (
        GUEST_ONLY_ROUTES.includes(pathname) ||
        (isSelfHosted && (pathname === '/' || pathname === '/en' || pathname === '/fr'))
      ) {
        router.push('/dashboard');
      }
    } else {
      if (!loading && !isPublicRoute(pathname)) {
        router.push('/login');
      }
    }
  }, [session, loading, pathname, router, isSelfHosted, isPublicRoute]);

  const login = async (email: string, pass: string) => {
    const result = await signIn('credentials', {
      email,
      password: pass,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    router.push('/dashboard');
  };

  const register = async (email: string, pass: string, plan?: string) => {
    // Note: NextAuth doesn't have a built-in register. 
    // Usually you'd call your API then sign in.
    console.log('Attempting registration for:', email);
    const res = await fetch(`/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass, plan }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Registration failed:', res.status, errorData);
      throw new Error(errorData.message || 'Registration failed');
    }

    console.log('Registration successful, logging in...');

    await login(email, pass);
  };

  const logout = async () => {
    await signOut({ redirect: false });
    if (isSelfHosted) {
      router.push('/login');
    } else {
      router.push('/');
    }
  };

  if (loading && !isPublicRoute(pathname)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
