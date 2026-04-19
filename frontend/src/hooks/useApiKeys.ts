import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiKeysService } from '@/services/api-keys.service';

export function useApiKeys() {
  return useQuery({
    queryKey: ['apiKeys'],
    queryFn: () => apiKeysService.list(),
  });
}

export function useGenerateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiKeysService.generate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiKeysService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });
}
