"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import OrderConfirmModal from "@/components/orders/OrderConfirmModal";
import NewOrderModal from "@/components/orders/NewOrderModal";
import {
  ShoppingCart,
  Brain,
  ArrowRight,
  CheckCircle,
  Phone,
  Store,
  Package,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  Send,
  Edit3,
  PackageCheck,
} from "lucide-react";
import { orders as initialOrders, products, restaurants } from "@/lib/data";
import { generateDemandForecast } from "@/lib/ai/matching";
import type { Order, DemandForecast } from "@/lib/types";

const statusLabels: Record<string, { label: string; color: string }> = {
  ai_suggested: { label: "AI提案", color: "bg-brand-100 text-brand-700" },
  pending_review: { label: "確認待ち", color: "bg-amber-100 text-amber-700" },
  confirmed: { label: "確定", color: "bg-blue-100 text-blue-700" },
  processing: { label: "出荷準備", color: "bg-indigo-100 text-indigo-700" },
  shipped: { label: "配送中", color: "bg-orange-100 text-orange-700" },
  delivered: { label: "納品済み", color: "bg-green-100 text-green-700" },
  invoiced: { label: "請求済み", color: "bg-purple-100 text-purple-700" },
};

const nextStatus: Record<string, string> = {
  ai_suggested: "pending_review",
  pending_review: "confirmed",
  confirmed: "processing",
  delivered: "invoiced",
};

function OrderCard({
  order,
  onStatusChange,
  onOpenConfirm,
}: {
  order: Order;
  onStatusChange: (id: string, status: string) => void;
  onOpenConfirm: (order: Order) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [forecasts, setForecasts] = useState<DemandForecast[] | null>(null);
  const [generating, setGenerating] = useState(false);

  const st = statusLabels[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };

  const handleShowForecasts = () => {
    setGenerating(true);
    const restaurant = restaurants.find((r) => r.id === order.restaurantId);
    setTimeout(() => {
      if (restaurant) {
        const results = order.items.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            return generateDemandForecast(product, restaurant, order.deliveryDate);
          }
          return null;
        }).filter(Boolean) as DemandForecast[];
        setForecasts(results);
      }
      setGenerating(false);
      setExpanded(true);
    }, 800);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono font-bold text-gray-800">{order.id}</span>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${st.color}`}>
              {st.label}
            </span>
            {order.status === "ai_suggested" && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-brand-50 text-brand-600 flex items-center gap-1">
                <Brain className="w-3 h-3" />
                AI自動提案
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">
              ¥{order.totalAmount.toLocaleString()}
            </div>
            {order.aiSavings && order.aiSavings > 0 && (
              <div className="text-xs text-green-600">
                AI最適化で¥{order.aiSavings.toLocaleString()}節約
              </div>
            )}
          </div>
        </div>

        {/* Restaurant -> Supplier */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-500" />
            <div>
              <div className="text-sm font-medium text-gray-900">{order.restaurantName}</div>
              <div className="text-xs text-gray-400">発注元</div>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-1 px-2">
            <div className="flex-1 h-px bg-gray-300" />
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-green-500" />
            <div>
              <div className="text-sm font-medium text-gray-900">{order.supplierName}</div>
              <div className="text-xs text-gray-400">仕入先</div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left py-2 font-medium">商品</th>
                <th className="text-right py-2 font-medium">数量</th>
                <th className="text-right py-2 font-medium">単価</th>
                <th className="text-right py-2 font-medium">小計</th>
                <th className="text-right py-2 font-medium">AI</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.productId} className="border-b border-gray-50">
                  <td className="py-2 text-gray-900">{item.productName}</td>
                  <td className="py-2 text-right text-gray-600">
                    {item.quantity}{item.unit}
                  </td>
                  <td className="py-2 text-right text-gray-600">
                    ¥{item.unitPrice.toLocaleString()}
                  </td>
                  <td className="py-2 text-right font-medium text-gray-900">
                    ¥{item.subtotal.toLocaleString()}
                  </td>
                  <td className="py-2 text-right">
                    {item.aiSuggested ? (
                      <span className="text-brand-600" title={item.aiReason}>
                        <Brain className="w-4 h-4 inline" />
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Reasons */}
        {order.items.some((i) => i.aiSuggested && i.aiReason) && (
          <div className="mb-4 space-y-1">
            {order.items
              .filter((i) => i.aiSuggested && i.aiReason)
              .map((item) => (
                <div key={item.productId} className="flex items-start gap-2 text-xs text-gray-500">
                  <Brain className="w-3.5 h-3.5 text-brand-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="font-medium text-gray-700">{item.productName}:</span>{" "}
                    {item.aiReason}
                  </span>
                </div>
              ))}
          </div>
        )}

        {order.note && (
          <div className="mb-4 text-xs text-gray-500 bg-amber-50 p-2 rounded-lg">
            {order.note}
          </div>
        )}

        {/* Info + Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            配達予定: {order.deliveryDate}
          </div>
          {order.aiConfidence > 0 && (
            <div className="flex items-center gap-1 text-xs text-brand-600">
              <Brain className="w-3.5 h-3.5" />
              AI信頼度: {order.aiConfidence}%
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {/* Action Buttons per status */}
            {order.status === "ai_suggested" && (
              <>
                <button
                  onClick={() => onOpenConfirm(order)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  承認して発注
                </button>
                <button
                  onClick={() => onOpenConfirm(order)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  修正する
                </button>
              </>
            )}
            {order.status === "pending_review" && (
              <button
                onClick={() => onStatusChange(order.id, "confirmed")}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 transition-colors"
              >
                <CheckCircle className="w-3 h-3" />
                確定する
              </button>
            )}
            {order.status === "confirmed" && (
              <span className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg flex items-center gap-1">
                <Package className="w-3 h-3" />
                出荷準備中...
              </span>
            )}
            {order.status === "delivered" && (
              <button
                onClick={() => onStatusChange(order.id, "invoiced")}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-1 transition-colors"
              >
                <PackageCheck className="w-3 h-3" />
                納品確認
              </button>
            )}

            <button
              onClick={handleShowForecasts}
              disabled={generating}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              {generating ? (
                <>
                  <div className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  AI分析中...
                </>
              ) : expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  閉じる
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  AI需要予測
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Forecast Panel */}
      {expanded && forecasts && (
        <div className="border-t border-gray-100 bg-brand-50/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-brand-600" />
            <h3 className="font-semibold text-gray-900">AI需要予測</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {forecasts.map((f) => (
              <div key={f.productId} className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{f.productName}</h4>
                  <span className="text-xs font-semibold text-brand-600">
                    信頼度 {f.confidence}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2 text-center">
                  <div className="bg-gray-50 rounded p-1.5">
                    <div className="text-sm font-bold text-gray-900">{f.currentStock}</div>
                    <div className="text-[10px] text-gray-400">現在庫</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1.5">
                    <div className="text-sm font-bold text-gray-900">{f.predictedDemand}</div>
                    <div className="text-[10px] text-gray-400">予測需要</div>
                  </div>
                  <div className={`rounded p-1.5 ${f.recommendedOrder > 0 ? "bg-brand-50" : "bg-gray-50"}`}>
                    <div className={`text-sm font-bold ${f.recommendedOrder > 0 ? "text-brand-700" : "text-gray-900"}`}>
                      {f.recommendedOrder}
                    </div>
                    <div className="text-[10px] text-gray-400">推奨発注</div>
                  </div>
                </div>
                {f.daysUntilStockout <= 2 && (
                  <div className="flex items-center gap-1 text-xs text-red-600 mb-1">
                    <AlertCircle className="w-3 h-3" />
                    在庫切れまであと{f.daysUntilStockout}日
                  </div>
                )}
                <ul className="space-y-0.5">
                  {f.factors.map((factor, i) => (
                    <li key={i} className="text-[11px] text-gray-500 flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orderList, setOrderList] = useState<Order[]>([...initialOrders]);
  const [filter, setFilter] = useState<string>("all");
  const [confirmOrder, setConfirmOrder] = useState<Order | null>(null);
  const [showNewOrder, setShowNewOrder] = useState(false);

  const filteredOrders =
    filter === "all" ? orderList : orderList.filter((o) => o.status === filter);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrderList((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o)
    );
  };

  const handleConfirmOrder = (orderId: string, deliveryDate: string, note: string) => {
    setOrderList((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "confirmed" as Order["status"], deliveryDate, note: note || o.note }
          : o
      )
    );
    setConfirmOrder(null);
  };

  const handleNewOrder = (order: Order) => {
    setOrderList((prev) => [order, ...prev]);
    setShowNewOrder(false);
  };

  return (
    <div>
      <Header
        title="発注 & AI提案"
        subtitle="毎朝の電話注文をAI需要予測による自動発注に置き換え"
      />

      <div className="p-8">
        {/* Legacy Comparison Banner */}
        <div className="mb-6 bg-gradient-to-r from-red-50 to-brand-50 rounded-xl p-4 border border-brand-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-red-600">
                <Phone className="w-5 h-5" />
                <div>
                  <div className="text-sm font-semibold">旧: 電話注文</div>
                  <div className="text-xs text-red-400">1件15分、聞き間違い頻発</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300" />
              <div className="flex items-center gap-2 text-brand-600">
                <Brain className="w-5 h-5" />
                <div>
                  <div className="text-sm font-semibold">新: AI自動発注</div>
                  <div className="text-xs text-brand-400">45秒、ワンタップ確定</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-700">95%</div>
              <div className="text-xs text-gray-500">時間削減</div>
            </div>
          </div>
        </div>

        {/* Filters + New Order */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: "all", label: "すべて" },
              { key: "ai_suggested", label: "AI提案" },
              { key: "pending_review", label: "確認待ち" },
              { key: "confirmed", label: "確定" },
              { key: "processing", label: "出荷準備" },
              { key: "shipped", label: "配送中" },
              { key: "delivered", label: "納品済み" },
            ].map((status) => (
              <button
                key={status.key}
                onClick={() => setFilter(status.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filter === status.key
                    ? "bg-brand-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowNewOrder(true)}
            className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新規発注
          </button>
        </div>

        {/* Order Cards */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onOpenConfirm={setConfirmOrder}
            />
          ))}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2" />
              <p>該当する発注がありません</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {confirmOrder && (
        <OrderConfirmModal
          order={confirmOrder}
          onConfirm={handleConfirmOrder}
          onClose={() => setConfirmOrder(null)}
        />
      )}
      {showNewOrder && (
        <NewOrderModal
          onSubmit={handleNewOrder}
          onClose={() => setShowNewOrder(false)}
        />
      )}
    </div>
  );
}
