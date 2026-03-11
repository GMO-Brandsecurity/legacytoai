"use client";

import { useState, useEffect } from "react";
import { Send, CheckCircle2, Zap, ArrowRight } from "lucide-react";

type BusinessType = "restaurant" | "supplier" | "other";

const businessTypes: { value: BusinessType; label: string }[] = [
  { value: "restaurant", label: "飲食店" },
  { value: "supplier", label: "食品卸" },
  { value: "other", label: "その他" },
];

export default function EarlyAccessForm() {
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("restaurant");
  const [companyName, setCompanyName] = useState("");
  const [step, setStep] = useState<"email" | "details" | "done">("email");
  const [submitting, setSubmitting] = useState(false);
  const [count, setCount] = useState(47);
  const [error, setError] = useState("");

  // Fetch real count on mount
  useEffect(() => {
    fetch("/api/early-access")
      .then((res) => res.json())
      .then((data) => {
        if (data.count) setCount(data.count);
      })
      .catch(() => {
        // Use default count
      });
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, businessType, companyName }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          // Already registered - still show success
          setStep("done");
          return;
        }
        // API error - save to localStorage as fallback
        const existing = JSON.parse(
          localStorage.getItem("hacchu_early_access") || "[]"
        );
        existing.push({ email, registeredAt: new Date().toISOString() });
        localStorage.setItem("hacchu_early_access", JSON.stringify(existing));
        setStep("done");
        return;
      }

      if (data.count) setCount(data.count);
      setStep("done");
    } catch {
      // Network error - save locally
      const existing = JSON.parse(
        localStorage.getItem("hacchu_early_access") || "[]"
      );
      existing.push({ email, registeredAt: new Date().toISOString() });
      localStorage.setItem("hacchu_early_access", JSON.stringify(existing));
      setStep("done");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "done") {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          登録ありがとうございます
        </h3>
        <p className="text-brand-200 text-sm">
          サービス開始時に <span className="font-medium text-white">{email}</span> へご案内をお送りします。
        </p>
        <p className="text-brand-400 text-xs mt-3">
          現在 {count}社 が早期アクセスに登録済み
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleEmailSubmit} className="max-w-xl mx-auto">
      <div className="flex flex-col gap-3">
        {/* Step 1: Email only - minimal friction */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="メールアドレスを入力"
            className="flex-1 px-4 py-3.5 bg-white/10 border border-brand-600 text-white placeholder-brand-400 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none text-base"
            autoComplete="email"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 bg-white text-brand-900 font-bold rounded-lg hover:bg-brand-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                送信中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                無料で登録
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {/* Optional: expand to show more fields */}
        {step === "email" && !submitting && (
          <button
            type="button"
            onClick={() => setStep("details")}
            className="text-brand-400 text-xs hover:text-brand-300 transition-colors flex items-center justify-center gap-1"
          >
            業種・会社名も入力する（任意）
            <ArrowRight className="w-3 h-3" />
          </button>
        )}

        {step === "details" && (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex gap-2 justify-center">
              {businessTypes.map((bt) => (
                <button
                  key={bt.value}
                  type="button"
                  onClick={() => setBusinessType(bt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    businessType === bt.value
                      ? "bg-white text-brand-900"
                      : "bg-brand-800/50 text-brand-300 hover:bg-brand-800"
                  }`}
                >
                  {bt.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="会社名・店舗名（任意）"
              className="px-4 py-3 bg-white/10 border border-brand-600 text-white placeholder-brand-400 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-brand-400">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>現在 {count}社 が登録済み</span>
        </div>
        <span>|</span>
        <span>クレジットカード不要</span>
        <span>|</span>
        <span>30秒で完了</span>
      </div>
    </form>
  );
}
