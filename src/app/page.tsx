"use client";

import Link from "next/link";
import {
  Phone,
  Printer,
  Table,
  ArrowRight,
  Zap,
  FileSearch,
  TrendingUp,
  UtensilsCrossed,
  Clock,
  Brain,
  ShoppingCart,
  Shield,
} from "lucide-react";

const legacyVsAI = [
  {
    legacy: {
      icon: Phone,
      title: "毎朝の電話注文",
      description:
        "飲食店のオーナーが毎朝5〜6時に起きて、複数の仕入先に電話で食材を注文。留守番電話、聞き間違い、言った言わないのトラブル。",
      pain: "1店舗あたり平均15分 × 仕入先数",
    },
    ai: {
      icon: Brain,
      title: "AI需要予測＆自動発注",
      description:
        "過去の注文パターン、曜日、季節、イベント、予約状況からAIが需要を予測。最適な数量を自動で発注提案。ワンタップで確定。",
      gain: "45秒で全仕入先への発注が完了",
    },
  },
  {
    legacy: {
      icon: Printer,
      title: "FAXで帳票やり取り",
      description:
        "注文書、納品書、請求書、価格表をFAXで送受信。手作業でデータを転記。紛失、誤読、ファイリングの手間。",
      pain: "1枚あたり15分の手作業",
    },
    ai: {
      icon: FileSearch,
      title: "AI帳票処理",
      description:
        "アップロードするだけでAIが瞬時にOCR・データ抽出。注文データと自動突合。請求書の自動検証で過請求も検出。",
      gain: "3秒で処理完了、精度98%",
    },
  },
  {
    legacy: {
      icon: Table,
      title: "Excelで価格・在庫管理",
      description:
        "仕入先ごとの価格表をExcelで管理。在庫は目視と勘。市場価格の変動に気づかず割高で仕入れ続ける。",
      pain: "週1回の更新では市場変動に追いつかない",
    },
    ai: {
      icon: TrendingUp,
      title: "AIダイナミック価格・在庫最適化",
      description:
        "リアルタイムの市場価格追跡、在庫の自動最適化、代替品の提案。廃棄ロスの予測と買い増し好機のアラート。",
      gain: "月間12万円のコスト削減実績",
    },
  },
];

const stats = [
  { label: "食品卸市場規模", value: "27兆円", sublabel: "日本国内の食品流通市場" },
  { label: "FAX利用率", value: "71%", sublabel: "の食品卸がFAXを使用" },
  { label: "電話注文", value: "65%+", sublabel: "の飲食店が毎朝電話で発注" },
  { label: "Excel管理", value: "80%", sublabel: "がExcelで在庫・価格管理" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-300 rounded-full blur-3xl" />
        </div>

        <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">発注AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/feedback"
              className="px-5 py-2.5 border border-brand-400 text-brand-200 font-semibold rounded-lg hover:bg-brand-800/50 transition-colors text-sm"
            >
              ご要望・フィードバック
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-white text-brand-900 font-semibold rounded-lg hover:bg-brand-50 transition-colors"
            >
              ダッシュボードを開く
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-24">
          <div className="flex items-center gap-2 text-brand-300 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>AIネイティブ受発注プラットフォーム</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white max-w-4xl leading-tight mb-6">
            飲食店の仕入れは、まだ
            <span className="text-brand-300">電話・FAX・Excel</span>
            ですか？
            <br />
            全部、AIに置き換えました。
          </h1>
          <p className="text-xl text-brand-200 max-w-2xl mb-10">
            発注AIは、毎朝の電話注文、FAXの帳票やり取り、Excelの価格管理を
            AIネイティブに変革します。27兆円の食品流通市場を、テクノロジーの力で効率化。
          </p>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 bg-brand-500 text-white font-semibold rounded-lg hover:bg-brand-600 transition-colors flex items-center gap-2"
            >
              デモを見る
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#transformation"
              className="px-8 py-3.5 border border-brand-400 text-brand-200 font-semibold rounded-lg hover:bg-brand-800/50 transition-colors"
            >
              仕組みを知る
            </a>
          </div>
        </div>
      </header>

      {/* Industry Stats */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-gray-500 text-sm font-medium uppercase tracking-wide mb-10">
            課題：27兆円の市場が、いまだに1990年代のツールで動いている
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-brand-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy vs AI Transformation */}
      <section id="transformation" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              変革の全貌
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              すべてのレガシープロセスを、AIネイティブな仕組みに置き換え。
              より速く、正確で、24時間稼働。
            </p>
          </div>

          <div className="space-y-12">
            {legacyVsAI.map((pair, idx) => (
              <div
                key={idx}
                className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch"
              >
                <div className="bg-white rounded-2xl p-8 border border-red-100 relative">
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                    レガシー
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                    <pair.legacy.icon className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pair.legacy.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {pair.legacy.description}
                  </p>
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    {pair.legacy.pain}
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center">
                  <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center shadow-lg ai-glow">
                    <ArrowRight className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-brand-100 relative ai-glow">
                  <div className="absolute top-4 right-4 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full">
                    AIネイティブ
                  </div>
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                    <pair.ai.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pair.ai.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{pair.ai.description}</p>
                  <div className="flex items-center gap-2 text-brand-600 text-sm font-medium">
                    <Zap className="w-4 h-4" />
                    {pair.ai.gain}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              最初からAIネイティブで設計
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              既存システムにAIを後付けしたのではなく、
              すべての機能がAIを前提に設計されています。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShoppingCart,
                title: "予測型自動発注",
                description:
                  "曜日、季節、イベント、予約状況を加味してAIが最適な発注量を提案。76%の発注が自動化済み。",
              },
              {
                icon: Shield,
                title: "品質・リスク管理",
                description:
                  "仕入先の納期遵守率をAIスコアリング。価格高騰の早期検知と代替品の自動提案。",
              },
              {
                icon: Zap,
                title: "業務の自動化",
                description:
                  "帳票の自動処理、注文と納品の突合、請求書の検証。人は判断と関係構築に集中。",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-50 rounded-2xl p-8 hover:bg-brand-50 transition-colors"
              >
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-900 to-brand-950">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            AIネイティブ受発注プラットフォームを体験する
          </h2>
          <p className="text-brand-200 text-lg mb-8">
            ダッシュボードでAI需要予測、帳票の自動処理、リアルタイムの価格分析をご覧ください。
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-900 font-bold rounded-lg hover:bg-brand-50 transition-colors text-lg"
          >
            ダッシュボードを開く
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-brand-950 text-brand-400 text-sm text-center">
        <p className="mb-2">
          発注AI &mdash; 飲食店向けAIネイティブ受発注プラットフォーム。
          電話・FAX・Excelを置き換える。
        </p>
        <Link
          href="/feedback"
          className="text-brand-300 hover:text-white transition-colors underline underline-offset-2"
        >
          ご要望・フィードバックはこちら
        </Link>
      </footer>
    </div>
  );
}
