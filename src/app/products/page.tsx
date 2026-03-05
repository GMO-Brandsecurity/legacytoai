"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import ProductFormModal from "@/components/products/ProductFormModal";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Brain,
  Clock,
  Sun,
  FileSpreadsheet,
  Package,
} from "lucide-react";
import { products as initialProducts } from "@/lib/data";
import type { Product, ProductCategory } from "@/lib/types";

const categoryLabels: Record<ProductCategory, string> = {
  vegetables: "野菜", fruits: "果物", meat: "肉類", seafood: "魚介類",
  dairy: "乳製品", dry_goods: "乾物・調味料", frozen: "冷凍食品",
  beverages: "飲料", alcohol: "酒類",
};

const categoryColors: Record<ProductCategory, string> = {
  vegetables: "bg-green-100 text-green-700",
  fruits: "bg-orange-100 text-orange-700",
  meat: "bg-red-100 text-red-700",
  seafood: "bg-blue-100 text-blue-700",
  dairy: "bg-yellow-100 text-yellow-700",
  dry_goods: "bg-amber-100 text-amber-700",
  frozen: "bg-cyan-100 text-cyan-700",
  beverages: "bg-teal-100 text-teal-700",
  alcohol: "bg-purple-100 text-purple-700",
};

function PriceChangeIndicator({ current, previous }: { current: number; previous: number }) {
  if (current === previous) {
    return <span className="flex items-center gap-0.5 text-xs text-gray-400"><Minus className="w-3 h-3" />0%</span>;
  }
  const pct = ((current - previous) / previous * 100).toFixed(1);
  if (current > previous) {
    return <span className="flex items-center gap-0.5 text-xs text-red-600"><TrendingUp className="w-3 h-3" />+{pct}%</span>;
  }
  return <span className="flex items-center gap-0.5 text-xs text-green-600"><TrendingDown className="w-3 h-3" />{pct}%</span>;
}

function StockIndicator({ stock, min }: { stock: number; min: number }) {
  const ratio = min > 0 ? stock / min : 1;
  const isLow = stock < min;
  const barColor = ratio < 0.5 ? "bg-red-500" : isLow ? "bg-amber-500" : "bg-green-500";
  const barWidth = Math.min(ratio * 100, 100);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-[60px]">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`text-sm font-medium ${isLow ? "text-red-700" : "text-gray-900"}`}>{stock}</span>
          <span className="text-[10px] text-gray-400">/ {min}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${barWidth}%` }} />
        </div>
      </div>
      {isLow && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
    </div>
  );
}

export default function ProductsPage() {
  const [productList, setProductList] = useState<Product[]>([...initialProducts]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalProduct, setModalProduct] = useState<Product | null | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = productList.filter((p) => {
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchSearch = searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.origin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const categoryTabs = [
    { key: "all", label: "すべて" },
    ...Object.entries(categoryLabels).map(([key, label]) => ({ key, label })),
  ];

  const handleSave = (saved: Product) => {
    setProductList((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) { const updated = [...prev]; updated[idx] = saved; return updated; }
      return [...prev, saved];
    });
    setModalProduct(undefined);
  };

  const handleDelete = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div>
      <Header title="商品マスタ" subtitle="商品情報の一覧管理・AI需要予測との連携" />

      <div className="p-8">
        {/* Legacy Comparison Banner */}
        <div className="mb-6 bg-gradient-to-r from-red-50 to-brand-50 rounded-xl p-4 border border-brand-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-red-600">
                <FileSpreadsheet className="w-5 h-5" />
                <div>
                  <div className="text-sm font-semibold">旧: Excel管理</div>
                  <div className="text-xs text-red-400">手動更新、在庫ズレ頻発</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300" />
              <div className="flex items-center gap-2 text-brand-600">
                <Brain className="w-5 h-5" />
                <div>
                  <div className="text-sm font-semibold">新: AIリアルタイム在庫</div>
                  <div className="text-xs text-brand-400">自動追跡、需要予測連動</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-700">98%</div>
              <div className="text-xs text-gray-500">在庫精度</div>
            </div>
          </div>
        </div>

        {/* Search + Add */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="商品名・仕入先・産地で検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none transition-colors" />
          </div>
          <button onClick={() => setModalProduct(null)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
            <Plus className="w-4 h-4" />新規商品を追加
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {categoryTabs.map((tab) => (
            <button key={tab.key} onClick={() => setCategoryFilter(tab.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                categoryFilter === tab.key ? "bg-brand-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}>{tab.label}</button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="text-left px-4 py-3 font-medium">商品</th>
                  <th className="text-left px-4 py-3 font-medium">カテゴリ</th>
                  <th className="text-left px-4 py-3 font-medium">産地・仕入先</th>
                  <th className="text-right px-4 py-3 font-medium">単価</th>
                  <th className="text-center px-4 py-3 font-medium">変動</th>
                  <th className="text-left px-4 py-3 font-medium">在庫</th>
                  <th className="text-center px-4 py-3 font-medium">AI予測</th>
                  <th className="text-center px-4 py-3 font-medium">LT</th>
                  <th className="text-center px-4 py-3 font-medium">旬</th>
                  <th className="text-right px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-400">{product.id} / {product.unit}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${categoryColors[product.category]}`}>
                        {categoryLabels[product.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{product.origin}</div>
                      <div className="text-xs text-gray-400">{product.supplier}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-medium text-gray-900">¥{product.currentPrice.toLocaleString()}</div>
                      {product.currentPrice !== product.previousPrice && (
                        <div className="text-xs text-gray-400 line-through">¥{product.previousPrice.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <PriceChangeIndicator current={product.currentPrice} previous={product.previousPrice} />
                    </td>
                    <td className="px-4 py-3">
                      <StockIndicator stock={product.stockLevel} min={product.minStockLevel} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Brain className="w-3.5 h-3.5 text-brand-500" />
                        <span className="text-sm font-medium text-brand-700">{product.aiDemandForecast}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" /><span className="text-xs">{product.leadTimeDays}日</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {product.isSeasonalPeak ? (
                        <span className="inline-flex items-center gap-0.5 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                          <Sun className="w-3 h-3" />旬
                        </span>
                      ) : <span className="text-xs text-gray-300">-</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setModalProduct(product)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="編集">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="削除">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-8 h-8 mx-auto mb-2" /><p>該当する商品がありません</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-6 text-xs text-gray-400">
          <span>全 {productList.length} 件</span>
          <span>表示中: {filtered.length} 件</span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            在庫不足: {productList.filter((p) => p.stockLevel < p.minStockLevel).length} 件
          </span>
        </div>
      </div>

      {modalProduct !== undefined && (
        <ProductFormModal product={modalProduct} onSave={handleSave} onClose={() => setModalProduct(undefined)} />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">削除の確認</h3>
            <p className="text-sm text-gray-600 mb-6">この商品を削除しますか？</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">キャンセル</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">削除する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
