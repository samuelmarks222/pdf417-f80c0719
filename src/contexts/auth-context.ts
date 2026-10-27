import type { User } from "@supabase/supabase-js";
import { createContext } from "react";

export interface CreditProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  credit_balance: number;
  is_admin: boolean;
}

export interface AuthContextValue {
  configured: boolean;
  loading: boolean;
  user: User | null;
  profile: CreditProfile | null;
  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<string | null>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
