import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { AuthContext, type AuthContextValue, type CreditProfile } from "@/contexts/auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CreditProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!supabase || !user) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("credit_profiles")
      .select("id,email,display_name,credit_balance,is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (error) throw error;
    setProfile(data as CreditProfile | null);
  }, [user]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    const applySession = async (session: Session | null) => {
      if (!active) return;
      setUser(session?.user ?? null);
      if (!session?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("credit_profiles")
        .select("id,email,display_name,credit_balance,is_admin")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!active) return;
      if (error) console.error("Could not load credit profile:", error.message);
      setProfile((data as CreditProfile | null) ?? null);
      setLoading(false);
    };

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error("Could not restore sign-in session:", error.message);
      return applySession(data.session);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    configured: isSupabaseConfigured,
    loading,
    user,
    profile,
    signInWithGoogle: async () => {
      if (!supabase) return "Supabase is not configured for this deployment.";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/account` },
      });
      return error?.message ?? null;
    },
    signOut: async () => {
      if (!supabase) return "Supabase is not configured for this deployment.";
      const { error } = await supabase.auth.signOut();
      return error?.message ?? null;
    },
    refreshProfile,
  }), [loading, user, profile, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
