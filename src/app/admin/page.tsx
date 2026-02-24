"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  MessageSquarePlus,
  Clock,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";

interface FeedbackEntry {
  id: string;
  name: string;
  company: string;
  email: string;
  category: "feature" | "improvement" | "bug" | "question";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  submittedAt: string;
  status: string;
}

// Sample data shown when no real feedback exists yet
const sampleFeedback: FeedbackEntry[] = [
  {
    id: "FB-0001",
    name: "田中 健太",
    company: "居酒屋 はなまる",
    email: "tanaka@hanamaru.jp",
    category: "feature",
    title: "発注履歴のCSVエクスポート機能",
    description:
      "月次の経理処理で発注履歴をCSV形式でダウンロードしたい。現在は画面を見ながら手入力しており非効率。日付範囲指定と仕入先別のフィルタがあると嬉しい。",
    priority: "high",
    submittedAt: "2026-02-23T09:30:00Z",
    status: "new",
  },
  {
    id: "FB-0002",
    name: "佐藤 美咲",
    company: "トラットリア ベラ",
    email: "sato@bella.jp",
    category: "improvement",
    title: "スマホでの操作性向上",
    description:
      "仕込み中にスマホからAI提案を確認・承認したい。現在のUIはPC向けで、スマホだとボタンが小さく操作しづらい。",
    priority: "high",
    submittedAt: "2026-02-22T14:15:00Z",
    status: "new",
  },
  {
    id: "FB-0003",
    name: "鈴木 一郎",
    company: "寿司 匠",
    email: "suzuki@takumi.jp",
    category: "feature",
    title: "LINE通知連携",
    description:
      "AI提案が出た時にLINEで通知がほしい。スタッフ間でも共有できるとなお良い。朝の忙しい時間帯に画面を開く余裕がないので。",
    priority: "medium",
    submittedAt: "2026-02-21T11:00:00Z",
    status: "new",
  },
  {
    id: "FB-0004",
    name: "木村 大輔",
    company: "中華 龍門",
    email: "kimura@ryumon.jp",
    category: "bug",
    title: "在庫数が正しく反映されない",
    description:
      "手動で在庫を更新しても、ダッシュボードの在庫数に反映されるまで時間がかかる場合がある。特に夕方の更新が翌朝まで反映されない。",
    priority: "high",
    submittedAt: "2026-02-20T17:45:00Z",
    status: "new",
  },
  {
    id: "FB-0005",
    name: "山本 花子",
    company: "カフェ ルミエール",
    email: "yamamoto@lumiere.jp",
    category: "question",
    title: "AI予測の精度を上げるには？",
    description:
      "利用開始1ヶ月ですが、AI予測の精度がまだ低い印象。学習にどのくらいのデータが必要か、精度を上げるためにこちらでできることがあれば知りたい。",
    priority: "low",
    submittedAt: "2026-02-19T10:20:00Z",
    status: "new",
  },
];

const categoryConfig = {
  feature: { label: "新機能", icon: Lightbulb, color: "bg-amber-100 text-amber-700" },
  improvement: { label: "改善", icon: MessageSquarePlus, color: "bg-brand-100 text-brand-700" },
  bug: { label: "不具合", icon: AlertTriangle, color: "bg-red-100 text-red-700" },
  question: { label: "質問", icon: HelpCircle, color: "bg-green-100 text-green-700" },
};

const priorityConfig = {
  low: { label: "低", color: "bg-gray-100 text-gray-600" },
  medium: { label: "中", color: "bg-amber-100 text-amber-700" },
  high: { label: "高", color: "bg-red-100 text-red-600" },
};

// AI analysis engine (runs client-side)
function generateAISummary(feedbacks: FeedbackEntry[]) {
  const total = feedbacks.length;
  const byCategory = {
    feature: feedbacks.filter((f) => f.category === "feature").length,
    improvement: feedbacks.filter((f) => f.category === "improvement").length,
    bug: feedbacks.filter((f) => f.category === "bug").length,
    question: feedbacks.filter((f) => f.category === "question").length,
  };
  const highPriority = feedbacks.filter((f) => f.priority === "high").length;

  return {
    totalRequests: total,
    byCategory,
    highPriority,
    topThemes: [
      {
        theme: "モバイル対応の強化",
        count: feedbacks.filter(
          (f) =>
            f.description.includes("スマホ") ||
            f.description.includes("モバイル") ||
            f.title.includes("スマホ")
        ).length || 1,
        impact: "high" as const,
      },
      {
        theme: "外部サービス連携（LINE、CSV等）",
        count: feedbacks.filter(
          (f) =>
            f.description.includes("LINE") ||
            f.description.includes("CSV") ||
            f.description.includes("連携") ||
            f.title.includes("LINE") ||
            f.title.includes("CSV")
        ).length || 1,
        impact: "high" as const,
      },
      {
        theme: "データ精度・リアルタイム性",
        count: feedbacks.filter(
          (f) =>
            f.description.includes("精度") ||
            f.description.includes("反映") ||
            f.description.includes("リアルタイム")
        ).length || 1,
        impact: "medium" as const,
      },
    ],
    proposals: [
      {
        title: "Phase 1: モバイルUI最適化",
        description:
          "スマホからのAI提案確認・承認をワンタップで完結できるレスポンシブUIを実装。仕込み中の片手操作を想定した大きなボタンと簡潔な画面設計。",
        effort: "2-3週間",
        impact: "利用頻度30%向上見込み",
        relatedFeedback: ["FB-0002"],
        priority: 1,
      },
      {
        title: "Phase 2: LINE通知連携",
        description:
          "AI提案発生時、在庫アラート時にLINE公式アカウント経由で通知。チームグループへの共有機能も追加。LINE Login連携で新規ユーザーの参入障壁も下げる。",
        effort: "2-3週間",
        impact: "アプリ起動率2倍見込み",
        relatedFeedback: ["FB-0003"],
        priority: 2,
      },
      {
        title: "Phase 3: データエクスポート機能",
        description:
          "発注履歴、在庫推移、コスト分析のCSV/Excelエクスポート。日付・仕入先・カテゴリでフィルタ可能。経理処理との連携を大幅に効率化。",
        effort: "1-2週間",
        impact: "月次経理作業50%削減",
        relatedFeedback: ["FB-0001"],
        priority: 3,
      },
      {
        title: "継続改善: AI予測精度の向上",
        description:
          "在庫更新のリアルタイム反映を実装（WebSocket）。ユーザーフィードバックループを追加し、AI予測の精度を継続的に改善。初期学習に必要なデータ量のガイドをアプリ内に表示。",
        effort: "継続的",
        impact: "AI精度95%→98%目標",
        relatedFeedback: ["FB-0004", "FB-0005"],
        priority: 4,
      },
    ],
  };
}

export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [analyzing, setAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState<ReturnType<typeof generateAISummary> | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // Load from localStorage or use sample data
    const stored = localStorage.getItem("hacchu_feedback");
    const data: FeedbackEntry[] = stored ? JSON.parse(stored) : sampleFeedback;
    if (!stored) {
      // Pre-populate with sample data for demo
      localStorage.setItem("hacchu_feedback", JSON.stringify(sampleFeedback));
    }
    setFeedbacks(data);

    // Simulate AI analysis
    const timer = setTimeout(() => {
      setAnalysis(generateAISummary(data));
      setAnalyzing(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filtered =
    filter === "all"
      ? feedbacks
      : feedbacks.filter((f) => f.category === filter);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-7 h-7 text-brand-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            要望管理 & AI分析
          </h1>
        </div>
        <p className="text-gray-500">
          ユーザーからの要望をAIが自動分析し、開発の優先順位を提案します。
        </p>
      </div>

      {/* AI Analysis Panel */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-800 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-brand-300" />
          <span className="text-sm font-semibold text-brand-300 uppercase tracking-wide">
            AI 分析レポート
          </span>
          {analyzing && (
            <div className="ml-2 flex items-center gap-2 text-brand-300 text-sm">
              <div className="w-4 h-4 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
              分析中...
            </div>
          )}
        </div>

        {analyzing ? (
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-brand-800/50 rounded-xl p-4 animate-pulse">
                <div className="h-8 bg-brand-700/50 rounded mb-2" />
                <div className="h-4 bg-brand-700/50 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : analysis ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold">{analysis.totalRequests}</div>
                <div className="text-sm text-brand-200">総要望数</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-red-300">
                  {analysis.highPriority}
                </div>
                <div className="text-sm text-brand-200">高優先度</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-amber-300">
                  {analysis.byCategory.feature}
                </div>
                <div className="text-sm text-brand-200">新機能要望</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-red-400">
                  {analysis.byCategory.bug}
                </div>
                <div className="text-sm text-brand-200">不具合報告</div>
              </div>
            </div>

            {/* Top Themes */}
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-brand-300 mb-3">
                AIが検出したトップテーマ
              </h3>
              <div className="flex flex-wrap gap-3">
                {analysis.topThemes.map((theme) => (
                  <div
                    key={theme.theme}
                    className="bg-white/10 rounded-lg px-4 py-2 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-brand-300" />
                    <span className="text-sm font-medium">{theme.theme}</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {theme.count}件
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* AI Proposals */}
      {analysis && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-gray-900">
              AIからの開発提案
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {analysis.proposals.map((proposal) => (
              <div
                key={proposal.title}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">
                      {proposal.priority}
                    </span>
                    <h3 className="font-bold text-gray-900">
                      {proposal.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {proposal.description}
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    {proposal.effort}
                  </div>
                  <div className="flex items-center gap-1 text-brand-600 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {proposal.impact}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-400">関連:</span>
                  {proposal.relatedFeedback.map((id) => (
                    <span
                      key={id}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">要望一覧</h2>
          <div className="flex gap-2">
            {[
              { value: "all", label: "すべて" },
              { value: "feature", label: "新機能" },
              { value: "improvement", label: "改善" },
              { value: "bug", label: "不具合" },
              { value: "question", label: "質問" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                  filter === f.value
                    ? "bg-brand-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((fb) => {
            const cat = categoryConfig[fb.category];
            const pri = priorityConfig[fb.priority];
            const isExpanded = expandedId === fb.id;
            return (
              <div
                key={fb.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : fb.id)
                  }
                  className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.color}`}
                  >
                    <cat.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-gray-400 font-mono">
                        {fb.id}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}
                      >
                        {cat.label}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${pri.color}`}
                      >
                        優先度: {pri.label}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate">
                      {fb.title}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-400">
                      {fb.name} / {fb.company}
                    </div>
                    <div className="text-xs text-gray-300">
                      {new Date(fb.submittedAt).toLocaleDateString("ja-JP")}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-6 pb-5 border-t border-gray-100 pt-4">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {fb.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>連絡先: {fb.email}</span>
                      <span>
                        受付日:{" "}
                        {new Date(fb.submittedAt).toLocaleString("ja-JP")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>該当する要望がありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
