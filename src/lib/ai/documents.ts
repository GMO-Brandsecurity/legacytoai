// ============================================================
// 発注AI - AI帳票処理エンジン
// 置き換え対象: FAXでの注文書・納品書・請求書（15分 → 3秒）
// ============================================================

import { DocumentType, DocumentRecord } from "../types";

interface ExtractionTemplate {
  fields: string[];
  validationRules: Record<string, (value: string) => boolean>;
}

const extractionTemplates: Record<DocumentType, ExtractionTemplate> = {
  order_sheet: {
    fields: ["restaurant", "supplier", "order_date", "delivery_date", "items", "total", "note"],
    validationRules: {
      total: (v) => /[¥￥][\d,]+/.test(v),
      order_date: (v) => /\d{4}\/\d{1,2}\/\d{1,2}/.test(v),
    },
  },
  delivery_note: {
    fields: ["supplier", "date", "delivery_no", "items", "total", "receiver"],
    validationRules: {
      total: (v) => /[¥￥][\d,]+/.test(v),
      delivery_no: (v) => /[A-Z]-\d{4}-\d+/.test(v),
    },
  },
  invoice: {
    fields: ["supplier", "period", "total", "items_count", "payment_due", "bank_info"],
    validationRules: {
      total: (v) => /[¥￥][\d,]+/.test(v),
      payment_due: (v) => /\d{4}\/\d{1,2}\/\d{1,2}/.test(v),
    },
  },
  receipt: {
    fields: ["supplier", "date", "amount", "payment_method", "receipt_no"],
    validationRules: {
      amount: (v) => /[¥￥][\d,]+/.test(v),
    },
  },
  price_list: {
    fields: ["supplier", "effective_date", "items_count", "major_changes", "category"],
    validationRules: {
      effective_date: (v) => /\d{4}\/\d{1,2}\/\d{1,2}/.test(v),
    },
  },
};

export interface ProcessingResult {
  documentId: string;
  status: "extracted" | "verified" | "error";
  extractedData: Record<string, string>;
  confidence: number;
  processingTimeMs: number;
  aiSummary: string;
  warnings: string[];
}

export function detectDocumentType(fileName: string): DocumentType {
  const lower = fileName.toLowerCase();
  if (lower.includes("注文") || lower.includes("発注")) return "order_sheet";
  if (lower.includes("納品")) return "delivery_note";
  if (lower.includes("請求")) return "invoice";
  if (lower.includes("領収")) return "receipt";
  if (lower.includes("価格")) return "price_list";
  return "delivery_note";
}

export function simulateDocumentProcessing(doc: DocumentRecord): ProcessingResult {
  const template = extractionTemplates[doc.type];
  const warnings: string[] = [];
  const extractedData: Record<string, string> =
    doc.extractedData || generateMockExtraction(doc.type);

  let validCount = 0;
  const totalRules = Object.keys(template.validationRules).length;
  for (const [field, validator] of Object.entries(template.validationRules)) {
    const value = extractedData[field];
    if (value && validator(value)) {
      validCount++;
    } else if (value) {
      warnings.push(`「${field}」の値「${value}」が形式に合致しません`);
    }
  }

  const fieldsPresent = template.fields.filter((f) => extractedData[f]).length;
  const completeness = fieldsPresent / template.fields.length;
  const validationRate = totalRules > 0 ? validCount / totalRules : 1;
  const confidence = Math.round(completeness * 60 + validationRate * 40);
  const status = confidence >= 90 ? "verified" : "extracted";
  const processingTimeMs = 1500 + Math.floor(Math.random() * 2000);

  return {
    documentId: doc.id,
    status,
    extractedData,
    confidence,
    processingTimeMs,
    aiSummary: doc.aiSummary || generateDocumentSummary(doc.type, extractedData),
    warnings,
  };
}

function generateMockExtraction(type: DocumentType): Record<string, string> {
  const templates: Record<DocumentType, Record<string, string>> = {
    order_sheet: {
      restaurant: "居酒屋 はなまる", supplier: "築地青果",
      order_date: "2024/12/19", delivery_date: "2024/12/20",
      items: "キャベツ20kg, 玉ねぎ15kg", total: "¥3,675",
    },
    delivery_note: {
      supplier: "豊洲水産", date: "2024/12/20", delivery_no: "T-2024-9012",
      items: "本マグロ赤身5kg, サーモン3kg", total: "¥29,400", receiver: "山田太郎",
    },
    invoice: {
      supplier: "日本食肉卸", period: "2024年12月1日〜15日", total: "¥245,800",
      items_count: "31件", payment_due: "2025/01/31", bank_info: "みずほ銀行 品川支店",
    },
    receipt: {
      supplier: "酒のまるや", date: "2024/12/18", amount: "¥25,500",
      payment_method: "銀行振込", receipt_no: "R-2024-00456",
    },
    price_list: {
      supplier: "築地青果", effective_date: "2024/12/20", items_count: "120品目",
      major_changes: "白菜+15%, 大根-8%", category: "野菜・果物",
    },
  };
  return templates[type];
}

function generateDocumentSummary(type: DocumentType, data: Record<string, string>): string {
  switch (type) {
    case "order_sheet":
      return `${data.restaurant || "飲食店"}から${data.supplier || "仕入先"}への注文書。合計${data.total || ""}。`;
    case "delivery_note":
      return `${data.supplier || "仕入先"}からの納品書。合計${data.total || ""}。受領者: ${data.receiver || ""}。`;
    case "invoice":
      return `${data.supplier || "仕入先"}の請求書。合計${data.total || ""}。支払期限: ${data.payment_due || ""}。`;
    case "receipt":
      return `${data.supplier || "仕入先"}からの領収書。金額: ${data.amount || ""}。`;
    case "price_list":
      return `${data.supplier || "仕入先"}の価格表。${data.items_count || ""}。主な変更: ${data.major_changes || ""}。`;
    default:
      return "帳票を正常に処理しました。";
  }
}
