"use client";

import Header from "@/components/layout/Header";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  ArrowRight,
  Table,
  AlertCircle,
  Package,
  Zap,
  Leaf,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { products, priceChanges } from "@/lib/data";
import { analyzePricing, optimizeInventory } from "@/lib/ai/pricing";

const categoryLabels: Record<string, string> = {
  vegetables: "野菜", fruits: "果物", meat: "肉類", seafood: "魚介類",
  dairy: "乳製品", dry_goods: "乾物", frozen: "冷凍", beverages: "飲料", alcohol: "酒類",
};

export default function PricingPage() {
  const analyses = products.map((p) => ({ product: p, analysis: analyzePricing(p), inventory: optimizeInventory(p) }));

  return (
    <div>
      <Header
        title="価格・在庫AI"
        subtitle="Excelの価格表と目視在庫チェックをAIダイナミック管理に置き換え"
      />

      <div className="p-8">
        {/* Legacy Comparison */}
        <div className="mb-6 bg-gradient-to-r from-red-50 to-brand-50 rounded-xl p-4 border border-brand-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-red-600">
                <Table className="w-5 h-5" />
                <div>
                  <div className="text-sm font-semibold">旧: Excel価格表</div>
                  <div className="text-xs text-red-400">週1更新、市場変動に追いつかない</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300" />
              <div className="flex items-center gap-2 text-brand-600">
                <Brain className="w-5 h-5" />
                <div>
                  <div className="text-sm font-semibold">新: AIリアルタイム分析</div>
                  <div className="text-xs text-brand-400">市場追跡、代替品提案、在庫最適化</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Changes Alert */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500" />
            直近の価格変動
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {priceChanges.map((pc) => (
              <div key={pc.productId} className={`rounded-xl p-4 border ${pc.changePercent > 0 ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}`}>
                <div className="text-sm font-medium text-gray-900 mb-1">{pc.productName}</div>
                <div className="flex items-center gap-1 mb-1">
                  {pc.changePercent > 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-red-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-green-500" />
                  )}
                  <span className={`text-lg font-bold ${pc.changePercent > 0 ? "text-red-600" : "text-green-600"}`}>
                    {pc.changePercent > 0 ? "+" : ""}{pc.changePercent}%
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  ¥{pc.oldPrice} → ¥{pc.newPrice}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">{pc.reason}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Analysis Grid */}
        <div className="space-y-3">
          {analyses.map(({ product, analysis, inventory }) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center">
                {/* Product Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-gray-100 text-gray-600">
                      {categoryLabels[product.category]}
                    </span>
                    {product.isSeasonalPeak && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-green-100 text-green-700 flex items-center gap-0.5">
                        <Leaf className="w-2.5 h-2.5" />旬
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {product.origin} / {product.supplier} / {product.unit}
                  </div>
                </div>

                {/* Price Analysis */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-gray-900">¥{product.currentPrice.toLocaleString()}</span>
                    <span className={`text-xs font-medium ${analysis.trend === "上昇" ? "text-red-500" : analysis.trend === "下落" ? "text-green-500" : "text-gray-400"}`}>
                      {analysis.trend === "上昇" && <TrendingUp className="w-3 h-3 inline" />}
                      {analysis.trend === "下落" && <TrendingDown className="w-3 h-3 inline" />}
                      {analysis.trend === "安定" && <Minus className="w-3 h-3 inline" />}
                      {" "}{analysis.trend}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className={`font-medium ${
                      analysis.priceRating === "お得" ? "text-green-600" :
                      analysis.priceRating === "割高" ? "text-red-600" : "text-gray-600"
                    }`}>
                      {analysis.priceRating}
                    </span>
                    <span className="text-gray-400"> (市場平均 ¥{analysis.marketAverage})</span>
                  </div>
                </div>

                {/* Inventory */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      在庫: {product.stockLevel}{product.unit}
                    </span>
                    <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                      inventory.action === "発注推奨" ? "bg-red-100 text-red-700" :
                      inventory.action === "在庫過多" ? "bg-amber-100 text-amber-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {inventory.action}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        inventory.action === "発注推奨" ? "bg-red-500" :
                        inventory.action === "在庫過多" ? "bg-amber-500" :
                        "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(100, (product.stockLevel / (product.minStockLevel * 2)) * 100)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    最低: {product.minStockLevel} / 最適: {inventory.optimalStock}
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="md:w-56">
                  <div className="text-xs text-gray-500 bg-brand-50/50 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Brain className="w-3 h-3 text-brand-500" />
                      <span className="font-semibold text-brand-600">AI提案</span>
                    </div>
                    {analysis.recommendation.length > 60
                      ? analysis.recommendation.substring(0, 60) + "..."
                      : analysis.recommendation}
                    {analysis.alternativeProducts && analysis.alternativeProducts.length > 0 && (
                      <div className="mt-1 text-[10px] text-green-600">
                        代替品: {analysis.alternativeProducts[0].name}（¥{analysis.alternativeProducts[0].saving}節約）
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
