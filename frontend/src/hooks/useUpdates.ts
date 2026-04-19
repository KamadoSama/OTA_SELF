"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updatesService } from "@/services/updates.service";

export function useUpdates() {
  return useQuery({
    queryKey: ["updates"],
    queryFn: () => updatesService.fetchUpdates(),
  });
}

export function useDeleteUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => updatesService.deleteUpdate(id),
    onMutate: async (deletedId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["updates"] });

      // Snapshot the previous value
      const previous = queryClient.getQueryData(["updates"]);

      // Optimistically remove the update
      queryClient.setQueryData(["updates"], (old: { id: string }[] | undefined) =>
        old?.filter((u) => u.id !== deletedId),
      );

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
