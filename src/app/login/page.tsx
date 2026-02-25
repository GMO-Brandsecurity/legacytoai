"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Brain,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const { login, resetPassword, user, isSupabase } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "ログインに失敗しました");
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("パスワードリセット用のメールアドレスを入力してください");
      return;
    }
    setError("");
    const result = await resetPassword(email);
    if (result.success) {
      setResetSent(true);
    } else {
      setError(result.error || "パスワードリセットに失敗しました");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">発注AI</span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            おかえりなさい
          </h1>
          <p className="text-gray-500 mb-8">
            アカウントにログインして、AIが最適化した発注を確認しましょう
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {resetSent && (
            <div className="mb-6 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700">
              パスワードリセットのメールを送信しました。受信トレイをご確認ください。
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@restaurant.jp"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">
                  パスワード
                </label>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                >
                  パスワードを忘れた方
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 text-sm border border-gray-200 rounded-xl focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  ログイン
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">
              アカウントをお持ちでない方は{" "}
            </span>
            <Link
              href="/signup"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              新規登録
            </Link>
          </div>

          {/* Demo Credentials - only show when Supabase is not configured */}
          {!isSupabase && (
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2">
                デモアカウント
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>
                  メール:{" "}
                  <span className="font-mono text-gray-800">demo@hacchu.net</span>
                </p>
                <p>
                  パスワード:{" "}
                  <span className="font-mono text-gray-800">demo1234</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 items-center justify-center p-12">
        <div className="text-white max-w-sm">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            AIが毎朝、最適な発注を提案します
          </h2>
          <p className="text-brand-200 mb-8 leading-relaxed">
            電話・FAX・Excelに費やしていた時間を、お客様のために使いましょう。
            発注AIが需要予測から帳票処理まで自動化します。
          </p>
          <div className="space-y-4">
            {[
              "需要予測で発注量を最適化",
              "帳票をAIが3秒で自動処理",
              "月間12万円以上のコスト削減",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-300 flex-shrink-0" />
                <span className="text-sm text-brand-100">{feature}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-sm text-brand-300 italic">
              &ldquo;発注AIを導入してから、毎朝の電話が完全になくなりました。&rdquo;
            </p>
            <p className="text-xs text-brand-400 mt-2">
              - 居酒屋 はなまる オーナー
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
