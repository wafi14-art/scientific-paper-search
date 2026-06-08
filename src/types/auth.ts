import type { Session, User } from "@supabase/supabase-js";

export type UserRole = "user" | "admin";

export interface AppUserProfile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: AppUserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
