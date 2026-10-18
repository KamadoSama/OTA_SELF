"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appsService } from "@/services/apps.service";

export function useApps() {
  return useQuery({
    queryKey: ["apps"],
    queryFn: () => appsService.fetchApps(),
    refetchInterval: 30000,
  });
}

export function useCreateApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, scheme }: { name: string; scheme?: string }) =>
      appsService.createApp(name, scheme),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
}
