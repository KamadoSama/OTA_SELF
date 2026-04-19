import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add interceptor to include JWT token from NextAuth session
apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const session = await getSession();
    // console.log('session', session);
    if (session && (session as any).user.accessToken) {
      // console.log('access token', (session as any).user.accessToken);
      config.headers.Authorization = `Bearer ${(session as any).user.accessToken}`;
    }

    // console.log('config', config);
  }
  return config;
});

export default apiClient;
