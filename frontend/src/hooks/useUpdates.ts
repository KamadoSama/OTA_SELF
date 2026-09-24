"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updatesService } from "@/services/updates.service";

export function useUpdates(
  page = 1,
  limit = 10,
  search?: string,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  app?: string,
) {
  return useQuery({
    queryKey: ["updates", page, limit, search, sortBy, sortOrder, app],
    queryFn: () => updatesService.fetchUpdates(page, limit, search, sortBy, sortOrder, app),
  });
}

export function useDeleteUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => updatesService.deleteUpdate(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["updates"] });
      const previous = queryClient.getQueryData(["updates"]);

      queryClient.setQueriesData({ queryKey: ["updates"] }, (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.filter((u: any) => u.id !== deletedId),
          meta: {
            ...old.meta,
            total: old.meta.total - 1,
          }
        };
      });

      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["updates"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["updates"] });
    },
  });
}

export function useUploadUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      appName,
      channelName,
    }: {
      file: File;
      appName: string;
      channelName: string;
    }) => updatesService.uploadUpdate(file, appName, channelName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["updates"] });
    },
  });
}

export function useBilling() {
  return useQuery({
    queryKey: ["billing"],
    queryFn: () => updatesService.fetchInvoices(),
  });
}

export function useSubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: () => updatesService.fetchSubscriptionStats(),
  });
}

export function useUpgradePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentInfo: any) => updatesService.upgradeToPro(paymentInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["billing"] });
    },
  });
}

export function useDowngradePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updatesService.downgradeToFree(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => updatesService.deleteAccount(),
  });
}

export function useDownloadInvoice() {
  return useMutation({
    mutationFn: (id: string) => updatesService.downloadInvoicePdf(id),
  });
}

export function useAnalytics(days = 14, app?: string) {
  return useQuery({
    queryKey: ["analytics", days, app],
    queryFn: () => updatesService.fetchAnalytics(days, app),
    refetchInterval: 30000, // Refresh every 30s
  });
}
