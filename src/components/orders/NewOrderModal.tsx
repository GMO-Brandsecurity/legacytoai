"use client";

import { useState } from "react";
import { X, Plus, Minus, ShoppingCart, ChevronRight, ChevronLeft } from "lucide-react";
import { suppliers, products } from "@/lib/data";
import type { Supplier, Product, Order, OrderItem } from "@/lib/types";

interface NewOrderModalProps {
  onSubmit: (order: Order) => void;
  onClose: () => void;
}

async function persistOrder(order: Order): Promise<boolean> {
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const categoryLabels: Record<string, string> = {
  vegetables: "野菜", fruits: "果物", meat: "肉類", seafood: "魚介類",
  dairy: "乳製品", dry_goods: "乾物・調味料", frozen: "冷凍食品",
  beverages: "飲料", alcohol: "酒類",
};

interface CartItem {
  product: Product;
  quantity: number;
}

export default function NewOrderModal({ onSubmit, onClose }: NewOrderModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Step 2: products filtered by supplier categories
  const availableProducts = selectedSupplier
    ? products.filter((p) => selectedSupplier.categories.some((c) => c === p.category))
    : [];

  const updateCart = (product: Product, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter((c) => c.product.id !== product.id);
        return prev.map((c) => c.product.id === product.id ? { ...c, quantity: newQty } : c);
      }
      if (delta > 0) return [...prev, { product, quantity: delta }];
      return prev;
    });
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.product.currentPrice * c.quantity, 0);

  const handleSubmit = () => {
    if (!selectedSupplier || cart.length === 0) return;
    setSubmitting(true);
    const now = new Date();
    const orderId = `ORD-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const items: OrderItem[] = cart.map((c) => ({
      productId: c.product.id,
      productName: c.product.name,
      quantity: c.quantity,
      unit: c.product.unit,
      unitPrice: c.product.currentPrice,
      subtotal: c.product.currentPrice * c.quantity,
      aiSuggested: false,
    }));

    const order: Order = {
      id: orderId,
      restaurantId: "R-001",
      restaurantName: "居酒屋 はなまる",
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      items,
      totalAmount: cartTotal,
      status: "pending_review",
      orderDate: now.toISOString().split("T")[0],
      deliveryDate,
      aiConfidence: 0,
      note: note || undefined,
      createdAt: now.toISOString(),
    };

    persistOrder(order).finally(() => {
      onSubmit(order);
      setSubmitting(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">新規発注</h2>
            <div className="flex items-center gap-2 mt-1">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= s ? "bg-brand-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}>{s}</div>
                  <span className={`text-xs ${step >= s ? "text-brand-600" : "text-gray-400"}`}>
                    {s === 1 ? "仕入先" : s === 2 ? "商品選択" : "確認"}
                  </span>
                  {s < 3 && <ChevronRight className="w-3 h-3 text-gray-300" />}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Select Supplier */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">発注先の仕入先を選択してください</p>
              {suppliers.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedSupplier(s); setCart([]); setStep(2); }}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    selectedSupplier?.id === s.id
                      ? "border-brand-300 bg-brand-50"
                      : "border-gray-100 hover:border-brand-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{s.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{s.area}</div>
                    </div>
                    <div className="flex gap-1.5">
                      {s.categories.map((c) => (
                        <span key={c} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                          {categoryLabels[c]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>最低注文: ¥{s.minimumOrder.toLocaleString()}</span>
                    <span>評価: {s.rating}</span>
                    <span>定時率: {s.onTimeRate}%</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Select Products */}
          {step === 2 && selectedSupplier && (
            <div>
              <p className="text-sm text-gray-500 mb-4">{selectedSupplier.name}の商品から選択</p>
              <div className="space-y-2">
                {availableProducts.map((p) => {
                  const inCart = cart.find((c) => c.product.id === p.id);
                  return (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500">
                          ¥{p.currentPrice.toLocaleString()}/{p.unit} ・ {p.origin}
                          {p.stockLevel <= p.minStockLevel && (
                            <span className="text-red-500 ml-2">在庫少</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {inCart ? (
                          <>
                            <button onClick={() => updateCart(p, -1)} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold">{inCart.quantity}</span>
                            <button onClick={() => updateCart(p, 1)} className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-100 hover:bg-brand-200 text-brand-700">
                              <Plus className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <button onClick={() => updateCart(p, 1)} className="px-3 py-1.5 text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors">
                            <Plus className="w-3 h-3 inline mr-1" />追加
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart summary */}
              {cart.length > 0 && (
                <div className="mt-4 p-3 bg-brand-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-brand-700">
                      <ShoppingCart className="w-4 h-4 inline mr-1" />{cart.length}品目
                    </span>
                    <span className="font-bold text-brand-800">¥{cartTotal.toLocaleString()}</span>
                  </div>
                  {cartTotal < selectedSupplier.minimumOrder && (
                    <p className="text-xs text-red-500 mt-1">
                      最低注文金額 ¥{selectedSupplier.minimumOrder.toLocaleString()} に達していません
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">
                  <ChevronLeft className="w-4 h-4" />戻る
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={cart.length === 0}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  確認へ<ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && selectedSupplier && (
            <div>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-900">{selectedSupplier.name}</div>
                <div className="text-xs text-gray-500">{selectedSupplier.area}</div>
              </div>

              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left py-2">商品</th>
                    <th className="text-right py-2">数量</th>
                    <th className="text-right py-2">単価</th>
                    <th className="text-right py-2">小計</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((c) => (
                    <tr key={c.product.id} className="border-b border-gray-50">
                      <td className="py-2">{c.product.name}</td>
                      <td className="py-2 text-right">{c.quantity}{c.product.unit}</td>
                      <td className="py-2 text-right">¥{c.product.currentPrice.toLocaleString()}</td>
                      <td className="py-2 text-right font-medium">¥{(c.product.currentPrice * c.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200">
                    <td colSpan={3} className="py-3 font-semibold">合計</td>
                    <td className="py-3 text-right text-lg font-bold">¥{cartTotal.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">配送希望日</label>
                  <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">備考</label>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="配送時の注意事項..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none resize-none" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex items-center gap-1 px-4 py-2.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">
                  <ChevronLeft className="w-4 h-4" />戻る
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                  発注する
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
