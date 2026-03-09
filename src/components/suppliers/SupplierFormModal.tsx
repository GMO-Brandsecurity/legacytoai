"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Supplier, ProductCategory } from "@/lib/types";

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

const dayOptions = ["月", "火", "水", "木", "金", "土", "日"];

interface SupplierFormModalProps {
  supplier: Supplier | null;
  onSave: (supplier: Supplier) => void;
  onClose: () => void;
}

export default function SupplierFormModal({ supplier, onSave, onClose }: SupplierFormModalProps) {
  const isEditing = supplier !== null;

  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [deliveryDays, setDeliveryDays] = useState<string[]>([]);
  const [minimumOrder, setMinimumOrder] = useState(5000);
  const [contactPhone, setContactPhone] = useState("");
  const [contactFax, setContactFax] = useState("");
  const [rating, setRating] = useState(4.0);
  const [onTimeRate, setOnTimeRate] = useState(95);
  const [aiReliabilityScore, setAiReliabilityScore] = useState(85);

  useEffect(() => {
    if (supplier) {
      setName(supplier.name);
      setArea(supplier.area);
      setCategories([...supplier.categories]);
      setDeliveryDays([...supplier.deliveryDays]);
      setMinimumOrder(supplier.minimumOrder);
      setContactPhone(supplier.contactPhone);
      setContactFax(supplier.contactFax || "");
      setRating(supplier.rating);
      setOnTimeRate(supplier.onTimeRate);
      setAiReliabilityScore(supplier.aiReliabilityScore);
    }
  }, [supplier]);

  const toggleCategory = (cat: ProductCategory) => {
    setCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const toggleDay = (day: string) => {
    setDeliveryDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const saved: Supplier = {
      id: supplier?.id || `S-${String(Date.now()).slice(-3)}`,
      name: name.trim(),
      area: area.trim(),
      categories,
      deliveryDays,
      minimumOrder,
      contactPhone: contactPhone.trim(),
      contactFax: contactFax.trim() || undefined,
      rating,
      onTimeRate,
      aiReliabilityScore,
    };
    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            {isEditing ? "仕入先を編集" : "新規仕入先を追加"}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">仕入先名 <span className="text-red-500">*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="例: 築地青果"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">エリア</label>
            <input type="text" value={area} onChange={(e) => setArea(e.target.value)} placeholder="例: 東京・築地"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">取扱カテゴリ</label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((opt) => (
                <button key={opt.value} type="button" onClick={() => toggleCategory(opt.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    categories.includes(opt.value)
                      ? "bg-brand-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>{opt.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">配達可能日</label>
            <div className="flex gap-2">
              {dayOptions.map((day) => (
                <button key={day} type="button" onClick={() => toggleDay(day)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    deliveryDays.includes(day)
                      ? "bg-brand-600 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}>{day}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最低注文金額（円）</label>
              <input type="number" value={minimumOrder} onChange={(e) => setMinimumOrder(Number(e.target.value))} min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">評価（1-5）</label>
              <input type="number" value={rating} onChange={(e) => setRating(Number(e.target.value))} min={1} max={5} step={0.1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
              <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="03-1234-5678"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FAX番号</label>
              <input type="text" value={contactFax} onChange={(e) => setContactFax(e.target.value)} placeholder="任意"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">定時納品率（%）</label>
              <input type="number" value={onTimeRate} onChange={(e) => setOnTimeRate(Number(e.target.value))} min={0} max={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AI信頼度（0-100）</label>
              <input type="number" value={aiReliabilityScore} onChange={(e) => setAiReliabilityScore(Number(e.target.value))} min={0} max={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">キャンセル</button>
            <button type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700">
              {isEditing ? "更新する" : "追加する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
