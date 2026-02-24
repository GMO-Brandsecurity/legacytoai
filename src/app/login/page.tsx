"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">発注AI</span>
          </Link>
          <p className="text-brand-300 text-sm">
            AIネイティブ受発注プラットフォーム
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-xl font-bold text-gray-900 text-center mb-2">
            ログイン
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Googleアカウントでログインしてください
          </p>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-700 font-semibold"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Googleでログイン
          </button>

          <div className="mt-6 p-4 bg-brand-50 rounded-xl">
            <div className="flex items-start gap-3">
              <LogIn className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-brand-900">
                  個人情報は安全に保護されます
                </p>
                <p className="text-xs text-brand-600 mt-1">
                  認証はGoogleが管理します。当サービスではパスワードやクレジットカード情報を保持しません。
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-brand-400 text-xs mt-6">
          ログインすることで、利用規約およびプライバシーポリシーに同意したものとみなされます。
        </p>
      </div>
    </div>
  );
}
