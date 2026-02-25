"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Store,
  Package,
  Zap,
  DollarSign,
} from "lucide-react";
import { orders, suppliers, products, restaurants } from "@/lib/data";

// --- 月次売上推移データ（モック） ---
const monthlyRevenue = [
  { month: "7月", amount: 1850000, orders: 98, savings: 62000 },
  { month: "8月", amount: 2100000, orders: 112, savings: 78000 },
  { month: "9月", amount: 1920000, orders: 105, savings: 72000 },
  { month: "10月", amount: 2350000, orders: 128, savings: 95000 },
  { month: "11月", amount: 2680000, orders: 142, savings: 112000 },
  { month: "12月", amount: 2840000, orders: 156, savings: 128000 },
];

// --- カテゴリ別支出データ ---
const categorySpend = [
  { category: "魚介類", amount: 980000, percent: 34.5, color: "bg-blue-500" },
  { category: "肉類", amount: 620000, percent: 21.8, color: "bg-red-500" },
  { category: "野菜", amount: 450000, percent: 15.8, color: "bg-green-500" },
  { category: "乳製品", amount: 280000, percent: 9.9, color: "bg-yellow-500" },
  { category: "酒類", amount: 250000, percent: 8.8, color: "bg-purple-500" },
  { category: "その他", amount: 260000, percent: 9.2, color: "bg-gray-400" },
];

// --- 仕入先別パフォーマンス ---
const supplierPerformance = suppliers.map((s) => ({
  name: s.name,
  reliability: s.aiReliabilityScore,
  onTime: s.onTimeRate,
  rating: s.rating,
  area: s.area,
  orderCount: Math.floor(Math.random() * 30) + 10,
  totalSpend: Math.floor(Math.random() * 800000) + 200000,
}));

// --- 曜日別発注パターン ---
const weekdayPattern = [
  { day: "月", count: 28, amount: 520000 },
  { day: "火", count: 22, amount: 410000 },
  { day: "水", count: 18, amount: 340000 },
  { day: "木", count: 25, amount: 480000 },
  { day: "金", count: 35, amount: 680000 },
  { day: "土", count: 20, amount: 320000 },
  { day: "日", count: 8, amount: 90000 },
];

type Period = "month" | "quarter" | "year";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("month");

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.amount));
  const maxWeekday = Math.max(...weekdayPattern.map((w) => w.count));
  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1];
  const prevMonth = monthlyRevenue[monthlyRevenue.length - 2];
  const revenueChange =
    ((currentMonth.amount - prevMonth.amount) / prevMonth.amount) * 100;
  const ordersChange =
    ((currentMonth.orders - prevMonth.orders) / prevMonth.orders) * 100;
  const savingsChange =
    ((currentMonth.savings - prevMonth.savings) / prevMonth.savings) * 100;

  return (
    <div>
      <Header
        title="分析レポート"
        subtitle="AIが解析するコスト・発注・仕入先パフォーマンスの全体像"
      />

      <div className="p-8">
        {/* Period Selector */}
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">期間:</span>
          {(["month", "quarter", "year"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                period === p
                  ? "bg-brand-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p === "month" ? "月次" : p === "quarter" ? "四半期" : "年間"}
            </button>
          ))}
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">月間発注額</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-50 text-brand-600">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ¥{(currentMonth.amount / 10000).toFixed(0)}万
            </div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {revenueChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              前月比 {revenueChange >= 0 ? "+" : ""}{revenueChange.toFixed(1)}%
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">発注件数</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {currentMonth.orders}件
            </div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${ordersChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {ordersChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              前月比 {ordersChange >= 0 ? "+" : ""}{ordersChange.toFixed(1)}%
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">AI削減額</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-green-50 text-green-600">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ¥{(currentMonth.savings / 10000).toFixed(1)}万
            </div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${savingsChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {savingsChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              前月比 {savingsChange >= 0 ? "+" : ""}{savingsChange.toFixed(1)}%
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">取引仕入先</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600">
                <Store className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {suppliers.length}社
            </div>
            <div className="text-xs mt-1 text-gray-400">
              平均信頼度 {Math.round(suppliers.reduce((a, s) => a + s.aiReliabilityScore, 0) / suppliers.length)}点
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-brand-600" />
              <h3 className="font-semibold text-gray-900">月次発注額推移</h3>
            </div>
            <div className="space-y-3">
              {monthlyRevenue.map((m) => (
                <div key={m.month} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-8 shrink-0">
                    {m.month}
                  </span>
                  <div className="flex-1 h-8 bg-gray-50 rounded-lg overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-lg transition-all duration-700"
                      style={{
                        width: `${(m.amount / maxRevenue) * 100}%`,
                      }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600">
                      ¥{(m.amount / 10000).toFixed(0)}万
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
              <span>6ヶ月間の推移</span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                成長率 +{((currentMonth.amount / monthlyRevenue[0].amount - 1) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Category Spend Breakdown */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-brand-600" />
              <h3 className="font-semibold text-gray-900">カテゴリ別支出</h3>
            </div>
            {/* Visual pie-like bar */}
            <div className="flex h-6 rounded-full overflow-hidden mb-6">
              {categorySpend.map((c) => (
                <div
                  key={c.category}
                  className={`${c.color} transition-all duration-500`}
                  style={{ width: `${c.percent}%` }}
                  title={`${c.category}: ${c.percent}%`}
                />
              ))}
            </div>
            <div className="space-y-3">
              {categorySpend.map((c) => (
                <div key={c.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${c.color}`} />
                    <span className="text-sm text-gray-700">{c.category}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-900">
                      ¥{(c.amount / 10000).toFixed(1)}万
                    </span>
                    <span className="text-xs text-gray-400 w-12 text-right">
                      {c.percent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Weekday Pattern */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-brand-600" />
              <h3 className="font-semibold text-gray-900">曜日別発注パターン</h3>
            </div>
            <div className="flex items-end gap-3 h-40">
              {weekdayPattern.map((w) => (
                <div key={w.day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    {w.count}件
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${(w.count / maxWeekday) * 100}%`,
                    }}
                  />
                  <span className="text-xs font-medium text-gray-600">
                    {w.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-brand-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-brand-600" />
                <span className="text-xs text-brand-700 font-medium">
                  AI分析: 金曜日の発注量が最も多く、週末の営業に備えた仕入れが集中しています
                </span>
              </div>
            </div>
          </div>

          {/* AI Savings Trend */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">AI削減額推移</h3>
            </div>
            <div className="space-y-3">
              {monthlyRevenue.map((m) => (
                <div key={m.month} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-8 shrink-0">
                    {m.month}
                  </span>
                  <div className="flex-1 h-8 bg-gray-50 rounded-lg overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg transition-all duration-700"
                      style={{
                        width: `${(m.savings / Math.max(...monthlyRevenue.map((r) => r.savings))) * 100}%`,
                      }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600">
                      ¥{(m.savings / 10000).toFixed(1)}万
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">
                  累計削減額: ¥{(monthlyRevenue.reduce((a, m) => a + m.savings, 0) / 10000).toFixed(1)}万
                  （6ヶ月間）
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Performance Table */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Store className="w-5 h-5 text-brand-600" />
            <h3 className="font-semibold text-gray-900">仕入先パフォーマンス比較</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    仕入先
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    エリア
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    AI信頼度
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    納期遵守率
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    評価
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    取引額
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {supplierPerformance
                  .sort((a, b) => b.reliability - a.reliability)
                  .map((s) => (
                    <tr key={s.name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {s.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {s.area}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                s.reliability >= 95
                                  ? "bg-green-500"
                                  : s.reliability >= 90
                                    ? "bg-blue-500"
                                    : "bg-amber-500"
                              }`}
                              style={{ width: `${s.reliability}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {s.reliability}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-sm font-medium ${
                          s.onTime >= 96
                            ? "text-green-600"
                            : s.onTime >= 93
                              ? "text-blue-600"
                              : "text-amber-600"
                        }`}>
                          {s.onTime}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">
                        {s.rating.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        ¥{(s.totalSpend / 10000).toFixed(1)}万
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
