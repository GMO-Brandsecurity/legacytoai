"use client";

import { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  UserPlus,
  Settings,
  Rocket,
  MessageSquare,
  HelpCircle,
  ArrowDown,
} from "lucide-react";
import EarlyAccessForm from "@/components/EarlyAccessForm";

// --- Data ---

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
  { label: "食品卸市場規模", value: "27", suffix: "兆円", sublabel: "日本国内の食品流通市場" },
  { label: "FAX利用率", value: "71", suffix: "%", sublabel: "の食品卸がFAXを使用" },
  { label: "電話注文", value: "65", suffix: "%+", sublabel: "の飲食店が毎朝電話で発注" },
  { label: "Excel管理", value: "80", suffix: "%", sublabel: "がExcelで在庫・価格管理" },
];

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "無料登録",
    description: "メールアドレスと業態を入力するだけ。クレジットカード不要、30秒で完了。",
  },
  {
    icon: Settings,
    number: "02",
    title: "初期設定",
    description: "仕入先・メニュー・注文パターンをAIが自動学習。既存データの取り込みもサポート。",
  },
  {
    icon: Rocket,
    number: "03",
    title: "運用開始",
    description: "翌日からAIが発注提案を開始。使うほど精度が向上し、業務が自動化されていきます。",
  },
];

const faqs = [
  {
    question: "導入にどれくらいの期間がかかりますか？",
    answer: "アカウント登録は30秒、初期設定は最短1日で完了します。既存の注文データがあれば、AIが自動で学習を開始します。専任のサポートチームが導入をお手伝いします。",
  },
  {
    question: "既存のシステムとの連携は可能ですか？",
    answer: "はい。主要なPOSシステム、会計ソフト、在庫管理システムとのAPI連携に対応しています。FAXからの移行も段階的に行えるため、一気に切り替える必要はありません。",
  },
  {
    question: "AIの発注提案はどれくらい正確ですか？",
    answer: "導入初月で約85%、3ヶ月の学習後は95%以上の精度を達成しています。曜日・季節・イベント・天候など多角的なデータを分析し、日々精度が向上します。",
  },
  {
    question: "小規模な飲食店でも使えますか？",
    answer: "もちろんです。1店舗からご利用いただけます。むしろ小規模店舗ほど、発注業務の負担が大きいため、効果を実感していただきやすいです。",
  },
  {
    question: "料金体系を教えてください",
    answer: "現在、早期アクセス登録いただいた方には特別料金でご案内予定です。店舗規模や利用機能に応じた柔軟なプランをご用意しています。詳細はサービス開始時にご案内します。",
  },
];

// --- Hooks ---

function useCountUp(target: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, target, duration]);

  return { count, ref };
}

function useInView(threshold: number = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// --- Components ---

function AnimatedStat({ label, value, suffix, sublabel }: { label: string; value: string; suffix: string; sublabel: string }) {
  const numericValue = parseInt(value, 10);
  const { count, ref } = useCountUp(numericValue, 1500);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl font-bold text-brand-900 mb-1">
        {count}
        <span className="text-2xl sm:text-3xl">{suffix}</span>
      </div>
      <div className="text-sm font-semibold text-gray-700">{label}</div>
      <div className="text-xs text-gray-400 mt-1">{sublabel}</div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-brand-500 shrink-0" />
          <span className="font-semibold text-gray-900 text-sm sm:text-base">{question}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-5 pt-0 text-gray-600 text-sm leading-relaxed pl-14">
          {answer}
        </div>
      </div>
    </div>
  );
}

// --- Page ---

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useInView(0.1);
  const transformRef = useInView(0.1);
  const featuresRef = useInView(0.1);
  const stepsRef = useInView(0.1);
  const voicesRef = useInView(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-400 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-300 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/30 rounded-full blur-3xl" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-brand-400/40 rounded-full animate-float-1" />
          <div className="absolute top-[25%] right-[15%] w-1.5 h-1.5 bg-brand-300/30 rounded-full animate-float-2" />
          <div className="absolute bottom-[30%] left-[20%] w-1 h-1 bg-white/20 rounded-full animate-float-3" />
          <div className="absolute top-[60%] right-[25%] w-2.5 h-2.5 bg-brand-400/20 rounded-full animate-float-1" />
          <div className="absolute top-[40%] left-[60%] w-1.5 h-1.5 bg-brand-300/25 rounded-full animate-float-2" />
        </div>

        <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">発注AI</span>
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#transformation" className="text-brand-300 hover:text-white transition-colors text-sm font-medium">
              変革の全貌
            </a>
            <a href="#steps" className="text-brand-300 hover:text-white transition-colors text-sm font-medium">
              導入ステップ
            </a>
            <a href="#faq" className="text-brand-300 hover:text-white transition-colors text-sm font-medium">
              FAQ
            </a>
            <Link
              href="/feedback"
              className="px-5 py-2.5 border border-brand-400/50 text-brand-200 font-semibold rounded-lg hover:bg-brand-800/50 transition-colors text-sm"
            >
              ご要望
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-white text-brand-900 font-semibold rounded-lg hover:bg-brand-50 transition-colors shadow-lg shadow-white/10"
            >
              デモを見る
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
            <a
              href="#transformation"
              className="block w-full px-4 py-3 text-brand-200 font-medium rounded-lg text-center hover:bg-brand-800/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              変革の全貌
            </a>
            <a
              href="#steps"
              className="block w-full px-4 py-3 text-brand-200 font-medium rounded-lg text-center hover:bg-brand-800/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              導入ステップ
            </a>
            <Link
              href="/dashboard"
              className="block w-full px-4 py-3 bg-white text-brand-900 font-semibold rounded-lg text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              デモを見る
            </Link>
            <Link
              href="/feedback"
              className="block w-full px-4 py-3 border border-brand-400 text-brand-200 font-semibold rounded-lg text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              ご要望・フィードバック
            </Link>
          </div>
        )}

        <div
          ref={heroRef.ref}
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-28 transition-all duration-1000 ${
            heroRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-2 text-brand-300 text-sm font-medium mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-800/50 rounded-full border border-brand-700/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span>早期アクセス受付中</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white max-w-4xl leading-tight mb-6">
            飲食店の仕入れは、まだ
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-100">
              電話・FAX・Excel
            </span>
            ですか？
            <br />
            <span className="relative">
              全部、AIに置き換えました。
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 6" stroke="rgba(142,204,255,0.4)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-brand-200 max-w-2xl mb-10 leading-relaxed">
            発注AIは、毎朝の電話注文、FAXの帳票やり取り、Excelの価格管理を
            AIネイティブに変革。27兆円の食品流通市場を、テクノロジーの力で効率化します。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#early-access"
              className="group px-8 py-4 bg-white text-brand-900 font-bold rounded-xl hover:bg-brand-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10 hover:shadow-white/20"
            >
              早期アクセスに登録する
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/dashboard"
              className="px-8 py-4 border border-brand-400/50 text-brand-200 font-semibold rounded-xl hover:bg-brand-800/50 transition-all text-center backdrop-blur-sm"
            >
              デモを体験する
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="hidden sm:flex justify-center mt-16 animate-bounce">
            <a href="#stats" className="text-brand-400/60 hover:text-brand-300 transition-colors">
              <ArrowDown className="w-6 h-6" />
            </a>
          </div>
        </div>
      </header>

      {/* Industry Stats */}
      <section id="stats" className="py-14 sm:py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <p className="text-center text-gray-500 text-sm font-medium uppercase tracking-wide mb-12">
            課題：27兆円の市場が、いまだに1990年代のツールで動いている
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {stats.map((stat) => (
              <AnimatedStat key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Legacy vs AI Transformation */}
      <section id="transformation" className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div
            ref={transformRef.ref}
            className={`text-center mb-16 transition-all duration-700 ${
              transformRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-600 text-sm font-semibold rounded-full mb-4">
              <Zap className="w-4 h-4" />
              Before → After
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              変革の全貌
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              すべてのレガシープロセスを、AIネイティブな仕組みに置き換え。
              より速く、正確で、24時間稼働。
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {legacyVsAI.map((pair, idx) => (
              <div
                key={idx}
                className="grid md:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-stretch"
              >
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-red-100 relative hover:border-red-200 transition-colors group">
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                    レガシー
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <pair.legacy.icon className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pair.legacy.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {pair.legacy.description}
                  </p>
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    {pair.legacy.pain}
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center shadow-lg shadow-brand-500/30">
                    <ArrowRight className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Mobile arrow */}
                <div className="flex md:hidden items-center justify-center py-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center shadow-md">
                    <ArrowDown className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-100 relative ai-glow hover:border-brand-200 transition-colors group">
                  <div className="absolute top-4 right-4 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full">
                    AIネイティブ
                  </div>
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <pair.ai.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pair.ai.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {pair.ai.description}
                  </p>
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
          <div
            ref={featuresRef.ref}
            className={`text-center mb-16 transition-all duration-700 ${
              featuresRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              最初からAIネイティブで設計
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              既存システムにAIを後付けしたのではなく、
              すべての機能がAIを前提に設計されています。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: ShoppingCart,
                title: "予測型自動発注",
                description:
                  "曜日、季節、イベント、予約状況を加味してAIが最適な発注量を提案。76%の発注が自動化済み。",
                highlight: "76%自動化",
              },
              {
                icon: Shield,
                title: "品質・リスク管理",
                description:
                  "仕入先の納期遵守率をAIスコアリング。価格高騰の早期検知と代替品の自動提案。",
                highlight: "リアルタイム検知",
              },
              {
                icon: Zap,
                title: "業務の自動化",
                description:
                  "帳票の自動処理、注文と納品の突合、請求書の検証。人は判断と関係構築に集中。",
                highlight: "98%の精度",
              },
            ].map((feature, idx) => (
              <div
                key={feature.title}
                className="group bg-gray-50 rounded-2xl p-8 hover:bg-brand-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 px-2.5 py-1 bg-brand-100 text-brand-700 text-xs font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {feature.highlight}
                </div>
                <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-200 transition-colors">
                  <feature.icon className="w-7 h-7 text-brand-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Start - Steps */}
      <section id="steps" className="py-12 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div
            ref={stepsRef.ref}
            className={`text-center mb-16 transition-all duration-700 ${
              stepsRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 text-sm font-semibold rounded-full mb-4">
              <Rocket className="w-4 h-4" />
              かんたん3ステップ
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              導入は驚くほど簡単です
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              複雑な設定は不要。登録から運用開始まで、スムーズにご案内します。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />

            {steps.map((step, idx) => (
              <div key={step.number} className="relative text-center group">
                <div className="relative z-10 w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow border border-gray-100 group-hover:border-brand-200">
                  <step.icon className="w-9 h-9 text-brand-600" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Voices */}
      <section className="py-12 sm:py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div
            ref={voicesRef.ref}
            className={`text-center mb-12 transition-all duration-700 ${
              voicesRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-700 text-sm font-semibold rounded-full mb-4">
              <MessageSquare className="w-4 h-4" />
              現場の声
            </div>
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
                className="bg-white rounded-2xl p-6 border border-gray-100 relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
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
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
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

      {/* FAQ */}
      <section id="faq" className="py-12 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-700 text-sm font-semibold rounded-full mb-4">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              よくある質問
            </h2>
            <p className="text-gray-600">
              導入を検討中の方からよくいただく質問にお答えします
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm mb-3">
              その他のご質問は
            </p>
            <Link
              href="/feedback"
              className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              お問い合わせフォームから
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Early Access CTA */}
      <section id="early-access" className="py-14 sm:py-24 bg-gradient-to-br from-brand-900 via-brand-950 to-brand-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 bg-brand-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-brand-300 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-800/50 text-brand-300 text-sm font-semibold rounded-full border border-brand-700/50 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            早期アクセス受付中
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
            電話・FAX・Excelから
            <br className="sm:hidden" />
            卒業しませんか？
          </h2>
          <p className="text-brand-200 text-base sm:text-lg mb-2 max-w-xl mx-auto">
            サービス開始時に優先的にご案内します。
            早期登録の方には特別料金でのご提供を予定しています。
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
              <p className="text-brand-400 text-sm leading-relaxed">
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
              </ul>
            </div>
            <div>
              <h4 className="text-brand-200 font-semibold text-sm mb-3">サポート</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/feedback" className="text-brand-400 hover:text-white transition-colors">ご要望・フィードバック</Link></li>
                <li><Link href="/documents" className="text-brand-400 hover:text-white transition-colors">帳票処理</Link></li>
                <li><Link href="/suppliers" className="text-brand-400 hover:text-white transition-colors">仕入先管理</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-brand-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-brand-500 text-xs">
              &copy; 2025 発注AI. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-xs">
              <a href="#" className="text-brand-500 hover:text-brand-300 transition-colors">プライバシーポリシー</a>
              <a href="#" className="text-brand-500 hover:text-brand-300 transition-colors">利用規約</a>
              <a href="#" className="text-brand-500 hover:text-brand-300 transition-colors">特商法表記</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
