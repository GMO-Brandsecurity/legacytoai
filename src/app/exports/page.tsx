"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Package,
  Store,
  Brain,
  AlertCircle,
} from "lucide-react";
import { orders, suppliers, products } from "@/lib/data";

type ExportFormat = "csv" | "pdf";
type ExportTarget = "orders" | "invoices" | "products" | "suppliers";

interface ExportJob {
  id: string;
  target: ExportTarget;
  format: ExportFormat;
  status: "completed" | "processing";
  fileName: string;
  createdAt: string;
  size: string;
}

const recentExports: ExportJob[] = [
  {
    id: "EXP-001",
    target: "orders",
    format: "csv",
    status: "completed",
    fileName: "注文履歴_202412.csv",
    createdAt: "2024-12-19 10:30",
    size: "24KB",
  },
  {
    id: "EXP-002",
    target: "invoices",
    format: "pdf",
    status: "completed",
    fileName: "請求書_豊洲水産_202412.pdf",
    createdAt: "2024-12-19 09:15",
    size: "156KB",
  },
  {
    id: "EXP-003",
    target: "products",
    format: "csv",
    status: "completed",
    fileName: "商品マスタ_202412.csv",
    createdAt: "2024-12-18 16:00",
    size: "12KB",
  },
  {
    id: "EXP-004",
    target: "suppliers",
    format: "csv",
    status: "completed",
    fileName: "仕入先一覧_202412.csv",
    createdAt: "2024-12-18 14:30",
    size: "8KB",
  },
];

const targetLabels: Record<ExportTarget, { label: string; icon: typeof Package }> = {
  orders: { label: "注文履歴", icon: Package },
  invoices: { label: "請求書", icon: FileText },
  products: { label: "商品マスタ", icon: Package },
  suppliers: { label: "仕入先一覧", icon: Store },
};

function generateCSV(target: ExportTarget): string {
  switch (target) {
    case "orders": {
      const header = "注文ID,店舗名,仕入先,合計金額,ステータス,発注日,納品日,AI信頼度\n";
      const rows = orders
        .map(
          (o) =>
            `${o.id},${o.restaurantName},${o.supplierName},${o.totalAmount},${o.status},${o.orderDate},${o.deliveryDate},${o.aiConfidence}%`
        )
        .join("\n");
      return header + rows;
    }
    case "products": {
      const header = "商品ID,商品名,カテゴリ,単位,現在価格,産地,在庫数,AI需要予測\n";
      const rows = products
        .map(
          (p) =>
            `${p.id},${p.name},${p.category},${p.unit},${p.currentPrice},${p.origin},${p.stockLevel},${p.aiDemandForecast}`
        )
        .join("\n");
      return header + rows;
    }
    case "suppliers": {
      const header = "仕入先ID,名前,エリア,配達日,最低注文額,評価,納期遵守率,AI信頼度スコア\n";
      const rows = suppliers
        .map(
          (s) =>
            `${s.id},${s.name},${s.area},"${s.deliveryDays.join("・")}",${s.minimumOrder},${s.rating},${s.onTimeRate}%,${s.aiReliabilityScore}`
        )
        .join("\n");
      return header + rows;
    }
    case "invoices": {
      const header = "注文ID,店舗名,仕入先,合計金額,ステータス,発注日\n";
      const rows = orders
        .filter((o) => o.status === "delivered" || o.status === "invoiced")
        .map(
          (o) =>
            `${o.id},${o.restaurantName},${o.supplierName},${o.totalAmount},${o.status},${o.orderDate}`
        )
        .join("\n");
      return header + rows;
    }
  }
}

function downloadCSV(target: ExportTarget) {
  const csv = "\uFEFF" + generateCSV(target); // BOM for Excel compatibility
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${targetLabels[target].label}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function generateInvoicePDFContent() {
  // Generate a simple text representation for demo purposes
  const deliveredOrders = orders.filter(
    (o) => o.status === "delivered" || o.status === "invoiced"
  );
  let content = "=== 請求書 ===\n\n";
  content += `発行日: ${new Date().toLocaleDateString("ja-JP")}\n\n`;
  deliveredOrders.forEach((o) => {
    content += `注文番号: ${o.id}\n`;
    content += `店舗: ${o.restaurantName}\n`;
    content += `仕入先: ${o.supplierName}\n`;
    content += `合計: ¥${o.totalAmount.toLocaleString()}\n`;
    content += `---\n`;
  });
  content += `\n合計金額: ¥${deliveredOrders.reduce((a, o) => a + o.totalAmount, 0).toLocaleString()}\n`;
  return content;
}

function downloadPDF() {
  const content = generateInvoicePDFContent();
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `請求書_${new Date().toISOString().slice(0, 10)}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ExportsPage() {
  const [selectedTarget, setSelectedTarget] = useState<ExportTarget>("orders");
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setExportSuccess(false);

    setTimeout(() => {
      if (selectedFormat === "csv") {
        downloadCSV(selectedTarget);
      } else {
        downloadPDF();
      }
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 800);
  };

  return (
    <div>
      <Header
        title="データエクスポート"
        subtitle="注文履歴・請求書・商品マスタをCSV/PDFでダウンロード"
      />

      <div className="p-8">
        {/* Export Builder */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-6">新規エクスポート</h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Target Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                エクスポート対象
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(targetLabels) as [ExportTarget, { label: string; icon: typeof Package }][]).map(
                  ([key, val]) => {
                    const Icon = val.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedTarget(key)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedTarget === key
                            ? "border-brand-500 bg-brand-50"
                            : "border-gray-100 hover:border-gray-200 bg-white"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 mb-2 ${
                            selectedTarget === key
                              ? "text-brand-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            selectedTarget === key
                              ? "text-brand-700"
                              : "text-gray-700"
                          }`}
                        >
                          {val.label}
                        </span>
                        <span className="block text-xs text-gray-400 mt-1">
                          {key === "orders" && `${orders.length}件`}
                          {key === "products" && `${products.length}品目`}
                          {key === "suppliers" && `${suppliers.length}社`}
                          {key === "invoices" &&
                            `${orders.filter((o) => o.status === "delivered" || o.status === "invoiced").length}件`}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Format & Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ファイル形式
              </label>
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setSelectedFormat("csv")}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all ${
                    selectedFormat === "csv"
                      ? "border-brand-500 bg-brand-50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <FileSpreadsheet
                    className={`w-5 h-5 ${
                      selectedFormat === "csv"
                        ? "text-brand-600"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="text-left">
                    <span
                      className={`text-sm font-medium ${
                        selectedFormat === "csv"
                          ? "text-brand-700"
                          : "text-gray-700"
                      }`}
                    >
                      CSV
                    </span>
                    <span className="block text-xs text-gray-400">
                      Excel対応
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedFormat("pdf")}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all ${
                    selectedFormat === "pdf"
                      ? "border-brand-500 bg-brand-50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <FileText
                    className={`w-5 h-5 ${
                      selectedFormat === "pdf"
                        ? "text-brand-600"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="text-left">
                    <span
                      className={`text-sm font-medium ${
                        selectedFormat === "pdf"
                          ? "text-brand-700"
                          : "text-gray-700"
                      }`}
                    >
                      PDF
                    </span>
                    <span className="block text-xs text-gray-400">
                      請求書向け
                    </span>
                  </div>
                </button>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    エクスポートプレビュー
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">
                    {targetLabels[selectedTarget].label}
                  </span>
                  を
                  <span className="font-medium uppercase">
                    {selectedFormat}
                  </span>
                  形式でエクスポート
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {selectedTarget === "orders" &&
                    `${orders.length}件の注文データを含みます`}
                  {selectedTarget === "products" &&
                    `${products.length}品目の商品データを含みます`}
                  {selectedTarget === "suppliers" &&
                    `${suppliers.length}社の仕入先データを含みます`}
                  {selectedTarget === "invoices" &&
                    `${orders.filter((o) => o.status === "delivered" || o.status === "invoiced").length}件の請求データを含みます`}
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    エクスポート中...
                  </>
                ) : exportSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    ダウンロード完了
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    エクスポート実行
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-brand-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-brand-800">
                AIからの提案
              </h4>
              <p className="text-sm text-brand-700 mt-1">
                月末に近づいています。12月の注文履歴CSVと請求書PDFをまとめてエクスポートすることをお勧めします。
                経理処理に必要なデータが揃います。
              </p>
            </div>
          </div>
        </div>

        {/* Recent Exports */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">最近のエクスポート</h3>
            <span className="text-xs text-gray-400">
              直近7日間
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentExports.map((exp) => {
              const TargetIcon = targetLabels[exp.target].icon;
              return (
                <div
                  key={exp.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        exp.format === "csv"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {exp.format === "csv" ? (
                        <FileSpreadsheet className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {exp.fileName}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">
                          {exp.createdAt}
                        </span>
                        <span className="text-xs text-gray-300">|</span>
                        <span className="text-xs text-gray-400">
                          {exp.size}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {exp.status === "completed" ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        完了
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        処理中
                      </span>
                    )}
                    <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
