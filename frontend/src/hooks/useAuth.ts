"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import axios from "axios";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authService.getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.push("/");
      router.refresh();
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
  });
}

export function isUnauthorized(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
