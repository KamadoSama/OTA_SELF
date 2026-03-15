import apiClient from '@/lib/api-client';

export interface UpdateAsset {
  id: string;
  hash: string;
  key: string;
  contentType: string;
  isLaunchAsset: boolean;
}

export interface App {
  id: string;
  name: string;
  createdAt: string;
}

export interface Channel {
  id: string;
  name: string;
  app: App;
}

export interface Update {
  id: string;
  runtimeVersion: string;
  platform: string;
  createdAt: string;
  channel: Channel;
  assets: UpdateAsset[];
}

export const updatesService = {
  async fetchUpdates(): Promise<Update[]> {
    const { data } = await apiClient.get<Update[]>('/api/admin/updates');
    return data;
  },

  async deleteUpdate(id: string) {
    const { data } = await apiClient.delete(`/api/admin/updates/${id}`);
    return data;
  },

  async uploadUpdate(file: File, appName: string, channelName: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('app', appName);
    formData.append('channel', channelName);

    const { data } = await apiClient.post('/api/admin/updates/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
