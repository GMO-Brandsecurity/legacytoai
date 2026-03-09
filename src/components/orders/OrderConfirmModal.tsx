"use client";

import { useState } from "react";
import { X, CheckCircle, Store, Package, Brain, Truck } from "lucide-react";
import type { Order } from "@/lib/types";

interface OrderConfirmModalProps {
  order: Order;
  onConfirm: (orderId: string, deliveryDate: string, note: string) => void;
  onClose: () => void;
}

export default function OrderConfirmModal({ order, onConfirm, onClose }: OrderConfirmModalProps) {
  const [deliveryDate, setDeliveryDate] = useState(order.deliveryDate);
  const [note, setNote] = useState(order.note || "");
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      onConfirm(order.id, deliveryDate, note);
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">発注確認</h2>
            <p className="text-sm text-gray-500 mt-0.5">{order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-medium">{order.restaurantName}</span>
            </div>
            <Truck className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">{order.supplierName}</span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="px-6 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">注文内容</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left py-2 font-medium">商品</th>
                <th className="text-right py-2 font-medium">数量</th>
                <th className="text-right py-2 font-medium">小計</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.productId} className="border-b border-gray-50">
                  <td className="py-2 text-gray-900">
                    {item.productName}
                    {item.aiSuggested && <Brain className="w-3 h-3 text-brand-500 inline ml-1" />}
                  </td>
                  <td className="py-2 text-right text-gray-600">{item.quantity}{item.unit}</td>
                  <td className="py-2 text-right font-medium">¥{item.subtotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200">
                <td colSpan={2} className="py-3 text-sm font-semibold text-gray-700">合計</td>
                <td className="py-3 text-right text-lg font-bold text-gray-900">¥{order.totalAmount.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* AI Savings */}
        {order.aiSavings && order.aiSavings > 0 && (
          <div className="mx-6 mt-3 p-2 bg-green-50 rounded-lg flex items-center gap-2 text-sm text-green-700">
            <Brain className="w-4 h-4" />
            AI最適化で ¥{order.aiSavings.toLocaleString()} 節約見込み
          </div>
        )}

        {/* Delivery Date */}
        <div className="px-6 pt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">配送希望日</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none"
          />
        </div>

        {/* Note */}
        <div className="px-6 pt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">備考</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="配送時の注意事項など..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none resize-none"
          />
        </div>

        {/* Actions */}
        <div className="p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            発注を確定
          </button>
        </div>
      </div>
    </div>
  );
}
