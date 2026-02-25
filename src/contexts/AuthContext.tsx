"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type User = {
  name: string;
  email: string;
  company?: string;
  businessType?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; password: string; company?: string; businessType?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_CREDENTIALS = {
  email: "demo@hacchu.net",
  password: "demo1234",
  user: { name: "デモユーザー", email: "demo@hacchu.net", company: "デモ居酒屋" },
};

const STORAGE_KEY = "hacchu-auth-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    if (!email || !password) {
      return { success: false, error: "メールアドレスとパスワードを入力してください" };
    }

    // Demo credentials or any valid-looking input
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const u = DEMO_CREDENTIALS.user;
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      return { success: true };
    }

    // Accept any email/password with minimum length for demo purposes
    if (password.length >= 4) {
      const u: User = { name: email.split("@")[0], email };
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      return { success: true };
    }

    return { success: false, error: "メールアドレスまたはパスワードが正しくありません" };
  }, []);

  const signup = useCallback(async (data: { name: string; email: string; password: string; company?: string; businessType?: string }) => {
    await new Promise((r) => setTimeout(r, 800));

    if (!data.name || !data.email || !data.password) {
      return { success: false, error: "必須項目を入力してください" };
    }
    if (data.password.length < 8) {
      return { success: false, error: "パスワードは8文字以上で入力してください" };
    }

    const u: User = {
      name: data.name,
      email: data.email,
      company: data.company,
      businessType: data.businessType,
    };
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
