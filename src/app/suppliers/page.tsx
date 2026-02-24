"use client";

import Header from "@/components/layout/Header";
import {
  Star,
  MapPin,
  Phone,
  Printer,
  Clock,
  Brain,
  ArrowRight,
  CheckCircle,
  Truck,
  Calendar,
} from "lucide-react";
import { suppliers } from "@/lib/data";

const categoryLabels: Record<string, string> = {
  vegetables: "野菜", fruits: "果物", meat: "肉類", seafood: "魚介類",
  dairy: "乳製品", dry_goods: "乾物・調味料", frozen: "冷凍食品",
  beverages: "飲料", alcohol: "酒類",
};

function ReliabilityBadge({ score }: { score: number }) {
  const color = score >= 90
    ? "text-green-600 bg-green-50 border-green-200"
    : score >= 75
      ? "text-amber-600 bg-amber-50 border-amber-200"
      : "text-red-600 bg-red-50 border-red-200";
  const label = score >= 90 ? "優良" : score >= 75 ? "良好" : "要確認";

  return (
    <div className={`px-2 py-1 rounded-lg border text-xs font-semibold ${color}`}>
      AI: {label} ({score}/100)
    </div>
  );
}

export default function SuppliersPage() {
  return (
    <div>
      <Header
        title="仕入先"
        subtitle="AIスコアリングによるリアルタイム仕入先管理"
      />

      <div className="p-8">
        {/* Legacy Comparison */}
        <div className="mb-6 bg-gradient-to-r from-red-50 to-brand-50 rounded-xl p-4 border border-brand-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-red-600">
              <Phone className="w-5 h-5" />
              <div>
                <div className="text-sm font-semibold">旧: 名刺・電話帳</div>
                <div className="text-xs text-red-400">紙の台帳で仕入先管理</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300" />
            <div className="flex items-center gap-2 text-brand-600">
              <Brain className="w-5 h-5" />
              <div>
                <div className="text-sm font-semibold">新: AIスマートネットワーク</div>
                <div className="text-xs text-brand-400">信頼度スコア＆リアルタイム評価</div>
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{supplier.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    {supplier.area}
                  </div>
                </div>
                <ReliabilityBadge score={supplier.aiReliabilityScore} />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {supplier.categories.map((cat) => (
                  <span key={cat} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                    {categoryLabels[cat] || cat}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-sm font-bold text-gray-900">{supplier.rating}</span>
                  </div>
                  <div className="text-xs text-gray-400">評価</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-sm font-bold text-gray-900">{supplier.onTimeRate}%</span>
                  </div>
                  <div className="text-xs text-gray-400">定時納品率</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-500" />
                    <span className="text-sm font-bold text-gray-900">
                      ¥{(supplier.minimumOrder / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">最低注文</div>
                </div>
              </div>

              {/* Delivery Days */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>配達可能日:</span>
                </div>
                <div className="flex gap-1.5">
                  {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
                    <span
                      key={day}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        supplier.deliveryDays.includes(day)
                          ? "bg-brand-100 text-brand-700"
                          : "bg-gray-50 text-gray-300"
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {supplier.contactPhone}
                  </span>
                  {supplier.contactFax && (
                    <span className="flex items-center gap-1 text-red-400 line-through">
                      <Printer className="w-3 h-3" />
                      FAX: {supplier.contactFax}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
