"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useSession } from "next-auth/react";

export function useCurrentUser() {
  const { data: session, status } = useSession();

  return {
    data: session?.user ? {
      id: (session.user as any).id,
      email: session.user.email,
      subscriptionTier: (session.user as any).tier,
    } : null,
    isLoading: status === "loading",
    status,
  };
}

export function useLogin() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useRegister() {
  const { register } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password, plan }: { email: string; password: string; plan?: string }) =>
      register(email, password, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useLogout() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
