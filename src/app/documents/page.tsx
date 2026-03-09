"use client";

import { useState, useRef, useCallback } from "react";
import Header from "@/components/layout/Header";
import {
  FileText,
  Brain,
  ArrowRight,
  Printer,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Zap,
  FileSearch,
  X,
  Link2,
} from "lucide-react";
import { documents as initialDocuments, orders } from "@/lib/data";
import { simulateDocumentProcessing } from "@/lib/ai/documents";
import type { DocumentRecord, DocumentType } from "@/lib/types";
import type { ProcessingResult } from "@/lib/ai/documents";

const typeLabels: Record<string, string> = {
  order_sheet: "注文書",
  delivery_note: "納品書",
  invoice: "請求書",
  receipt: "領収書",
  price_list: "価格表",
};

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  uploaded: { label: "アップロード済", color: "bg-gray-100 text-gray-700", icon: Upload },
  processing: { label: "処理中", color: "bg-brand-100 text-brand-700", icon: Clock },
  extracted: { label: "抽出完了", color: "bg-blue-100 text-blue-700", icon: FileSearch },
  verified: { label: "検証済み", color: "bg-green-100 text-green-700", icon: CheckCircle },
  error: { label: "エラー", color: "bg-red-100 text-red-700", icon: AlertCircle },
};

function guessDocumentType(fileName: string): DocumentType {
  const lower = fileName.toLowerCase();
  if (lower.includes("納品") || lower.includes("delivery")) return "delivery_note";
  if (lower.includes("請求") || lower.includes("invoice")) return "invoice";
  if (lower.includes("注文") || lower.includes("order")) return "order_sheet";
  if (lower.includes("領収") || lower.includes("receipt")) return "receipt";
  if (lower.includes("価格") || lower.includes("price")) return "price_list";
  return "delivery_note";
}

// --- 照合機能 ---
function ReconciliationBadge({ doc }: { doc: DocumentRecord }) {
  if (!doc.orderId) return null;
  const order = orders.find((o) => o.id === doc.orderId);
  if (!order) return null;

  // 簡易照合: ドキュメントの合計と注文の合計を比較
  const extractedTotal = doc.extractedData?.total;
  const orderTotal = `¥${order.totalAmount.toLocaleString()}`;
  const match = extractedTotal === orderTotal;

  return (
    <div className={`mt-2 p-2 rounded-lg flex items-center gap-2 text-xs ${
      match ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
    }`}>
      <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
      <div>
        <span className="font-medium">発注照合: {doc.orderId}</span>
        {match ? (
          <span className="ml-2">金額一致 ({orderTotal})</span>
        ) : (
          <span className="ml-2">要確認 — 書類: {extractedTotal || "不明"} / 注文: {orderTotal}</span>
        )}
      </div>
      {match ? (
        <CheckCircle className="w-3.5 h-3.5 text-green-600 ml-auto flex-shrink-0" />
      ) : (
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 ml-auto flex-shrink-0" />
      )}
    </div>
  );
}

function DocumentCard({ doc }: { doc: DocumentRecord }) {
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [processing, setProcessing] = useState(false);

  const st = statusConfig[doc.status] || statusConfig.uploaded;
  const Icon = st.icon;

  const handleProcess = () => {
    setProcessing(true);
    setTimeout(() => {
      const r = simulateDocumentProcessing(doc);
      setResult(r);
      setProcessing(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{doc.fileName}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-500">{typeLabels[doc.type]}</span>
              {doc.orderId && (
                <span className="text-xs text-brand-600">{doc.orderId}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 ${st.color}`}>
            <Icon className="w-3 h-3" />
            {st.label}
          </span>
          {doc.confidence && (
            <span className="text-xs font-semibold text-brand-600">
              {doc.confidence}%
            </span>
          )}
        </div>
      </div>

      {/* AI Summary */}
      {doc.aiSummary && (
        <div className="mb-3 p-3 bg-brand-50/50 rounded-lg">
          <div className="flex items-center gap-1 mb-1">
            <Brain className="w-3.5 h-3.5 text-brand-500" />
            <span className="text-xs font-semibold text-brand-600">AI要約</span>
          </div>
          <p className="text-xs text-gray-600">{doc.aiSummary}</p>
        </div>
      )}

      {/* Extracted Data */}
      {doc.extractedData && (
        <div className="mb-3">
          <div className="text-xs text-gray-400 mb-1">抽出データ:</div>
          <div className="grid grid-cols-2 gap-1">
            {Object.entries(doc.extractedData).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="text-gray-400">{key}: </span>
                <span className="text-gray-700 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 照合結果 */}
      <ReconciliationBadge doc={doc} />

      {/* Processing result */}
      {result && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center gap-1 mb-1">
            <Zap className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-semibold text-green-700">
              AI処理完了 ({result.processingTimeMs}ms)
            </span>
          </div>
          <p className="text-xs text-gray-600">{result.aiSummary}</p>
          {result.warnings.length > 0 && (
            <div className="mt-1">
              {result.warnings.map((w, i) => (
                <div key={i} className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {w}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 mt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          {doc.processedAt
            ? `処理: ${new Date(doc.processedAt).toLocaleString("ja-JP")}`
            : `アップロード: ${new Date(doc.uploadedAt).toLocaleString("ja-JP")}`}
        </span>
        {!result && doc.status !== "verified" && (
          <button
            onClick={handleProcess}
            disabled={processing}
            className="px-3 py-1.5 bg-brand-600 text-white text-xs font-medium rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-1.5 disabled:opacity-70"
          >
            {processing ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                AI処理中...
              </>
            ) : (
              <>
                <Brain className="w-3.5 h-3.5" />
                AI処理を実行
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const [documentList, setDocumentList] = useState<DocumentRecord[]>([...initialDocuments]);
  const [isDragging, setIsDragging] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList) => {
    Array.from(files).forEach((file) => {
      const now = new Date();
      const docType = guessDocumentType(file.name);
      const newDoc: DocumentRecord = {
        id: `DOC-${String(now.getTime()).slice(-6)}`,
        type: docType,
        fileName: file.name,
        status: "uploaded",
        uploadedAt: now.toISOString(),
      };
      setDocumentList((prev) => [newDoc, ...prev]);
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  }, [handleFiles]);

  const filtered = typeFilter === "all"
    ? documentList
    : documentList.filter((d) => d.type === typeFilter);

  // 照合サマリー
  const reconciled = documentList.filter((d) => d.orderId);
  const matchCount = reconciled.filter((d) => {
    const order = orders.find((o) => o.id === d.orderId);
    return order && d.extractedData?.total === `¥${order.totalAmount.toLocaleString()}`;
  }).length;

  return (
    <div>
      <Header
        title="帳票処理"
        subtitle="FAXの代わりにAIが注文書・納品書・請求書を瞬時に処理"
      />

      <div className="p-8">
        {/* Legacy Comparison */}
        <div className="mb-6 bg-gradient-to-r from-red-50 to-brand-50 rounded-xl p-4 border border-brand-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-red-600">
                <Printer className="w-5 h-5" />
                <div>
                  <div className="text-sm font-semibold">旧: FAX送受信</div>
                  <div className="text-xs text-red-400">手入力15分、紛失リスク</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300" />
              <div className="flex items-center gap-2 text-brand-600">
                <Brain className="w-5 h-5" />
                <div>
                  <div className="text-sm font-semibold">新: AI帳票処理</div>
                  <div className="text-xs text-brand-400">3秒処理、精度98%</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-700">312件</div>
              <div className="text-xs text-gray-500">今月廃止したFAX</div>
            </div>
          </div>
        </div>

        {/* 照合サマリー */}
        {reconciled.length > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{reconciled.length}</div>
              <div className="text-xs text-gray-500">照合済みドキュメント</div>
            </div>
            <div className="bg-white rounded-xl border border-green-100 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{matchCount}</div>
              <div className="text-xs text-gray-500">金額一致</div>
            </div>
            <div className="bg-white rounded-xl border border-amber-100 p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{reconciled.length - matchCount}</div>
              <div className="text-xs text-gray-500">要確認</div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? "border-brand-500 bg-brand-50"
              : "border-brand-200 bg-brand-50/30 hover:bg-brand-50/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx"
            onChange={handleFileInput}
            className="hidden"
          />
          <Upload className={`w-8 h-8 mx-auto mb-3 ${isDragging ? "text-brand-600" : "text-brand-400"}`} />
          <p className="text-sm font-medium text-gray-700 mb-1">
            {isDragging ? "ここにドロップしてアップロード" : "帳票をドラッグ＆ドロップ、またはクリックしてアップロード"}
          </p>
          <p className="text-xs text-gray-400">
            PDF, JPG, PNG, CSV, XLSX対応 — 注文書、納品書、請求書、価格表を自動認識
          </p>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {[
            { key: "all", label: "すべて" },
            { key: "order_sheet", label: "注文書" },
            { key: "delivery_note", label: "納品書" },
            { key: "invoice", label: "請求書" },
            { key: "receipt", label: "領収書" },
            { key: "price_list", label: "価格表" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTypeFilter(t.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                typeFilter === t.key
                  ? "bg-brand-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Document List */}
        <div className="space-y-4">
          {filtered.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-8 h-8 mx-auto mb-2" />
              <p>該当するドキュメントがありません</p>
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-400">
          全 {documentList.length} 件 / 表示中: {filtered.length} 件
        </div>
      </div>
    </div>
  );
}
