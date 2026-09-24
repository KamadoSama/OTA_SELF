import apiClient from '@/lib/api-client';

export interface AppSummary {
  id: string;
  name: string;
  scheme?: string;
  createdAt: string;
  channelsCount: number;
  channels: string[];
  updatesCount: number;
  latestUpdate?: {
    id: string;
    runtimeVersion: string;
    platform: string;
    rolloutPercentage: number;
    isRollback: boolean;
    createdAt: string;
    installationsCount: number;
  } | null;
}

export const appsService = {
  async fetchApps(): Promise<AppSummary[]> {
    const { data } = await apiClient.get<AppSummary[]>('/api/admin/apps');
    return data;
  },

  async createApp(name: string, scheme?: string): Promise<AppSummary> {
    const { data } = await apiClient.post<AppSummary>('/api/admin/apps', {
      name,
      scheme,
    });
    return data;
  },
};
