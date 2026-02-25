"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import {
  ShoppingCart,
  TrendingUp,
  Clock,
  Zap,
  FileCheck,
  Brain,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Store,
  Package,
} from "lucide-react";
import {
  dashboardStats as defaultStats,
  aiInsights as defaultInsights,
  orders as defaultOrders,
} from "@/lib/data";
import type { Order } from "@/lib/types";
import Link from "next/link";

function buildStatCards(stats: typeof defaultStats) {
  return [
    {
      label: "今月の発注数",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "brand",
      change: null,
    },
    {
      label: "AI自動発注率",
      value: `${stats.aiAutomationRate}%`,
      icon: Brain,
      color: "purple",
      change: "先月比 +4.2%",
    },
    {
      label: "平均発注時間",
      value: stats.avgOrderTime,
      icon: Clock,
      color: "green",
      change: "電話では15分だった",
    },
    {
      label: "月間発注額",
      value: `¥${(stats.monthlyOrderAmount / 10000).toFixed(0)}万`,
      icon: TrendingUp,
      color: "amber",
      change: null,
    },
    {
      label: "帳票処理数",
      value: stats.documentsProcessed.toLocaleString(),
      icon: FileCheck,
      color: "cyan",
      change: `FAX ${stats.faxesEliminated}件を廃止`,
    },
    {
      label: "今月のコスト削減",
      value: `¥${(stats.costSavingsThisMonth / 10000).toFixed(1)}万`,
      icon: Zap,
      color: "rose",
      change: `電話${stats.phoneCallsReplaced}件を削減`,
    },
  ];
}

const colorMap: Record<string, string> = {
  brand: "bg-brand-50 text-brand-600",
  purple: "bg-purple-50 text-purple-600",
  green: "bg-green-50 text-green-600",
  amber: "bg-amber-50 text-amber-600",
  cyan: "bg-cyan-50 text-cyan-600",
  rose: "bg-rose-50 text-rose-600",
};

const insightIcons: Record<string, typeof Zap> = {
  cost_saving: Lightbulb,
  demand_alert: AlertTriangle,
  quality_warning: AlertTriangle,
  optimization: Zap,
  trend: TrendingUp,
};

const insightColors: Record<string, string> = {
  cost_saving: "bg-green-50 text-green-600",
  demand_alert: "bg-red-50 text-red-600",
  quality_warning: "bg-amber-50 text-amber-600",
  optimization: "bg-brand-50 text-brand-600",
  trend: "bg-purple-50 text-purple-600",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  ai_suggested: { label: "AI提案", color: "bg-brand-100 text-brand-700" },
  pending_review: { label: "確認待ち", color: "bg-amber-100 text-amber-700" },
  confirmed: { label: "確定", color: "bg-blue-100 text-blue-700" },
  processing: { label: "出荷準備", color: "bg-indigo-100 text-indigo-700" },
  shipped: { label: "配送中", color: "bg-orange-100 text-orange-700" },
  delivered: { label: "納品済み", color: "bg-green-100 text-green-700" },
  invoiced: { label: "請求済み", color: "bg-purple-100 text-purple-700" },
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>(defaultOrders);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.orders?.length) setOrders(data.orders);
      })
      .catch(() => {});
  }, []);

  const statCards = buildStatCards(defaultStats);

  return (
    <div>
      <Header
        title="ダッシュボード"
        subtitle="AIが駆動する受発注オペレーションの全体像"
      />

      <div className="p-8">
        {/* AI Impact Banner */}
        <div className="mb-8 bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5" />
                <span className="text-sm font-semibold text-brand-200 uppercase">
                  今日のAI成果
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-1">
                電話0件、FAX0件、Excel更新0回で全発注完了
              </h2>
              <p className="text-brand-200">
                本日の6件の発注すべてをAIが提案・処理。先月比で12.8万円のコスト削減を達成。
              </p>
            </div>
            <div className="hidden md:flex items-center gap-6 text-right">
              <div>
                <div className="text-3xl font-bold">45秒</div>
                <div className="text-xs text-brand-200">
                  平均発注時間
                  <br />
                  <span className="line-through opacity-60">旧: 15分</span>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">3秒</div>
                <div className="text-xs text-brand-200">
                  帳票処理
                  <br />
                  <span className="line-through opacity-60">旧: 15分</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[stat.color]}`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              {stat.change && (
                <div className="text-xs text-gray-400">{stat.change}</div>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">最近の発注</h3>
              <Link
                href="/orders"
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                すべて表示
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {orders.map((order) => {
                const st = statusLabels[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };
                return (
                  <div
                    key={order.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-semibold text-gray-700">
                          {order.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${st.color}`}
                        >
                          {st.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        ¥{order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />
                        {order.restaurantName}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                      <div className="flex items-center gap-1">
                        <Store className="w-3.5 h-3.5" />
                        {order.supplierName}
                      </div>
                    </div>
                    {order.aiConfidence && (
                      <div className="mt-2 flex items-center gap-2">
                        <Brain className="w-3.5 h-3.5 text-brand-500" />
                        <span className="text-xs text-brand-600 font-medium">
                          AI信頼度: {order.aiConfidence}%
                        </span>
                        {order.aiSavings && order.aiSavings > 0 && (
                          <span className="text-xs text-green-600">
                            &bull; ¥{order.aiSavings.toLocaleString()}節約
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-brand-600" />
                <h3 className="font-semibold text-gray-900">AI洞察</h3>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                手動分析を完全に置き換えるリアルタイムインテリジェンス
              </p>
            </div>
            <div className="divide-y divide-gray-50">
              {defaultInsights.map((insight) => {
                const Icon = insightIcons[insight.type] || Zap;
                return (
                  <div key={insight.id} className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${insightColors[insight.type]}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {insight.title}
                          </h4>
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded uppercase ${
                              insight.impact === "high"
                                ? "bg-red-50 text-red-600"
                                : insight.impact === "medium"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {insight.impact === "high" ? "重要" : insight.impact === "medium" ? "中" : "低"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {insight.description}
                        </p>
                        {insight.actionable && insight.suggestedAction && (
                          <button className="mt-2 text-xs text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {insight.suggestedAction}
                          </button>
                        )}
                        {insight.estimatedSaving && (
                          <span className="text-xs text-green-600 ml-2">
                            推定削減: ¥{insight.estimatedSaving.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
