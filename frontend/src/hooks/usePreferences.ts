"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCurrentUser } from "./useAuth";

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: async (preferences: any) => {
      const res = await axios.post("/api/auth/preferences", preferences);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate current user to refresh session data
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      // Note: Since preferences are in the NextAuth session, 
      // we might need to call update() from useSession() if we want it instant without reload.
    },
  });
}
