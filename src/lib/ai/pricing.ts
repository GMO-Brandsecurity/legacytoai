// ============================================================
// 発注AI - AI価格分析 & 在庫最適化エンジン
// 置き換え対象: Excelの価格表管理・手動在庫チェック
// ============================================================

import { Product, ProductCategory } from "../types";

export interface PriceAnalysis {
  productId: string;
  productName: string;
  currentPrice: number;
  marketAverage: number;
  priceRating: "お得" | "適正" | "割高";
  trend: "上昇" | "安定" | "下落";
  recommendation: string;
  alternativeProducts?: { name: string; price: number; saving: number }[];
  seasonalNote?: string;
}

export interface InventoryOptimization {
  productId: string;
  productName: string;
  currentStock: number;
  optimalStock: number;
  action: "発注推奨" | "在庫適正" | "在庫過多";
  urgency: "urgent" | "normal" | "low";
  estimatedWaste: number;
  recommendation: string;
}

const marketAverages: Record<string, number> = {
  "P-001": 110, "P-002": 960, "P-003": 2700, "P-004": 90,
  "P-005": 690, "P-006": 8500, "P-007": 4000, "P-008": 148,
  "P-009": 450, "P-010": 1780, "P-011": 980, "P-012": 100,
};

export function analyzePricing(product: Product): PriceAnalysis {
  const marketAvg = marketAverages[product.id] || product.currentPrice;
  const priceDiff = ((product.currentPrice - marketAvg) / marketAvg) * 100;

  const priceRating: "お得" | "適正" | "割高" =
    priceDiff <= -5 ? "お得" : priceDiff >= 5 ? "割高" : "適正";

  const trend: "上昇" | "安定" | "下落" =
    product.currentPrice > product.previousPrice ? "上昇"
    : product.currentPrice < product.previousPrice ? "下落"
    : "安定";

  let recommendation: string;
  if (priceRating === "割高" && trend === "上昇") {
    recommendation = `市場平均（¥${marketAvg}）より${Math.round(priceDiff)}%高い状態です。代替品への切り替えを検討してください。`;
  } else if (priceRating === "お得" && trend === "下落") {
    recommendation = `市場平均より${Math.round(Math.abs(priceDiff))}%安く、さらに下落傾向です。買い増しの好機です。`;
  } else if (priceRating === "お得") {
    recommendation = `現在の仕入値は市場平均より${Math.round(Math.abs(priceDiff))}%安く、良い条件です。`;
  } else {
    recommendation = "市場平均に近い適正価格です。現状維持で問題ありません。";
  }

  let alternativeProducts: { name: string; price: number; saving: number }[] | undefined;
  if (priceRating === "割高") {
    if (product.category === "seafood" && product.name.includes("サーモン")) {
      alternativeProducts = [
        { name: "北海道産トラウトサーモン", price: 2200, saving: product.currentPrice - 2200 },
        { name: "チリ産アトランティックサーモン", price: 2400, saving: product.currentPrice - 2400 },
      ];
    }
    if (product.category === "vegetables" && product.name.includes("キャベツ")) {
      alternativeProducts = [
        { name: "白菜（代用可）", price: 75, saving: product.currentPrice - 75 },
      ];
    }
  }

  const seasonalNote = product.isSeasonalPeak
    ? "旬の時期です。品質が最も良い時期のため、多少の価格上昇は許容範囲です。"
    : undefined;

  return {
    productId: product.id, productName: product.name,
    currentPrice: product.currentPrice, marketAverage: marketAvg,
    priceRating, trend, recommendation, alternativeProducts, seasonalNote,
  };
}

export function optimizeInventory(product: Product): InventoryOptimization {
  const ratio = product.stockLevel / product.minStockLevel;
  const daysOfSupply = product.aiDemandForecast > 0
    ? Math.floor(product.stockLevel / (product.aiDemandForecast / 7)) : 999;

  let action: "発注推奨" | "在庫適正" | "在庫過多";
  let urgency: "urgent" | "normal" | "low";
  let estimatedWaste = 0;
  let recommendation: string;

  if (ratio < 1) {
    action = "発注推奨";
    urgency = ratio < 0.5 ? "urgent" : "normal";
    recommendation = ratio < 0.5
      ? `在庫が最低レベルの${Math.round(ratio * 100)}%です。緊急発注が必要です。`
      : `在庫が最低レベルに近づいています。次回配送日での発注をお勧めします。`;
  } else if (ratio > 2.5) {
    action = "在庫過多";
    urgency = "low";
    const excessUnits = product.stockLevel - product.minStockLevel * 2;
    estimatedWaste = excessUnits * product.currentPrice * 0.3;
    recommendation = `在庫が過剰です。${daysOfSupply}日分の在庫があります。次回発注を見送ることを推奨します。`;
  } else {
    action = "在庫適正";
    urgency = "low";
    recommendation = `在庫量は適正です。約${daysOfSupply}日分の在庫があります。`;
  }

  const optimalStock = Math.ceil(
    (product.aiDemandForecast / 7) * (product.leadTimeDays + 1) + product.minStockLevel * 0.5
  );

  return {
    productId: product.id, productName: product.name,
    currentStock: product.stockLevel, optimalStock,
    action, urgency, estimatedWaste, recommendation,
  };
}
