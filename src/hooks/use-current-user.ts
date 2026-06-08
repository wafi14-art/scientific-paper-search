"use client";

import { useAuth } from "@/features/auth/auth-context";

export function useCurrentUser() {
  const { user, profile, session, isLoading, isAuthenticated, refreshProfile } =
    useAuth();

  return {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated,
    refreshProfile,
  };
}
