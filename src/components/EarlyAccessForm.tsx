"use client";

import { useState } from "react";
import { Send, CheckCircle2, Zap } from "lucide-react";

type BusinessType = "restaurant" | "supplier" | "other";

interface FormData {
  email: string;
  businessType: BusinessType;
  companyName: string;
}

const businessTypes: { value: BusinessType; label: string }[] = [
  { value: "restaurant", label: "飲食店" },
  { value: "supplier", label: "食品卸" },
  { value: "other", label: "その他" },
];

export default function EarlyAccessForm() {
  const [form, setForm] = useState<FormData>({
    email: "",
    businessType: "restaurant",
    companyName: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [count, setCount] = useState(() => {
    if (typeof window !== "undefined") {
      const existing = JSON.parse(
        localStorage.getItem("hacchu_early_access") || "[]"
      );
      return 47 + existing.length;
    }
    return 47;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    setSubmitting(true);

    const existing = JSON.parse(
      localStorage.getItem("hacchu_early_access") || "[]"
    );
    existing.push({
      ...form,
      registeredAt: new Date().toISOString(),
    });
    localStorage.setItem("hacchu_early_access", JSON.stringify(existing));

    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
    setCount((c: number) => c + 1);
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          登録ありがとうございます
        </h3>
        <p className="text-brand-200 text-sm">
          サービス開始時にご案内メールをお送りします。
        </p>
        <p className="text-brand-400 text-xs mt-3">
          現在 {count}社 が早期アクセスに登録済み
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
      <div className="flex flex-col gap-3">
        {/* Business type selector */}
        <div className="flex gap-2 justify-center">
          {businessTypes.map((bt) => (
            <button
              key={bt.value}
              type="button"
              onClick={() => setForm({ ...form, businessType: bt.value })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                form.businessType === bt.value
                  ? "bg-white text-brand-900"
                  : "bg-brand-800/50 text-brand-300 hover:bg-brand-800"
              }`}
            >
              {bt.label}
            </button>
          ))}
        </div>

        {/* Email + Company */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            placeholder="会社名・店舗名"
            className="flex-1 px-4 py-3 bg-white/10 border border-brand-600 text-white placeholder-brand-400 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none"
          />
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="メールアドレス *"
            className="flex-1 px-4 py-3 bg-white/10 border border-brand-600 text-white placeholder-brand-400 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto sm:mx-auto px-8 py-3.5 bg-white text-brand-900 font-bold rounded-lg hover:bg-brand-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
              送信中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              早期アクセスに登録する（無料）
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-brand-400">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>現在 {count}社 が登録済み</span>
        </div>
        <span>|</span>
        <span>クレジットカード不要</span>
      </div>
    </form>
  );
}
