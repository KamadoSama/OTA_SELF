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
  downloadCount: number;
  rolloutPercentage?: number;
  isRollback?: boolean;
  installationsCount?: number;
  createdAt: string;
  channel: Channel;
  assets: UpdateAsset[];
}

export interface AnalyticsHistoryPoint {
  date: string;
  total: number;
  ios: number;
  android: number;
}

export interface AnalyticsResponse {
  history: AnalyticsHistoryPoint[];
  totalUniqueDevices: number;
}

export interface Invoice {
  id: string;
  amount: number;
  status: string;
  date: string;
  pdfUrl?: string;
}

export interface SubscriptionStats {
  isSelfHosted?: boolean;
  tier: string;
  monthlyDownloads: number;
  downloadLimit: number;
  activeApps: number;
  appsLimit: number | string;
  deploymentsToday: number;
  deploymentsLimit: number | string;
  activeApiKeys: number;
  apiKeysLimit: number | string;
  storageUsed: string;
  storageLimit: string;
  nextBillingDate: string | null;
  trialEndsAt: string | null;
  cardLast4?: string;
  cardBrand?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const updatesService = {
  async fetchUpdates(
    page = 1,
    limit = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    app?: string,
  ): Promise<PaginatedResponse<Update>> {
    const { data } = await apiClient.get<PaginatedResponse<Update>>('/api/admin/updates', {
      params: { page, limit, search, sortBy, sortOrder, app },
    });
    return data;
  },

  async deleteUpdate(id: string) {
    const { data } = await apiClient.delete(`/api/admin/updates/${id}`);
    return data;
  },

  async toggleRollback(id: string): Promise<{ success: boolean; updateId: string; isRollback: boolean; message: string }> {
    const { data } = await apiClient.post(`/api/admin/updates/${id}/rollback`);
    return data;
  },

  async rollbackChannel(appName: string, channelName: string): Promise<{ success: boolean; rolledBackUpdateId: string; nowActiveUpdateId: string | null; message: string }> {
    const { data } = await apiClient.post('/api/admin/updates/rollback-channel', { appName, channelName });
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

  async fetchInvoices(): Promise<Invoice[]> {
    const { data } = await apiClient.get<Invoice[]>('/api/subscription/invoices');
    return data;
  },

  async fetchSubscriptionStats(): Promise<SubscriptionStats> {
    const { data } = await apiClient.get<SubscriptionStats>('/api/subscription');
    return data;
  },

  async upgradeToPro(paymentInfo: any) {
    const { data } = await apiClient.post('/api/subscription/upgrade', paymentInfo);
    return data;
  },

  async downgradeToFree() {
    const { data } = await apiClient.post('/api/subscription/downgrade');
    return data;
  },

  async deleteAccount() {
    const { data } = await apiClient.delete('/api/subscription/account');
    return data;
  },

  async downloadInvoicePdf(id: string) {
    const response = await apiClient.get(`/api/subscription/invoices/${id}/pdf`, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async fetchAnalytics(days = 14, app?: string): Promise<AnalyticsResponse> {
    const { data } = await apiClient.get<AnalyticsResponse>('/api/admin/updates/analytics/history', {
      params: { days, app },
    });
    return data;
  },
};
