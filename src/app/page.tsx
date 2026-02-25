"use client";

import { useState } from "react";
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
  Menu,
  X,
  CheckCircle2,
  Quote,
} from "lucide-react";
import EarlyAccessForm from "@/components/EarlyAccessForm";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-300 rounded-full blur-3xl" />
        </div>

        <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">発注AI</span>
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/feedback"
              className="px-4 py-2.5 text-brand-200 font-medium hover:text-white transition-colors text-sm"
            >
              ご要望
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 border border-brand-400 text-brand-200 font-semibold rounded-lg hover:bg-brand-800/50 transition-colors text-sm"
            >
              ログイン
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-white text-brand-900 font-semibold rounded-lg hover:bg-brand-50 transition-colors"
            >
              ダッシュボードを開く
            </Link>
          </div>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="メニューを開く"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="relative z-20 md:hidden bg-brand-900/95 backdrop-blur-sm border-t border-brand-700 px-4 py-4 space-y-3">
            <Link
              href="/dashboard"
              className="block w-full px-4 py-3 bg-white text-brand-900 font-semibold rounded-lg text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              ダッシュボードを開く
            </Link>
            <Link
              href="/login"
              className="block w-full px-4 py-3 border border-brand-400 text-brand-200 font-semibold rounded-lg text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              ログイン
            </Link>
            <Link
              href="/feedback"
              className="block w-full px-4 py-3 text-brand-300 font-medium text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              ご要望・フィードバック
            </Link>
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-16 sm:pb-24">
          <div className="flex items-center gap-2 text-brand-300 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>AIネイティブ受発注プラットフォーム</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white max-w-4xl leading-tight mb-6">
            飲食店の仕入れは、まだ
            <span className="text-brand-300">電話・FAX・Excel</span>
            ですか？
            <br />
            全部、AIに置き換えました。
          </h1>
          <p className="text-lg sm:text-xl text-brand-200 max-w-2xl mb-10">
            発注AIは、毎朝の電話注文、FAXの帳票やり取り、Excelの価格管理を
            AIネイティブに変革します。27兆円の食品流通市場を、テクノロジーの力で効率化。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#early-access"
              className="px-8 py-3.5 bg-brand-500 text-white font-semibold rounded-lg hover:bg-brand-600 transition-colors flex items-center justify-center gap-2"
            >
              早期アクセスに登録する
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/dashboard"
              className="px-8 py-3.5 border border-brand-400 text-brand-200 font-semibold rounded-lg hover:bg-brand-800/50 transition-colors text-center"
            >
              デモを見る
            </Link>
          </div>
        </div>
      </header>

      {/* Industry Stats */}
      <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
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
      <section id="transformation" className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
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
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
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

      {/* Social Proof / Voices */}
      <section className="py-12 sm:py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              導入を検討している方の声
            </h2>
            <p className="text-gray-600">
              飲食業界の現場から届いたリアルな課題
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                quote: "毎朝5時に起きて3社に電話。留守電になると折り返し待ち。これだけで1時間近くかかる日もある。",
                author: "居酒屋オーナー",
                location: "東京・渋谷",
                pain: "発注に毎朝1時間",
              },
              {
                quote: "FAXで届く納品書を手打ちでExcelに転記。月末の請求書照合が地獄。数字の打ち間違いで過払いしてたことも。",
                author: "イタリアン店長",
                location: "東京・恵比寿",
                pain: "月末に3日間の突合作業",
              },
              {
                quote: "キャベツが急に値上がりしたのに気づかず1ヶ月仕入れ続けた。市場価格を毎日追うのは現実的に無理。",
                author: "中華料理オーナー",
                location: "東京・池袋",
                pain: "年間20万円の過払い",
              },
            ].map((voice, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-gray-100 relative"
              >
                <Quote className="w-8 h-8 text-brand-100 absolute top-4 right-4" />
                <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                  &ldquo;{voice.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{voice.author}</div>
                    <div className="text-xs text-gray-400">{voice.location}</div>
                  </div>
                  <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                    {voice.pain}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Impact numbers */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="text-center mb-6">
              <p className="text-sm font-semibold text-brand-600 uppercase tracking-wide">発注AIで解決できること</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "95%", label: "電話発注を削減", sub: "45秒で完了" },
                { value: "98%", label: "帳票処理の精度", sub: "AI OCR" },
                { value: "¥12万+", label: "月間コスト削減", sub: "平均実績" },
                { value: "3秒", label: "帳票処理時間", sub: "旧: 15分" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-2xl sm:text-3xl font-bold text-brand-600 mb-1">{item.value}</div>
                  <div className="text-sm font-medium text-gray-900">{item.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Early Access CTA */}
      <section id="early-access" className="py-12 sm:py-20 bg-gradient-to-br from-brand-900 to-brand-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            早期アクセスに登録する
          </h2>
          <p className="text-brand-200 text-base sm:text-lg mb-2">
            サービス開始時に優先的にご案内します。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-brand-300 mb-8">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />無料で登録</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />クレジットカード不要</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />いつでも解除可能</span>
          </div>
          <EarlyAccessForm />

          <div className="mt-10 pt-8 border-t border-brand-800">
            <p className="text-brand-400 text-sm mb-4">まずはデモで機能を確認したい方</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 border border-brand-600 text-brand-200 font-semibold rounded-lg hover:bg-brand-800/50 transition-colors"
            >
              デモを体験する
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 bg-brand-950 border-t border-brand-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold">発注AI</span>
              </div>
              <p className="text-brand-400 text-sm">
                飲食店向けAIネイティブ受発注プラットフォーム。
                電話・FAX・Excelを置き換える。
              </p>
            </div>
            <div>
              <h4 className="text-brand-200 font-semibold text-sm mb-3">プラットフォーム</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard" className="text-brand-400 hover:text-white transition-colors">ダッシュボード</Link></li>
                <li><Link href="/orders" className="text-brand-400 hover:text-white transition-colors">発注・AI提案</Link></li>
                <li><Link href="/pricing" className="text-brand-400 hover:text-white transition-colors">価格・在庫AI</Link></li>
                <li><Link href="/analytics" className="text-brand-400 hover:text-white transition-colors">分析レポート</Link></li>
                <li><Link href="/exports" className="text-brand-400 hover:text-white transition-colors">エクスポート</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-brand-200 font-semibold text-sm mb-3">アカウント</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="text-brand-400 hover:text-white transition-colors">ログイン</Link></li>
                <li><Link href="/signup" className="text-brand-400 hover:text-white transition-colors">新規登録</Link></li>
                <li><Link href="/settings" className="text-brand-400 hover:text-white transition-colors">設定</Link></li>
                <li><Link href="/feedback" className="text-brand-400 hover:text-white transition-colors">ご要望・フィードバック</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-brand-800 pt-6 text-center text-brand-500 text-xs">
            &copy; 2025 発注AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
