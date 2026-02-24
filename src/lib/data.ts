// ============================================================
// 発注AI (HacchuAI) - モックデータ層
// 日本の飲食店向け食品卸のリアルなデータ
// ============================================================

import {
  Product,
  Order,
  DocumentRecord,
  Restaurant,
  Supplier,
  AIInsight,
  DashboardStats,
  PriceChange,
} from "./types";

export const products: Product[] = [
  {
    id: "P-001", name: "キャベツ", category: "vegetables", unit: "kg",
    currentPrice: 120, previousPrice: 98, supplier: "築地青果",
    origin: "群馬県", isSeasonalPeak: false, stockLevel: 15, minStockLevel: 20,
    leadTimeDays: 1, aiDemandForecast: 30,
  },
  {
    id: "P-002", name: "豚バラ肉", category: "meat", unit: "kg",
    currentPrice: 980, previousPrice: 950, supplier: "日本食肉卸",
    origin: "鹿児島県", isSeasonalPeak: false, stockLevel: 8, minStockLevel: 5,
    leadTimeDays: 1, aiDemandForecast: 12,
  },
  {
    id: "P-003", name: "サーモン（ノルウェー産）", category: "seafood", unit: "kg",
    currentPrice: 2800, previousPrice: 2600, supplier: "豊洲水産",
    origin: "ノルウェー", isSeasonalPeak: false, stockLevel: 3, minStockLevel: 5,
    leadTimeDays: 2, aiDemandForecast: 8,
  },
  {
    id: "P-004", name: "玉ねぎ", category: "vegetables", unit: "kg",
    currentPrice: 85, previousPrice: 80, supplier: "築地青果",
    origin: "北海道", isSeasonalPeak: true, stockLevel: 25, minStockLevel: 15,
    leadTimeDays: 1, aiDemandForecast: 20,
  },
  {
    id: "P-005", name: "鶏もも肉", category: "meat", unit: "kg",
    currentPrice: 680, previousPrice: 700, supplier: "日本食肉卸",
    origin: "宮崎県", isSeasonalPeak: false, stockLevel: 12, minStockLevel: 10,
    leadTimeDays: 1, aiDemandForecast: 15,
  },
  {
    id: "P-006", name: "アサヒスーパードライ 生樽20L", category: "alcohol", unit: "本",
    currentPrice: 8500, previousPrice: 8500, supplier: "酒のまるや",
    origin: "日本", isSeasonalPeak: false, stockLevel: 2, minStockLevel: 3,
    leadTimeDays: 2, aiDemandForecast: 4,
  },
  {
    id: "P-007", name: "本マグロ 赤身", category: "seafood", unit: "kg",
    currentPrice: 4200, previousPrice: 3800, supplier: "豊洲水産",
    origin: "青森県大間", isSeasonalPeak: true, stockLevel: 2, minStockLevel: 3,
    leadTimeDays: 1, aiDemandForecast: 5,
  },
  {
    id: "P-008", name: "しめじ", category: "vegetables", unit: "パック",
    currentPrice: 150, previousPrice: 145, supplier: "築地青果",
    origin: "長野県", isSeasonalPeak: false, stockLevel: 10, minStockLevel: 8,
    leadTimeDays: 1, aiDemandForecast: 12,
  },
  {
    id: "P-009", name: "特選醤油 1L", category: "dry_goods", unit: "本",
    currentPrice: 450, previousPrice: 450, supplier: "調味料の大黒",
    origin: "千葉県", isSeasonalPeak: false, stockLevel: 6, minStockLevel: 4,
    leadTimeDays: 3, aiDemandForecast: 3,
  },
  {
    id: "P-010", name: "モッツァレラチーズ", category: "dairy", unit: "kg",
    currentPrice: 1800, previousPrice: 1750, supplier: "チーズ工房ナカザワ",
    origin: "北海道", isSeasonalPeak: false, stockLevel: 4, minStockLevel: 5,
    leadTimeDays: 2, aiDemandForecast: 7,
  },
  {
    id: "P-011", name: "冷凍エビフライ 10尾", category: "frozen", unit: "パック",
    currentPrice: 980, previousPrice: 980, supplier: "冷凍食品マルハ",
    origin: "ベトナム", isSeasonalPeak: false, stockLevel: 8, minStockLevel: 5,
    leadTimeDays: 3, aiDemandForecast: 6,
  },
  {
    id: "P-012", name: "にんじん", category: "vegetables", unit: "kg",
    currentPrice: 95, previousPrice: 110, supplier: "築地青果",
    origin: "千葉県", isSeasonalPeak: true, stockLevel: 18, minStockLevel: 10,
    leadTimeDays: 1, aiDemandForecast: 15,
  },
];

export const restaurants: Restaurant[] = [
  {
    id: "R-001", name: "居酒屋 はなまる", genre: "居酒屋",
    area: "東京・渋谷", seats: 45,
    monthlyOrderVolume: 850000, primarySuppliers: ["S-001", "S-002", "S-004"],
    aiAutomationRate: 82, joinedAt: "2024-04-01",
  },
  {
    id: "R-002", name: "トラットリア ベラ", genre: "イタリアン",
    area: "東京・恵比寿", seats: 30,
    monthlyOrderVolume: 620000, primarySuppliers: ["S-001", "S-003", "S-005"],
    aiAutomationRate: 75, joinedAt: "2024-05-15",
  },
  {
    id: "R-003", name: "鮨処 大和", genre: "寿司",
    area: "東京・銀座", seats: 12,
    monthlyOrderVolume: 1200000, primarySuppliers: ["S-002", "S-001"],
    aiAutomationRate: 45, joinedAt: "2024-08-01",
  },
  {
    id: "R-004", name: "中華料理 龍華", genre: "中華",
    area: "東京・池袋", seats: 60,
    monthlyOrderVolume: 950000, primarySuppliers: ["S-001", "S-002", "S-004"],
    aiAutomationRate: 88, joinedAt: "2024-03-01",
  },
  {
    id: "R-005", name: "カフェ モンブラン", genre: "カフェ",
    area: "東京・自由が丘", seats: 25,
    monthlyOrderVolume: 320000, primarySuppliers: ["S-003", "S-005"],
    aiAutomationRate: 91, joinedAt: "2024-06-01",
  },
];

export const suppliers: Supplier[] = [
  {
    id: "S-001", name: "築地青果", categories: ["vegetables", "fruits"],
    area: "東京・築地", deliveryDays: ["月", "火", "水", "木", "金", "土"],
    minimumOrder: 5000, rating: 4.8, onTimeRate: 97,
    contactPhone: "03-1234-5678", contactFax: "03-1234-5679",
    aiReliabilityScore: 96,
  },
  {
    id: "S-002", name: "豊洲水産", categories: ["seafood"],
    area: "東京・豊洲", deliveryDays: ["月", "火", "水", "木", "金", "土"],
    minimumOrder: 10000, rating: 4.9, onTimeRate: 98,
    contactPhone: "03-2345-6789", contactFax: "03-2345-6790",
    aiReliabilityScore: 98,
  },
  {
    id: "S-003", name: "チーズ工房ナカザワ", categories: ["dairy"],
    area: "北海道・帯広", deliveryDays: ["火", "金"],
    minimumOrder: 8000, rating: 4.7, onTimeRate: 94,
    contactPhone: "0155-12-3456", contactFax: "0155-12-3457",
    aiReliabilityScore: 90,
  },
  {
    id: "S-004", name: "日本食肉卸", categories: ["meat"],
    area: "東京・品川", deliveryDays: ["月", "水", "金"],
    minimumOrder: 15000, rating: 4.6, onTimeRate: 95,
    contactPhone: "03-3456-7890", contactFax: "03-3456-7891",
    aiReliabilityScore: 92,
  },
  {
    id: "S-005", name: "酒のまるや", categories: ["beverages", "alcohol"],
    area: "東京・新宿", deliveryDays: ["火", "木", "土"],
    minimumOrder: 20000, rating: 4.5, onTimeRate: 92,
    contactPhone: "03-4567-8901",
    aiReliabilityScore: 88,
  },
  {
    id: "S-006", name: "調味料の大黒", categories: ["dry_goods"],
    area: "千葉・船橋", deliveryDays: ["月", "木"],
    minimumOrder: 3000, rating: 4.4, onTimeRate: 90,
    contactPhone: "047-123-4567", contactFax: "047-123-4568",
    aiReliabilityScore: 85,
  },
];

export const orders: Order[] = [
  {
    id: "ORD-2024-1201",
    restaurantId: "R-001", restaurantName: "居酒屋 はなまる",
    supplierId: "S-001", supplierName: "築地青果",
    items: [
      { productId: "P-001", productName: "キャベツ", quantity: 20, unit: "kg", unitPrice: 120, subtotal: 2400, aiSuggested: true, aiReason: "金曜の宴会予約が通常比+40%。キャベツ消費量の増加を予測" },
      { productId: "P-004", productName: "玉ねぎ", quantity: 15, unit: "kg", unitPrice: 85, subtotal: 1275, aiSuggested: true, aiReason: "在庫が最低レベルに近づいています" },
      { productId: "P-012", productName: "にんじん", quantity: 10, unit: "kg", unitPrice: 95, subtotal: 950, aiSuggested: false },
    ],
    totalAmount: 4625,
    status: "ai_suggested",
    orderDate: "2024-12-19",
    deliveryDate: "2024-12-20",
    aiConfidence: 92,
    aiSavings: 380,
    note: "金曜夜の宴会需要を考慮したAI提案",
    createdAt: "2024-12-19T05:00:00Z",
  },
  {
    id: "ORD-2024-1202",
    restaurantId: "R-003", restaurantName: "鮨処 大和",
    supplierId: "S-002", supplierName: "豊洲水産",
    items: [
      { productId: "P-007", productName: "本マグロ 赤身", quantity: 5, unit: "kg", unitPrice: 4200, subtotal: 21000, aiSuggested: true, aiReason: "週末の予約状況と過去の消費パターンから算出" },
      { productId: "P-003", productName: "サーモン（ノルウェー産）", quantity: 3, unit: "kg", unitPrice: 2800, subtotal: 8400, aiSuggested: true, aiReason: "在庫が最低レベルを下回っています。緊急補充推奨" },
    ],
    totalAmount: 29400,
    status: "confirmed",
    orderDate: "2024-12-19",
    deliveryDate: "2024-12-20",
    aiConfidence: 88,
    aiSavings: 1200,
    createdAt: "2024-12-19T04:30:00Z",
  },
  {
    id: "ORD-2024-1203",
    restaurantId: "R-002", restaurantName: "トラットリア ベラ",
    supplierId: "S-003", supplierName: "チーズ工房ナカザワ",
    items: [
      { productId: "P-010", productName: "モッツァレラチーズ", quantity: 5, unit: "kg", unitPrice: 1800, subtotal: 9000, aiSuggested: true, aiReason: "クリスマスメニューの仕込み需要を予測" },
    ],
    totalAmount: 9000,
    status: "processing",
    orderDate: "2024-12-18",
    deliveryDate: "2024-12-20",
    aiConfidence: 95,
    aiSavings: 450,
    note: "クリスマスディナー用。品質最優先でお願いします。",
    createdAt: "2024-12-18T06:00:00Z",
  },
  {
    id: "ORD-2024-1204",
    restaurantId: "R-004", restaurantName: "中華料理 龍華",
    supplierId: "S-004", supplierName: "日本食肉卸",
    items: [
      { productId: "P-002", productName: "豚バラ肉", quantity: 15, unit: "kg", unitPrice: 980, subtotal: 14700, aiSuggested: true, aiReason: "角煮フェア開催中。通常の1.5倍の消費を予測" },
      { productId: "P-005", productName: "鶏もも肉", quantity: 10, unit: "kg", unitPrice: 680, subtotal: 6800, aiSuggested: false },
    ],
    totalAmount: 21500,
    status: "delivered",
    orderDate: "2024-12-17",
    deliveryDate: "2024-12-18",
    aiConfidence: 90,
    createdAt: "2024-12-17T05:00:00Z",
  },
  {
    id: "ORD-2024-1205",
    restaurantId: "R-005", restaurantName: "カフェ モンブラン",
    supplierId: "S-005", supplierName: "酒のまるや",
    items: [
      { productId: "P-006", productName: "アサヒスーパードライ 生樽20L", quantity: 3, unit: "本", unitPrice: 8500, subtotal: 25500, aiSuggested: true, aiReason: "年末需要のピークに備えた在庫積み増し" },
    ],
    totalAmount: 25500,
    status: "shipped",
    orderDate: "2024-12-18",
    deliveryDate: "2024-12-19",
    aiConfidence: 85,
    aiSavings: 0,
    createdAt: "2024-12-18T07:00:00Z",
  },
  {
    id: "ORD-2024-1206",
    restaurantId: "R-001", restaurantName: "居酒屋 はなまる",
    supplierId: "S-002", supplierName: "豊洲水産",
    items: [
      { productId: "P-003", productName: "サーモン（ノルウェー産）", quantity: 4, unit: "kg", unitPrice: 2800, subtotal: 11200, aiSuggested: true, aiReason: "サーモン刺身の注文が先週比30%増。在庫補充推奨" },
    ],
    totalAmount: 11200,
    status: "pending_review",
    orderDate: "2024-12-19",
    deliveryDate: "2024-12-20",
    aiConfidence: 78,
    aiSavings: 200,
    createdAt: "2024-12-19T05:30:00Z",
  },
];

export const documents: DocumentRecord[] = [
  {
    id: "DOC-001", type: "delivery_note", fileName: "納品書_築地青果_20241218.pdf",
    status: "verified", orderId: "ORD-2024-1201",
    uploadedAt: "2024-12-18T10:00:00Z", processedAt: "2024-12-18T10:00:03Z",
    extractedData: {
      supplier: "築地青果", date: "2024/12/18", items: "キャベツ20kg, 玉ねぎ15kg, にんじん10kg",
      total: "¥4,625", delivery_no: "T-2024-8834",
    },
    confidence: 98,
    aiSummary: "築地青果からの野菜3品目の納品書。合計¥4,625。注文ORD-2024-1201と一致確認済み。",
  },
  {
    id: "DOC-002", type: "invoice", fileName: "請求書_豊洲水産_202412.pdf",
    status: "extracted", orderId: undefined,
    uploadedAt: "2024-12-19T09:00:00Z", processedAt: "2024-12-19T09:00:05Z",
    extractedData: {
      supplier: "豊洲水産", period: "2024年12月1日〜15日", total: "¥187,400",
      items_count: "23件", payment_due: "2025/01/31",
    },
    confidence: 95,
    aiSummary: "豊洲水産の12月前半の請求書。23件の取引で合計¥187,400。支払期限: 1/31。",
  },
  {
    id: "DOC-003", type: "price_list", fileName: "価格表_日本食肉卸_202412.pdf",
    status: "verified",
    uploadedAt: "2024-12-15T08:00:00Z", processedAt: "2024-12-15T08:00:08Z",
    extractedData: {
      supplier: "日本食肉卸", effective_date: "2024/12/15", items_count: "45品目",
      major_changes: "豚バラ+3.2%, 鶏もも-2.9%, 和牛ロース+5.1%",
    },
    confidence: 97,
    aiSummary: "日本食肉卸の12月価格表。45品目中3品目に大きな変動あり。豚バラと和牛ロースが値上がり、鶏ももは値下がり。",
  },
  {
    id: "DOC-004", type: "order_sheet", fileName: "注文書_はなまる_20241219.pdf",
    status: "verified", orderId: "ORD-2024-1201",
    uploadedAt: "2024-12-19T06:00:00Z", processedAt: "2024-12-19T06:00:02Z",
    extractedData: {
      restaurant: "居酒屋 はなまる", order_date: "2024/12/19",
      items: "キャベツ20kg, 玉ねぎ15kg, にんじん10kg",
      total: "¥4,625", delivery_date: "2024/12/20",
    },
    confidence: 99,
    aiSummary: "居酒屋はなまるの発注書。AI提案を承認した内容。翌日配達指定。",
  },
  {
    id: "DOC-005", type: "delivery_note", fileName: "納品書_チーズ工房_20241220.pdf",
    status: "processing", orderId: "ORD-2024-1203",
    uploadedAt: "2024-12-20T08:00:00Z",
  },
];

export const aiInsights: AIInsight[] = [
  {
    id: "INS-001", type: "demand_alert",
    title: "年末需要ピーク予測",
    description: "12/27〜31にかけて全カテゴリで注文量が通常比180%になると予測。特に酒類と肉類の需要が顕著。仕入先への事前連絡を推奨します。",
    impact: "high", actionable: true,
    suggestedAction: "年末特別発注を自動生成する",
    estimatedSaving: 45000,
    createdAt: "2024-12-19T04:00:00Z",
  },
  {
    id: "INS-002", type: "cost_saving",
    title: "にんじん価格下落トレンド",
    description: "千葉県産にんじんの市場価格が2週連続で下落中（-13.6%）。旬入りによる供給増が原因。今が買い増しの好機です。",
    impact: "medium", actionable: true,
    suggestedAction: "にんじんの発注量を20%増やす",
    estimatedSaving: 2800,
    createdAt: "2024-12-19T04:30:00Z",
  },
  {
    id: "INS-003", type: "quality_warning",
    title: "サーモン価格高騰アラート",
    description: "ノルウェー産サーモンの仕入値が先月比+7.7%。世界的な需要増と為替影響。代替として北海道産トラウトサーモン（¥2,200/kg）への切り替えを検討してください。",
    impact: "high", actionable: true,
    suggestedAction: "代替品の見積もりを取得する",
    estimatedSaving: 8400,
    createdAt: "2024-12-19T05:00:00Z",
  },
  {
    id: "INS-004", type: "optimization",
    title: "配送日の最適化提案",
    description: "チーズ工房ナカザワの配送日（火・金）と酒のまるやの配送日（火・木・土）を考慮し、火曜日にまとめて発注すると配送コストを12%削減できます。",
    impact: "medium", actionable: true,
    suggestedAction: "火曜まとめ発注を設定する",
    estimatedSaving: 5600,
    createdAt: "2024-12-19T05:30:00Z",
  },
  {
    id: "INS-005", type: "trend",
    title: "鶏もも肉の値下がり傾向",
    description: "宮崎県産鶏もも肉が3週連続で値下がり中。飼料価格安定化の影響。来月も安定した価格が続く見込みです。",
    impact: "low", actionable: false,
    createdAt: "2024-12-19T06:00:00Z",
  },
];

export const priceChanges: PriceChange[] = [
  { productId: "P-001", productName: "キャベツ", category: "vegetables", oldPrice: 98, newPrice: 120, changePercent: 22.4, reason: "冬場の出荷量減少", effectiveDate: "2024-12-15" },
  { productId: "P-003", productName: "サーモン（ノルウェー産）", category: "seafood", oldPrice: 2600, newPrice: 2800, changePercent: 7.7, reason: "世界的需要増・円安", effectiveDate: "2024-12-10" },
  { productId: "P-007", productName: "本マグロ 赤身", category: "seafood", oldPrice: 3800, newPrice: 4200, changePercent: 10.5, reason: "年末需要・漁獲量減", effectiveDate: "2024-12-18" },
  { productId: "P-005", productName: "鶏もも肉", category: "meat", oldPrice: 700, newPrice: 680, changePercent: -2.9, reason: "飼料価格安定", effectiveDate: "2024-12-12" },
  { productId: "P-012", productName: "にんじん", category: "vegetables", oldPrice: 110, newPrice: 95, changePercent: -13.6, reason: "旬入りによる供給増", effectiveDate: "2024-12-14" },
];

export const dashboardStats: DashboardStats = {
  totalOrders: 156,
  monthlyOrderAmount: 2840000,
  aiAutomationRate: 76,
  avgOrderTime: "45秒",
  documentsProcessed: 423,
  costSavingsThisMonth: 128000,
  faxesEliminated: 312,
  phoneCallsReplaced: 468,
};
