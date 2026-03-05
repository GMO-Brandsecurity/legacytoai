"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/types";

const categoryOptions: { value: ProductCategory; label: string }[] = [
  { value: "vegetables", label: "野菜" },
  { value: "fruits", label: "果物" },
  { value: "meat", label: "肉類" },
  { value: "seafood", label: "魚介類" },
  { value: "dairy", label: "乳製品" },
  { value: "dry_goods", label: "乾物・調味料" },
  { value: "frozen", label: "冷凍食品" },
  { value: "beverages", label: "飲料" },
  { value: "alcohol", label: "酒類" },
];

interface ProductFormModalProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}

export default function ProductFormModal({ product, onSave, onClose }: ProductFormModalProps) {
  const isEditing = product !== null;

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("vegetables");
  const [unit, setUnit] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [supplier, setSupplier] = useState("");
  const [origin, setOrigin] = useState("");
  const [stockLevel, setStockLevel] = useState(0);
  const [minStockLevel, setMinStockLevel] = useState(0);
  const [leadTimeDays, setLeadTimeDays] = useState(1);
  const [isSeasonalPeak, setIsSeasonalPeak] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setUnit(product.unit);
      setCurrentPrice(product.currentPrice);
      setSupplier(product.supplier);
      setOrigin(product.origin);
      setStockLevel(product.stockLevel);
      setMinStockLevel(product.minStockLevel);
      setLeadTimeDays(product.leadTimeDays);
      setIsSeasonalPeak(product.isSeasonalPeak);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const saved: Product = {
      id: product?.id || `P-${String(Date.now()).slice(-3)}`,
      name: name.trim(),
      category,
      unit: unit.trim() || "kg",
      currentPrice,
      previousPrice: product?.previousPrice ?? currentPrice,
      supplier: supplier.trim(),
      origin: origin.trim(),
      isSeasonalPeak,
      stockLevel,
      minStockLevel,
      leadTimeDays,
      aiDemandForecast: product?.aiDemandForecast ?? Math.round(stockLevel * 1.2),
    };
    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            {isEditing ? "商品を編集" : "新規商品を追加"}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">商品名 <span className="text-red-500">*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="例: キャベツ"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none bg-white">
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">単位</label>
              <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="kg, 個, パック, 本"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">現在価格（円）</label>
            <input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))} min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">仕入先</label>
              <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="例: 築地青果"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">産地</label>
              <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="例: 群馬県"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">在庫数</label>
              <input type="number" value={stockLevel} onChange={(e) => setStockLevel(Number(e.target.value))} min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最低在庫数</label>
              <input type="number" value={minStockLevel} onChange={(e) => setMinStockLevel(Number(e.target.value))} min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">リードタイム（日）</label>
            <input type="number" value={leadTimeDays} onChange={(e) => setLeadTimeDays(Number(e.target.value))} min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isSeasonalPeak} onChange={(e) => setIsSeasonalPeak(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600" />
            </label>
            <span className="text-sm font-medium text-gray-700">旬の時期</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              キャンセル
            </button>
            <button type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors">
              {isEditing ? "更新する" : "追加する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
