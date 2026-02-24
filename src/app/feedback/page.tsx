"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Send,
  CheckCircle2,
  MessageSquarePlus,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";

type RequestCategory = "feature" | "improvement" | "bug" | "question";

interface FeedbackForm {
  name: string;
  company: string;
  email: string;
  category: RequestCategory;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

const categories: { value: RequestCategory; label: string; icon: typeof Lightbulb; color: string }[] = [
  { value: "feature", label: "新機能の要望", icon: Lightbulb, color: "text-amber-500 bg-amber-50 border-amber-200" },
  { value: "improvement", label: "改善提案", icon: MessageSquarePlus, color: "text-brand-500 bg-brand-50 border-brand-200" },
  { value: "bug", label: "不具合報告", icon: AlertTriangle, color: "text-red-500 bg-red-50 border-red-200" },
  { value: "question", label: "質問・相談", icon: HelpCircle, color: "text-green-500 bg-green-50 border-green-200" },
];

const initialForm: FeedbackForm = {
  name: "",
  company: "",
  email: "",
  category: "feature",
  title: "",
  description: "",
  priority: "medium",
};

export default function FeedbackPage() {
  const [form, setForm] = useState<FeedbackForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Save to localStorage (demo) - in production, this would go to a backend API
    const existing = JSON.parse(localStorage.getItem("hacchu_feedback") || "[]");
    const newEntry = {
      ...form,
      id: `FB-${String(existing.length + 1).padStart(4, "0")}`,
      submittedAt: new Date().toISOString(),
      status: "new",
    };
    existing.push(newEntry);
    localStorage.setItem("hacchu_feedback", JSON.stringify(existing));

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            ご要望を受け付けました
          </h2>
          <p className="text-gray-600 mb-2">
            内容をAIが分析し、開発チームに共有いたします。
          </p>
          <p className="text-sm text-gray-400 mb-8">
            対応状況はメールでお知らせします。
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setForm(initialForm);
                setSubmitted(false);
              }}
              className="px-6 py-2.5 bg-brand-500 text-white font-semibold rounded-lg hover:bg-brand-600 transition-colors"
            >
              別の要望を送る
            </button>
            <Link
              href="/"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              トップへ戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-brand-950 to-brand-800 text-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">発注AI</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-brand-300 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              トップに戻る
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <MessageSquarePlus className="w-6 h-6 text-brand-300" />
            <h1 className="text-2xl font-bold">ご要望・フィードバック</h1>
          </div>
          <p className="text-brand-200">
            発注AIをより良くするために、皆様の声をお聞かせください。
            いただいたご要望はAIが分析・整理し、開発の優先順位に反映します。
          </p>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">基本情報</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="山田 太郎"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  会社名・店舗名
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="居酒屋 はなまる"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="taro@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">カテゴリ</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.value })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    form.category === cat.value
                      ? cat.color + " border-current ring-2 ring-offset-1"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <cat.icon
                    className={`w-6 h-6 mx-auto mb-2 ${
                      form.category === cat.value ? "" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      form.category === cat.value ? "" : "text-gray-600"
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">要望の内容</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="例：発注履歴のCSVエクスポート機能がほしい"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  詳細説明 <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="どのような機能が必要か、どのような場面で使いたいかなど、できるだけ詳しくお書きください。"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors resize-vertical"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  優先度
                </label>
                <div className="flex gap-3">
                  {(
                    [
                      { value: "low", label: "低", color: "bg-gray-100 text-gray-600 border-gray-300" },
                      { value: "medium", label: "中", color: "bg-amber-50 text-amber-700 border-amber-300" },
                      { value: "high", label: "高", color: "bg-red-50 text-red-600 border-red-300" },
                    ] as const
                  ).map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setForm({ ...form, priority: p.value })}
                      className={`px-5 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        form.priority === p.value
                          ? p.color + " ring-2 ring-offset-1"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 bg-brand-500 text-white font-bold rounded-lg hover:bg-brand-600 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  要望を送信する
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
