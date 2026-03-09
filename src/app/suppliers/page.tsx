"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import SupplierFormModal from "@/components/suppliers/SupplierFormModal";
import {
  Star,
  MapPin,
  Phone,
  Printer,
  Clock,
  Brain,
  ArrowRight,
  CheckCircle,
  Calendar,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { suppliers as initialSuppliers } from "@/lib/data";
import type { Supplier } from "@/lib/types";

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
  const [supplierList, setSupplierList] = useState<Supplier[]>([...initialSuppliers]);
  const [modalSupplier, setModalSupplier] = useState<Supplier | null | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleSave = (saved: Supplier) => {
    setSupplierList((prev) => {
      const idx = prev.findIndex((s) => s.id === saved.id);
      if (idx >= 0) { const updated = [...prev]; updated[idx] = saved; return updated; }
      return [...prev, saved];
    });
    setModalSupplier(undefined);
  };

  const handleDelete = (id: string) => {
    setSupplierList((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  };

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

        {/* Add Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setModalSupplier(null)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新規仕入先を追加
          </button>
        </div>

        {/* Supplier Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {supplierList.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-xl border border-gray-100 p-6 relative group">
              {/* Edit/Delete */}
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setModalSupplier(supplier)}
                  className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg" title="編集">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteConfirm(supplier.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="削除">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

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
                    <span key={day}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        supplier.deliveryDays.includes(day)
                          ? "bg-brand-100 text-brand-700"
                          : "bg-gray-50 text-gray-300"
                      }`}>{day}</span>
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

      {/* Supplier Form Modal */}
      {modalSupplier !== undefined && (
        <SupplierFormModal supplier={modalSupplier} onSave={handleSave} onClose={() => setModalSupplier(undefined)} />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">削除の確認</h3>
            <p className="text-sm text-gray-600 mb-6">この仕入先を削除しますか？</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">キャンセル</button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">削除する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
