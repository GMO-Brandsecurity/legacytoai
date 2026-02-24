// ============================================================
// 発注AI - AI需要予測 & 自動発注エンジン
// 置き換え対象: 毎朝の電話注文（平均15分/店舗 → 45秒）
// ============================================================

import { Product, DemandForecast, Restaurant, OrderItem } from "../types";

const dayOfWeekMultipliers: Record<string, number> = {
  "月": 0.7, "火": 0.85, "水": 0.9, "木": 1.0, "金": 1.4, "土": 1.3, "日": 0.8,
};

const genreConsumptionProfile: Record<string, Record<string, number>> = {
  "居酒屋": { vegetables: 1.2, meat: 1.3, seafood: 1.1, alcohol: 1.8, dairy: 0.5, dry_goods: 1.0, frozen: 1.0, beverages: 1.2, fruits: 0.3 },
  "イタリアン": { vegetables: 1.1, meat: 0.9, seafood: 1.2, alcohol: 1.3, dairy: 1.8, dry_goods: 1.1, frozen: 0.6, beverages: 1.0, fruits: 0.8 },
  "寿司": { vegetables: 0.5, meat: 0.2, seafood: 2.5, alcohol: 1.0, dairy: 0.1, dry_goods: 0.8, frozen: 0.3, beverages: 0.5, fruits: 0.3 },
  "中華": { vegetables: 1.4, meat: 1.6, seafood: 0.8, alcohol: 0.9, dairy: 0.2, dry_goods: 1.3, frozen: 1.2, beverages: 0.8, fruits: 0.2 },
  "カフェ": { vegetables: 0.6, meat: 0.4, seafood: 0.3, alcohol: 0.5, dairy: 1.5, dry_goods: 1.2, frozen: 0.8, beverages: 2.0, fruits: 1.5 },
};

function getSeasonalFactor(month: number, category: string): number {
  const patterns: Record<string, number[]> = {
    vegetables: [0.85, 0.8, 0.9, 1.0, 1.1, 1.15, 1.2, 1.15, 1.1, 1.0, 0.9, 0.85],
    seafood: [1.1, 1.0, 0.9, 0.85, 0.9, 0.95, 0.9, 0.85, 1.0, 1.1, 1.15, 1.3],
    meat: [0.9, 0.9, 0.95, 1.0, 1.0, 0.95, 0.9, 0.9, 1.0, 1.05, 1.1, 1.2],
    alcohol: [1.0, 0.85, 0.9, 0.95, 1.0, 1.0, 1.1, 1.1, 0.95, 1.0, 1.1, 1.5],
    dairy: [0.95, 0.95, 1.0, 1.0, 1.05, 1.1, 1.15, 1.1, 1.0, 1.0, 0.95, 1.0],
  };
  const pattern = patterns[category] || [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  return pattern[month];
}

function getEventMultiplier(dateStr: string): { multiplier: number; event: string | null } {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (month === 12 && day >= 27) return { multiplier: 1.8, event: "年末" };
  if (month === 12 && (day === 24 || day === 25)) return { multiplier: 1.5, event: "クリスマス" };
  if (month === 12 && day >= 5 && day <= 20) return { multiplier: 1.3, event: "忘年会シーズン" };
  if (month === 2 && day === 14) return { multiplier: 1.2, event: "バレンタインデー" };
  if (month === 5 && day >= 3 && day <= 5) return { multiplier: 1.4, event: "ゴールデンウィーク" };
  if (month === 8 && day >= 13 && day <= 16) return { multiplier: 0.6, event: "お盆（閑散期）" };

  return { multiplier: 1.0, event: null };
}

export function generateDemandForecast(
  product: Product,
  restaurant: Restaurant,
  targetDate: string
): DemandForecast {
  const date = new Date(targetDate);
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const dayOfWeek = dayNames[date.getDay()];
  const month = date.getMonth();

  let baseDemand = product.aiDemandForecast;
  const dowMultiplier = dayOfWeekMultipliers[dayOfWeek] || 1.0;
  const genreProfile = genreConsumptionProfile[restaurant.genre] || {};
  const genreMultiplier = genreProfile[product.category] || 1.0;
  const seasonalFactor = getSeasonalFactor(month, product.category);
  const { multiplier: eventMultiplier, event } = getEventMultiplier(targetDate);
  const seatScaling = restaurant.seats / 40;

  const predictedDemand = Math.round(
    baseDemand * dowMultiplier * genreMultiplier * seasonalFactor * eventMultiplier * seatScaling
  );

  const safetyBuffer = Math.ceil(predictedDemand * 0.15);
  const recommendedOrder = Math.max(0, predictedDemand + safetyBuffer - product.stockLevel);
  const dailyUsage = predictedDemand || 1;
  const daysUntilStockout = Math.floor(product.stockLevel / dailyUsage);

  const factors: string[] = [];
  if (dowMultiplier > 1.1) factors.push(`${dayOfWeek}曜日は繁忙（需要×${dowMultiplier}）`);
  if (dowMultiplier < 0.8) factors.push(`${dayOfWeek}曜日は閑散（需要×${dowMultiplier}）`);
  if (genreMultiplier > 1.2) factors.push(`${restaurant.genre}は${product.category}の消費が多い`);
  if (seasonalFactor > 1.05) factors.push("旬の時期で需要増");
  if (seasonalFactor < 0.9) factors.push("季節外れで需要減");
  if (event) factors.push(`${event}の影響（×${eventMultiplier}）`);
  if (product.stockLevel <= product.minStockLevel) factors.push("在庫が最低レベル以下");
  if (product.isSeasonalPeak) factors.push("旬の食材（品質ピーク）");

  const baseConfidence = 75;
  const historyBonus = Math.min(15, restaurant.monthlyOrderVolume / 100000);
  const factorPenalty = factors.length > 4 ? 5 : 0;
  const confidence = Math.min(98, Math.round(baseConfidence + historyBonus - factorPenalty));

  return {
    productId: product.id,
    productName: product.name,
    currentStock: product.stockLevel,
    predictedDemand,
    recommendedOrder,
    confidence,
    factors: factors.length > 0 ? factors : ["過去の注文パターンに基づく標準予測"],
    daysUntilStockout,
  };
}

export function generateAutoOrder(
  restaurant: Restaurant,
  allProducts: Product[],
  targetDate: string,
  supplierProducts: Record<string, string[]>
): { supplierId: string; items: OrderItem[]; totalAmount: number; confidence: number }[] {
  const ordersBySupplier: Record<string, { items: OrderItem[]; totalConfidence: number }> = {};

  for (const product of allProducts) {
    const forecast = generateDemandForecast(product, restaurant, targetDate);
    if (forecast.recommendedOrder <= 0) continue;

    const supplierId = Object.entries(supplierProducts).find(
      ([, productIds]) => productIds.includes(product.id)
    )?.[0];
    if (!supplierId) continue;

    if (!ordersBySupplier[supplierId]) {
      ordersBySupplier[supplierId] = { items: [], totalConfidence: 0 };
    }

    ordersBySupplier[supplierId].items.push({
      productId: product.id,
      productName: product.name,
      quantity: forecast.recommendedOrder,
      unit: product.unit,
      unitPrice: product.currentPrice,
      subtotal: forecast.recommendedOrder * product.currentPrice,
      aiSuggested: true,
      aiReason: forecast.factors[0] || "需要予測に基づく自動提案",
    });
    ordersBySupplier[supplierId].totalConfidence += forecast.confidence;
  }

  return Object.entries(ordersBySupplier).map(([supplierId, data]) => ({
    supplierId,
    items: data.items,
    totalAmount: data.items.reduce((sum, item) => sum + item.subtotal, 0),
    confidence: Math.round(data.totalConfidence / data.items.length),
  }));
}
