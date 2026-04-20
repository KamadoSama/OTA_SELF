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
  createdAt: string;
  channel: Channel;
  assets: UpdateAsset[];
}

export interface Invoice {
  id: string;
  amount: number;
  status: string;
  date: string;
  pdfUrl?: string;
}

export interface SubscriptionStats {
  tier: string;
  monthlyDownloads: number;
  downloadLimit: number;
  activeApps: number;
  appsLimit: number | string;
  deploymentsToday: number;
  deploymentsLimit: number | string;
  activeApiKeys: number;
  storageUsed: string;
  storageLimit: string;
  nextBillingDate: string | null;
  trialEndsAt: string | null;
  cardLast4?: string;
  cardBrand?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
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
};
