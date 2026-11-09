import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const apiClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

// Add interceptor to include JWT token from NextAuth session
apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const session = await getSession();
    if (session && (session as any).user?.accessToken) {
      config.headers.Authorization = `Bearer ${(session as any).user.accessToken}`;
    }
  }
  return config;
});

// Add response interceptor to handle 401 Unauthorized (expired or invalid token)
let isRedirecting = false;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      const pathname = window.location.pathname;
      const isAuthPage =
        pathname.includes('/login') ||
        pathname.includes('/register') ||
        pathname.includes('/setup');

      if (!isAuthPage && !isRedirecting) {
        isRedirecting = true;
        try {
          await signOut({ redirect: false });
        } catch (e) {
          console.error('Error signing out on 401:', e);
        }

        const localeMatch = pathname.match(/^\/(en|fr)(?=\/|$)/);
        const localePrefix = localeMatch ? `/${localeMatch[1]}` : '';
        window.location.href = `${localePrefix}/login?expired=true`;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
