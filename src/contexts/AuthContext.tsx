"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

type User = {
  name: string;
  email: string;
  company?: string;
  businessType?: string;
};

type SocialProvider = "google" | "line";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isSupabase: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; password: string; company?: string; businessType?: string }) => Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }>;
  loginWithSocial: (provider: SocialProvider) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Demo mode fallback (when Supabase is not configured)
const DEMO_CREDENTIALS = {
  email: "demo@hacchu.net",
  password: "demo1234",
  user: { name: "デモユーザー", email: "demo@hacchu.net", company: "デモ居酒屋" },
};
const STORAGE_KEY = "hacchu-auth-user";

function extractUserFromMeta(meta: Record<string, unknown> | undefined, email: string): User {
  // Google provides full_name / name, LINE provides name
  const name = (meta?.full_name || meta?.name || email.split("@")[0] || "") as string;
  return {
    name,
    email,
    company: meta?.company as string | undefined,
    businessType: meta?.businessType as string | undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Create SSR-aware browser client (singleton per render tree)
  const supabase = useMemo(() => {
    if (!isSupabaseConfigured) return null;
    return createSupabaseBrowser();
  }, []);

  // --- Supabase session listener ---
  useEffect(() => {
    if (!supabase) {
      // Demo mode: hydrate from localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setUser(JSON.parse(stored));
      } catch {}
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(extractUserFromMeta(session.user.user_metadata, session.user.email || ""));
      }
      setIsLoading(false);
    });

    // Listen for auth changes (login, logout, token refresh, OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(extractUserFromMeta(session.user.user_metadata, session.user.email || ""));
        // After OAuth redirect, navigate to dashboard
        if (event === "SIGNED_IN") {
          router.push("/dashboard");
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Login ---
  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) {
      return { success: false, error: "メールアドレスとパスワードを入力してください" };
    }

    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          return { success: false, error: "メールアドレスまたはパスワードが正しくありません" };
        }
        if (error.message.includes("Email not confirmed")) {
          return { success: false, error: "メールアドレスの確認が完了していません。受信トレイをご確認ください。" };
        }
        return { success: false, error: error.message };
      }
      return { success: true };
    }

    // Demo mode fallback
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const u = DEMO_CREDENTIALS.user;
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      return { success: true };
    }
    if (password.length >= 4) {
      const u: User = { name: email.split("@")[0], email };
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      return { success: true };
    }
    return { success: false, error: "メールアドレスまたはパスワードが正しくありません" };
  }, [supabase]);

  // --- Social Login (Google / LINE) ---
  const loginWithSocial = useCallback(async (provider: SocialProvider) => {
    if (!supabase) {
      return { success: false, error: "ソーシャルログインを利用するにはSupabaseの設定が必要です" };
    }

    const redirectTo = typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider === "line" ? "line" as never : provider,
      options: { redirectTo },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    // The browser will redirect to the provider — no further action needed here
    return { success: true };
  }, [supabase]);

  // --- Signup ---
  const signup = useCallback(async (data: { name: string; email: string; password: string; company?: string; businessType?: string }) => {
    if (!data.name || !data.email || !data.password) {
      return { success: false, error: "必須項目を入力してください" };
    }
    if (data.password.length < 8) {
      return { success: false, error: "パスワードは8文字以上で入力してください" };
    }

    if (supabase) {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            company: data.company,
            businessType: data.businessType,
          },
        },
      });
      if (error) {
        if (error.message.includes("already registered")) {
          return { success: false, error: "このメールアドレスは既に登録されています" };
        }
        return { success: false, error: error.message };
      }
      // Supabase may require email confirmation
      return { success: true, needsConfirmation: true };
    }

    // Demo mode fallback
    const u: User = {
      name: data.name,
      email: data.email,
      company: data.company,
      businessType: data.businessType,
    };
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return { success: true };
  }, [supabase]);

  // --- Logout ---
  const logout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setUser(null);
    router.push("/");
  }, [supabase, router]);

  // --- Password Reset ---
  const resetPassword = useCallback(async (email: string) => {
    if (!email) {
      return { success: false, error: "メールアドレスを入力してください" };
    }
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    }
    // Demo mode: just pretend it worked
    return { success: true };
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isSupabase: isSupabaseConfigured, login, signup, loginWithSocial, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
