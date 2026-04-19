import apiClient from '@/lib/api-client';

export interface ApiKey {
  id: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface GeneratedKeyResponse {
  apiKey: ApiKey;
  rawKey: string;
}

export const apiKeysService = {
  async list() {
    const { data } = await apiClient.get<ApiKey[]>('/api/api-keys');
    return data;
  },

  async generate() {
    const { data } = await apiClient.post<GeneratedKeyResponse>('/api/api-keys');
    return data;
  },

  async delete(id: string) {
    const { data } = await apiClient.delete(`/api/api-keys/${id}`);
    return data;
  },
};
