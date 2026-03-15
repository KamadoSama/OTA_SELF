import axios from 'axios';

// Auth routes use Next.js API routes (relative URLs) so cookies are set on the same domain
const authClient = axios.create({
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
}

export const authService = {
  async login(email: string, password: string) {
    const { data } = await authClient.post<{ success: boolean; email: string }>(
      '/api/admin/auth/login',
      { email, password },
    );
    return data;
  },

  async logout() {
    const { data } = await authClient.post('/api/admin/auth/logout');
    return data;
  },

  async getMe(): Promise<AdminUser> {
    const { data } = await authClient.get<AdminUser>('/api/admin/auth/me');
    return data;
  },
};

