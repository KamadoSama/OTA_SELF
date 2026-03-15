import apiClient from '@/lib/api-client';

export interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
}

export const authService = {
  async login(email: string, password: string) {
    const { data } = await apiClient.post<{ success: boolean; email: string }>(
      '/api/admin/auth/login',
      { email, password },
    );
    return data;
  },

  async logout() {
    const { data } = await apiClient.post('/api/admin/auth/logout');
    return data;
  },

  async getMe(): Promise<AdminUser> {
    const { data } = await apiClient.get<AdminUser>('/api/admin/auth/me');
    return data;
  },
};
