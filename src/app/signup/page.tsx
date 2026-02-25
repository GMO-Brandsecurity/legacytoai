"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  Mail,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  Brain,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessType: "restaurant",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const { signup, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }
    if (!agreed) {
      setError("利用規約に同意してください");
      return;
    }

    setIsLoading(true);
    const result = await signup({
      name: form.name,
      email: form.email,
      password: form.password,
      company: form.company,
      businessType: form.businessType,
    });

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "登録に失敗しました");
      setIsLoading(false);
    }
  };

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Signup Form */}
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
            新規アカウント登録
          </h1>
          <p className="text-gray-500 mb-8">
            無料で始められます。AIが発注業務を自動化します。
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  氏名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="田中 太郎"
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  店舗名 / 会社名
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => updateForm("company", e.target.value)}
                    placeholder="居酒屋 はなまる"
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                業種
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "restaurant", label: "飲食店" },
                  { value: "supplier", label: "食品卸" },
                  { value: "other", label: "その他" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateForm("businessType", opt.value)}
                    className={`px-3 py-2.5 text-sm rounded-xl border-2 font-medium transition-all ${
                      form.businessType === opt.value
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-gray-100 text-gray-600 hover:border-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="you@restaurant.jp"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  パスワード <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => updateForm("password", e.target.value)}
                    placeholder="8文字以上"
                    className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  パスワード確認 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) =>
                      updateForm("confirmPassword", e.target.value)
                    }
                    placeholder="再入力"
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
              />
              <label htmlFor="terms" className="text-xs text-gray-500">
                <span className="text-brand-600 font-medium hover:underline cursor-pointer">
                  利用規約
                </span>
                および
                <span className="text-brand-600 font-medium hover:underline cursor-pointer">
                  プライバシーポリシー
                </span>
                に同意します
              </label>
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
                  無料で始める
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">
              すでにアカウントをお持ちの方は{" "}
            </span>
            <Link
              href="/login"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              ログイン
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 items-center justify-center p-12">
        <div className="text-white max-w-sm">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            3分で登録、すぐにAI発注を開始
          </h2>
          <p className="text-brand-200 mb-8 leading-relaxed">
            登録後すぐにAIが過去のデータを学習し、最適な発注提案を開始します。
            導入サポートも無料で提供しています。
          </p>
          <div className="space-y-4">
            {[
              { step: "1", text: "アカウント登録（3分）" },
              { step: "2", text: "店舗情報を入力" },
              { step: "3", text: "仕入先を登録" },
              { step: "4", text: "AIが自動で発注提案を開始" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold text-brand-200">
                  {item.step}
                </div>
                <span className="text-sm text-brand-100">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-brand-100">
                47社以上が早期アクセスに登録済み
              </span>
            </div>
            <p className="text-xs text-brand-300">
              飲食店・食品卸の事業者様に選ばれています
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
