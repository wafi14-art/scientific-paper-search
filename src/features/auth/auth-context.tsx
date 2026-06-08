"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { AppUserProfile, AuthContextValue } from "@/types/auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchProfile(): Promise<AppUserProfile | null> {
  const response = await fetch("/api/auth/profile", {
    method: "GET",
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load user profile.");
  }

  const data = (await response.json()) as { profile: AppUserProfile | null };
  return data.profile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const refreshProfile = useCallback(async () => {
    const nextProfile = await fetchProfile();
    setProfile(nextProfile);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      setIsLoading(true);

      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      setSession(activeSession);
      setUser(activeSession?.user ?? null);

      if (activeSession?.user) {
        try {
          const nextProfile = await fetchProfile();
          if (isMounted) setProfile(nextProfile);
        } catch {
          if (isMounted) setProfile(null);
        }
      } else {
        setProfile(null);
      }

      if (isMounted) setIsLoading(false);
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        try {
          setProfile(await fetchProfile());
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setIsLoading(false);
      router.refresh();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsLoading(false);
    router.push("/");
    router.refresh();
  }, [router, supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      isLoading,
      isAuthenticated: Boolean(session?.user),
      refreshProfile,
      signOut,
    }),
    [isLoading, profile, refreshProfile, session, signOut, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
