"use client";

import { useState } from "react";
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
  FileCheck,
  FileSearch,
} from "lucide-react";
import { documents } from "@/lib/data";
import { simulateDocumentProcessing } from "@/lib/ai/documents";
import type { DocumentRecord } from "@/lib/types";
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

      {/* Processing result */}
      {result && (
        <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-100">
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

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
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

        {/* Upload Area */}
        <div className="mb-6 border-2 border-dashed border-brand-200 rounded-xl p-8 text-center bg-brand-50/30 hover:bg-brand-50/50 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 text-brand-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            帳票をドラッグ＆ドロップ、またはクリックしてアップロード
          </p>
          <p className="text-xs text-gray-400">
            注文書、納品書、請求書、価格表を自動認識・処理します
          </p>
        </div>

        {/* Document List */}
        <div className="space-y-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      </div>
    </div>
  );
}
