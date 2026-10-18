"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth-provider";
import { useSession } from "next-auth/react";

interface SessionUserExtended {
  id?: string;
  email?: string | null;
  tier?: string;
  preferences?: Record<string, unknown>;
}

export function useCurrentUser() {
  const { data: session, status } = useSession();
  const user = session?.user as SessionUserExtended | undefined;

  return {
    data: user ? {
      id: user.id || '',
      email: user.email,
      subscriptionTier: user.tier,
      preferences: user.preferences,
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
